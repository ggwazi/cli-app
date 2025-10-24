import { Router } from 'express';
import { MCPClient } from '../mcp-client.js';
import type { Task } from '../types.js';

// Create router factory to inject mcpClient
export function createMCPRouter(mcpClient: MCPClient) {
  const router = Router();

// Submit a new task to MCP orchestrator
router.post('/tasks', async (req, res) => {
  try {
    const task: Omit<Task, 'id'> = req.body;
    
    if (!task.type || !task.payload) {
      return res.status(400).json({ error: 'Missing required fields: type, payload' });
    }

    const validTypes = ['code-review', 'generate-code', 'refactor', 'analyze', 'document', 'complex-task'];
    if (!validTypes.includes(task.type)) {
      return res.status(400).json({ error: `Invalid task type. Must be one of: ${validTypes.join(', ')}` });
    }

    const taskId = await mcpClient.submitTask(task);
    res.status(201).json({ taskId, message: 'Task submitted successfully' });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ error: 'Failed to submit task' });
  }
});

// Get task status
router.get('/tasks/:taskId/status', async (req, res) => {
  try {
    const { taskId } = req.params;
    const status = await mcpClient.getTaskStatus(taskId);
    
    if (!status) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(status);
  } catch (error) {
    console.error('Error getting task status:', error);
    res.status(500).json({ error: 'Failed to get task status' });
  }
});

// Get task result
router.get('/tasks/:taskId/result', async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await mcpClient.getTaskResult(taskId);
    
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting task result:', error);
    res.status(500).json({ error: 'Failed to get task result' });
  }
});

// List tasks
router.get('/tasks', async (req, res) => {
  try {
    const { status } = req.query;
    const tasks = await mcpClient.listTasks(status as string);
    res.json({ tasks, count: tasks.length });
  } catch (error) {
    console.error('Error listing tasks:', error);
    res.status(500).json({ error: 'Failed to list tasks' });
  }
});

  return router;
}

// Export default with new instance for backwards compatibility
export default createMCPRouter(new MCPClient());
