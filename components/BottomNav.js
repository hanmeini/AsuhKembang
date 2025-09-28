'use client';

import React from 'react';
import Link from 'next/link';
import { FaChartBar, FaUser, FaUsers,FaUserCircle } from 'react-icons/fa';
import { IoScan, IoJournal } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

const BottomNavBar = () => {
  const { userProfile } = useAuth();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center p-2 z-50">
      <Link href="/dashboard" className="flex flex-col items-center text-gray-500 hover:text-teal-600">
        <FaChartBar size={22} />
        <span className="text-xs mt-1">Dashboard</span>
      </Link>
      <Link href="/jurnal" className="flex flex-col items-center text-gray-500 hover:text-teal-600">
        <IoJournal size={22} />
        <span className="text-xs mt-1">Jurnal</span>
      </Link>
      <Link href="/scan" className="transform -translate-y-4">
        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
          <IoScan size={32} />
        </div>
      </Link>
      <Link href="/komunitas" className="flex flex-col items-center text-gray-500 hover:text-teal-600">
        <FaUsers size={22} />
        <span className="text-xs mt-1">Komunitas</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-teal-600">
        {userProfile?.photoURL ? (
          <Image
            src={userProfile.photoURL}
            alt="Foto Profil"
            width={22}
            height={22}
            className="rounded-full object-cover w-6 h-6 flex-shrink-0"
          />
        ) : (
          <FaUserCircle size={22} className="text-gray-500 flex-shrink-0" />
        )}
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNavBar;