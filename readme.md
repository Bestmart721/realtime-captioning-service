Implementation Choices:

Used Express for RESTful API and ws for WebSocket communication.
Stored client usage in an in-memory object (usage).
Simulated captioning by sending random "lorem ipsum" text every 100ms.
Implemented a simple time limit of 60 seconds for each user.
How to Run:

Clone the repository.
Install dependencies: npm install express ws.
Start the server: node server.js.
How to Test:

Use a WebSocket client to connect to the server on ws://localhost:3000.
Send sequential audio packets (each representing 100ms).
Use the REST endpoint /usage/:clientId to check usage.