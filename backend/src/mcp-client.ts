import Redis from 'ioredis';
import Queue from 'bull';
import type { Task, AgentResult } from './types.js';

export class MCPClient {
  private redis: Redis;
  private taskQueue: Queue.Queue;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.taskQueue = new Queue('mcp-tasks', process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async submitTask(task: Omit<Task, 'id'>): Promise<string> {
    const fullTask: Task = { ...task, id: '' };

    const job = await this.taskQueue.add(fullTask, {
      priority: task.priority || 1,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });

    return job.id.toString();
  }

  async getTaskStatus(taskId: string): Promise<{ state: string; progress?: number } | null> {
    const jobId = parseInt(taskId);
    if (isNaN(jobId)) return null;
    
    const job = await this.taskQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    return { state, progress: job.progress() };
  }

  async getTaskResult(taskId: string): Promise<AgentResult | null> {
    const resultJson = await this.redis.get(`result:${taskId}`);
    if (!resultJson) return null;
    return JSON.parse(resultJson);
  }

  async listTasks(status?: string): Promise<any[]> {
    let jobs;
    if (status === 'completed') {
      jobs = await this.taskQueue.getCompleted();
    } else if (status === 'failed') {
      jobs = await this.taskQueue.getFailed();
    } else if (status === 'active') {
      jobs = await this.taskQueue.getActive();
    } else if (status === 'waiting') {
      jobs = await this.taskQueue.getWaiting();
    } else {
      jobs = await this.taskQueue.getJobs(['completed', 'failed', 'active', 'waiting']);
    }

    return jobs.map(job => ({
      id: job.id,
      data: job.data,
      state: job.getState(),
      progress: job.progress(),
      timestamp: job.timestamp
    }));
  }

  async close() {
    await this.taskQueue.close();
    this.redis.disconnect();
  }
}
