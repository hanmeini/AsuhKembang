'use client';

import React, {useState, useEffect} from 'react';
import { FaCheckCircle, FaHourglassHalf, FaBullseye } from 'react-icons/fa';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Sesuaikan path jika perlu
import { useAuth } from '../context/AuthContext';

// Komponen kecil untuk setiap item misi
const MissionItem = ({ label, isComplete }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${isComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
        <p className={`font-semibold text-sm ${isComplete ? 'text-green-800' : 'text-gray-700'}`}>{label}</p>
        {isComplete ? 
            <FaCheckCircle className="text-green-500"/> : 
            <FaHourglassHalf className="text-gray-400 animate-pulse"/>
        }
    </div>
);

const DailyMissionWidget = () => {
    const { userProfile } = useAuth();
    const [missions, setMissions] = useState({ proteinAchieved: false, ironAchieved: false });

    useEffect(() => {
        if (!userProfile) return;
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const missionRef = doc(db, "users", userProfile.uid, "dailyMissions", today);

        // Memasang listener real-time ke status misi hari ini
        const unsubscribe = onSnapshot(missionRef, (doc) => {
            if (doc.exists()) {
                setMissions(doc.data());
            } else {
                // Jika dokumen belum ada, reset state
                setMissions({ proteinAchieved: false, ironAchieved: false });
            }
        });
        return () => unsubscribe(); // Cleanup listener
    }, [userProfile]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FaBullseye className="text-teal-500"/> Misi Gizi Hari Ini</h3>
            <div className="space-y-2">
                <MissionItem label="Penuhi Target Protein" isComplete={missions.proteinAchieved} />
                <MissionItem label="Cukupi Kebutuhan Zat Besi" isComplete={missions.ironAchieved} />
                {/* Anda bisa menambahkan misi lain di sini, misal: Gula Terkendali */}
            </div>
        </div>
    );
};

export default DailyMissionWidget;