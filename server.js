const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;  // แนะนำให้ใช้ PORT จาก env

// ใส่ API KEY จาก Google AI
const genAI = new GoogleGenerativeAI("AIzaSyAeTJkCLKBKEvf_1dG4RIZyZxfWrawL1p4");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the AI Chat server! Use POST /chat to talk.');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ reply: "ขออภัย ระบบมีปัญหา 😢" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
