'use client';

import React from 'react';
import { useChat } from '../context/ChatContext';
import { FaComments } from 'react-icons/fa';
import Link from 'next/link';

const FloatingChatButton = () => {
  const { openChatWithContext } = useChat();

  return (
    <Link href="/chat" 
      className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg"
    >
      <FaComments size={28} />
    </Link>
  );
};

export default FloatingChatButton;
