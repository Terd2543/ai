const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
require('dotenv').config();

const app = express();
// Render.com จะกำหนด PORT ให้เองผ่าน process.env.PORT
// หากรันบน Local จะใช้ PORT=3001 ตามที่กำหนดใน .env
const port = process.env.PORT || 3001;

// ใช้ CORS middleware เพื่ออนุญาตให้ Frontend เข้าถึงได้
// หาก Deploy บน Render, Frontend และ Backend จะถือเป็นคนละ Origin กัน
app.use(cors());

// ใช้ express.json() สำหรับการ parse JSON body จาก request
app.use(express.json());

// เข้าถึง API Key จาก .env (สำหรับ Local) หรือจาก Environment Variables ของ Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// กำหนดชื่อ AI
const aiName = "swchat.kru";

// Endpoint สำหรับการสนทนากับ AI
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // เลือกโมเดล Gemini ที่ต้องการใช้ (gemini-pro เหมาะสำหรับข้อความ)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // ส่งข้อความไปให้ AI และรอการตอบกลับ
        const result = await model.generateContent(message);
        const response = await result.response;
        const aiResponseText = response.text(); // ดึงข้อความที่ AI ตอบกลับมา

        // ส่งคำตอบของ AI กลับไปยัง Frontend พร้อมชื่อ AI
        res.json({ reply: aiResponseText, aiName: aiName });

    } catch (error) {
        console.error('Error calling Google Gemini API:', error);
        // จัดการ Error ที่อาจเกิดขึ้น
        if (error.response) {
            // Error จาก Google API (เช่น API Key ไม่ถูกต้อง, เกินโควต้า)
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            // Error อื่นๆ (เช่น Network error)
            res.status(500).json({ error: 'Something went wrong with the AI. Please check your API key or try again later.' });
        }
    }
});

// เริ่มต้น Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`AI Name: ${aiName}`);
});
