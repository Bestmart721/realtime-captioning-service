# Realtime Captioning Service

## Implementation Choices
- **Node.js + Express** for REST API and static hosting
- **WebSocket** for real-time caption simulation
- **In-memory object** for simple usage tracking (per client)
- Randomly generated lorem ipsum simulates captions
- Bonus: Usage cap (60s per client) with auto disconnect

## How to Run
1. `npm install express ws uuid`
2. Run: `node index.js`
3. Visit: `http://localhost:3000` to open the client

## How to Test
- On the client page, enter a token (or keep default)
- Click **Start** — captions will start streaming
- Usage increments behind the scenes per audio packet
- Check usage: `GET http://localhost:3000/usage/{clientId}`
  Example: `curl http://localhost:3000/usage/client123`
 