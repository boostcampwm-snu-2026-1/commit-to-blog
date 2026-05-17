const express = require('express');
const router = express.Router();
const github = require('../services/githubService');

router.get('/repos', async (req, res, next) => {
  try { res.json(await github.getUserRepos()); } catch (e) { next(e); }
});

router.get('/repos/:owner/:repo/branches', async (req, res, next) => {
  try { res.json(await github.getBranches(req.params.owner, req.params.repo)); } catch (e) { next(e); }
});

router.get('/repos/:owner/:repo/commits', async (req, res, next) => {
  try {
    const { branch = 'main', per_page = 30 } = req.query;
    res.json(await github.getCommits(req.params.owner, req.params.repo, branch, Number(per_page)));
  } catch (e) { next(e); }
});

router.get('/repos/:owner/:repo/commits/:sha', async (req, res, next) => {
  try { res.json(await github.getCommitDetail(req.params.owner, req.params.repo, req.params.sha)); } catch (e) { next(e); }
});

module.exports = router;
