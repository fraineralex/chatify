import express from 'express'
import logger from 'morgan'
import path from 'path'

const port = process.env.PORT ?? 3000

const app = express()
app.use(logger('dev'))
app.use(express.static(path.join(process.cwd(), '../client/dist')))
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../client/dist/index.html'))
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
