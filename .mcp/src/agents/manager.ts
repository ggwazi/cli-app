import { createLogger } from '../logger.js';
import type { Task, AgentType, AgentResult } from '../types.js';
import { ContinueAgent } from './continue.js';

const logger = createLogger('agent-manager');

export class AgentManager {
  private agents: Map<AgentType, any> = new Map();
  private continueAgent?: ContinueAgent;

  async initialize() {
    logger.info('Initializing agents...');
    
    // Initialize Continue agent
    if (process.env.CONTINUE_ENABLED === 'true') {
      this.continueAgent = new ContinueAgent();
      this.agents.set('continue', this.continueAgent);
      logger.info('Continue agent enabled');
    }
    
    if (process.env.OPENCODE_ENABLED === 'true') {
      logger.info('OpenCode agent enabled');
    }
    if (process.env.CODEX_ENABLED === 'true') {
      logger.info('Codex agent enabled');
    }
    if (process.env.AMP_ENABLED === 'true') {
      logger.info('Amp agent enabled');
    }
    if (process.env.GEMINI_ENABLED === 'true') {
      logger.info('Gemini agent enabled');
    }
  }

  async executeTask(task: Task): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Executing task ${task.id} with ${task.agent} agent`);
      
      const output = await this.invokeAgent(task);
      
      return {
        taskId: task.id,
        agent: task.agent!,
        status: 'success',
        output,
        duration: Date.now() - startTime
      };
    } catch (error) {
      logger.error(`Task ${task.id} failed:`, error);
      return {
        taskId: task.id,
        agent: task.agent!,
        status: 'failure',
        output: null,
        duration: Date.now() - startTime,
        error: (error as Error).message
      };
    }
  }

  private async invokeAgent(task: Task): Promise<any> {
    // Use Continue agent if available
    if (task.agent === 'continue' && this.continueAgent) {
      const result = await this.continueAgent.execute(task);
      return result.output;
    }
    
    return { message: `Task ${task.id} processed by ${task.agent}` };
  }
}
