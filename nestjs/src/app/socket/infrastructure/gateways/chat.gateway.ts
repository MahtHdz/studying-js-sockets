import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080', // allow your static-server origin
    methods: ['GET', 'POST'],
  },
  // namespace: 'chat', // Optional: specify a namespace for this gateway
}) // You can pass options, e.g., { namespace: 'chat', cors: true }
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server; // The Socket.IO server instance

  // Optional: lifecycle hook when gateway initializes
  afterInit() {
    Logger.log('WebSocket gateway initialized', 'ChatGateway');
    // e.g., you could use server.use() here to add middleware (for auth, etc.)
  }

  // Handle a new client connection
  handleConnection(client: Socket): void {
    console.log(`⚡️ Client connected: ${client.id}`);
    // Notify everyone that a user joined
    this.server.emit('message', `🔵 User ${client.id} connected`);
  }
  // Handle client disconnection
  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    // Notify everyone that a user left
    this.server.emit('message', `🔴 User ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): void {
    const socketId = client.id;
    console.log(`Received message from ${socketId}: ${payload}`);
    // Broadcast the message to all clients
    this.server.emit('message', `${socketId}: ${payload}`);
  }
}
