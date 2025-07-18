// pages/assistant.js

import { useState } from 'react';
import Head from 'next/head';

export default function Assistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/movie-assistant?q=${encodeURIComponent(input)}`);
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Thenux Movie Assistant</title>
      </Head>
      <div className="min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold mb-4">🎬 Thenux Movie Assistant</h1>
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
          placeholder="Ask something or paste movie link..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={askAssistant}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>

        {response && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">🤖 AI Response:</h2>
            <p className="mb-4">{response.ai}</p>

            {response.movie && !response.movie.error && (
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="text-lg font-bold">{response.movie.title}</h3>
                <img src={response.movie.poster} alt="Poster" className="my-2 w-48 rounded" />
                <p>{response.movie.desc}</p>
                <p className="mt-2 text-blue-300">
                  ▶️ <a href={response.movie.video} target="_blank" rel="noreferrer">Watch Now</a>
                </p>
                <h4 className="mt-2 font-semibold">Downloads:</h4>
                <ul className="list-disc list-inside">
                  {response.movie.download.map((dl, i) => (
                    <li key={i}><a href={dl.link} target="_blank" rel="noreferrer">{dl.name}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
