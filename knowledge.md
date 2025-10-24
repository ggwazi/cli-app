# CLI App - Multi-Agent AI Orchestration Platform

## Project Mission
Orchestrate multiple AI CLI tools (OpenCode, Codex, Amp, Gemini-CLI) as background agents using the Model Context Protocol (MCP) for complex development tasks.

## Architecture Overview
- **Frontend**: React + Vite (port 5173)
- **Backend**: Express.js API (port 3000)
  - Exposes MCP capabilities via REST API at `/api/mcp`
  - Uses Redis/Bull to communicate with orchestrator
- **MCP Orchestrator**: Node.js task queue manager (port 8080)
  - Handles agent lifecycle and task execution
- **Agents**: OpenCode, Codex, Amp, Gemini-CLI as background workers

## Key Components

### MCP Orchestrator (`.mcp/`)
- Manages agent lifecycle and task queuing
- Handles context sharing between agents
- Routes tasks to appropriate agents
- See `.mcp/README.md` for detailed documentation

### Agent Capabilities
- **OpenCode**: PR reviews, issue analysis, diff analysis
- **Codex**: Code generation, refactoring, optimization
- **Amp**: Multi-file editing, complex multi-step tasks
- **Gemini-CLI**: Code analysis, documentation, summarization

### Orchestration Modes
1. **Parallel**: Independent agent execution
2. **Sequential**: Pipeline processing
3. **Consensus**: Multi-agent voting
4. **Specialized**: Route to best-suited agent

## Development Workflow

### Starting Services
- Run `npm run dev` to start all services (frontend, backend, MCP)
- Individual services: `npm run dev:frontend`, `npm run dev:backend`, `npm run dev:mcp`

### Package Management
- Uses npm workspaces
- Install dependencies: `npm run install:all`

## Configuration

### API Keys
Each service requires API keys in `.env` files:
- `backend/.env`
- `.mcp/.env`

Required keys: OPENCODE_API_KEY, CODEX_API_KEY, AMP_API_KEY, GEMINI_API_KEY

## Important Notes
- The MCP orchestrator must be running for agent coordination
- Backend API requires Redis to be running for task queue communication
- Submit tasks via `POST /api/mcp/tasks`, retrieve results via `GET /api/mcp/tasks/:taskId/result`
- Task IDs are Bull job IDs (numeric), not custom strings
- Backend gracefully shuts down Redis/Bull connections on SIGTERM/SIGINT
- Task type validation enforced at API level
- Background agents run as separate processes managed by the orchestrator
- Task results are stored in Redis with 1-hour TTL
