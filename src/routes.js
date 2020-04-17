const express = require('express');
const asyncHandler = require('express-async-handler');
const auth = require('./auth');
const WorkspaceModel = require('./model/workspace');


const router = express.Router();

router.post('/login', asyncHandler(auth.authenticate));

router.get('/my_workspaces', auth.middleware, asyncHandler(async (req, res) => {
  const workspaces = await WorkspaceModel
    .find()
    .populate({
      path: 'ideas',
      match: { author: req.user.userId },
    })
    .lean();

  const result = workspaces
    .filter(workspace => workspace.ideas.length > 0)
    .map(({ ideas, ...workspace }) => workspace);

  res.json(result);
}));

router.post('/set_workspace/:id', auth.middleware, asyncHandler(async (req, res) => {
  const workspaceId = req.params.id;

  const workspace = await WorkspaceModel
    .findOne({ _id: workspaceId })
    .populate({
      path: 'ideas',
      match: { author: req.user.userId },
    })
    .lean();

  if (!workspace || workspace.ideas.length === 0) {
    return res.status(400).send({ error: 'Invalid workspace' });
  }

  const token = auth.signJwtToken(req.user.userId, workspaceId);
  res.json(token);
}));

router.get('/ideas', auth.middleware, asyncHandler(async (req, res) => {
  const workspace = await WorkspaceModel
    .findOne({ _id: req.user.workspaceId })
    .populate('ideas')
    .lean();

  res.json(workspace.ideas);
}));

router.get('/my_ideas', auth.middleware, asyncHandler(async (req, res) => {
  const workspace = await WorkspaceModel
    .findOne({ _id: req.user.workspaceId })
    .populate({
      path: 'ideas',
      match: { author: req.user.userId },
    })
    .lean();

  res.json(workspace.ideas);
}));

module.exports = router;
