import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '20mb' }));

  // Connected SSE clients set
  const sseClients = new Set<express.Response>();

  // SSE endpoint for real-time notifications
  app.get('/api/realtime/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Send initial handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Système de notifications en temps réel connecté.' })}\n\n`);

    sseClients.add(res);

    // Keep connection alive with heartbeat comment every 25 seconds
    const heartbeat = setInterval(() => {
      try {
        res.write(': keep-alive\n\n');
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  // API route to broadcast real-time notification to all connected clients
  app.post('/api/realtime/broadcast', (req, res) => {
    const payload = req.body;
    const messageData = `data: ${JSON.stringify(payload)}\n\n`;

    sseClients.forEach((client) => {
      try {
        client.write(messageData);
      } catch {
        sseClients.delete(client);
      }
    });

    res.json({ success: true, clientCount: sseClients.size });
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', sseClients: sseClients.size });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Portail L2 server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
