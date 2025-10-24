# MCP Tools Orchestration

Multi-agent orchestration system for AI CLI tools as background agents.

## Architecture Overview

This system enables multiple AI CLI tools (OpenCode, Codex, Amp, Gemini-CLI) to work as coordinated background agents through the Model Context Protocol (MCP).

```
┌─────────────────────────────────────────────────────┐
│           MCP Orchestrator (Node.js)                │
│  - Task Queue Management                            │
│  - Agent Lifecycle Control                          │
│  - Context Sharing & State Management               │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────┴────────────┬──────────┬──────────┐
    │                       │          │          │
┌───▼────┐  ┌──────▼──────┐ ┌───▼───┐ ┌────▼────┐
│OpenCode│  │   Codex     │ │  Amp  │ │ Gemini  │
│ Agent  │  │   Agent     │ │ Agent │ │  Agent  │
└────────┘  └─────────────┘ └───────┘ └─────────┘
```

## Agent Capabilities

### OpenCode Agent
- **Best for**: PR reviews, issue analysis
- **MCP Tools**: `code-review`, `issue-context`, `diff-analysis`
- **Trigger**: Issue comments with `/oc` or `/opencode`

### Codex Agent
- **Best for**: Code generation, refactoring
- **MCP Tools**: `generate-code`, `refactor`, `optimize`
- **Trigger**: Manual invoke or complex generation tasks

### Amp Agent
- **Best for**: Complex multi-step tasks, orchestration
- **MCP Tools**: `task-planning`, `multi-file-edit`, `code-search`
- **Trigger**: Complex user requests requiring planning

### Gemini-CLI Agent
- **Best for**: Analysis, documentation, explanations
- **MCP Tools**: `explain-code`, `generate-docs`, `summarize`
- **Trigger**: Documentation and analysis tasks

## Reusable MCP Tool Patterns

### 1. Tool Wrapper Interface
Each CLI tool is wrapped with a standardized MCP interface:

```typescript
interface MCPTool {
  name: string;
  capabilities: string[];
  invoke(task: Task, context: Context): Promise<Result>;
  health(): Promise<boolean>;
}
```

### 2. Shared Context Store
Redis-based shared context for all agents:
- File changes tracking
- Task dependencies
- Conversation history
- Code context cache

### 3. Task Queue System
Priority-based task distribution:
- High: Security fixes, build failures
- Medium: Feature requests, refactoring
- Low: Documentation, optimization

## Setup Instructions

### 1. Install Dependencies
```bash
cd .mcp
npm install
```

### 2. Configure API Keys
Copy `.env.example` to `.env` and add your API keys:
```bash
cp .env.example .env
```

### 3. Start Orchestrator
```bash
npm run orchestrator
```

### 4. Register CLI Agents
```bash
npm run register-agents
```

## Agent Communication Protocol

### Message Format
```json
{
  "type": "task" | "status" | "result",
  "agent": "opencode" | "codex" | "amp" | "gemini",
  "task_id": "uuid",
  "payload": {},
  "context": {
    "files": [],
    "conversation": [],
    "dependencies": []
  }
}
```

## Orchestration Strategies

### 1. Parallel Execution
Multiple agents work on independent tasks simultaneously.

### 2. Sequential Pipeline
Output from one agent becomes input for another:
```
Gemini (analyze) → Codex (generate) → OpenCode (review)
```

### 3. Consensus Mode
Multiple agents vote on the best solution:
```
Task → [Amp, Codex, Gemini] → Vote → Best Solution
```

### 4. Specialized Routing
Route tasks to the most capable agent based on task type.

## Background Agent Modes

### Always-On Monitoring
Agents run in background watching for:
- New commits → Code review
- Failed tests → Debug analysis
- New issues → Context gathering
- Documentation gaps → Auto-documentation

### On-Demand Scaling
Spawn agents only when needed:
```typescript
orchestrator.scaleAgent('codex', { min: 0, max: 3 });
```

### Cron-Based Tasks
Schedule periodic agent tasks:
```typescript
schedule.daily('gemini', 'update-documentation');
schedule.hourly('opencode', 'check-prs');
```

## Advanced Features

### Agent Collaboration
Agents can request help from other agents:
```typescript
amp.requestAssistance('codex', {
  task: 'generate-boilerplate',
  context: currentContext
});
```

### Learning & Optimization
Track agent performance and optimize routing:
- Success rate per agent per task type
- Average completion time
- Resource usage patterns

### Fallback & Redundancy
If primary agent fails, fallback to secondary:
```typescript
orchestrator.setFallback('codex', ['amp', 'gemini']);
```

## Monitoring & Observability

### Metrics Dashboard
- Active agents count
- Task queue depth
- Success/failure rates
- Average response times

### Logging
Centralized logging to `logs/` directory:
- `orchestrator.log` - Main orchestrator events
- `agents/{agent-name}.log` - Per-agent logs
- `tasks.log` - Task execution history

## Security Considerations

1. **API Key Isolation**: Each agent has isolated credentials
2. **Sandboxed Execution**: Agents run in containers
3. **Rate Limiting**: Prevent API abuse
4. **Audit Trail**: All agent actions logged

## Future Enhancements

- [ ] Web UI for orchestrator control
- [ ] Custom agent plugins
- [ ] Multi-repository support
- [ ] Agent training/fine-tuning
- [ ] Cost optimization strategies
- [ ] Real-time collaboration mode
