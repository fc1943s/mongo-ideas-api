const mongoose = require('mongoose');


const workspaceSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  ideas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
});

module.exports = mongoose.model('Workspace', workspaceSchema);
