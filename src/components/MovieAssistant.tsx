// src/components/MovieAssistant.tsx

"use client"; // Marking this as a Client Component

import React, { useState } from 'react';
import { AiOutlineRobot } from 'react-icons/ai'; // Importing an AI icon

const MovieAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // State to toggle visibility

  const callAIModel = async (input: string, model: string) => {
    const prompt = `You are a smart and friendly Movie Assistant created by @thenux-ai. If a user sends a movie link (like filmslk.com), help by showing movie title, description, and video links. Otherwise, answer normally as an AI movie expert. also repsne with emojies friendly .User input: ${input}`;
    
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
      setResponse("Sorry, I couldn't process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callAIModel(input, 'gpt4'); // You can change to 'gpt3' if needed
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
        aria-label="Open AI Assistant"
      >
        <AiOutlineRobot className="h-6 w-6" />
      </button>

      {isVisible && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 fixed bottom-16 right-4 w-80">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Movie Assistant</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about movies or share a movie link..."
              required
              className="border dark:border-gray-600 p-2 rounded w-full dark:bg-gray-700 dark:text-white"
            />
            <button type="submit" disabled={loading} className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
              {loading ? 'Loading...' : 'Ask'}
            </button>
          </form>
          {response && (
            <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Response:</h3>
              <p className="text-gray-700 dark:text-gray-300">{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieAssistant;

