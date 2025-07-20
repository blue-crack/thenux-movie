// src/components/MovieAssistant.tsx

"use client"; // Marking this as a Client Component

import React, { useState } from 'react';

const MovieAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const callAIModel = async (input: string, model: string) => {
    // Add the prompt to the input
    const prompt = `You are a smart Movie Assistant created by @thenux-ai. If a user sends a movie link (like filmslk.com), help by showing movie title, description, and video links. Otherwise, answer normally as an AI movie expert. User input: ${input}`;
    
    const apiUrl = `https://thenuxai-gpt.vercel.app/api/gpt?q=${encodeURIComponent(prompt)}&model=${model}`;
    
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
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-2">Movie Assistant</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about movies or share a movie link..."
          required
          className="border p-2 rounded w-full"
        />
        <button type="submit" disabled={loading} className="mt-2 bg-blue-500 text-white p-2 rounded">
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default MovieAssistant;
