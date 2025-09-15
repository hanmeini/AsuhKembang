'use client';

import React from 'react';
import { useChat } from '../context/ChatContext';
import { FaComments } from 'react-icons/fa';

const FloatingChatButton = () => {
  const { openChatWithContext } = useChat();

  return (
    <button 
      onClick={() => openChatWithContext({ type: 'general', data: null })}
      className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg"
    >
      <FaComments size={28} />
    </button>
  );
};

export default FloatingChatButton;
