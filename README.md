# Monorepo Overview

``` plaintext
┌───────────────┐                          ┌───────────────┐
│    Client     │                          │    Server     │
│ ┌───────────┐ │                          │ ┌───────────┐ │
│ │   Socket  │─┼──── Connection ──────────┼▶│   Socket  │ │
│ └───────────┘ │                          │ └───────────┘ │
└───────────────┘                          └───────────────┘
      │                                            │
      │─ Request (send data) ─────────────────────▶│
      │                                            │
      │◀─ Response (receive data) ─────────────────│
      │                                            │
      │─ Close Connection ────────────────────────▶│
      │                                            │
      │◀─ Acknowledge Close ───────────────────────│
```

This repository contains four distinct projects organized in a workspace:

``` plaintext
.
├── client/            # Static single-page application (HTML, CSS, JS)
├── js/                # Plain JavaScript WebSocket server (CommonJS)
├── nestjs/            # NestJS WebSocket gateway application (TypeScript)
└── ts/                # TypeScript WebSocket server
LICENSE                # Repository license
```

## Projects

### 1. `client/`

A front-end single-page application that connects to WebSocket servers using client-side JavaScript.

* **Entry point:** `client/index.html`
* **Static assets:** `client/public/assets/`
* **Source code:** `client/src/index.js`
* **Client behavior:** Opens a WebSocket connection, handles incoming messages, and allows sending messages via a simple UI.

### 2. `js/`

A minimal WebSocket server implemented in CommonJS JavaScript using Socket.IO on top of Node's HTTP module.

* **Server file:** `js/src/index.js`
* **Functionality:** Accepts client connections, broadcasts connect/disconnect events and relays chat messages to all clients.

### 3. `nestjs/`

A full-featured NestJS application providing a Socket.IO gateway for real-time updates.

* **Gateway implementation:** `nestjs/src/app/socket/infrastructure/gateways/chat.gateway.ts`
* **Module:** `nestjs/src/app/socket/socket.module.ts`
* **Bootstrap:** `nestjs/src/main.ts`, `nestjs/src/app.module.ts`
* **Testing:** located under `nestjs/test/`
* **Configuration:** ESLint, Nest CLI, TypeScript configs under the project root.

### 4. `ts/`

A TypeScript-based WebSocket server using Socket.IO and Node's HTTP module.

* **Source:** `ts/src/index.ts`
* **Build config:** `ts/tsconfig.json`
* **Behavior:** Similar to the JS server but written in TypeScript for type safety.

## Workspace Tooling

* Uses **pnpm** workspaces (each subfolder contains its own lockfile).
* You can run scripts scoped to each project via your package manager (e.g., `pnpm --filter client run start`).

## License

This repository is licensed under the [MIT License](LICENSE).
