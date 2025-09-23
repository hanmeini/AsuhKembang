'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { subscribeToAllChats, subscribeToChatMessages } from '../../lib/firestore';
import AuthGuard from '../../context/AuthGuard';
import BottomNavBar from '../../components/BottomNav';
import { FaPaperPlane, FaPlus, FaComments, FaBook, FaCode, FaCog, FaShare2 } from 'react-icons/fa';
import Image from 'next/image';
import { Video, Mic, Equal } from 'lucide-react';
import Link from 'next/link';
import { LayoutDashboard, MessageSquarePlus, MessageSquare, Menu, X } from 'lucide-react';

const Sidebar = ({ 
    isExpanded, 
    onToggleExpand, 
    chatHistory, 
    activeChatId, 
    onSelectChat, 
    onNewChat 
}) => {
    const { userProfile } = useAuth();
    
    return (
    <>
      <button 
        onClick={onToggleExpand}
        className="fixed top-4 right-4 z-100 p-2 bg-white rounded-full shadow-lg md:hidden"
      >
        {isExpanded ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gray-50 text-gray-800 flex flex-col z-40
        transition-transform duration-300 ease-in-out
        ${isExpanded ? 'translate-x-0 w-72 p-4' : '-translate-x-full w-72 p-4'}
        md:relative md:translate-x-0 md:w-72 md:p-4
      `}>
        
        {/* Header dan Navigasi Utama */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-teal-600">Healthier</h1>
          </div>
          
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-gray-200 transition-colors">
              <LayoutDashboard size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <button onClick={onNewChat} className="w-full flex items-center gap-3 px-4 py-2.5 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors">
              <MessageSquarePlus size={20} />
              <span className="font-semibold">Percakapan Baru</span>
            </button>
          </nav>
        </div>

        <div className="flex-grow flex flex-col min-h-0 mt-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-4">Histori</h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-1">
            {chatHistory.map((chat) => (
              <button 
                key={chat.id} 
                onClick={() => onSelectChat(chat)} 
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-full transition-colors group
                           ${activeChatId === chat.id ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
              >
                <MessageSquare size={18} className="text-gray-500 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-700">{chat.title}</p>
              </button>
            ))}
          </div>
        </div>
        
      </aside>
      {isExpanded && <div onClick={onToggleExpand} className="fixed inset-0 bg-black/30 z-30 md:hidden"></div>}
    </>
  );
}

export default function ChatPage() {
    const { userProfile } = useAuth();
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const userName = userProfile?.displayName || 'Pengguna';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);

    useEffect(() => {
        if (userProfile?.uid) {
            const unsubscribe = subscribeToAllChats(userProfile.uid, (chats) => {
                setChatHistory(chats);
            });
            return () => unsubscribe();
        }
    }, [userProfile]);

    // Berlangganan ke pesan dari chat yang sedang aktif
    useEffect(() => {
        if (activeChat?.id) {
            const unsubscribe = subscribeToChatMessages(activeChat.id, (messages) => {
                setActiveChat(prev => ({ ...prev, messages }));
            });
            return () => unsubscribe();
        }
    }, [activeChat?.id]);
    
    const handleSendMessage = async (message) => {
        if (!message.trim() || isLoading) return;
        
        let currentChatId = activeChat?.id || null;
        let currentMessages = activeChat?.messages || [];
        
        const userMessage = { sender: 'user', text: message };
        setActiveChat(prev => ({
            ...prev,
            messages: [...(prev?.messages || []), userMessage]
        }));
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    context: { type: 'general' },
                    history: currentMessages,
                    chatId: currentChatId,
                    userProfile: userProfile
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            if (!currentChatId && data.chatId) {
                setActiveChat(prev => ({ ...prev, id: data.chatId }));
            }
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            setActiveChat(prev => ({...prev, messages: currentMessages}));
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setActiveChat({ id: null, title: 'Percakapan Baru', messages: [] });
    };
    
    const handleSelectChat = (chat) => {
        setActiveChat(chat);
        setSidebarExpanded(false); 
    };

    const hasMessages = activeChat && activeChat.messages && activeChat.messages.length > 0;

    return (
        <AuthGuard>
            <div className="flex bg-gradient-to-br from-white via-white to-purple-50/50 h-screen text-gray-800">
                <Sidebar 
                    isExpanded={isSidebarExpanded} 
                    onToggleExpand={() => setSidebarExpanded(!isSidebarExpanded)}
                    chatHistory={chatHistory}
                    activeChatId={activeChat?.id}
                    onSelectChat={handleSelectChat}
                    onNewChat={handleNewChat}
                />
                
                <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
                    <div className="flex-1 flex flex-col items-center justify-between p-2 md:p-2 w-full max-w-4xl mx-auto">
                        <div className="w-full flex-1 flex flex-col justify-center items-center overflow-hidden">
                            {hasMessages ? (
                                <div className="space-y-4 overflow-y-auto pb-4">
                                    {activeChat.messages.map((msg, index) => (
                                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.sender !== 'user' && (
                                                <video className="w-14 h-14 rounded-full object-cover" autoPlay loop muted playsInline>
                                                    <source 
                                                        src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4">
                                                    </source>
                                                </video>
                                            )}
                                            <p className={`max-w-[80%] text-[16px] font-medium p-3 rounded-xl ${msg.sender === 'user' ? 'bg-teal-500 text-white' : 'bg-white shadow-sm text-gray-800'}`}>{msg.text}</p>
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
                            ) : (
                                <div className="text-center flex-1 flex flex-col justify-center items-center -mt-16 relative">
                                    <div className="relative mb-8">
                                        <video className="object-contain w-52 h-52" autoPlay loop muted playsInline>
                                            <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
                                        </video>
                                    </div> 
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-96 h-96 bg-gradient-to-b from-teal-600 to-emerald-300 rounded-full filter blur-[150px] opacity-20"></div>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-semibold text-gray-700">Hallo, {userName}</h1>
                                    <h2 className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                                        Ayo ceritakan keluhanmu
                                    </h2>
                                </div>
                            )}
                        </div>
                        
                        <div className="w-full pt-4">
                            {!hasMessages && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <button onClick={() => handleSendMessage('Apa saja makanan yang baik untuk ibu hamil?')} className="bg-white/60 backdrop-blur-sm border border-gray-200/70 p-4 rounded-xl hover:border-teal-300 transition text-left"><p className="font-semibold text-sm">Apa saja makanan yang baik untuk ibu hamil?</p></button>
                                    <button onClick={() => handleSendMessage('Berapa kalori dalam sepiring nasi goreng?')} className="bg-white/60 backdrop-blur-sm border border-gray-200/70 p-4 rounded-xl hover:border-teal-300 transition text-left"><p className="font-semibold text-sm">Berapa kalori dalam sepiring nasi goreng?</p></button>
                                    <button onClick={() => handleSendMessage('Buatkan menu makan sehat untuk seminggu')} className="bg-white/60 backdrop-blur-sm border border-gray-200/70 p-4 rounded-xl hover:border-teal-300 transition text-left"><p className="font-semibold text-sm">Buatkan menu makan sehat untuk seminggu</p></button>
                                </div>
                            )}

                            <div className="relative mb-24 md:mb-0 shadow-lg rounded-full">
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)} placeholder="Ceritakan keluhan atau tanyakan apa saja..." className="w-full py-4 pl-6 pr-16 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                                <button onClick={() => handleSendMessage(input)} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full disabled:bg-gray-400 hover:bg-teal-600 transition">
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <BottomNavBar/>
            </div>
        </AuthGuard>
    );
}

