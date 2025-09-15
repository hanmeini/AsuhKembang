'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ChatModal = () => {
  const {userProfile} = useAuth();
  const { isOpen, closeChat, messages, setMessages, context, chatId, setChatId } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          context: context,
          chatId: chatId,
          userProfile: userProfile,
          history: [...messages, userMessage], 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mendapatkan balasan.");

      if (data.chatId && !chatId) {
        setChatId(data.chatId);
      }

      const aiMessage = { sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error saat chat dengan AI:", error);
      const errorMessage = { sender: 'ai', text: "Maaf, terjadi kesalahan. Coba lagi nanti." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex justify-center items-end p-0 md:p-4"
        >
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white w-full max-w-lg h-[90vh] md:h-[80vh] md:rounded-2xl rounded-t-3xl flex flex-col"
          >
            {/* Header Chat */}
            <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
              <h3 className="font-bold text-lg">Tanya Brocco</h3>
              <button onClick={closeChat} className="text-gray-500 hover:text-gray-800"><FaTimes /></button>
            </div>
            {/* Area Pesan */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender !== 'user' && (
                    <video className="w-14 h-14 rounded-full object-cover" autoPlay loop muted playsInline>
                      <source 
                        src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4">
                      </source>
                    </video>
                  )}
                  <p className={`max-w-[80%] text-[16px] font-medium p-3 rounded-xl ${msg.sender === 'user' ? 'bg-teal-500 text-white' : 'bg-white shadow-sm text-gray-800'}`}>
                    {msg.text}
                  </p>
                </div>
              ))}
              {isLoading && 
                <div className="flex items-end gap-2 justify-start animate-fade-in">
                  <video className="w-14 h-14 rounded-full object-cover" autoPlay loop muted playsInline>
                    <source 
                      src="/images/brokoli-think.mp4" type="video/mp4">
                    </source>
                  </video>
                  <div className="relative max-w-[80%] p-3 rounded-xl bg-white shadow-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-semibold">Brocco sedang berpikir...</p>
                      </div>
                    </div>
                  </div>
                }
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="relative mb-24 md:mb-0 p-2 rounded-full">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ceritakan keluhan atau tanyakan apa saja..." className="w-full py-4 pl-6 pr-16 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
              <button type='submit' disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full disabled:bg-gray-400 hover:bg-teal-600 transition">
                <FaPaperPlane />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;

