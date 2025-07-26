<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
pnpm install
```

## Compile and run the project

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## Run tests

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## WebSockets / Real-Time Updates

This project supports real-time communication using **WebSockets** via **Socket.IO** and NestJS Gateways. The socket-related code is organized under `src/app/socket/`:

``` plaintext
src/app/socket/
├── infrastructure/
│   └── gateways/
│       └── chat.gateway.ts
└── socket.module.ts
```

1. **Install dependencies**

   ```bash
   pnpm install @nestjs/websockets @nestjs/platform-socket.io socket.io
   ```

2. **Gateway implementation** (`src/app/socket/infrastructure/gateways/chat.gateway.ts`)

   ```ts
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
   ```

3. **Socket module** (`src/app/socket/socket.module.ts`)

   ```ts
   import { Module } from '@nestjs/common';
   import { ChatGateway } from './infrastructure/gateways/chat.gateway';

   @Module({
     providers: [ChatGateway],
   })
   export class SocketModule {}
   ```

4. **Register the SocketModule** in your root module (`src/app.module.ts`)

   ```ts
   import { Module } from '@nestjs/common';
   import { SocketModule } from './app/socket/socket.module';

   @Module({
     imports: [SocketModule],
   })
   export class AppModule {}
   ```

5. **Client Connection**

   Include the Socket.IO client in your front-end and connect to your server:

   ```html
   <script src="/socket.io/socket.io.js"></script>
   <script>
     const socket = io(); // connects to http://localhost:3000 by default
     socket.on('message', (msg) => console.log(msg));
     socket.emit('message', 'Hello from client!');
   </script>
   ```

Customize namespaces, rooms, and authentication as needed.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
pnpm install -g @nestjs/mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

* Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
* For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
* To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
* Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
* Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](nhttps://devtools.nestjs.com).
* Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
* To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
* Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

* Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
* Website - [https://nestjs.com](https://nestjs.com/)
* Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
