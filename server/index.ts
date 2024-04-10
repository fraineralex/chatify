import express from 'express'
import logger from 'morgan'
import path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'
import { METHODS } from 'http'

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server)

io.on('connection', socket => {
  console.log('A user has connected!')

  socket.on('disconnect', () => {
    console.log('A user has disconnected!')
  })
})

app.use(
  cors({
    origin: 'http://localhost:5173',
    METHODS: ['GET', 'POST']
  })
)
app.use(logger('dev'))

/* app.use(express.static(path.join(process.cwd(), '../client/dist')))
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../client/dist/index.html'))
}) */

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
