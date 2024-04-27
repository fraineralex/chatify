import express from 'express'
import logger from 'morgan'
//import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './src/router/user.js'
import { createTables } from './src/database/index.js'
import { createClient } from '@libsql/client'
import { SocketRouter } from './src/router/socket.js'
import { ChatRouter } from './src/router/chat.js'

dotenv.config({ path: '.env.local' })
const port = process.env.PORT ?? 3000
const clientDomain = process.env.CLIENT_DOMAIN ?? 'http://localhost:5173'

const client = createClient({
  url: process.env.DB_URL ?? '',
  authToken: process.env.DB_AUTH_TOKEN ?? ''
})
createTables(client)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: clientDomain },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  }
})
const socketRouter = new SocketRouter(io, client)
const chatRouter = new ChatRouter(client)

socketRouter.init()
app.use(express.json())
app.use(cors({ origin: clientDomain }))
app.use(logger('dev'))
app.use('/users', userRouter)
app.use('/chats', chatRouter.init())

/* app.use(express.static(path.join(process.cwd(), '../client/dist')))
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../client/dist/index.html'))
}) */

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
