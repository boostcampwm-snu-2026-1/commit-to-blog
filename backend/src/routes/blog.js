const express = require('express');
const router = express.Router();
const llm = require('../services/llmService');
const github = require('../services/githubService');

router.post('/generate', async (req, res, next) => {
  try {
    const { repoFullName, branch, commitShas, additionalContext } = req.body;
    if (!repoFullName || !Array.isArray(commitShas) || commitShas.length === 0) {
      return res.status(400).json({ error: 'repoFullName and commitShas[] are required' });
    }
    const [owner, repo] = repoFullName.split('/');
    const commits = await Promise.all(commitShas.map(sha => github.getCommitDetail(owner, repo, sha)));
    const draft = await llm.generateBlogPost({ repoFullName, branch, commits, additionalContext });
    res.json(draft);
  } catch (e) { next(e); }
});

module.exports = router;
