const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    let chatSession = await Chat.findOne({ sessionId });
    if (!chatSession) {
      chatSession = new Chat({ sessionId, messages: [] });
    }

    chatSession.messages.push({ text: message, isUser: true });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatSession.messages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }))
    });

    const aiResponse = completion.choices[0].message.content;
    chatSession.messages.push({ text: aiResponse, isUser: false });

    await chatSession.save();
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error processing chat message' });
  }
});

module.exports = router;
