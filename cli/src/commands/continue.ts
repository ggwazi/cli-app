import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { ContinueClient } from '../services/continue-client.js';

const continueClient = new ContinueClient();

export const continueCommand = new Command('continue');

continueCommand
  .description('Continue AI assistant')
  .option('-i, --interactive', 'Start interactive session')
  .action(async (options) => {
    if (options.interactive) {
      await interactiveSession();
    } else {
      continueCommand.help();
    }
  });

continueCommand
  .command('chat')
  .description('Chat with Continue AI')
  .argument('[message]', 'Message to send')
  .option('-c, --context <files...>', 'Include file context')
  .action(async (message, options) => {
    if (!message) {
      console.log(chalk.yellow('Starting interactive chat mode. Type "exit" to quit.'));
      await chatLoop(options.context);
    } else {
      await sendMessage(message, options.context);
    }
  });

continueCommand
  .command('review')
  .description('Code review with Continue')
  .argument('<files...>', 'Files to review')
  .option('-t, --type <type>', 'Review type (security, performance, style)', 'general')
  .action(async (files, options) => {
    const spinner = ora('Reviewing code with Continue...').start();
    
    try {
      const result = await continueClient.reviewCode(files, options.type);
      spinner.succeed('Review complete!');
      console.log(chalk.cyan('\n📋 Review Results:\n'));
      console.log(result);
    } catch (error) {
      spinner.fail('Review failed');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

continueCommand
  .command('generate')
  .description('Generate code with Continue')
  .argument('<prompt>', 'What to generate')
  .option('-l, --language <lang>', 'Programming language')
  .option('-o, --output <file>', 'Output file')
  .action(async (prompt, options) => {
    const spinner = ora('Generating code...').start();
    
    try {
      const code = await continueClient.generateCode(prompt, options.language);
      spinner.succeed('Code generated!');
      
      if (options.output) {
        const fs = await import('fs/promises');
        await fs.writeFile(options.output, code);
        console.log(chalk.green(`✓ Saved to ${options.output}`));
      } else {
        console.log(chalk.cyan('\n📝 Generated Code:\n'));
        console.log(code);
      }
    } catch (error) {
      spinner.fail('Generation failed');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

continueCommand
  .command('explain')
  .description('Explain code with Continue')
  .argument('<file>', 'File to explain')
  .option('-s, --selection <range>', 'Line range (e.g., 10-20)')
  .action(async (file, options) => {
    const spinner = ora('Analyzing code...').start();
    
    try {
      const explanation = await continueClient.explainCode(file, options.selection);
      spinner.succeed('Analysis complete!');
      console.log(chalk.cyan('\n💡 Explanation:\n'));
      console.log(explanation);
    } catch (error) {
      spinner.fail('Explanation failed');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

continueCommand
  .command('refactor')
  .description('Refactor code with Continue')
  .argument('<file>', 'File to refactor')
  .option('-p, --pattern <pattern>', 'Refactoring pattern')
  .option('--dry-run', 'Preview changes without applying')
  .action(async (file, options) => {
    const spinner = ora('Refactoring code...').start();
    
    try {
      const result = await continueClient.refactorCode(file, options.pattern, options.dryRun);
      spinner.succeed('Refactoring complete!');
      
      if (options.dryRun) {
        console.log(chalk.yellow('\n🔍 Preview (dry-run):\n'));
      } else {
        console.log(chalk.green('\n✨ Refactored Code:\n'));
      }
      console.log(result);
    } catch (error) {
      spinner.fail('Refactoring failed');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    }
  });

async function chatLoop(context?: string[]) {
  while (true) {
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: chalk.cyan('You:'),
        prefix: '💬'
      }
    ]);

    if (message.toLowerCase() === 'exit') {
      console.log(chalk.yellow('Goodbye!'));
      break;
    }

    await sendMessage(message, context);
  }
}

async function sendMessage(message: string, context?: string[]) {
  const spinner = ora('Thinking...').start();
  
  try {
    const response = await continueClient.chat(message, context);
    spinner.stop();
    console.log(chalk.green('🤖 Continue:'), response);
    console.log();
  } catch (error) {
    spinner.fail('Failed to get response');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
  }
}

async function interactiveSession() {
  console.log(chalk.cyan.bold('\n🚀 Continue Interactive Session\n'));
  
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '💬 Chat', value: 'chat' },
        { name: '📋 Code Review', value: 'review' },
        { name: '📝 Generate Code', value: 'generate' },
        { name: '💡 Explain Code', value: 'explain' },
        { name: '✨ Refactor Code', value: 'refactor' }
      ]
    }
  ]);

  switch (action) {
    case 'chat':
      await chatLoop();
      break;
    case 'review':
      const { reviewFiles } = await inquirer.prompt([
        {
          type: 'input',
          name: 'reviewFiles',
          message: 'Enter files to review (space-separated):'
        }
      ]);
      await continueCommand.parseAsync(['node', 'continue', 'review', ...reviewFiles.split(' ')]);
      break;
    case 'generate':
      const { prompt } = await inquirer.prompt([
        {
          type: 'input',
          name: 'prompt',
          message: 'What code would you like to generate?'
        }
      ]);
      await continueCommand.parseAsync(['node', 'continue', 'generate', prompt]);
      break;
    case 'explain':
      const { explainFile } = await inquirer.prompt([
        {
          type: 'input',
          name: 'explainFile',
          message: 'Enter file to explain:'
        }
      ]);
      await continueCommand.parseAsync(['node', 'continue', 'explain', explainFile]);
      break;
    case 'refactor':
      const { refactorFile } = await inquirer.prompt([
        {
          type: 'input',
          name: 'refactorFile',
          message: 'Enter file to refactor:'
        }
      ]);
      await continueCommand.parseAsync(['node', 'continue', 'refactor', refactorFile]);
      break;
  }
}
