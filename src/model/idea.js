const mongoose = require('mongoose');


const ideaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
});

module.exports = mongoose.model('Idea', ideaSchema);
