import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { OrchestratorClient } from '../services/orchestrator-client.js';

const client = new OrchestratorClient();

export const taskCommand = new Command('task');

taskCommand
  .command('submit')
  .description('Submit a new task')
  .option('-t, --type <type>', 'Task type')
  .option('-a, --agent <agent>', 'Specific agent to use')
  .option('-p, --priority <priority>', 'Task priority (1-10)', '5')
  .action(async (options) => {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select task type:',
        choices: [
          'code-review',
          'generate-code',
          'refactor',
          'analyze',
          'document',
          'complex-task'
        ],
        when: !options.type
      },
      {
        type: 'input',
        name: 'description',
        message: 'Task description:'
      },
      {
        type: 'input',
        name: 'files',
        message: 'Related files (comma-separated, optional):'
      }
    ]);

    const spinner = ora('Submitting task...').start();

    try {
      const taskId = await client.submitTask({
        type: options.type || answers.type,
        agent: options.agent,
        priority: parseInt(options.priority),
        payload: {
          description: answers.description,
          files: answers.files ? answers.files.split(',').map((f: string) => f.trim()) : []
        }
      });

      spinner.succeed('Task submitted!');
      console.log(chalk.green(`\n✓ Task ID: ${taskId}`));
      console.log(chalk.gray('Use "task status <id>" to check progress'));
    } catch (error) {
      spinner.fail('Task submission failed');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

taskCommand
  .command('status')
  .description('Get task status')
  .argument('<id>', 'Task ID')
  .action(async (id) => {
    const spinner = ora('Fetching task status...').start();

    try {
      const status = await client.getTaskStatus(id);
      spinner.succeed('Status retrieved');

      console.log(chalk.cyan.bold(`\n📋 Task ${id}:\n`));
      console.log(`  Status: ${getStatusColor(status.status)}`);
      console.log(`  Agent: ${status.agent}`);
      console.log(`  Progress: ${status.progress}%`);
      if (status.result) {
        console.log(`\n  Result:\n${status.result}`);
      }
    } catch (error) {
      spinner.fail('Failed to fetch status');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

taskCommand
  .command('list')
  .description('List recent tasks')
  .option('-l, --limit <number>', 'Number of tasks to show', '10')
  .option('-s, --status <status>', 'Filter by status')
  .action(async (options) => {
    const spinner = ora('Fetching tasks...').start();

    try {
      const tasks = await client.listTasks({
        limit: parseInt(options.limit),
        status: options.status
      });
      spinner.succeed('Tasks retrieved');

      console.log(chalk.cyan.bold('\n📋 Recent Tasks:\n'));
      tasks.forEach((task: any) => {
        console.log(`  ${task.id} - ${task.type} - ${getStatusColor(task.status)}`);
        console.log(`    Agent: ${task.agent} | Priority: ${task.priority}`);
        console.log();
      });
    } catch (error) {
      spinner.fail('Failed to fetch tasks');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

taskCommand
  .command('cancel')
  .description('Cancel a task')
  .argument('<id>', 'Task ID')
  .action(async (id) => {
    const spinner = ora('Cancelling task...').start();

    try {
      await client.cancelTask(id);
      spinner.succeed(`Task ${id} cancelled`);
    } catch (error) {
      spinner.fail('Failed to cancel task');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
    case 'success':
      return chalk.green(status);
    case 'failed':
    case 'error':
      return chalk.red(status);
    case 'pending':
    case 'queued':
      return chalk.yellow(status);
    case 'running':
    case 'processing':
      return chalk.blue(status);
    default:
      return chalk.gray(status);
  }
}
