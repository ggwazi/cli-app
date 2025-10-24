# CLI App - Multi-Agent AI Orchestration Platform

## Quick Start

### Development
```bash
npm run install:all
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MCP Orchestrator: http://localhost:8080

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
│   └── README.md           # MCP documentation
├── backend/                # Express.js backend
│   └── src/
├── frontend/               # React + Vite frontend
│   └── src/
└── package.json            # Workspace root
```

## MCP Agent System

### Supported Agents
1. **OpenCode** - PR reviews, issue analysis
2. **Codex** - Code generation, refactoring
3. **Amp** - Complex multi-step tasks
4. **Gemini-CLI** - Analysis, documentation

### Orchestration Modes
- **Parallel**: Multiple agents on independent tasks
- **Sequential**: Pipeline processing
- **Consensus**: Multi-agent voting
- **Specialized**: Route to best agent

## Configuration

Copy `.env.example` to `.env` in each directory:
- `/backend/.env`
- `/.mcp/.env`

Add your API keys for each agent.

## Testing Commands

```bash
# Backend
cd backend && npm test

# Frontend  
cd frontend && npm test

# MCP Orchestrator
cd .mcp && npm test
```

## Build Commands

```bash
# All workspaces
npm run build

# Individual
npm run build --workspace=backend
npm run build --workspace=frontend
npm run build --workspace=.mcp
```
