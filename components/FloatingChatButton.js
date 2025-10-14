'use client';

import React from 'react';
import Link from 'next/link';
import { FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

const FloatingChatButton = () => {
  return (
    <MotionLink 
      href="/chat"
      className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg"
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300 }}
      aria-label="Buka Halaman Chat"
    >
      <FaComments size={28} />
    </MotionLink>
  );
};

export default FloatingChatButton;

