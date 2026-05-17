require('dotenv').config();
const express = require('express');
const cors = require('cors');
const githubRoutes = require('./routes/github');
const postsRoutes = require('./routes/posts');
const blogRoutes = require('./routes/blog');
const errorHandler = require('./middleware/errorHandler');
const { initDb } = require('./services/dbService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/github', githubRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/blog', blogRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

initDb();

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
