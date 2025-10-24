import chalk from 'chalk';
import ora from 'ora';
import { OrchestratorClient } from '../services/orchestrator-client.js';

const client = new OrchestratorClient();

export async function statusCommand() {
  const spinner = ora('Checking system status...').start();

  try {
    const status = await client.getSystemStatus();
    spinner.succeed('System status retrieved');

    console.log(chalk.cyan.bold('\n🚀 CLI App System Status\n'));
    
    console.log(chalk.bold('Services:'));
    console.log(`  Backend: ${getServiceStatus(status.backend)}`);
    console.log(`  Frontend: ${getServiceStatus(status.frontend)}`);
    console.log(`  MCP Orchestrator: ${getServiceStatus(status.orchestrator)}`);
    console.log(`  Redis: ${getServiceStatus(status.redis)}`);
    
    console.log(chalk.bold('\nAgents:'));
    for (const [name, enabled] of Object.entries(status.agents)) {
      console.log(`  ${name}: ${enabled ? chalk.green('✓ enabled') : chalk.gray('○ disabled')}`);
    }
    
    console.log(chalk.bold('\nMetrics:'));
    console.log(`  Active Tasks: ${status.metrics.activeTasks}`);
    console.log(`  Queued Tasks: ${status.metrics.queuedTasks}`);
    console.log(`  Completed Today: ${status.metrics.completedToday}`);
    console.log(`  Failed Today: ${status.metrics.failedToday}`);
    console.log();
  } catch (error) {
    spinner.fail('Failed to retrieve system status');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    console.log(chalk.yellow('\nMake sure all services are running:'));
    console.log(chalk.gray('  npm run dev'));
  }
}

function getServiceStatus(status: string): string {
  return status === 'online' ? chalk.green('✓ online') : chalk.red('✗ offline');
}
