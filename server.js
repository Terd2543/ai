const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
