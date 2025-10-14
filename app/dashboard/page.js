'use client';
import React from 'react';
import { 
  FaRegBell, FaHeartbeat, FaUsers,FaUserCircle
} from 'react-icons/fa';
import { IoWater, IoJournal, IoScan } from "react-icons/io5";
import Sidebar from '../../components/Sidebar';
import AuthGuard from '../../context/AuthGuard';
import { useState, useEffect } from 'react';
import HealthProfileModal from '../../components/HealthProfileModal';
import { useAuth } from '../../context/AuthContext';
import { updateUserHealthProfile } from '../../lib/firestore'; 
import { subscribeToTodaysScans } from '../../lib/firestore';
import MacroWidget from '../../components/MacroWidget';
import { subscribeToTodaysWater, updateTodaysWater } from '../../lib/firestore';
import Link from 'next/link';
import BottomNavBar from '../../components/BottomNav';
import Image from 'next/image';
import ProfileSelector from '../../components/profileSelector';
import PregnancyInfo from '../../components/tespregnant';
import FloatingChatButton from '../../components/FloatingChatButton';
import NutritionChart from '../../components/NutritionChart';
import WelcomeModal from '../../components/WelcomeModal';
import { motion } from 'framer-motion';
import HistoryItem from '../../components/Historyscan';
import DailyMissionWidget from '../../components/DailyMissonWidget';


const DashboardPage = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const { userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const name = userProfile?.name;
  const [todaysScans, setTodaysScans] = useState([]);
  const [totals, setTotals] = useState({ 
    calories: 0, protein: 0, fat: 0, carbs: 0,
    folic_acid: 0, iron: 0, sugar: 0, sodium: 0 
  });
  const [healthTip, setHealthTip] = useState("Memuat tips kesehatan...");
  const [pregnancyUpdate, setPregnancyUpdate] = useState("Memuat informasi...");
  const [waterIntake, setWaterIntake] = useState(0);
  const [activeProfile, setActiveProfile] = useState(null);
  const [bmiResult, setBmiResult] = useState(null);
  const [tdeeResult, setTdeeResult] = useState(null);
  const [macroTargets, setMacroTargets] = useState({ protein: 150, carbs: 250, fat: 70 });
  const [currentWeek, setCurrentWeek] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const MotionLink = motion(Link);

  // Efek untuk memeriksa apakah pengguna baru (belum punya sub-profil)
  useEffect(() => {
    if (userProfile && (!userProfile.profiles || userProfile.profiles.length === 0)) {
        setShowWelcomeModal(true);
    } else {
        setShowWelcomeModal(false);
    }
  }, [userProfile]);


  // fetch aktif profile
  // Efek 1: Mengatur profil aktif saat userProfile berubah
  useEffect(() => {
    if (userProfile?.profiles?.length > 0) {
      const currentActiveProfile = userProfile.profiles.find(p => p.profileId === userProfile.activeProfileId) || userProfile.profiles[0];
      setActiveProfile(currentActiveProfile);
    } else if (userProfile) {
      setActiveProfile({ type: 'general', name: userProfile.displayName || 'Utama', profileId: userProfile.uid });
    }
  }, [userProfile]);

useEffect(() => {
  if (userProfile?.uid && activeProfile) {
    // --- Bagian Kalkulasi Profil ---
    let profileDataForCalc = userProfile.healthProfile;
      if (activeProfile.type === 'child' && activeProfile.healthData) {
        profileDataForCalc = {
          ...activeProfile.healthData,
          birthDate: activeProfile.birthDate,
          activityLevel: 'Aktif'
        };
      } else {
        profileDataForCalc = userProfile.healthProfile;
      }

    // Hitung minggu kehamilan
    let calculatedWeek = null;
    if (activeProfile.type === "pregnant" && activeProfile.dueDate) {
      const dueDate =
        typeof activeProfile.dueDate.toDate === "function"
          ? activeProfile.dueDate.toDate()
          : new Date(activeProfile.dueDate);

      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekNumber = 40 - Math.floor(daysRemaining / 7);

      if (weekNumber > 0 && weekNumber <= 42) {
        calculatedWeek = weekNumber;
      }
    }
    setCurrentWeek(calculatedWeek);

    // Kalkulasi BMI, BMR, TDEE
    if (
      profileDataForCalc?.height &&
      profileDataForCalc?.weight &&
      profileDataForCalc?.birthDate
    ) {
      const { height, weight, birthDate, gender, activityLevel } =
        profileDataForCalc;
      const heightInMeters = Number(height) / 100;
      const numWeight = Number(weight);

      const bmi = (numWeight / (heightInMeters * heightInMeters)).toFixed(2);
      const age =
        new Date().getFullYear() -
        new Date(birthDate).getFullYear();

        const bmr = (gender === 'Pria') ? (10 * numWeight) + (6.25 * Number(height)) - (5 * age) + 5 : (10 * numWeight) + (6.25 * Number(height)) - (5 * age) - 161;
        const activityMultipliers = { 'Jarang': 1.2, 'Ringan': 1.375, 'Aktif': 1.55, 'Sangat Aktif': 1.725 };
        let tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));

      setBmiResult(bmi);

      // --- Tambah kalori khusus ibu hamil ---
      if (activeProfile.type === "pregnant") {
        const currentTrimester = calculatedWeek
          ? calculatedWeek <= 14
            ? 1
            : calculatedWeek <= 28
            ? 2
            : 3
          : 1;

        if (currentTrimester === 2) tdee += 340;
        if (currentTrimester === 3) tdee += 450;

        setMacroTargets({
          carbs: Math.round((tdee * 0.45) / 4),
          protein: Math.round((tdee * 0.25) / 4),
          fat: Math.round((tdee * 0.3) / 9),
        });
      } else {
        setMacroTargets({
          carbs: Math.round((tdee * 0.4) / 4),
          protein: Math.round((tdee * 0.3) / 4),
          fat: Math.round((tdee * 0.3) / 9),
        });
      }
      setTdeeResult(tdee);
    }

    // --- Bagian API Kehamilan ---
    console.log("DEBUG pregnancy:", {
  activeProfile,
  calculatedWeek,
});

if (activeProfile?.type === "pregnant" && calculatedWeek) {
  console.log(">>> Memanggil API pregnancy-tip dengan week:", calculatedWeek);

  fetch("/api/pregnancy-tip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ week: calculatedWeek }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Respon pregnancy-tip:", data);
      if (data.perkembangan_janin && data.gejala_umum_ibu) {
        setPregnancyUpdate(
          `Perkembangan janin: ${data.perkembangan_janin}\n\nGejala umum ibu: ${data.gejala_umum_ibu}`
        );
      } else if (data.error) {
        setPregnancyUpdate("❌ " + data.error);
      } else {
        setPregnancyUpdate("Informasi tidak tersedia.");
      }
    })
    .catch((err) => {
      console.error("❌ Error pregnancy-tip:", err);
      setPregnancyUpdate("Gagal memuat informasi kehamilan.");
    });
} else {
  console.log(">>> Tidak fetch pregnancy-tip karena bukan profil hamil atau minggu null");
  setPregnancyUpdate(null);
}

    // --- Bagian API Health Tip ---
    fetch("/api/health-tip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userProfile.uid, activeProfile }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.tip) setHealthTip(data.tip);
        else setHealthTip("Gagal memuat tips.");
      })
      .catch((err) => {
        console.error("❌ Error health-tip:", err);
        setHealthTip("Gagal memuat tips.");
      });

    // --- Listener Realtime ---
    const unsubscribeScans = subscribeToTodaysScans(
      userProfile.uid,
      activeProfile.profileId,
      (scans) => {
        setTodaysScans(scans);
        const newTotals = scans.reduce((acc, scan) => {
          const nutrition = scan.nutritionData || {};
          acc.calories += nutrition.calories || 0;
          acc.protein += nutrition.protein || 0;
          acc.fat += nutrition.fat || 0;
          acc.carbs += nutrition.carbohydrates || 0;
          acc.folic_acid += nutrition.folic_acid || 0;
          acc.iron += nutrition.iron || 0;
          acc.sugar += nutrition.sugar || 0;
          acc.sodium += nutrition.sodium || 0;
          return acc;
        }, { calories: 0, protein: 0, fat: 0, carbs: 0, folic_acid: 0, iron: 0, sugar: 0, sodium: 0 });
        setTotals(newTotals);
      }
    );

    const unsubscribeWater = subscribeToTodaysWater(userProfile.uid, (water) => {
      setWaterIntake(water);
    });

    return () => {
      unsubscribeScans();
      unsubscribeWater();
    };
  }
}, [userProfile, activeProfile]);

  
  
  const handleSaveProfile = async (healthData) => {
    if (!userProfile) return;
    try {
      await updateUserHealthProfile(userProfile.uid, healthData);
      alert("Profil berhasil disimpan!");
      setIsModalOpen(false);
    } catch (error) {
      alert("Gagal menyimpan profil.");
    }
  };
  // Update Water Function
  const handleWaterChange = (change) => {
    const newAmount = Math.max(0, waterIntake + change); 
    updateTodaysWater(userProfile.uid, newAmount);
  };


  const targetsForWidget = {
    calories: tdeeResult || 2000,
    ...macroTargets
  };


  return (
    <AuthGuard>
      {showWelcomeModal && <WelcomeModal />}
      {isModalOpen && ( <HealthProfileModal userProfile={userProfile} onSave={handleSaveProfile} onClose={() => setIsModalOpen(false)} /> )}
    <div className="">
      {/* ===== SIDEBAR ===== */}
      <Sidebar 
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      />
      <main className={`pb-24 md:pb-0 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
          <header className="flex items-start flex-col w-full p-6 md:p-10">
              <div className='flex flex-row justify-between items-center w-full'>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Selamat Pagi, {userProfile?.name || 'Pengguna'}! 👋</h2>
                {userProfile?.photoURL ? (
                  <Image
                    src={userProfile.photoURL}
                    alt="Foto Profil"
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10 flex-shrink-0"
                  />
                ) : (
                  <FaUserCircle size={40} className="text-gray-500 flex-shrink-0" />
                )}
              </div>
              <div className="mt-2">
                <ProfileSelector profiles={userProfile?.profiles} activeProfile={activeProfile} onProfileChange={setActiveProfile} />
              </div>
          </header>

        {/* =======Laptop======== */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri (Lebar) */}
          <div className="lg:col-span-2 space-y-8 p-2">
            {/* Kartu Aksi Utama */}
            <div className="bg-teal-500 text-white p-4 md:p-8 md:rounded-2xl shadow-lg flex flex-col md:flex-row items-start gap-4 md:items-center justify-between">
              <div>
                <h3 className="text-md md:text-2xl font-bold">Punya makanan baru?</h3>
                <p className="text-sm md:text-base mt-2 opacity-90">Ayo cari tahu kandungan gizinya sekarang juga.</p>
              </div>
              <Link href='/scan' className="bg-white text-teal-600 text-sm md:text-base font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-transform hover:scale-105">
                Mulai Pindai
              </Link>
            </div>

            <Link href="/resep" className="block group">
              <div className="relative bg-white p-8 rounded-2xl shadow-lg flex items-center gap-6 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <Image src="/images/analisis-instan.jpg" width={100} height={100} alt="Ilustrasi Resep" className='rounded-md ' />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Dapur Komunitas</h2>
                  <p className="mt-1 text-gray-600">Temukan ribuan resep MPASI dan makanan sehat yang dibagikan oleh para bunda dan divalidasi oleh ahli gizi.</p>
                </div>
                <span className="absolute top-4 right-4 text-xs font-semibold bg-pink-100 text-pink-700 px-3 py-1 rounded-full">BARU!</span>
              </div>
            </Link>

            <NutritionChart totals={totals} targets={targetsForWidget} />

            <DailyMissionWidget/>

              {/* Aktivitas Terakhir */}
              <div className='p-2 md:p-0'>
                <h3 className="text-md md:text-xl font-bold text-gray-700 mb-4">Aktivitas Terakhir</h3>
                  {todaysScans.length > 0? (
                    todaysScans.map(scan => (
                      <div key={scan.id} className='space-y-3'>
                        <HistoryItem scan={scan} />
                      </div>
                    ))
                  ) : (
                  <div className="flex flex-row items-center py-6 px-6 shadow-sm rounded-2xl">
                    <p className="text-gray-500 text-sm">Belum ada makanan yang dipindai hari ini. <span className='font-bold text-orange-500'>Ayo mulai!</span></p>
                  </div>
                  )}
              </div>
              
            {/* Tip Kesehatan */}
            <div className="bg-white rounded-2xl shadow-sm flex flex-col md:flex-row">
            <div className="relative w-full h-64 flex-col flex md:mt-0 items-center gap-5 md:gap-14 justify-center group">
              <video
                className="object-contain w-64 h-64 rounded-2xl
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
              {/* Bubble Chat "Hi" */}
              <div
                className="absolute top-1/4 left-0 bg-white px-6 py-3 rounded-full shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out transform translate-x-1/4 group-hover:-rotate-3 -translate-y-1/2"
              >
                <span className="text-lg font-medium">Hi 👋</span>
                <div className="absolute right-full top-0 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
              </div>
              {/* Bubble Chat "Brocco" */}
              <div className="absolute bottom-1/10 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-12 py-2 rounded-full shadow-md">
                <span className="text-sm font-semibold text-gray-700">Brocco</span>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </div>
            {/* Tips */}
            <div className='flex justify-center items-start flex-col p-2'>
              <div className='rounded-lg h-auto bg-teal-50 border-l-4 border-teal-500 p-3'>
                <h3 className="font-bold text-teal-800 mb-2">💡 Tip Sehat Hari Ini dari <span className='text-orange-500'>Brocco</span></h3>
                <p className="text-teal-600 italic">{healthTip}</p>
              </div>
            </div>
            </div>
            </div>

          {/* Kolom Kanan (Widget) */}
          <div className="space-y-8">
            {/* Profile */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold text-gray-700">Profil Kesehatan Anda</h4>
                {userProfile?.healthProfile ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">IMT/BMI:</span>
                      <span className="font-bold">{bmiResult}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kebutuhan Kalori:</span>
                      <span className="font-bold">~{tdeeResult} kkal/hari</span>
                    </div>
                    <Link 
                      href='/profile'
                      className="w-full text-sm mt-4 text-teal-600 font-semibold py-2 rounded-lg hover:bg-teal-50"
                    >
                      Ubah Data
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mt-2">Lengkapi data Anda untuk mendapatkan analisis yang lebih akurat.</p>
                    <Link 
                      href='/profile'
                      className="w-full mt-4 bg-teal-500 text-white font-semibold py-2 rounded-lg hover:bg-teal-600"
                    >
                      Lengkapi Profil
                    </Link>
                  </div>
                )}
              </div>
            {/* Widget Kehamilan */}
            <PregnancyInfo week={currentWeek} />

            
            {/* Widget Nutrisi */}
            <MacroWidget totals={totals} targets={targetsForWidget} />
          

            {/* Widget Minum Air */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-blue-600">
                  <IoWater />
                  <span className="font-bold">Minum Air</span>
                </div>
                {/* Tombol Interaktif */}
                <div className="flex items-center space-x-2">
                  <button aria-label="minum" onClick={() => handleWaterChange(-1)} className="w-7 h-7 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300">-</button>
                  <button aria-label="minum" onClick={() => handleWaterChange(1)} className="w-7 h-7 bg-blue-500 text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-blue-600">+</button>
                </div>
              </div>
              <p className="text-right text-3xl font-bold text-blue-600 mt-4">{waterIntake} <span className="text-lg font-medium text-gray-500">/ 8 Gelas</span></p>
            </div>
            
          </div>
        </div>

          {/* ================== LAYOUT UNTUK MOBILE (di bawah lg:) ================== */}
          <div className="block md:hidden space-y-6 px-6 pb-10">
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Akses Cepat</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 px-2 snap-x">
                <MotionLink 
                  href='/scan' 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  aria-label="Buka Halaman Scan"
                  className="flex-shrink-0 snap-center w-[140px] flex flex-col items-center justify-center py-6 bg-teal-500 text-white rounded-2xl text-center font-semibold hover:bg-teal-600 transition-colors shadow-md">
                  <IoScan size={24}/>
                  <span className="text-xs mt-2 leading-tight">Pindai Makanan</span>
                </MotionLink>
                <MotionLink 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  aria-label="Buka Halaman Jurnal"
                  href='/jurnal' 
                  className="flex-shrink-0 snap-center w-[140px] flex flex-col items-center justify-center py-6 bg-pink-600 text-white rounded-2xl text-center font-semibold hover:bg-pink-700 transition-colors shadow-md">
                  <IoJournal size={24} />
                  <span className="text-xs mt-2 leading-tight">Jurnal Harian</span>
                </MotionLink>
                <MotionLink 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  aria-label="Buka Halaman Lacak"
                  href='/lacak' 
                  className="flex-shrink-0 snap-center w-[140px] flex flex-col items-center justify-center py-6 bg-orange-500 text-white rounded-2xl text-center font-semibold hover:bg-orange-600 transition-colors shadow-md">
                  <FaHeartbeat size={24} />
                  <span className="text-xs mt-2 leading-tight">Lacak Pertumbuhan</span>
                </MotionLink>
                <MotionLink 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  aria-label="Buka Halaman Komunitas"
                  href='/komunitas' 
                  className="flex-shrink-0 snap-center w-[140px] flex flex-col items-center justify-center py-6 bg-orange-400 text-white rounded-2xl text-center font-semibold hover:bg-orange-500 transition-colors shadow-md">
                  <FaUsers size={24} />
                  <span className="text-xs mt-2 leading-tight">Komunitas</span>
                </MotionLink>
              </div>
            </div>

            {/* Dapur Komunitas */}
            <Link href="/resep" className="block">
              <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <Image 
                  src="/images/analisis-instan.jpg" 
                  width={60} 
                  height={60} 
                  alt="Ilustrasi Resep" 
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">Dapur Komunitas</h3>
                    <span className="text-xs font-semibold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">BARU!</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Jelajahi resep MPASI & makanan sehat dari para bunda</p>
                </div>
              </div>
            </Link>

            <DailyMissionWidget/>

            {/* 2. Aktivitas Terakhir (Scroll Horizontal) */}
              <div className='p-2 md:p-0'>
                <h3 className="text-md md:text-xl font-bold text-gray-700 mb-4">Aktivitas Terakhir</h3>

                  <div className="space-y-3">
                    {todaysScans.length > 0? (
                      todaysScans.map(scan => (
                        <HistoryItem key={scan.id} scan={scan} />
                    ))): (
                    <div className="flex flex-row items-center py-6 px-6 shadow-sm rounded-2xl">
                      <p className="text-gray-500 text-sm">Belum ada makanan yang dipindai hari ini. <span className='font-bold text-orange-500'>Ayo mulai!</span></p>
                    </div>
                    )}
                  </div>
              </div>

            {/* 1. Ringkasan Gizi */}
            <MacroWidget totals={totals} targets={targetsForWidget} />

            {/* 3. Widget Interaktif */}
            <h3 className="text-md font-bold text-gray-700 mb-4">Catatan minum air</h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-blue-600"><IoWater /><span className="font-bold">Minum Air</span></div>
                <div className="flex items-center space-x-2">
                  <button aria-label="minum" onClick={() => handleWaterChange(-1)} className="w-7 h-7 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300">-</button>
                  <button aria-label="minum" onClick={() => handleWaterChange(1)} className="w-7 h-7 bg-blue-500 text-white rounded-full font-bold text-lg flex items-center justify-center hover:bg-blue-600">+</button>
                </div>
              </div>
              <p className="text-right text-3xl font-bold text-blue-600 mt-4">{waterIntake} <span className="text-lg font-medium text-gray-500">/ 8 Gelas</span></p>
            </div>
          
          <div className="bg-white rounded-2xl md:shadow-sm flex flex-col md:flex-row">
            <div className="relative w-full h-64 flex-col flex md:mt-0 items-center gap-5 md:gap-14 justify-center group">
              <video
                className="object-contain w-64 h-64 rounded-2xl
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
              {/* Bubble Chat "Hi" */}
              <div
                className="absolute top-1/4 left-0 bg-white px-6 py-3 rounded-full shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out transform translate-x-1/4 group-hover:-rotate-3 -translate-y-1/2"
              >
                <span className="text-lg font-medium">Hi 👋</span>
                <div className="absolute right-full top-0 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
              </div>
              {/* Bubble Chat "Brocco" */}
              <div className="absolute bottom-1/10 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-12 py-2 rounded-full shadow-md">
                <span className="text-sm font-semibold text-gray-700">Brocco</span>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </div>
            {/* Tips */}
            <div className='justify-center items-center rounded-lg bg-teal-50 border-l-4 border-teal-500 p-3'>
                <h3 className="font-bold text-teal-800 mb-2">💡 Tip Sehat Hari Ini dari <span className='text-orange-500'>Brocco</span></h3>
                <p className="text-teal-600 italic">{healthTip}</p>
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
};

export default DashboardPage;