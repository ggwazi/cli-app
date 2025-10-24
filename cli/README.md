# CLI App - Command Line Interface

A powerful CLI for the Multi-Agent AI Orchestration Platform with integrated Continue AI support.

## Installation

```bash
npm install
npm run build
npm link  # Optional: make globally available
```

## Usage

### Basic Commands

```bash
# Check system status
cli-app status

# List all agents
cli-app agent list

# Submit a task
cli-app task submit

# Continue AI chat
cli-app continue chat "Explain this code"
```

### Continue AI Integration

#### Interactive Mode
```bash
cli-app continue --interactive
```

#### Chat
```bash
# Start chat session
cli-app continue chat

# Single message
cli-app continue chat "How do I optimize this function?"

# With context
cli-app continue chat "Review this file" --context src/index.ts
```

#### Code Review
```bash
cli-app continue review src/**/*.ts --type security
cli-app continue review src/index.ts --type performance
```

#### Code Generation
```bash
cli-app continue generate "Create a REST API endpoint for users" --language typescript
cli-app continue generate "Write a React component for user profile" --output src/UserProfile.tsx
```

#### Code Explanation
```bash
cli-app continue explain src/orchestrator.ts
cli-app continue explain src/index.ts --selection 10-20
```

#### Code Refactoring
```bash
# Preview changes
cli-app continue refactor src/index.ts --dry-run

# Apply refactoring
cli-app continue refactor src/index.ts --pattern "extract-function"
```

### Agent Management

```bash
# List all agents
cli-app agent list

# Check agent status
cli-app agent status continue
cli-app agent status opencode

# Enable/disable agents
cli-app agent enable continue
cli-app agent disable codex
```

### Task Management

```bash
# Submit a task
cli-app task submit --type code-review --priority 8

# Check task status
cli-app task status <task-id>

# List recent tasks
cli-app task list --limit 20
cli-app task list --status completed

# Cancel a task
cli-app task cancel <task-id>
```

## Configuration

Create a `.env` file:

```env
# Backend API
BACKEND_URL=http://localhost:3000

# MCP Orchestrator
ORCHESTRATOR_URL=http://localhost:8080

# Continue Integration
CONTINUE_API_KEY=your_continue_api_key
CONTINUE_API_URL=https://api.continue.dev/v1
CONTINUE_ENABLED=true

# Agent Keys
OPENCODE_API_KEY=your_key
CODEX_API_KEY=your_key
AMP_API_KEY=your_key
GEMINI_API_KEY=your_key
```

## Examples

### Automated Code Review Pipeline
```bash
# Review all TypeScript files
cli-app continue review src/**/*.ts --type security

# Submit to orchestrator for deeper analysis
cli-app task submit --type code-review --agent opencode
```

### Generate and Test
```bash
# Generate code
cli-app continue generate "Create user authentication" --output src/auth.ts

# Explain generated code
cli-app continue explain src/auth.ts

# Refactor if needed
cli-app continue refactor src/auth.ts --pattern "improve-security"
```

### Interactive Development
```bash
# Start interactive session
cli-app continue --interactive

# Choose from menu:
# - Chat with AI
# - Code Review
# - Generate Code
# - Explain Code
# - Refactor Code
```

## Architecture

The CLI integrates with:
- **Continue AI**: Direct API integration for code assistance
- **MCP Orchestrator**: Multi-agent task coordination
- **Backend API**: Application state and data
- **Frontend**: Optional web interface

```
┌─────────────┐
│     CLI     │
└──────┬──────┘
       │
   ┌───┴────┬────────────┬──────────┐
   │        │            │          │
   ▼        ▼            ▼          ▼
Continue  Orchestrator Backend  Frontend
   API       API         API       API
```

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Link globally
npm link
```

## Features

- 🤖 **Continue AI Integration**: Direct access to Continue's code assistance
- 🎯 **Multi-Agent Orchestration**: Route tasks to specialized agents
- 💬 **Interactive Mode**: Conversational interface for complex workflows
- 📊 **Status Monitoring**: Real-time system and task status
- 🔄 **Task Management**: Submit, track, and cancel tasks
- 🎨 **Rich Output**: Colorful, formatted CLI output with spinners
- ⚙️ **Flexible Configuration**: Environment-based setup

## Requirements

- Node.js 18+
- Running backend (port 3000)
- Running MCP orchestrator (port 8080)
- Continue API key (optional, for Continue features)
