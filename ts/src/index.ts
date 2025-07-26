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

