# Socket.IO HTTP Server (CommonJS)

A minimal Socket.IO-powered WebSocket server built with Node.js using CommonJS modules. This server demonstrates how to:

* Create an HTTP server with the built-in `http` module
* Attach a Socket.IO instance for real-time, bi-directional communication
* Configure CORS to allow connections from specific origins
* Broadcast events on client connect, message receive, and disconnect

## Prerequisites

* **Node.js** v14 or newer
* **npm** or **pnpm**

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MahtHdz/studying-js-sockets
   cd studying-js-sockets/js
   ```

2. Install the Socket.IO dependency:

   ```bash
   # npm
   npm install socket.io

   # or pnpm
   pnpm add socket.io

   # Also you can install all dependencies at once
   npm install
   # or
   pnpm install
   ```

## Project Structure

``` plaintext
.
├── src
│   ├── index.js       # Main server file (CommonJS)
├── package.json    # Project metadata and dependencies
└── README.md       # This documentation
```

## Usage

### Start the server

By default, the server listens on port 3000. You can override this with the `PORT` environment variable.

```bash
# Default port (3000)
node index.js

# Custom port (e.g., 4000)
PORT=4000 node index.js

# Or use the script directly

# npm
npm start
# pnpm
pnpm start
```

You should see logs in the console when clients connect, send messages, or disconnect:

``` plaintext
⚡️ Client connected: <socket-id>
Received message from <socket-id>: Hello
🔴 User <socket-id> disconnected
```

## Server Implementation (`index.js`)

```js
const http = require('http');
const { Server } = require('socket.io');

// Create a native HTTP server
const httpServer = http.createServer();

// Attach Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080', // Frontend origin
    methods: ['GET', 'POST'],
  },
});

// Handle incoming connections
io.on('connection', (socket) => {
  console.log('⚡️ Client connected:', socket.id);
  io.emit('message', `🔵 User ${socket.id} connected`);

  // Relay messages to all clients
  socket.on('message', (msg) => {
    console.log(`Received message from ${socket.id}: ${msg}`);
    io.emit('message', `${socket.id}: ${msg}`);
  });

  // On client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    io.emit('message', `🔴 User ${socket.id} disconnected`);
  });
});

// Start listening
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🟢 Socket.IO server listening on http://localhost:${PORT}`);
});
```

## Client Example

Use this minimal HTML client to test the server:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Socket.IO Client</title>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <input id="msg" placeholder="Message..." />
  <button id="send">Send</button>
  <ul id="log"></ul>

  <script>
    const socket = io('http://localhost:3000');
    const log = document.getElementById('log');

    socket.on('message', (text) => {
      const li = document.createElement('li');
      li.textContent = text;
      log.appendChild(li);
    });

    document.getElementById('send').onclick = () => {
      const input = document.getElementById('msg');
      if (!input.value) return;
      socket.emit('message', input.value);
      input.value = '';
    };
  </script>
</body>
</html>
```

## License

This project is licensed under the MIT License.
