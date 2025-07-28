const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ไม่ควรมี require('dotenv').config(); ถ้าคุณฝัง API Key โดยตรง
// หรือ ถ้าคุณใช้ Environment Variable บน Render, ให้มีบรรทัดนี้ และไม่ต้องฝัง Key ในโค้ด

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// *** ให้แน่ใจว่า aiName ถูกประกาศแค่ครั้งเดียว ***
const YOUR_ACTUAL_GEMINI_API_KEY = "AIzaSyCbFSsUjmf5-0vjn6pN633vWbfraFSlawg"; // ถ้าคุณเลือกฝัง Key
const genAI = new GoogleGenerativeAI(YOUR_ACTUAL_GEMINI_API_KEY); // ถ้าคุณเลือกฝัง Key

// หรือถ้าใช้ Environment Variable บน Render:
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// *** ให้แน่ใจว่า aiName ถูกประกาศแค่ครั้งเดียวตรงนี้ ***
const aiName = "swchat.kru"; // <--- บรรทัดนี้ควรมีแค่ครั้งเดียวเท่านั้น!


app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // <--- อย่าลืมใช้ Model ที่ถูกต้อง

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
