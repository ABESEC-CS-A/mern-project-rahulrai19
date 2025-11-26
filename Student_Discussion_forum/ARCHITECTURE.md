## System Overview

This repository contains a full-stack MERN implementation of a student discussion forum with JWT-secured REST APIs and real-time collaboration via WebSockets.

- **Frontend**: React (Vite), React Router, Context API, Socket.IO client.
- **Backend**: Express, MongoDB (Mongoose ODM), Zod validation, Socket.IO server.
- **Realtime**: Bidirectional updates for new threads/messages and thread activity cues.

## Backend

- `src/app.js` wires middleware (CORS, Helmet, JSON parsing) and routes (`/api/auth`, `/api/threads`). Health probe lives at `/health`.
- `src/index.js` boots the server, connects MongoDB (`src/config/db.js`), and mounts Socket.IO (`src/sockets/socketServer.js`).
- **Auth flow**
  - Registration/login handled by `src/controllers/authController.js`.
  - Tokens issued via `src/utils/token.js`, validated by `src/middleware/auth.js`.
  - Payload validation uses Zod schemas in `src/validators/authSchemas.js`.
- **Threads & messages**
  - CRUD logic in `src/controllers/threadController.js`.
  - Routes secured in `src/routes/threadRoutes.js`.
  - Thread/message validation lives in `src/validators/threadSchemas.js`.

### Database Schemas

**User (`src/models/User.js`)**
- `fullName`, `email` (unique), `password` (bcrypt hashed), optional `avatarColor`, `role`, `lastSeenAt`.

**Thread (`src/models/Thread.js`)**
- Core fields: `title`, `description`, `category`, `tags`, `createdBy`, `participants`, `isClosed`, `lastActivityAt`.
- Embedded `messages` subdocuments store `author`, `body`, `attachments`, and `createdAt`.

Both schemas enable automatic timestamping. Thread pre-save hook keeps `lastActivityAt` fresh whenever messages change.

### WebSocket Layer

- `src/sockets/socketServer.js` initializes Socket.IO with JWT-aware middleware.
- Supported events:
  - `thread:join` / `thread:leave` subscribe clients to per-thread rooms.
  - `thread:message` allows authenticated users to post in realtime; broadcast handled server-side.
- Helper emitters (`src/utils/socketEmitter.js`) push `thread:created`, `message:created`, and `thread:activity` events so HTTP mutations stay in sync with live clients.

### Environment Variables

```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/student_forum
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d
```

## Frontend

- Entry: `src/main.jsx` renders `App.jsx`. Routing handled via `react-router-dom`.
- `src/context/AuthContext.jsx` centralizes authentication state, token storage, and exposes `login`, `register`, `logout`.
- API layer (`src/api/*.js`) wraps Axios with automatic bearer token headers.
- Pages:
  - `pages/Login.jsx` / `Register.jsx`: forms styled via `pages/Login.css`.
  - `pages/Home.jsx`: orchestrates thread list, composer, and message board components.
  - Static `pages/About.jsx` / `Contact.jsx`.
- Components:
  - `ThreadList.jsx`, `ThreadComposer.jsx`, `MessageBoard.jsx`, `MessageInput.jsx` cover discussion UX.
  - `ProtectedRoute.jsx` guards private views.
  - `Header.jsx`/`Footer.jsx` wrap layout.
- `hooks/useSocket.js` instantiates a Socket.IO client whenever a user holds a valid JWT, aligning with the server’s auth expectations.

### Frontend Env Vars (`Frontend/.env` example)

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Running Locally

1. **Backend**
   ```
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend**
   ```
   cd Frontend
   npm install
   npm run dev
   ```
3. Ensure MongoDB is running locally (default port 27017) or update `MONGODB_URI`.

With both servers active, register a user via the UI. Creating threads and posting messages will immediately sync across connected clients thanks to the Socket.IO events described above.


