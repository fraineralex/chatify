# 📬 [Chatify](https://chatify.fraineralex.dev/) &middot; [![EC2 Deployment Pipeline](https://github.com/fraineralex/chatify/actions/workflows/deployement-pipeline.yaml/badge.svg)](https://github.com/fraineralex/chatify/actions/workflows/deployement-pipeline.yaml) [![GitHub license](https://img.shields.io/badge/license-MIT-004DFF.svg)](https://github.com/fraineralex/chatify/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-FF0065.svg)](https://legacy.reactjs.org/docs/how-to-contribute.html#your-first-pull-request) ![Website](https://img.shields.io/website-running-stopped-7B2EFF-red/https/chatify.fraineralex.dev.svg)

A realtime chat app built with TypeScript, React, Node.js, and AWS. It allows users to log in easily using OAuth 2.0 (Google, GitHub, email/password). Users can connect with others and send text messages, emojis, stickers, media, files, and more. The chat offers many features found in popular messaging apps like WhatsApp.

![Open graph image of Chatify](/client/public/og.webp)

## 📦 Technologies

[![Main Technologies](https://skillicons.dev/icons?i=ts,react,vite,tailwind,css,html,nodejs,express,sqlite,aws,cloudflare,pnpm,githubactions,ubuntu)](https://skillicons.dev) 

<details>
  <summary><h3>All Technologies ⚡</h3></summary>
  
  - **Fronted:** `TypeScript` &middot; `React` &middot; `Vite` &middot; `TailwindCSS` &middot; `Zustand` &middot; `Auth0`
  - **Backend:** `TypeScript` &middot; `Node.js` &middot; `Express` &middot; `Turso` &middot; `Socket.io` &middot; `REST` &middot; `JWT Auth`
  - **Infra:** `AWS: EC2 - S3 - CloudFront` &middot; `Cloudflare Pages` &middot; `PNPM Workspaces` &middot; `PM2` &middot; `GitHub Actions`
  - **Linting and Formatting:** `StandarJS` &middot; `EsLint` &middot; `Prettier`
    
</details>

## 🚀 Features

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

## 🚦Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repository to your local machine.
2. Rename the files: `client/.env.example` to `.env.local` and `/server/.env.example` to `.env.local`.
3. Fill in the values of the environment variables in the newly created `.env.local` files with your own data.
4. Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed on your machine.
5. Navigate to the `server` directory of the project and install dependencies and run the server by running `npm i && npm start`.
6. Open another terminal, navigate to the `client` directory, install the dependencies, and start the client by running: `npm i && npm start`
7. You can access the app at: [http://localhost:5173](http://localhost:5173).

That's it! Your project should now be up and running locally.

## 🌟 Contributions

Thank you for exploring this project! If you find the structure or features useful, feel free to use this code for your project. Contributions are welcome! If you have ideas, corrections, or improvements, please open an issue or send a pull request. Your collaboration is valued and appreciated! 🚀

Chatify is [MIT licensed](/LICENSE). ❤️

## 🍿 Video

https://github.com/fraineralex/chatify/assets/89224196/d194bb34-df03-4496-a4b0-fe1e3af00bbf
