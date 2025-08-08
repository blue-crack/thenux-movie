// src/components/MovieAssistant.tsx

"use client"; // Marking this as a Client Component

import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineRobot, AiOutlineSend, AiOutlineClose, AiOutlineStar } from 'react-icons/ai';
import { BiMessageRounded, BiMoviePlay, BiTrendingUp, BiSearch } from 'react-icons/bi';
import { FiFilm, FiTv, FiHeart, FiBookmark, FiShare2 } from 'react-icons/fi';
import { MdRecommend, MdLocalMovies, MdTrendingUp } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'movie' | 'recommendation';
  movieData?: {
    title: string;
    rating: number;
    genre: string;
    year: string;
    poster?: string;
  };
}

const MovieAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'trending'>('chat');
  const [quickActions, setQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const callAIModel = async (input: string, model: string) => {
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
      return data.response;
    } catch (error) {
      console.error("Error calling AI model:", error);
      return "Sorry, I couldn't process your request. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    const aiResponse = await callAIModel(currentInput, 'gpt4');
    
    const aiMessage: Message = {
      id: Date.now() + 1,
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleQuickAction = async (action: string) => {
    const quickPrompts = {
      'trending': 'What are the trending movies this week?',
      'recommendations': 'Can you recommend some good movies based on popular genres?',
      'new-releases': 'What are the latest movie releases?',
      'top-rated': 'Show me the top-rated movies of all time'
    };

    const prompt = quickPrompts[action as keyof typeof quickPrompts];
    if (prompt) {
      setInput(prompt);
      // Auto-submit the quick action
      const userMessage: Message = {
        id: Date.now(),
        text: prompt,
        isUser: true,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, userMessage]);
      
      const aiResponse = await callAIModel(prompt, 'gpt4');
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'recommendation'
      };

      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const loadingVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const quickActionButtons = [
    { id: 'trending', icon: BiTrendingUp, label: 'Trending', color: 'from-red-500 to-pink-500' },
    { id: 'recommendations', icon: MdRecommend, label: 'Recommend', color: 'from-blue-500 to-cyan-500' },
    { id: 'new-releases', icon: MdLocalMovies, label: 'New Releases', color: 'from-green-500 to-emerald-500' },
    { id: 'top-rated', icon: AiOutlineStar, label: 'Top Rated', color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Action Button with Enhanced Design */}
      <motion.button
        onClick={toggleVisibility}
        className="relative group"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Open AI Assistant"
      >
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full blur-lg opacity-75"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main Button */}
        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-2 border-white/20">
          <AnimatePresence mode="wait">
            {isVisible ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AiOutlineClose className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="robot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AiOutlineRobot className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Pulsing Ring */}
        <motion.div 
          className="absolute inset-0 border-2 border-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Notification dot */}
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Enhanced Chat Interface */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute bottom-16 right-0 w-[420px] max-w-[95vw]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Chat Container with Advanced Background */}
            <motion.div 
              className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              variants={backgroundVariants}
              animate="animate"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
                    `,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Header with Tabs */}
              <div className="relative bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ 
                        boxShadow: [
                          '0 0 20px rgba(168, 85, 247, 0.4)',
                          '0 0 30px rgba(236, 72, 153, 0.6)',
                          '0 0 20px rgba(168, 85, 247, 0.4)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <AiOutlineRobot className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Movie Assistant</h3>
                      <p className="text-xs text-gray-300">AI-Powered Movie Expert</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={clearChat}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Clear chat"
                    >
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-black/20 rounded-xl p-1">
                  {[
                    { id: 'chat', icon: BiMessageRounded, label: 'Chat' },
                    { id: 'recommendations', icon: MdRecommend, label: 'Recommend' },
                    { id: 'trending', icon: BiTrendingUp, label: 'Trending' }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                        activeTab === tab.id 
                          ? 'bg-white/20 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              {quickActions && activeTab === 'chat' && (
                <motion.div 
                  className="p-4 border-b border-white/10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xs text-gray-300 mb-3">Quick Actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActionButtons.map((action, index) => (
                      <motion.button
                        key={action.id}
                        onClick={() => handleQuickAction(action.id)}
                        className={`flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-20 hover:bg-opacity-30 text-white text-xs transition-all duration-200 border border-white/10`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <action.icon className="h-4 w-4" />
                        <span>{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages Area */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {messages.length === 0 ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <BiMoviePlay className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="text-white font-semibold mb-2">Welcome to Movie Assistant!</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Ask me about movies, TV shows, get recommendations,<br />
                      or share a movie link for detailed information!
                    </p>
                  </motion.div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${
                        message.isUser 
                          ? 'ml-4' 
                          : 'mr-4'
                      }`}>
                        <div className={`p-4 rounded-2xl ${
                          message.isUser 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                            : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm'
                        }`}>
                          {message.type === 'recommendation' && (
                            <div className="flex items-center space-x-2 mb-2">
                              <MdRecommend className="h-4 w-4 text-yellow-400" />
                              <span className="text-xs font-semibold text-yellow-400">AI Recommendation</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${
                              message.isUser ? 'text-purple-100' : 'text-gray-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {!message.isUser && (
                              <div className="flex space-x-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 hover:bg-white/10 rounded"
                                >
                                  <FiHeart className="h-3 w-3 text-gray-400 hover:text-red-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 hover:bg-white/10 rounded"
                                >
                                  <FiShare2 className="h-3 w-3 text-gray-400 hover:text-blue-400" />
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Enhanced Loading indicator */}
                {loading && (
                  <motion.div
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm mr-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about movies, share links, or get recommendations..."
                        disabled={loading}
                        className="w-full p-4 pr-14 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      />
                      <motion.button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <AiOutlineRobot className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <AiOutlineSend className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Feature Pills */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {[
                        { icon: FiFilm, label: 'Movies' },
                        { icon: FiTv, label: 'TV Shows' },
                        { icon: BiSearch, label: 'Search' }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.label}
                          className="flex items-center space-x-1 px-2 py-1 bg-white/5 rounded-full border border-white/10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <feature.icon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{feature.label}</span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Powered by AI
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieAssistant;