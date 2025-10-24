# Backend MCP API Documentation

The backend exposes MCP orchestrator capabilities through REST API endpoints.

## Base URL
```
http://localhost:3000/api/mcp
```

## Endpoints

### 1. Submit Task
Submit a new task to the MCP orchestrator.

**Endpoint:** `POST /api/mcp/tasks`

**Request Body:**
```json
{
  "type": "code-review" | "generate-code" | "refactor" | "analyze" | "document" | "complex-task",
  "payload": {
    "description": "Task description",
    "files": ["path/to/file.ts"],
    // ... other task-specific data
  },
  "context": {
    "files": ["file1.ts", "file2.ts"],
    "conversation": ["Previous messages"],
    "dependencies": ["package-name"]
  },
  "priority": 1,
  "timeout": 300000
}
```

**Response:**
```json
{
  "taskId": "task-1234567890-abc123",
  "message": "Task submitted successfully"
}
```

### 2. Get Task Status
Check the status of a submitted task.

**Endpoint:** `GET /api/mcp/tasks/:taskId/status`

**Response:**
```json
{
  "state": "completed" | "active" | "waiting" | "failed",
  "progress": 100
}
```

### 3. Get Task Result
Retrieve the result of a completed task.

**Endpoint:** `GET /api/mcp/tasks/:taskId/result`

**Response:**
```json
{
  "taskId": "task-1234567890-abc123",
  "agent": "opencode" | "codex" | "amp" | "gemini",
  "status": "success" | "failure",
  "output": {
    // Agent-specific output
  },
  "duration": 5432,
  "error": "Error message if failed"
}
```

### 4. List Tasks
List all tasks or filter by status.

**Endpoint:** `GET /api/mcp/tasks?status=completed`

**Query Parameters:**
- `status` (optional): Filter by status (`completed`, `failed`, `active`, `waiting`)

**Response:**
```json
{
  "tasks": [
    {
      "id": "task-1234567890-abc123",
      "data": { /* Task data */ },
      "state": "completed",
      "progress": 100,
      "timestamp": 1234567890
    }
  ],
  "count": 1
}
```

## Agent Selection

The orchestrator automatically selects the best agent based on task type:

- **code-review** → OpenCode
- **generate-code** → Codex
- **complex-task** → Amp
- **analyze** or **document** → Gemini
- Default → Amp

## Example Usage

### Submit a Code Review Task
```bash
curl -X POST http://localhost:3000/api/mcp/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "code-review",
    "payload": {
      "pr": "123",
      "files": ["src/app.ts"]
    }
  }'
```

### Check Task Status
```bash
curl http://localhost:3000/api/mcp/tasks/task-1234567890-abc123/status
```

### Get Task Result
```bash
curl http://localhost:3000/api/mcp/tasks/task-1234567890-abc123/result
```

### List All Completed Tasks
```bash
curl http://localhost:3000/api/mcp/tasks?status=completed
```

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created (task submitted)
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message"
}
```
