import express from 'express'

const DEFAULT_PORT = 3001
const app = express()
const port = Number(process.env.PORT) || DEFAULT_PORT

app.use(express.json())

app.get('/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'backend',
  })
})

app.get('/', (_request, response) => {
  response.json({
    message: 'Commit to Blog backend is running.',
  })
})

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`)
})
