# CLI App - Multi-Agent AI Orchestration Platform

A sophisticated platform for orchestrating multiple AI CLI tools (OpenCode, Codex, Amp, Gemini-CLI) as background agents using the Model Context Protocol (MCP).

## Features

- 🤖 **Multi-Agent Orchestration** - Coordinate multiple AI agents for complex tasks
- 🔄 **Background Processing** - Agents run as background workers with task queuing
- 🎯 **Smart Routing** - Automatically route tasks to the best-suited agent
- 📊 **Real-time Monitoring** - Track agent performance and task status
- 🔌 **Extensible Architecture** - Easy to add new agents and capabilities
- 💬 **Continue Integration** - Direct CLI access to Continue AI
- 🎨 **Modern UI** - React-based frontend with Vite

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start all services (frontend, backend, MCP orchestrator)
npm run dev

# Or start services individually
npm run dev:frontend  # Start React frontend
npm run dev:backend   # Start Express backend with MCP API
npm run dev:mcp       # Start MCP orchestrator
```

### Prerequisites
- Node.js 18+
- Redis server running (for MCP task queue)
- API keys configured in `.env` files

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
  - **MCP API**: http://localhost:3000/api/mcp
- **MCP Orchestrator**: http://localhost:8080

## Architecture

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

## Project Structure

```
cli-app/
├── .devcontainer/          # VSCode devcontainer configuration
├── .github/workflows/      # GitHub Actions (OpenCode integration)
├── .mcp/                   # MCP orchestration system
│   ├── src/
│   │   ├── orchestrator.ts # Main orchestrator
│   │   ├── agents/         # Agent implementations
│   │   └── types.ts        # TypeScript definitions
│   └── README.md           # Detailed MCP documentation
├── backend/                # Express.js backend API
│   └── src/
├── frontend/               # React + Vite frontend
│   └── src/
├── cli/                    # Command-line interface
│   ├── src/
│   │   ├── commands/       # CLI commands
│   │   └── services/       # API clients
│   └── README.md           # CLI documentation
└── package.json            # Workspace root
```

## MCP Agent System

### Supported Agents
1. **Continue** - Interactive code assistance, chat, review, generation
2. **OpenCode** - PR reviews, issue analysis
3. **Codex** - Code generation, refactoring
4. **Amp** - Complex multi-step tasks
5. **Gemini-CLI** - Analysis, documentation

### Agent Capabilities

#### OpenCode
- PR reviews and code quality analysis
- Issue context gathering
- Diff analysis

#### Codex
- Code generation
- Refactoring
- Optimization

#### Amp
- Complex multi-step tasks
- Multi-file editing
- Task planning

#### Gemini-CLI
- Code analysis and explanations
- Documentation generation
- Summarization

### Orchestration Modes
1. **Parallel** - Multiple agents work independently
2. **Sequential** - Pipeline processing (one agent's output → next agent's input)
3. **Consensus** - Multiple agents vote on best solution
4. **Specialized** - Route to most capable agent

## Configuration

Copy `.env.example` to `.env` in each directory:
- `backend/.env`
- `.mcp/.env`
- `cli/.env`

Add your API keys:
```env
OPENCODE_API_KEY=your_key
CODEX_API_KEY=your_key
AMP_API_KEY=your_key
GEMINI_API_KEY=your_key
```

## CLI Usage

### Installation
```bash
npm run build:cli
cd cli && npm link
```

### Commands
```bash
# System status
cli-app status

# Continue AI
cli-app continue chat "Explain this code"
cli-app continue review src/**/*.ts
cli-app continue generate "Create a REST API" --output src/api.ts

# Agent management
cli-app agent list
cli-app agent status continue

# Task management
cli-app task submit
cli-app task list
```

See [cli/README.md](./cli/README.md) for full CLI documentation.

## API Documentation

The backend exposes MCP capabilities through REST endpoints:

### Submit a Task
```bash
curl -X POST http://localhost:3000/api/mcp/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "code-review",
    "payload": { "pr": "123" }
  }'
```

### Check Task Status
```bash
curl http://localhost:3000/api/mcp/tasks/{taskId}/status
```

### Get Task Result
```bash
curl http://localhost:3000/api/mcp/tasks/{taskId}/result
```

See [Backend API Documentation](backend/API.md) for complete endpoint details.

## Development

```bash
# Run specific workspace
npm run dev:backend
npm run dev:frontend
npm run dev:mcp

# Build all
npm run build

# Build and link CLI globally
npm run build:cli
cd cli && npm link

# Test
npm test --workspaces
```

## Testing Commands

```bash
# Backend
cd backend && npm test

# Frontend  
cd frontend && npm test

# MCP Orchestrator
cd .mcp && npm test

# CLI
cd cli && npm test
```

## Documentation

- [Backend API Reference](backend/API.md)
- [MCP Orchestration Details](.mcp/README.md)
- [Agent Configuration](AGENTS.md)
- [CLI Documentation](cli/README.md)

## License

MIT
