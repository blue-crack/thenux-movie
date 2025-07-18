// pages/api/movie-assistant.js

import axios from 'axios';
import scrape from '../../utils/scrape';

export default async function handler(req, res) {
  const { q, model = 'gpt4' } = req.query;

  if (!q) return res.status(400).json({ error: 'Missing query' });

  try {
    const systemPrompt = `
You are a smart Movie Assistant created by @thenux-ai.
If a user provides a link like https://filmslk.com/watch.php?id=..., respond with detailed movie info.
Otherwise, help as a movie chatbot.
`;

    const aiRes = await axios.get(
      `https://thenuxai-gpt.vercel.app/api/gpt?q=${encodeURIComponent(systemPrompt + "\nUser: " + q)}&model=${model}`
    );

    const ai = aiRes.data?.response || "Sorry, I couldn't process that.";

    const match = q.match(/https?:\/\/filmslk\.com\/watch\.php\?id=\d+/);
    const movie = match ? await scrape(match[0]) : null;

    return res.status(200).json({ ai, movie });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
