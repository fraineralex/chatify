import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './src/router/user.js'
import { createTables } from './src/database/index.js'
import { createClient } from '@libsql/client'
import { SocketRouter } from './src/router/socket.js'
import { ChatRouter } from './src/router/chat.js'
import { checkJwtMiddleware } from './src/middlewares/auth.js'
import { refreshAccessToken } from './src/middlewares/refreshAccessToken.js'

dotenv.config({ path: '.env.local' })
const port = process.env.PORT ?? 3000
const clientDomain = process.env.CLIENT_DOMAIN ?? 'http://localhost:5173'

const client = createClient({
  url: process.env.DB_URL ?? '',
  authToken: process.env.DB_AUTH_TOKEN ?? '',
})
createTables(client)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: clientDomain },
  maxHttpBufferSize: 2e8,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
})

const socketRouter = new SocketRouter(io, client)
const chatRouter = new ChatRouter(client)

app.use(cors({ origin: clientDomain }))
socketRouter.init()
app.use(express.json())
app.use(logger('dev'))

app.get('/', (req, res) => res.send('Welcome to Chatify API'))
app.get('/api', (req, res) => res.send('Welcome to Chatify API'))

app.use(checkJwtMiddleware, refreshAccessToken)
app.use('/api/chats', chatRouter.init())
app.use('/api/users', userRouter)

app.use((req, res) => res.status(404).send('404 Not Found'))

server.listen(port, () => console.log(`Server is running in port ${port}`))
