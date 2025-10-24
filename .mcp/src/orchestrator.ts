import { EventEmitter } from 'events';
import Redis from 'ioredis';
import Queue from 'bull';
import { createLogger } from './logger.js';
import { AgentManager } from './agents/manager.js';
import type { Task, AgentType } from './types.js';

const logger = createLogger('orchestrator');

class MCPOrchestrator extends EventEmitter {
  private redis: Redis;
  private taskQueue: Queue.Queue;
  private agentManager: AgentManager;

  constructor() {
    super();
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.taskQueue = new Queue('mcp-tasks', process.env.REDIS_URL || 'redis://localhost:6379');
    this.agentManager = new AgentManager();
  }

  async start() {
    logger.info('Starting MCP Orchestrator...');
    
    await this.agentManager.initialize();
    this.setupTaskProcessor();
    
    logger.info(`Orchestrator running on port ${process.env.ORCHESTRATOR_PORT || 8080}`);
  }

  private setupTaskProcessor() {
    this.taskQueue.process(async (job) => {
      const task: Task = job.data;
      logger.info(`Processing task ${task.id} with agent ${task.agent}`);
      
      try {
        const result = await this.agentManager.executeTask(task);
        await this.storeResult(task.id, result);
        return result;
      } catch (error) {
        logger.error(`Task ${task.id} failed:`, error);
        throw error;
      }
    });
  }

  async submitTask(task: Task) {
    const agent = this.selectBestAgent(task);
    task.agent = agent;
    
    await this.taskQueue.add(task, {
      priority: task.priority || 1,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
    
    logger.info(`Task ${task.id} queued for ${agent}`);
    return task.id;
  }

  private selectBestAgent(task: Task): AgentType {
    // Prefer Continue for interactive tasks if enabled
    if (process.env.CONTINUE_ENABLED === 'true') {
      if (task.type === 'code-review') return 'continue';
      if (task.type === 'generate-code') return 'continue';
      if (task.type === 'refactor') return 'continue';
      if (task.type === 'analyze') return 'continue';
      if (task.type === 'document') return 'continue';
    }
    
    // Fallback to specialized agents
    if (task.type === 'code-review') return 'opencode';
    if (task.type === 'generate-code') return 'codex';
    if (task.type === 'complex-task') return 'amp';
    if (task.type === 'analyze' || task.type === 'document') return 'gemini';
    return 'amp';
  }

  private async storeResult(taskId: string, result: any) {
    await this.redis.setex(`result:${taskId}`, 3600, JSON.stringify(result));
  }
}

const orchestrator = new MCPOrchestrator();
orchestrator.start().catch((error) => {
  logger.error('Failed to start orchestrator:', error);
  process.exit(1);
});
