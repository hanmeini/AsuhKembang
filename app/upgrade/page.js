'use client';

import React from 'react';
import { useState } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import BottomNavBar from '../../components/BottomNav';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const FeatureItem = ({ text }) => (
    <li className="flex items-center gap-3">
        <FaCheckCircle className="text-teal-500" />
        <span>{text}</span>
    </li>
);

export default function UpgradePage() {
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);

    const handleSubscribeClick = () => {
        alert("Terima kasih atas minat Anda! Fitur 'AsuhKembang Plus' akan segera hadir.");
    };

    return (
        <AuthGuard>
            <div className="flex bg-gray-50 min-h-screen">
                <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
                <main className={`flex-1 pb-24 md:pb-0 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
                    <div className="p-6 md:p-10 max-w-2xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src='/images/logo-asuh-kembang.png' width={40} height={40} className='mx-auto' alt='logo'/>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">Tingkatkan ke AsuhKembang Plus</h1>
                            <p className="mt-2 text-gray-600">
                                Dapatkan akses tak terbatas ke semua fitur cerdas kami dan percepat perjalanan Anda menuju gizi optimal.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="bg-white p-8 rounded-2xl shadow-lg mt-8 text-left space-y-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Semua yang Anda dapatkan di Plus:</h2>
                            <ul className="space-y-3 text-gray-700">
                                <FeatureItem text="Konsultasi AI Tanpa Batas dengan 'Brocco'" />
                                <FeatureItem text="Akses Penuh ke Seluruh Riwayat Scan Makanan" />
                                <FeatureItem text="Perencana Menu Makan Mingguan oleh AI" />
                                <FeatureItem text="Laporan Pertumbuhan Anak yang Mendalam (PDF)" />
                                <FeatureItem text="Dukungan Prioritas" />
                            </ul>
                            <div className="pt-6">
                                <button 
                                    onClick={handleSubscribeClick}
                                    className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition-transform hover:scale-105"
                                >
                                    Berlangganan Sekarang (Rp 25.000/bulan)
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <BottomNavBar />
            </div>
        </AuthGuard>
    );
}
