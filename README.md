# 📬 [Chatify](https://chatify.fraineralex.dev/) &middot; [![CI](https://github.com/fraineralex/chatify/actions/workflows/ci.yaml/badge.svg)](https://github.com/fraineralex/chatify/actions/workflows/ci.yaml) [![EC2 Deployment Pipeline](https://github.com/fraineralex/chatify/actions/workflows/deployement-pipeline.yaml/badge.svg)](https://github.com/fraineralex/chatify/actions/workflows/deployement-pipeline.yaml) [![GitHub license](https://img.shields.io/badge/license-MIT-004DFF.svg)](https://github.com/fraineralex/chatify/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-FF0065.svg)](https://legacy.reactjs.org/docs/how-to-contribute.html#your-first-pull-request) ![Website](https://img.shields.io/website-running-stopped-7B2EFF-red/https/chatify.fraineralex.dev.svg)

Chatify is a realtime messaging app for authenticated users. It supports one-to-one chats with text, media, stickers, reactions, and read/delivery status — similar to modern messaging products, built as a full-stack TypeScript project.

![Open graph image of Chatify](/client/public/og.webp)

## Architecture

The app splits into a React client and a Node.js API with Socket.io for realtime delivery:

```text
Browser (React + Auth0) ──REST──► Express API ──► Turso (libSQL)
        │                              │
        └──── Socket.io (JWT auth) ────┘
Media uploads flow through the API to AWS S3, with optional CloudFront signed URLs.
```

- **Auth boundary:** Auth0 JWT on REST routes (`express-oauth2-jwt-bearer`) and on socket connections (`authSocketMiddleware`).
- **Realtime path:** Clients emit `new_message` over Socket.io; the server persists to Turso and broadcasts `chat_message` to connected clients.

## Stack

| Layer | Technologies |
| --- | --- |
| Frontend | TypeScript, React, Vite, Tailwind CSS, Zustand, Auth0, Dexie |
| Backend | TypeScript, Node.js, Express, Socket.io, Turso (libSQL) |
| Infra | AWS (EC2, S3, CloudFront), Cloudflare Pages, GitHub Actions |

<details>
  <summary><h3>All Technologies ⚡</h3></summary>

  - **Frontend:** `TypeScript` · `React` · `Vite` · `TailwindCSS` · `Zustand` · `Auth0`
  - **Backend:** `TypeScript` · `Node.js` · `Express` · `Turso` · `Socket.io` · `REST` · `JWT Auth`
  - **Infra:** `AWS: EC2 - S3 - CloudFront` · `Cloudflare Pages` · `PNPM Workspaces` · `PM2` · `GitHub Actions`
  - **Linting and Formatting:** `StandardJS` · `ESLint` · `Prettier`

</details>

## Quick start

**Prerequisites:** Node.js 18+, pnpm 9+

1. Clone the repository.
2. Copy env templates and fill in your own values (no secrets are committed):
   - `client/.env.example` → `client/.env.local`
   - `server/.env.example` → `server/.env.local`
3. Install dependencies from the repo root:

   ```bash
   pnpm install
   ```

4. Start the API and client (separate terminals):

   ```bash
   pnpm --filter chatify run build && pnpm --filter chatify run start
   pnpm --filter client run start
   ```

5. Open [http://localhost:5173](http://localhost:5173).

### Development checks

From the repo root:

```bash
pnpm run lint        # ESLint on client + server source
pnpm run typecheck   # TypeScript --noEmit
pnpm run test        # Auth boundary, message handler, client utils
pnpm run build       # Compile server + production client bundle
```

## Features

- 🔐 Sign in/Sign up with Google, GitHub, or email/password
- 💬 Initiate personalized chats with other users.
- 📩 **Messaging Options:**

  - 🗃️ Share any file type.
  - 📷 Exchange images.
  - ✏️ Send and receive text messages.
  - 🎥 Share videos.
  - 😁 Express with fun stickers.
  - 🎞️ Share animated GIFs.
  - 😀 Add emojis to convey emotions.

- 🌐 Automatically identify links and provide clickable anchor tags.

- 🔄 Respond to messages to maintain clear and contextual conversations.

- 🔮 Stay updated with notifications for unseen messages.

- 🧐 Track message read status for improved communication clarity.

- 😄 React to messages with emojis to express feelings and responses.

- 😊 Access a wide array of emojis through an intuitive emoji picker.
- 🎈 Send stickers using an intuitive sticker picker powered by Tenor.
- 📷 Preview sent images and files directly within the chat interface.

- 📬 **Message Management:**
  - 🗑️ Delete messages with a note indicating removal.
  - 🔎 Filter chats and messages efficiently using the search bar.
  - 🧮 Sort messages by file type, media, and more.
- 🔥 **Chat Actions:**
  - 📌 Pin/Unpin
  - 👀 Hide/Unhide
  - 🔕 Mute/Unmute
  - 🔵 Mark Read/Unread
  - 🔐 Block/Unblock
  - 🧼 Clear
  - ❌ Delete

## Contributions

Thank you for exploring this project! If you find the structure or features useful, feel free to use this code for your project. Contributions are welcome! If you have ideas, corrections, or improvements, please open an issue or send a pull request. Your collaboration is valued and appreciated! 🚀

Chatify is [MIT licensed](/LICENSE). ❤️

## Video

https://github.com/fraineralex/chatify/assets/89224196/d194bb34-df03-4496-a4b0-fe1e3af00bbf
