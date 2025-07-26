# Socket.IO HTTP Server with TypeScript (TypeScript Project)

This repository demonstrates a simple **Socket.IO** server on top of a native Node.js HTTP server using TypeScript syntax. It enables real-time, bidirectional messaging between clients and the server with CORS support.

## Features

* Uses Node.js native `http` module
* Integrates Socket.IO for WebSocket transport
* CORS enabled for `http://localhost:8080`
* Broadcasts events on client connection, disconnection, and message receipt
* Configurable port via environment variable

## Prerequisites

* **Node.js** v14 or higher
* **npm** or **pnpm**
* Basic understanding of TypeScript and Node.js

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MahtHdz/studying-js-sockets
   cd studying-js-sockets/ts
   ```

2. Install dependencies:

   ```bash
   # npm
   npm install socket.io @types/node ts-node

   # or pnpm
   pnpm add socket.io @types/node ts-node

   # Also you can install all dependencies at once
   npm install
   # or
   pnpm install
   ```

## Project Structure

``` plaintext
.
├── src
│   ├── index.ts     # Main server file (TypeScript)
├── package.json     # Project metadata and dependencies
├── README.md        # This documentation
├── tsconfig.json    # TypeScript configuration
└── .env             # Optional environment variables
```

## Usage

### Running the Server

```bash
# Default (port 3000)
ts-node index.ts

# Specify custom port
PORT=4000 ts-node index.ts

# Or use the script directly

# npm
npm start
# pnpm
pnpm start
```

The server will listen on the specified port and log client events to the console.

### Environment Variables

| Variable | Description                            | Default |
| -------- | -------------------------------------- | ------- |
| `PORT`   | Port for the HTTP and WebSocket server | `3000`  |

Configure any environment variables in a `.env` file or export them in your shell before starting the server.

## Server Code Overview (`index.ts`)

```ts
import http from 'http';
import { Server, Socket } from 'socket.io';

// Create an HTTP server
const httpServer = http.createServer();

// Initialize a Socket.IO server instance, attached to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',  // allow your static-server origin
    methods: ['GET', 'POST'],
  }
});

// Listen for client connections
io.on('connection', (socket: Socket) => {
  console.log('⚡️ Client connected:', socket.id);
  // Broadcast to all clients that a new user joined
  io.emit('message', `🔵 User ${socket.id} connected`);

  // Handle incoming messages from this client
  socket.on('message', (msg: string) => {
    console.log(`Received message from ${socket.id}: ${msg}`);
    // Broadcast the message to all clients (including sender)
    io.emit('message', `${socket.id}: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    io.emit('message', `🔴 User ${socket.id} disconnected`);
  });
});

// Start the HTTP server (which also starts WebSocket server)
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🟢 Socket.IO server listening on http://localhost:${PORT}`);
});
```

## Client Example

A minimal HTML client connecting to this server:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Socket.IO Client</title>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <input id="msg" placeholder="Type a message..." />
  <button id="send">Send</button>
  <ul id="log"></ul>

  <script>
    const socket = io('http://localhost:3000');
    const log = document.getElementById('log');

    socket.on('message', (data) => {
      const item = document.createElement('li');
      item.textContent = data;
      log.appendChild(item);
    });

    document.getElementById('send').onclick = () => {
      const input = document.getElementById('msg');
      const text = input.value.trim();
      if (!text) return;
      socket.emit('message', text);
      input.value = '';
    };
  </script>
</body>
</html>
```

## License

This project is licensed under the MIT License.
