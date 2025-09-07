import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Allow requests from any frontend
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const categories = ['Friendly', 'Sarcastic', 'Savage'];

app.post('/get-roast', async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    const chosenCategory = category && categories.includes(category)
      ? category
      : categories[Math.floor(Math.random() * categories.length)];

    const prompt = `
      You are a witty roast bot. Make a funny, harmless roast for ${name}.
      Tone: ${chosenCategory}. Keep it playful, clever, and light-hearted.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });

    const roast = response.choices[0].message.content.trim();
    res.json({ roast, category: chosenCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate roast' });
  }
});

app.listen(port, () => {
  console.log(`Roast Bot server running at http://localhost:${port}`);
});
