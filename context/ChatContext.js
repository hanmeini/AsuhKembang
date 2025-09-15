'use client';

import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState({ type: 'general', data: null });
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);

  const openChatWithContext = (newContext) => {
    setContext(newContext);
    let welcomeMessage = "Hai! Ada yang bisa saya bantu seputar kesehatan ibu dan anak?";
    if (newContext.type === 'scan_result') {
        welcomeMessage = `Hai! Ada yang ingin ditanyakan tentang ${newContext.data.aiScanResult.display_name} ini?`;
    }
    setMessages([{ sender: 'ai', text: welcomeMessage }]);
    setChatId(null);
    setIsOpen(true);
  };

  const closeChat = () => setIsOpen(false);

  const value = {
    isOpen,
    context,
    messages,
    setMessages,
    openChatWithContext,
    closeChat,
    chatId,
    setChatId
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

