import 'dotenv/config'
import express from 'express'
import githubRoutes from './src/routes/github.js'
import postsRoutes from './src/routes/posts.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api', githubRoutes)
app.use('/api', postsRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
