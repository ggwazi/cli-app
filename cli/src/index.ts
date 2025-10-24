#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { agentCommand } from './commands/agent.js';
import { taskCommand } from './commands/task.js';
import { continueCommand } from './commands/continue.js';
import { statusCommand } from './commands/status.js';

dotenv.config();

const program = new Command();

program
  .name('cli-app')
  .description('Multi-Agent AI Orchestration Platform CLI')
  .version('1.0.0');

program
  .command('agent')
  .description('Manage AI agents')
  .addCommand(agentCommand);

program
  .command('task')
  .description('Manage and submit tasks')
  .addCommand(taskCommand);

program
  .command('continue')
  .description('Continue AI assistant integration')
  .addCommand(continueCommand);

program
  .command('status')
  .description('Check system status')
  .action(statusCommand);

program.on('command:*', () => {
  console.error(chalk.red('Invalid command: %s\nSee --help for a list of available commands.'), program.args.join(' '));
  process.exit(1);
});

program.parse();
