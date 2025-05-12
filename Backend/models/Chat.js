const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sessionId: String,
  messages: [{
    text: String,
    isUser: Boolean,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
