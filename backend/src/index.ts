import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createMCPRouter } from './routes/mcp.js';
import { MCPClient } from './mcp-client.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const mcpClient = new MCPClient();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MCP API routes
app.use('/api/mcp', createMCPRouter(mcpClient));

const server = app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`MCP API available at http://localhost:${PORT}/api/mcp`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
  await mcpClient.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
  await mcpClient.close();
  process.exit(0);
});
