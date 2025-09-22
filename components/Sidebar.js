'use client';

import React from 'react';
import { FaUserCircle, FaSignOutAlt, FaChartBar, FaCamera, FaUsers, FaBookMedical, FaHeartbeat, FaComments } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import { useChat } from '../context/ChatContext';

const SidebarLink = ({ href, icon, text, expanded }) => (
  <Link 
    href={href} 
    className="flex items-center space-x-4 text-gray-700 p-3 rounded-lg hover:bg-teal-50 transition-colors"
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>
      {text}
    </span>
  </Link>
);

const Sidebar = ({ isExpanded, onMouseEnter, onMouseLeave }) => {
  const { userProfile, logout } = useAuth(); 
  const { openChatWithContext } = useChat(); 
  
  const userName = userProfile?.displayName || 'Pengguna';

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen z-50 
                 hidden md:flex flex-col bg-white shadow-md 
                 transition-all duration-300 ease-in-out 
                 ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4 flex items-center justify-center">
        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          H
        </div>
      </div>

      <nav className="flex-grow px-4 pt-4 space-y-2">
        <SidebarLink href="/dashboard" icon={<FaChartBar size={24} />} text="Dashboard" expanded={isExpanded} />
        <SidebarLink href="/scan" icon={<FaCamera size={24} />} text="Scan Makanan" expanded={isExpanded} />
        <SidebarLink href="/jurnal" icon={<FaBookMedical size={24} />} text="Jurnal" expanded={isExpanded} />
        <SidebarLink href="/lacak" icon={<FaHeartbeat size={24} />} text="Lacak Pertumbuhan" expanded={isExpanded} />
        <SidebarLink href="/komunitas" icon={<FaUsers size={24} />} text="Komunitas" expanded={isExpanded} />
        <SidebarLink href="/chat" icon={<FaComments size={24} />} text="Chat Brocco" expanded={isExpanded} />
      </nav>

      <div className="p-4 border-t overflow-hidden">
        <Link href='/profile' className="flex p-2 hover:bg-gray-50 transition-colors duration-200 w-full rounded-lg items-center space-x-4">
        {userProfile?.photoURL ? (
          <Image
            src={userProfile.photoURL}
            alt="Foto Profil"
            width={40}
            height={40}
            className="rounded-full flex-shrink-0"
          />
        ) : (
          <FaUserCircle size={40} className="text-gray-500 flex-shrink-0" />
        )}
          <div className={`transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
            <p className="font-bold whitespace-nowrap">{userName}</p>
            <div className="text-sm text-gray-500 hover:underline whitespace-nowrap">
              Kelola Profil
            </div>
          </div>
        </Link>
        <button 
          onClick={logout} 
          className="w-full mt-4 flex items-center space-x-2 text-red-600 p-2 rounded-lg hover:bg-red-50"
        >
          <FaSignOutAlt className="flex-shrink-0"/>
          <span className={`font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;