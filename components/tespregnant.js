'use client';

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { subscribeToLatestJournal } from '../lib/firestore';

const PregnancyJournalWidget = () => {
  const { userProfile } = useAuth();
  const [activeProfile, setActiveProfile] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  
  // State ini sekarang akan diisi dari data jurnal yang sudah ada
  const [pregnancyUpdate, setPregnancyUpdate] = useState("Memuat informasi...");
  
  const [latestJournal, setLatestJournal] = useState(null);

  // Mengatur profil aktif
  useEffect(() => {
    if (userProfile?.profiles?.length > 0) {
      const currentActiveProfile = userProfile.profiles.find(p => p.profileId === userProfile.activeProfileId) || userProfile.profiles[0];
      setActiveProfile(currentActiveProfile);
    }
  }, [userProfile]);

  // Efek untuk menghitung minggu kehamilan saat ini (tanpa memanggil API)
  useEffect(() => {
    if (activeProfile?.type === 'pregnant' && activeProfile.dueDate) {
      const dueDate = typeof activeProfile.dueDate.toDate === 'function' 
        ? activeProfile.dueDate.toDate() 
        : new Date(activeProfile.dueDate);
      
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekNumber = 40 - Math.floor(daysRemaining / 7);
      
      if (weekNumber > 0 && weekNumber <= 42) {
        setCurrentWeek(weekNumber);
      }
    } else {
      setCurrentWeek(null);
    }
  }, [activeProfile]);

  // Efek untuk mendengarkan jurnal terakhir DAN memperbarui teks info
  useEffect(() => {
    if (userProfile?.uid && activeProfile?.profileId) {
        const unsubscribe = subscribeToLatestJournal(userProfile.uid, activeProfile.profileId, (entry) => {
            setLatestJournal(entry);
            // PERBAIKAN: Ambil info dari data jurnal, bukan dari API baru
            if (entry) {
                setPregnancyUpdate(entry.result.perkembangan_janin);
            } else {
                setPregnancyUpdate("Buat jurnal pertamamu untuk melihat info di sini!");
            }
        });
        return () => unsubscribe();
    }
  }, [userProfile, activeProfile]);

  // Jangan tampilkan widget sama sekali jika bukan profil kehamilan
  if (activeProfile?.type !== 'pregnant') {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-3 text-pink-600">
        <FaCalendarAlt />
        <span className="font-bold">Jurnal Kehamilan</span>
      </div>
      {currentWeek ? (
        <>
          <p className="text-3xl font-bold mt-4">Minggu ke-{currentWeek}</p>
          <p className="text-gray-500 mt-2">{pregnancyUpdate}</p>
        </>
      ) : (
        <p className="text-gray-500 mt-2">Data HPL belum lengkap. Harap perbarui di halaman profil Anda.</p>
      )}
      
      {latestJournal && (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase">CATATAN TERAKHIR (Minggu ke-{latestJournal.week})</p>
            <p className="text-sm italic text-gray-600 mt-2">"{latestJournal.dailyInputs.note}"</p>
        </div>
      )}
    </div>
  );
};

export default PregnancyJournalWidget;

