'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import BottomNavBar from '../../components/BottomNav';
import { FaPlus, FaCamera, FaWeight, FaShieldAlt, FaBaby, FaHeartbeat, FaCalendarAlt, FaTimes, FaSearch, FaSmile, FaTired, FaExclamationTriangle, FaArrowLeft, FaCheckCircle, FaComments, FaUtensils } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { subscribeToJournals, updateUserActiveTrimester } from '../../lib/firestore';
import JournalingAnimation from '../../components/jurnalAnimation';
import FloatingChatButton from '../../components/FloatingChatButton';

const WeekBox = ({ week, isComplete, isCurrent, onClick }) => (
    <motion.button 
        onClick={onClick} 
        whileHover={{ scale: 1.1, y: -2 }}
        className={`relative w-full aspect-square flex items-center justify-center rounded-lg border-2 font-bold transition-all duration-200
        ${isComplete ? 'bg-teal-500 text-white' : 'bg-white hover:bg-pink-50'}
        ${isCurrent ? 'border-pink-500 ring-2 ring-pink-300' : 'border-gray-200'}
    `}>
        <span className="text-lg">{week}</span>
        {isComplete && <FaCheckCircle className="absolute top-1.5 right-1.5 text-white/70 text-xs"/>}
    </motion.button>
);

// Komponen untuk menampilkan detail entri jurnal yang dipilih
const JournalDetailView = ({ entry, onBack, userProfile, activeProfile }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState(null);
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    
    const handleVerify = async () => {
        console.log("Memulai verifikasi untuk:", { userId: userProfile?.uid, profileId: activeProfile?.profileId, journalId: entry?.id });

        if (!userProfile || !activeProfile || !entry) {
            setError("Data pengguna atau jurnal tidak lengkap untuk verifikasi.");
            return;
        }

        setIsVerifying(true);
        setError(null);
        try {
            const response = await fetch('/api/verify-journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: userProfile.uid, 
                    profileId: activeProfile.profileId, 
                    journalId: entry.id 
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Gagal melakukan verifikasi.");

            alert("Jurnal berhasil diverifikasi di blockchain!");
            setVerificationSuccess(true);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsVerifying(false);
        }
    };

    if (!entry) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-10 h-full bg-gray-100 rounded-2xl">
                <FaHeartbeat size={50} className="text-gray-300" />
                <h3 className="mt-4 text-xl font-bold text-gray-700">Pilih Jurnal</h3>
                <p className="mt-2 text-gray-500">Pilih salah satu entri dari daftar untuk melihat detailnya.</p>
            </div>
        );
    }
    
    // Cek status verifikasi dari data entri atau dari state sementara
    const isVerified = entry.isVerified || verificationSuccess;

    return (
        <div className="space-y-8 animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 font-semibold text-gray-600 hover:text-gray-800">
                <FaArrowLeft/> Kembali ke Daftar Jurnal
            </button>
            <div className="bg-white md:p-6 md:rounded-2xl md:shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Rangkuman Minggu ke-{entry.week}</h2>
                        <p className="text-sm text-gray-500 mb-4">{entry.date}</p>
                    </div>
                    <div className='flex flex-col'>
                        {isVerified ? (
                            <a href={`https://sepolia.etherscan.io/tx/${entry.transactionHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-full hover:bg-green-200">
                                <FaShieldAlt /> Terverifikasi
                            </a>
                        ) : (
                            <button onClick={handleVerify} disabled={isVerifying} className="flex items-center gap-2 text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-full hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed">
                                <FaShieldAlt /> {isVerifying ? 'Memverifikasi...' : 'Verifikasi di Blockchain'}
                            </button>
                        )}
                        {error && <p className="text-xs text-red-500 mt-1 text-right">{error}</p>}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col items-start gap-4">
                        <div className='flex flex-row gap-5'>
                            <FaBaby className="text-pink-500 mt-1" size={20}/>
                            <h4 className="font-semibold">Perkembangan Janin</h4>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{entry.result.perkembangan_janin}</p>
                        </div>
                    </div>
                     <div className="flex items-start flex-col gap-4">
                        <div className='flex flex-row gap-5'>
                            <FaExclamationTriangle className="text-orange-500 mt-1" size={20}/>
                            <h4 className="font-semibold">Perubahan Tubuh Ibu</h4>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{entry.result.gejala_umum_ibu}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Rangkuman Catatan Pengguna */}
            <div className="bg-white md:p-6 md:rounded-2xl md:shadow-lg">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Rangkuman Catatan Anda</h2>
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-sm text-gray-600 mb-2">Suasana Hati</h3>
                        <p className="text-lg font-bold">{entry.dailyInputs.mood || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-sm text-gray-600 mb-2">Gejala</h3>
                        <p className="text-lg font-bold">{entry.dailyInputs.symptoms.join(', ') || 'N/A'}</p>
                    </div>
                 </div>
                <div className="bg-white">
                <h3 className="text-xl font-bold text-gray-800">
                    Dokumentasi <span className="text-pink-500">Kehamilan</span> Anda
                </h3>

                {entry.dailyInputs.photoUrl ? (
                    <div className="relative w-full aspect-video mt-4 rounded-lg overflow-hidden">
                    <Image 
                        src={entry.dailyInputs.photoUrl} 
                        alt={`Foto minggu ke-${entry.week}`} 
                        fill 
                        className="object-cover"
                    />
                    </div>
                ) : (
                    <div className="w-full text-center mt-4 p-6 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Belum ada foto yang diunggah untuk minggu ini.</p>
                    </div>
                )}
                </div>
                 {entry.dailyInputs.note && (
                    <div className="p-4 rounded-lg mt-6 flex md: items-center md:flex-row flex-col border-l-4 border-teal-500">
                                <video className="object-cover w-44 h-40 transition-transform duration-500 ease-in-out transform group-hover:scale-105 group-hover:-rotate-3"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/images/Cheerful_Broccoli_Animation_Generated.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                        <div className=''>
                            <h4 className="font-semibold text-sm text-teal-800">Saran dari Brocco:</h4>
                            <p className="text-sm italic text-teal-700 mt-1">"{entry.result.kesimpulan_ai}"</p>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};


const SymptomButton = ({ symptom, isSelected, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
      isSelected ? 'bg-pink-500 text-white border-pink-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {symptom}
  </button>
);

const MoodButton = ({ icon, label, isSelected, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 w-16 h-16 justify-center ${
      isSelected ? 'bg-amber-400 scale-110' : 'bg-gray-100 hover:bg-amber-100'
    }`}
  >
    <div className="text-2xl">{icon}</div>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

// ================== MODAL UNTUK MEMBUAT JURNAL BARU ==================
const NewJournalForm = ({ week, onSave, onBack }) => {
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        mood: null,
        symptoms: [],
        weight: '',
        note: '',
        photoFile: null,
        photoPreview: null,
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSave = () => {
        setIsSaving(true);
        const { photoPreview, ...dataToSave } = formData;
        onSave({ week, dailyInputs: dataToSave });
    };

    const handleSymptomClick = (symptom) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };
    
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photoFile: file,
                photoPreview: URL.createObjectURL(file),
            }));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-lg relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700"><FaArrowLeft size={20}/></button>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Jurnal Minggu ke-{week}</h2>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
                <motion.div 
                    className="bg-teal-500 h-1.5 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                    {step === 1 && (
                        <div>
                            <label className="font-semibold text-gray-700 text-lg">Bagaimana suasana hatimu hari ini?</label>
                            <div className="flex justify-around mt-4">
                                <MoodButton icon="😔" label="Sedih" isSelected={formData.mood === 'Sedih'} onClick={() => setFormData({...formData, mood: 'Sedih'})} />
                                <MoodButton icon="😐" label="Biasa" isSelected={formData.mood === 'Biasa'} onClick={() => setFormData({...formData, mood: 'Biasa'})} />
                                <MoodButton icon="😊" label="Senang" isSelected={formData.mood === 'Senang'} onClick={() => setFormData({...formData, mood: 'Senang'})} />
                                <MoodButton icon="😄" label="Bahagia" isSelected={formData.mood === 'Bahagia'} onClick={() => setFormData({...formData, mood: 'Bahagia'})} />
                            </div>
                        </div>
                    )}
                     {step === 2 && (
                        <div>
                            <label className="font-semibold text-gray-700 text-lg">Gejala apa yang kamu rasakan?</label>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <SymptomButton symptom="Mual" isSelected={formData.symptoms.includes('Mual')} onClick={() => handleSymptomClick('Mual')} />
                                <SymptomButton symptom="Lelah" isSelected={formData.symptoms.includes('Lelah')} onClick={() => handleSymptomClick('Lelah')} />
                                <SymptomButton symptom="Nyeri Punggung" isSelected={formData.symptoms.includes('Nyeri Punggung')} onClick={() => handleSymptomClick('Nyeri Punggung')} />
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                         <div>
                            <label className="font-semibold text-gray-700 text-lg">Catatan & Berat Badan</label>
                            <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} placeholder="Berat badan saat ini (kg)" className="w-full p-2 border rounded mt-4"/>
                            <textarea value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} placeholder="Tulis catatan harianmu..." rows="3" className="w-full p-2 border rounded mt-2"/>
                        </div>
                    )}
                     {step === 4 && (
                        <div>
                            <label className="font-semibold text-gray-700 text-lg">Unggah Foto Momen</label>
                            <div className="mt-4 h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                                {formData.photoPreview ? (
                                    <img src={formData.photoPreview} alt="Preview" className="h-full object-contain rounded-lg"/>
                                ) : (
                                    <label htmlFor="photo-upload" className="cursor-pointer text-center text-gray-500">
                                        <FaCamera size={40} className="mx-auto"/>
                                        <p>Klik untuk unggah foto</p>
                                    </label>
                                )}
                                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden"/>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
                <button 
                    onClick={handleBack} 
                    disabled={step === 1 || isSaving} 
                    className="px-6 py-2 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 transition-transform active:scale-95"
                >
                    Kembali
                </button>
                {step < 4 ? (
                    <button 
                        onClick={handleNext} 
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-pink-500 active:scale-95 active:brightness-90"
                    >
                        Lanjut
                    </button>
                ) : (
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-teal-600 disabled:bg-gray-400 active:scale-95 active:brightness-90"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan & Lihat Rangkuman'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const JournalLobby = () => {
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
    return (
        <div className='space-y-8'>
                    <div className="relative bg-pink-600 bg-gradient-to-r text-white rounded-2xl shadow-lg flex justify-between items-center overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                    <div className="p-6 md:p-8 flex-1 z-10">
                        <h3 className="text-md md:text-2xl font-bold">Jurnal Kehamilan</h3>
                        <p className="text-sm md:text-base mt-2 opacity-90 max-w-xs">
                        Peduli dengan si kecil melalui jurnal kehamilan yang cerdas dan personal.
                        </p>
                    </div>
                    <div className="relative w-40 h-full flex-shrink-0">
                        <div className="absolute -bottom-26 -right-4 w-48 h-48">
                        <Image 
                            src='/images/hamil-transparan1.png'
                            alt="Ibu Hamil" 
                            width={200} 
                            height={200}
                            className='w-full h-full object-contain'
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/65 via-pink-500/50 to-pink-500/20"></div>
                        </div>
                    </div>
                    </div>

                    <motion.section 
                        className="container mx-auto p-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <motion.div variants={itemVariants} className="relative items-center justify-center flex group">
                                <video
                                    className="object-cover w-40 h-40
                                            transition-transform duration-500 ease-in-out
                                            transform group-hover:scale-105 group-hover:-rotate-3"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/images/Baby_Animation_Request_Fulfilled.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div
                                    className="absolute top-1/4 -left-4 bg-white px-4 py-2 rounded-full shadow-md
                                            opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                                            transition-all duration-300 ease-in-out
                                            transform group-hover:-rotate-6"
                                >
                                    <span className="text-sm font-medium">gugugaga 🍼</span>
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0
                                                border-t-8 border-t-transparent
                                                border-b-8 border-b-transparent
                                                border-r-8 border-r-white">
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col text-left">
                                <motion.h2 variants={textVariants} className="text-md md:text-xl font-bold text-gray-800 leading-tight">
                                    Awali <span className="text-pink-500">Kepedulian</span>, Abadikan <span className="text-teal-500">Perjalanan</span>
                                </motion.h2>
                                <motion.p variants={textVariants} transition={{ delay: 0.2 }} className="mt-4 md:text-base text-xs text-gray-600 max-w-lg mx-auto md:mx-0">
                                    Setiap tendangan, setiap momen. Catat dan pahami kehamilan dengan Healthier untuk masa depan sang buah hati.
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Link href="/chat" className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <FaComments size={30} className="text-pink-500"/>
                            <div>
                                <h3 className="font-bold text-gray-800">Konsultasi AI</h3>
                                <p className="text-sm text-gray-500">Tanya Brocco tentang gizi & kehamilan.</p>
                            </div>
                        </Link>
                        <Link href="/rekomendasi" className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <FaUtensils size={30} className="text-teal-500"/>
                            <div>
                                <h3 className="font-bold text-gray-800">Rekomendasi Makanan</h3>
                                <p className="text-sm text-gray-500">Dapatkan ide menu sehat setiap hari.</p>
                            </div>
                        </Link>
                    </div>
        </div>

    );

}

// --- Halaman Utama Jurnal Kehamilan ---
export default function TrackerPage() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const { userProfile } = useAuth();
  const [activeProfile, setActiveProfile] = useState(null);
  const [view, setView] = useState('trimester_view'); 
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [activeTrimester, setActiveTrimester] = useState(1);
  const [journalEntries, setJournalEntries] = useState({});
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);

  useEffect(() => {
    if (userProfile?.profiles?.length > 0) {
      const currentActiveProfile = userProfile.profiles.find(p => p.profileId === userProfile.activeProfileId) || userProfile.profiles[0];
      setActiveProfile(currentActiveProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile?.activeTrimester) {
        setActiveTrimester(userProfile.activeTrimester);
    } else if (activeProfile?.type === 'pregnant' && activeProfile.dueDate) {
      const dueDate = new Date(activeProfile.dueDate);
      const today = new Date();
      const totalPregnancyDays = 280;
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const daysPregnant = totalPregnancyDays - diffDays;
      const weekNumber = Math.ceil(daysPregnant / 7);
      
      setCurrentWeek(weekNumber);
      if (weekNumber <= 14) setActiveTrimester(1);
      else if (weekNumber <= 28) setActiveTrimester(2);
      else setActiveTrimester(3);
    } else {
      setCurrentWeek(null);
    }
  }, [activeProfile, userProfile]);

  // Listener real-time untuk data jurnal
  useEffect(() => {
    if (userProfile?.uid && activeProfile?.profileId) {
      const unsubscribe = subscribeToJournals(userProfile.uid, activeProfile.profileId, (entries) => {
        const entriesObject = entries.reduce((acc, entry) => { acc[entry.week] = entry; return acc; }, {});
        setJournalEntries(entriesObject);
      });
      return () => unsubscribe();
    }
  }, [userProfile, activeProfile]);

  const trimesterWeeks = {
    1: Array.from({ length: 14 }, (_, i) => i + 1),
    2: Array.from({ length: 14 }, (_, i) => i + 15),
    3: Array.from({ length: 14 }, (_, i) => i + 29),
  };

  const handleWeekSelect = (week) => {
    const existingEntry = journalEntries[week];
    if (existingEntry) {
      setSelectedEntry(existingEntry);
      setView('detail');
    } else {
      setSelectedWeek(week);
      setView('form');
    }
  };

  const handleSaveJournal = async (newEntryData) => {
    if (!userProfile || !activeProfile) {
        aler("sesi tidak valid, harap login ulang")
        return;
    }
    setIsSavingJournal(true);

    console.log("mengirim data jurnal ke backend", newEntryData);

        try {
        let photoUrl = null;
        if (newEntryData.dailyInputs.photoFile) {
            console.log("Mengunggah foto ke Cloudinary...");
            const formData = new FormData();
            formData.append('file', newEntryData.dailyInputs.photoFile);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

            const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
            
            const cloudinaryResponse = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
            const cloudinaryData = await cloudinaryResponse.json();
            
            if (!cloudinaryResponse.ok) {
                throw new Error(cloudinaryData.error.message || 'Gagal mengunggah foto.');
            }
            photoUrl = cloudinaryData.secure_url;
            console.log("Foto berhasil diunggah:", photoUrl);
        }

        // Siapkan data lengkap untuk dikirim ke backend
        const finalDailyInputs = {
            ...newEntryData.dailyInputs,
            photoFile: undefined,
            photoUrl: photoUrl
        };

        console.log("Mengirim data jurnal ke backend:", finalDailyInputs);

      const response = await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userId: userProfile.uid,
            profileId: activeProfile.profileId,
            week: newEntryData.week,
            dailyInputs: finalDailyInputs
         }),
      });
      const savedData = await response.json();
      if (!response.ok)
        { throw new Error(savedData.error || 'Gagal menyimpan jurnal.'); }
        setJournalEntries(prev => ({...prev, [selectedWeek]: savedData}));
        setSelectedEntry(savedData);
        setView('detail');

      } catch (error) {
        console.error("Error saat menyimpan jurnal");
        alert(error.message);
      } finally {
        setIsSavingJournal(false);
    }
    }
    
  useEffect(() => {
    if (journalEntries.length > 0 && !currentEntry) {
        const lastEntryKey = Object.keys(journalEntries).pop();
        setCurrentEntry(journalEntries[lastEntryKey]);
    }
  }, [journalEntries, currentEntry]);


 const renderContent = () => {
    switch(view) {
        case 'detail':
            return <JournalDetailView entry={selectedEntry} userProfile={userProfile} activeProfile={activeProfile}  onBack={() => setView('lobby')} />;
        case 'form':
            return <NewJournalForm week={selectedWeek} onSave={handleSaveJournal} onBack={() => setView('lobby')} />;
        case 'lobby':
        default:
            return <JournalLobby />;
    }
  };

  return (
    <AuthGuard>
      <AnimatePresence>
          {isSavingJournal && <JournalingAnimation />}
      </AnimatePresence>
      <div className="flex min-h-screen">
        <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
        <main className={`flex-1 pb-24 md:pb-0 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-10">
            
            {/* KOLOM KIRI */}
            <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* KOLOM KANAN*/}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Trimester {activeTrimester}</h2>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button onClick={() => setActiveTrimester(1)} className={`px-3 py-1 text-sm font-semibold rounded ${activeTrimester === 1 ? 'bg-white shadow' : ''}`}>1</button>
                      <button onClick={() => setActiveTrimester(2)} className={`px-3 py-1 text-sm font-semibold rounded ${activeTrimester === 2 ? 'bg-white shadow' : ''}`}>2</button>
                      <button onClick={() => setActiveTrimester(3)} className={`px-3 py-1 text-sm font-semibold rounded ${activeTrimester === 3 ? 'bg-white shadow' : ''}`}>3</button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto">
                  {trimesterWeeks[activeTrimester].map(week => {
                    if (week > 42) return null;
                    return (
                      <WeekBox 
                        key={week}
                        week={week}
                        isComplete={!!journalEntries[week]}
                        isCurrent={week === currentWeek}
                        onClick={() => handleWeekSelect(week)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </main>
        <div className="fixed bottom-24 right-4 z-50 md:hidden">
            <FloatingChatButton />
        </div>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}

