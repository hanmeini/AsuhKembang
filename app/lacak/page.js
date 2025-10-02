'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import BottomNavBar from '../../components/BottomNav';
import { useAuth } from '../../context/AuthContext';
import GrowthChart from '../../components/GrafikAnak';
import { addGrowthEntry, subscribeToGrowthEntries, deleteGrowthEntry } from '../../lib/firestore';
import { FaChartArea, FaChild, FaSave } from 'react-icons/fa';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ================== KOMPONEN BARU UNTUK KESIMPULAN AI ==================
const AISummaryCard = ({ summary, isLoading }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-teal-500">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Kesimpulan dari Brocco</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <video
                className="object-contain w-44 h-44 rounded-2xl
                           transition-transform duration-500 ease-in-out
                           transform"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            <div className="flex-1 ">
                {isLoading ? (
                    <p className="text-teal-700 italic">Brocco sedang menganalisis data pertumbuhan...</p>
                ) : summary ? (
                    <p className="text-teal-700 italic">"{summary}"</p>
                ) : (
                    <p className="text-teal-700 italic">Belum ada data untuk dianalisis</p>
                )}
            </div>
        </div>
    </div>
);

// ================== KOMPONEN BARU UNTUK TABEL RIWAYAT ==================
const HistoryTable = ({ entries, onDelete }) => {
    const formatDate = (dateValue) => {
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return 'Tanggal tidak valid';
};

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Pengukuran</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase">
                    <tr>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Berat (kg)</th>
              <th className="px-4 py-2">Tinggi (cm)</th>
                    </tr>
                </thead>
                <tbody>
            {entries.slice().reverse().map((entry) => (
                        <tr key={entry.id} className="border-b">
                <td className="px-4 py-2">{formatDate(entry.date)}</td>
                <td className="px-4 py-2">{entry.weight}</td>
                <td className="px-4 py-2">{entry.height}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
};


export default function GrowthTrackerPage() {
  const { userProfile } = useAuth();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  
  // State untuk data pertumbuhan, form, dan kesimpulan AI
  const [growthEntries, setGrowthEntries] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Mengatur profil anak yang aktif
  useEffect(() => {
    if (userProfile?.profiles) {
      const childProfile = userProfile.profiles.find(p => p.type === 'child');
      if (childProfile) {
        setActiveProfile(childProfile);
      }
    }
  }, [userProfile]);

  // Listener untuk mengambil data pertumbuhan
  useEffect(() => {
    if (userProfile?.uid && activeProfile?.profileId) {
      const unsubscribe = subscribeToGrowthEntries(userProfile.uid, activeProfile.profileId, (entries) => {
        setGrowthEntries(entries);
      });
      return () => unsubscribe();
    }
  }, [userProfile, activeProfile]);
  
  // Efek BARU untuk mengambil kesimpulan AI setiap kali data berubah
  useEffect(() => {
    if (growthEntries.length > 0 && activeProfile) {
        setIsLoadingAi(true);
        fetch('/api/growth-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ growthEntries, childProfile: activeProfile })
        })
        .then(res => res.json())
        .then(data => {
            if (data.summary) setAiSummary(data.summary);
        })
        .finally(() => setIsLoadingAi(false));
    }
  }, [growthEntries, activeProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || !height || !date || !activeProfile) return alert("Harap lengkapi semua data.");
    try {
      await addGrowthEntry(userProfile.uid, activeProfile.profileId, { date, weight: Number(weight), height: Number(height) });
      setWeight(''); setHeight('');
    } catch (error) {
      alert("Gagal menyimpan data pertumbuhan.");
    }
  };

    const handleDeleteEntry = async (entryId) => {
      if (!userProfile?.uid || !activeProfile?.profileId) return alert("Informasi profil tidak lengkap.");
      
      const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus catatan pertumbuhan ini?");
      if (confirmDelete) {
          try {
              await deleteGrowthEntry(userProfile.uid, activeProfile.profileId, entryId);
              alert("Data pertumbuhan berhasil dihapus.");
          } catch (error) {
              console.error("Gagal menghapus data:", error);
              alert("Gagal menghapus data. Silakan coba lagi.");
          }
      }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        }
    }
};

  const itemVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const textVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };


  const svgVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
        pathLength: 1, 
        opacity: 1,
        transition: { duration: 2, ease: "easeInOut" }
    }
};
  
  return (
    <AuthGuard>
      <div className="flex min-h-screen w-screen overflow-x-hidden">
        <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
        <main className={`pb-24 md:pb-0 transition-all duration-300 ease-in-out w-full md:w-[calc(100vw-5rem)] ${isSidebarExpanded ? 'md:ml-64 md:w-[calc(100vw-16rem)]' : 'md:ml-20'}`}>
          <div className="p-4 sm:p-6 md:p-10 w-full mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-full">
              <motion.div 
                    className="flex flex-col gap-4 w-full"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-3 rounded-full w-fit shadow-md">
                        <FaChartArea size={20} className="inline-block mr-3" />
                        Pelacak Pertumbuhan Anak
                    </h1>
                    <motion.div 
                        className='bg-gradient-to-br from-white via-emerald-100 to-teal-200 p-6 sm:p-8 rounded-2xl shadow-lg relative text-gray-600 overflow-hidden w-full'
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 w-16 h-16 bg-teal-600 rounded-full animate-pulse"></div>
                            <div className="absolute top-8 right-8 w-8 h-8 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <div className="absolute bottom-6 left-8 w-12 h-12 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute bottom-4 right-4 w-6 h-6 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                            <div className="absolute top-10 right-1/2 w-12 h-12 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                            <div className="absolute bottom-2 right-1/3 w-10 h-10 bg-teal-600 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        </div>
                        
                        <div className="relative z-10">
                            <h2 className="font-extrabold text-lg md:text-4xl leading-tight">
                                Awasi Setiap <span className="text-teal-700">Keajaiban</span> Pertumbuhan Si Kecil
                            </h2>
                            <p className="mt-2 max-w-lg md:text-base text-sm font-medium">
                                Dari senyum pertama hingga langkah pertamanya, setiap milimeter dan gram adalah sebuah pencapaian. Fitur ini mengubah data sederhana menjadi wawasan yang kuat.
                            </p>
                        </div>
                        <motion.div 
                            className="absolute bottom-0 right-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Video Bayi */}  
                            <motion.div 
                                className="relative z-10"
                                animate={{ y: [-5, 5] }}
                                transition={{ yoyo: Infinity, duration: 3, ease: 'easeInOut' }}
                            >
                                <Image 
                                    className="object-cover w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl" 
                                    src="/images/Continuous-Line-Heart-Hug-Anim-unscreen.gif" 
                                    alt="Heart Hug Animation"
                                    height={20}
                                    width={20}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>

              </motion.div>
            </div>

            
            {!activeProfile ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                    <FaChild size={40} className="mx-auto text-gray-400"/>
                    <p className="mt-4 text-gray-600">Anda belum memiliki profil anak. Silakan buat profil anak terlebih dahulu di halaman Profil untuk menggunakan fitur ini.</p>
                </div>
            ) : (
                <>
                    <p className="text-gray-600">Pantau tumbuh kembang <span className="font-bold">{activeProfile.name}</span> dan bandingkan dengan standar kurva pertumbuhan WHO.</p>
                    
                    {/* Form Input Data Baru */}
                    <div className='flex flex-col lg:flex-row justify-between gap-6 w-full'>
                      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl md:shadow-lg w-full lg:max-w-2xl">
                          <h2 className="text-xl font-bold text-gray-700">Tambah Catatan Baru</h2>
                          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm text-gray-600 font-semibold">Tanggal</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-3 md:p-4 rounded-xl bg-gray-50" required/></div>
                                <div><label className="block text-sm text-gray-600 font-semibold">Berat (kg)</label><input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Contoh: 8.5" className="w-full mt-1 p-3 md:p-4 rounded-xl bg-gray-50" required/></div>
                                <div><label className="block text-sm text-gray-600 font-semibold">Tinggi (cm)</label><input type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} placeholder="Contoh: 70.2" className="w-full mt-1 p-3 md:p-4 rounded-xl bg-gray-50" required/></div>
                              </div>
                              <button type="submit" className="w-fit bg-teal-500 text-white font-semibold gap-3 justify-center flex flex-row items-center py-2.5 px-10 rounded-xl hover:bg-teal-600">Simpan
                                <span>
                                  <FaSave size={16} className="inline-block" />
                                </span>
                              </button>
                          </form>
                      </div>
                      <motion.div 
                          className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 lg:flex hidden items-center justify-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                      >
                          {/* Video Bayi */}  
                          <motion.div 
                              className="relative z-10"
                              animate={{ y: [-5, 5] }}
                              transition={{ yoyo: Infinity, duration: 3, ease: 'easeInOut' }}
                          >
                              <video className="object-cover w-52 h-52 rounded-2xl" autoPlay loop muted playsInline>
                                  <source src="/images/Baby_Animation_Request_Fulfilled.mp4" type="video/mp4" />
                              </video>
                          </motion.div>
                      </motion.div>
                    </div>

                    {/* Tampilan Grafik */}
                    <div className="bg-white p-6 rounded-2xl md:shadow-lg">
                        <GrowthChart childData={growthEntries} childBirthDate={activeProfile.birthDate}/>
                    </div>

                    {/* Kesimpulan AI & Riwayat */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AISummaryCard summary={aiSummary} isLoading={isLoadingAi} />
                        <HistoryTable entries={growthEntries} onDelete={handleDeleteEntry} />
                    </div>
                </>
            )}
          </div>
        </main>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}
