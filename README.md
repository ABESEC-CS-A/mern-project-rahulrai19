## Student Discussion Forum (MERN + WebSockets)

This project delivers a full-stack discussion board for students featuring:

- React (Vite) SPA with protected routes, live thread list, and message composer
- Node/Express API with MongoDB (Mongoose) schemas for users, threads, and messages
- JWT authentication and secure password hashing
- Socket.IO for real-time thread + message broadcasting

### Getting Started

#### Backend API

```bash
cd Student_Discussion_forum/backend
npm install
cp .env.example .env # create and edit with your Mongo URI + secrets
npm run dev
```

Environment variables used by the backend:

| Key | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Comma-separated list of allowed frontend origins |

#### Frontend SPA

```bash
cd Student_Discussion_forum/Frontend
npm install
# copy .env.example to .env if available, otherwise set VITE_API_URL + VITE_SOCKET_URL manually
npm run dev
```

Frontend `.env` keys:

| Key | Description |
| --- | --- |
| `VITE_API_URL` | Base URL for REST calls (e.g. `http://localhost:5000/api`) |
| `VITE_SOCKET_URL` | Socket.IO endpoint (e.g. `http://localhost:5000`) |

### Tech Decisions

- **Mongoose subdocuments** store messages within threads, simplifying pagination for the first release.
- **Socket.IO** emits `thread:created`, `message:created`, and `thread:activity` events so every client stays in sync without reloading.
- **Zod validation** guards API payloads.
- **Auth context + axios interceptors** keep the UI stateless and automatically attach tokens.

### Folder Structure

```
Student_Discussion_forum/
├─ backend/
│  └─ src/app|config|controllers|middleware|models|routes|sockets|utils
└─ Frontend/
   └─ src/api|components|context|hooks|pages
```

You can now register, log in, create new threads, chat in real-time, and see changes broadcast across all connected browsers. Refer to inline comments for additional implementation details. Enjoy hacking!
