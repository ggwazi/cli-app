import axios, { AxiosInstance } from 'axios';
import { createLogger } from '../logger.js';
import type { Task, AgentResult } from '../types.js';

const logger = createLogger('continue-agent');

export class ContinueAgent {
  private client: AxiosInstance;
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.CONTINUE_ENABLED === 'true';
    this.client = axios.create({
      baseURL: process.env.CONTINUE_API_URL || 'https://api.continue.dev/v1',
      headers: {
        'Authorization': `Bearer ${process.env.CONTINUE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });
  }

  async execute(task: Task): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Executing task ${task.id} with Continue agent`);
      
      let output: any;
      
      switch (task.type) {
        case 'code-review':
          output = await this.reviewCode(task);
          break;
        case 'generate-code':
          output = await this.generateCode(task);
          break;
        case 'refactor':
          output = await this.refactorCode(task);
          break;
        case 'analyze':
          output = await this.analyzeCode(task);
          break;
        case 'document':
          output = await this.documentCode(task);
          break;
        default:
          output = await this.handleGenericTask(task);
      }
      
      return {
        taskId: task.id,
        agent: 'continue',
        status: 'success',
        output,
        duration: Date.now() - startTime
      };
    } catch (error) {
      logger.error(`Task ${task.id} failed:`, error);
      return {
        taskId: task.id,
        agent: 'continue',
        status: 'failure',
        output: null,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async reviewCode(task: Task): Promise<any> {
    const response = await this.client.post('/code/review', {
      files: task.context?.files || [],
      reviewType: task.payload.reviewType || 'general',
      severity: task.payload.severity || 'all'
    });
    
    return response.data;
  }

  private async generateCode(task: Task): Promise<any> {
    const response = await this.client.post('/code/generate', {
      prompt: task.payload.prompt,
      language: task.payload.language,
      framework: task.payload.framework,
      includeTests: task.payload.includeTests || false
    });
    
    return response.data;
  }

  private async refactorCode(task: Task): Promise<any> {
    const response = await this.client.post('/code/refactor', {
      files: task.context?.files || [],
      pattern: task.payload.pattern,
      preserveBehavior: true,
      addComments: task.payload.addComments || false
    });
    
    return response.data;
  }

  private async analyzeCode(task: Task): Promise<any> {
    const response = await this.client.post('/code/analyze', {
      files: task.context?.files || [],
      analysisType: task.payload.analysisType || 'comprehensive',
      metrics: task.payload.metrics || ['complexity', 'maintainability', 'security']
    });
    
    return response.data;
  }

  private async documentCode(task: Task): Promise<any> {
    const response = await this.client.post('/code/document', {
      files: task.context?.files || [],
      format: task.payload.format || 'markdown',
      includeExamples: task.payload.includeExamples || true
    });
    
    return response.data;
  }

  private async handleGenericTask(task: Task): Promise<any> {
    const response = await this.client.post('/chat', {
      message: task.payload.description || task.payload.prompt,
      context: task.context,
      stream: false
    });
    
    return response.data;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getCapabilities(): string[] {
    return [
      'code-review',
      'generate-code',
      'refactor',
      'analyze',
      'document',
      'chat',
      'explain',
      'debug'
    ];
  }
}
