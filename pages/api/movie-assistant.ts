// pages/api/movie-assistant.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { scrapeMovie } from '@/lib/utils'; // ✅ TypeScript + alias import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, model = 'gpt4' } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query' });
  }

  try {
    const systemPrompt = `
You are a smart Movie Assistant created by @thenux-ai.
If a user provides a link like https://filmslk.com/watch.php?id=..., respond with detailed movie info.
Otherwise, help as a movie chatbot.
`;

    const aiRes = await axios.get(`https://thenuxai-gpt.vercel.app/api/gpt?q=${encodeURIComponent(systemPrompt + "\nUser: " + q)}&model=${model}`);
    const ai = aiRes.data?.response || "Sorry, I couldn't process that.";

    const match = q.match(/https?:\\/\\/filmslk\\.com\\/watch\\.php\\?id=\\d+/);
    const movie = match ? await scrapeMovie(match[0]) : null;

    return res.status(200).json({ ai, movie });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
