'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaUsers, FaUserCircle } from 'react-icons/fa';
import { IoScan, IoJournal } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Komponen internal untuk setiap item navigasi
const NavItem = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="flex-1">
      <motion.div
        className={`flex flex-col items-center transition-colors duration-200 ${
          isActive ? 'text-teal-600' : 'text-gray-500 hover:text-teal-600'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
        <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
          {label}
        </span>
      </motion.div>
    </Link>
  );
};

const BottomNavBar = () => {
  const { userProfile } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center p-2 z-50">
      <NavItem href="/dashboard" icon={<FaChartBar size={22} />} label="Dashboard" />
      <NavItem href="/jurnal" icon={<IoJournal size={22} />} label="Jurnal" />

      {/* Tombol Scan di Tengah */}
      <Link href="/scan" className="flex-1">
        <motion.div 
            className="transform -translate-y-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg mx-auto">
            <IoScan size={32} />
          </div>
        </motion.div>
      </Link>
      
      <NavItem href="/komunitas" icon={<FaUsers size={22} />} label="Komunitas" />
      
      {/* Item Profil dengan Logika Avatar */}
      <NavItem 
        href="/profile"
        label="Profil"
        icon={
          userProfile?.photoURL ? (
            <Image
              src={userProfile.photoURL}
              alt="Foto Profil"
              width={24}
              height={24}
              className="rounded-full object-cover w-6 h-6"
            />
          ) : (
            <FaUserCircle size={22} />
          )
        }
      />
    </nav>
  );
};

export default BottomNavBar;

