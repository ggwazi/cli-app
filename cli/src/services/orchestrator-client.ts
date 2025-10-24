import axios, { AxiosInstance } from 'axios';

export class OrchestratorClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.ORCHESTRATOR_URL || 'http://localhost:8080',
      timeout: 10000
    });
  }

  async listAgents() {
    const response = await this.client.get('/agents');
    return response.data;
  }

  async getAgentStatus(name: string) {
    const response = await this.client.get(`/agents/${name}/status`);
    return response.data;
  }

  async enableAgent(name: string) {
    await this.client.post(`/agents/${name}/enable`);
  }

  async disableAgent(name: string) {
    await this.client.post(`/agents/${name}/disable`);
  }

  async submitTask(task: any) {
    const response = await this.client.post('/tasks', task);
    return response.data.taskId;
  }

  async getTaskStatus(id: string) {
    const response = await this.client.get(`/tasks/${id}`);
    return response.data;
  }

  async listTasks(options: { limit?: number; status?: string }) {
    const response = await this.client.get('/tasks', { params: options });
    return response.data;
  }

  async cancelTask(id: string) {
    await this.client.delete(`/tasks/${id}`);
  }

  async getSystemStatus() {
    const response = await this.client.get('/status');
    return response.data;
  }
}
