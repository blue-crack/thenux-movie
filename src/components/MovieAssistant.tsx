// src/components/MovieAssistant.tsx

import React, { useState } from 'react';

const MovieAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const callAIModel = async (input: string, model: string) => {
    const apiUrl = `https://thenuxai-gpt.vercel.app/api/gpt?q=${encodeURIComponent(input)}&model=${model}`;
    
    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error calling AI model:", error);
      setResponse("Sorry, I couldn't process your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callAIModel(input, 'gpt4'); // You can change to 'gpt3' if needed
  };

  return (
    <div>
      <h2>Movie Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about movies..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </form>
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default MovieAssistant;
