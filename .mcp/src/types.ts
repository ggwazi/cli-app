export type AgentType = 'opencode' | 'codex' | 'amp' | 'gemini';

export type TaskType = 
  | 'code-review'
  | 'generate-code'
  | 'refactor'
  | 'analyze'
  | 'document'
  | 'complex-task';

export interface Task {
  id: string;
  type: TaskType;
  agent?: AgentType;
  payload: Record<string, any>;
  context?: {
    files?: string[];
    conversation?: string[];
    dependencies?: string[];
  };
  priority?: number;
  timeout?: number;
}

export interface AgentConfig {
  name: AgentType;
  enabled: boolean;
  apiKey: string;
  capabilities: string[];
  maxConcurrent: number;
}

export interface AgentResult {
  taskId: string;
  agent: AgentType;
  status: 'success' | 'failure';
  output: any;
  duration: number;
  error?: string;
}
