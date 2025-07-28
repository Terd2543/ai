const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// require('dotenv').config(); // บรรทัดนี้ถูกลบไปแล้ว

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// *** ฝัง API Key ของคุณตรงนี้ ***
const YOUR_ACTUAL_GEMINI_API_KEY = "AIzaSyCbFSsUjmf5-0vjn6pN633vWbfraFSlawg"; // <--- เปลี่ยนตรงนี้เป็น API Key จริงของคุณ (อยู่ใน "...")
const genAI = new GoogleGenerativeAI(YOUR_ACTUAL_GEMINI_API_KEY); // <--- แก้ไขตรงนี้

const aiName = "swchat.kru";

// ... ส่วนที่เหลือของโค้ดเหมือนเดิม ...
const aiName = "swchat.kru";

// *** เปลี่ยน Endpoint ตรงนี้จาก '/api/chat' เป็น '/chat' ***
app.post('/chat', async (req, res) => { // <--- แก้ไขตรงนี้
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const aiResponseText = response.text();

        res.json({ reply: aiResponseText, aiName: aiName });

    } catch (error) {
        console.error('Error calling Google Gemini API:', error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Something went wrong with the AI. Please check your API key or try again later.' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`AI Name: ${aiName}`);
});
