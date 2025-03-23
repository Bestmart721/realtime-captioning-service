// realtime-captioning-service/index.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 4000;
const CAPTION_DELAY = 1000; // milliseconds
const PACKET_DURATION = 100; // each packet = 100ms of speech
const USAGE_LIMIT_MS = 60000; // 60 seconds (bonus)

const usageStore = {}; // { clientId: totalUsageMs }

function generateRandomText() {
  const lorem = [
    'lorem ipsum dolor sit amet', 'consectetur adipiscing elit',
    'sed do eiusmod tempor incididunt', 'ut labore et dolore magna aliqua',
    'ut enim ad minim veniam', 'quis nostrud exercitation ullamco laboris'
  ];
  return lorem[Math.floor(Math.random() * lorem.length)];
}

wss.on('connection', (ws, req) => {
  const clientId = req.url.split('?token=')[1] || uuidv4();
  if (!usageStore[clientId]) usageStore[clientId] = 0;

  let captionInterval;

  ws.on('message', (message) => {
    if (usageStore[clientId] >= USAGE_LIMIT_MS) {
      ws.send(JSON.stringify({ error: 'Usage limit exceeded. Disconnecting.' }));
      ws.close();
      return;
    }

    usageStore[clientId] += PACKET_DURATION;

    if (!captionInterval) {
      captionInterval = setInterval(() => {
        if (usageStore[clientId] >= USAGE_LIMIT_MS) {
          ws.send(JSON.stringify({ error: 'Usage limit exceeded. Disconnecting.' }));
          ws.close();
          clearInterval(captionInterval);
        } else {
          const caption = generateRandomText();
          ws.send(JSON.stringify({ caption }));
        }
      }, CAPTION_DELAY);
    }
  });

  ws.on('close', () => clearInterval(captionInterval));
});

// Usage endpoint
app.get('/usage/:clientId', (req, res) => {
  const { clientId } = req.params;
  const usage = usageStore[clientId] || 0;
  res.json({ clientId, usageMs: usage });
});

// Serve static HTML client
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));