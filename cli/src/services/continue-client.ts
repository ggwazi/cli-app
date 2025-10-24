import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';

export class ContinueClient {
  private apiKey: string;
  private client: AxiosInstance;

  constructor() {
    this.apiKey = process.env.CONTINUE_API_KEY || '';
    this.client = axios.create({
      baseURL: process.env.CONTINUE_API_URL || 'https://api.continue.dev/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async chat(message: string, contextFiles?: string[]): Promise<string> {
    const context = await this.loadContextFiles(contextFiles);
    
    const response = await this.client.post('/chat', {
      message,
      context,
      stream: false
    });

    return response.data.response;
  }

  async reviewCode(files: string[], reviewType: string): Promise<string> {
    const fileContents = await this.loadFiles(files);
    
    const response = await this.client.post('/code/review', {
      files: fileContents,
      reviewType,
      format: 'markdown'
    });

    return response.data.review;
  }

  async generateCode(prompt: string, language?: string): Promise<string> {
    const response = await this.client.post('/code/generate', {
      prompt,
      language,
      includeComments: true,
      includeTests: false
    });

    return response.data.code;
  }

  async explainCode(file: string, selection?: string): Promise<string> {
    const content = await fs.readFile(file, 'utf-8');
    let codeToExplain = content;

    if (selection) {
      const [start, end] = selection.split('-').map(Number);
      const lines = content.split('\n');
      codeToExplain = lines.slice(start - 1, end).join('\n');
    }

    const response = await this.client.post('/code/explain', {
      code: codeToExplain,
      filename: file,
      detailLevel: 'comprehensive'
    });

    return response.data.explanation;
  }

  async refactorCode(file: string, pattern?: string, dryRun?: boolean): Promise<string> {
    const content = await fs.readFile(file, 'utf-8');
    
    const response = await this.client.post('/code/refactor', {
      code: content,
      filename: file,
      pattern,
      preserveBehavior: true
    });

    const refactoredCode = response.data.code;

    if (!dryRun) {
      await fs.writeFile(file, refactoredCode);
    }

    return refactoredCode;
  }

  private async loadContextFiles(files?: string[]): Promise<Array<{ path: string; content: string }>> {
    if (!files || files.length === 0) return [];

    const contextFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await fs.readFile(file, 'utf-8');
          return { path: file, content };
        } catch {
          return null;
        }
      })
    );

    return contextFiles.filter((f): f is { path: string; content: string } => f !== null);
  }

  private async loadFiles(files: string[]): Promise<Array<{ path: string; content: string }>> {
    return Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(file, 'utf-8');
        return { path: file, content };
      })
    );
  }
}
