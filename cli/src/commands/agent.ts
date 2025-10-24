import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { OrchestratorClient } from '../services/orchestrator-client.js';

const client = new OrchestratorClient();

export const agentCommand = new Command('agent');

agentCommand
  .command('list')
  .description('List all available agents')
  .action(async () => {
    const spinner = ora('Fetching agents...').start();
    
    try {
      const agents = await client.listAgents();
      spinner.succeed('Agents retrieved');
      
      console.log(chalk.cyan.bold('\n📋 Available Agents:\n'));
      agents.forEach((agent: any) => {
        const status = agent.enabled ? chalk.green('✓ enabled') : chalk.red('✗ disabled');
        console.log(`  ${chalk.bold(agent.name)} - ${status}`);
        console.log(`    Capabilities: ${agent.capabilities.join(', ')}`);
        console.log(`    Max Concurrent: ${agent.maxConcurrent}\n`);
      });
    } catch (error) {
      spinner.fail('Failed to fetch agents');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

agentCommand
  .command('status')
  .description('Get agent status')
  .argument('<name>', 'Agent name (opencode, codex, amp, gemini, continue)')
  .action(async (name) => {
    const spinner = ora(`Checking ${name} status...`).start();
    
    try {
      const status = await client.getAgentStatus(name);
      spinner.succeed(`${name} status retrieved`);
      
      console.log(chalk.cyan.bold(`\n📊 ${name} Status:\n`));
      console.log(`  Status: ${status.enabled ? chalk.green('Active') : chalk.red('Inactive')}`);
      console.log(`  Current Tasks: ${status.currentTasks}`);
      console.log(`  Completed Tasks: ${status.completedTasks}`);
      console.log(`  Failed Tasks: ${status.failedTasks}`);
      console.log(`  Average Duration: ${status.avgDuration}ms\n`);
    } catch (error) {
      spinner.fail(`Failed to get ${name} status`);
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

agentCommand
  .command('enable')
  .description('Enable an agent')
  .argument('<name>', 'Agent name')
  .action(async (name) => {
    const spinner = ora(`Enabling ${name}...`).start();
    
    try {
      await client.enableAgent(name);
      spinner.succeed(`${name} enabled`);
    } catch (error) {
      spinner.fail(`Failed to enable ${name}`);
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

agentCommand
  .command('disable')
  .description('Disable an agent')
  .argument('<name>', 'Agent name')
  .action(async (name) => {
    const spinner = ora(`Disabling ${name}...`).start();
    
    try {
      await client.disableAgent(name);
      spinner.succeed(`${name} disabled`);
    } catch (error) {
      spinner.fail(`Failed to disable ${name}`);
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });
