'use client';

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const MissionItem = ({ label, isComplete }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
        <p className={`font-semibold ${isComplete ? 'text-green-700' : 'text-gray-700'}`}>{label}</p>
        {isComplete ? <FaCheckCircle className="text-green-500"/> : <FaHourglassHalf className="text-gray-400"/>}
    </div>
);

const DailyMissionWidget = () => {
    const { userProfile } = useAuth();
    const [missions, setMissions] = useState({ proteinAchieved: false, ironAchieved: false });

    useEffect(() => {
        if (!userProfile) return;
        const today = new Date().toISOString().split('T')[0];
        const missionRef = doc(db, "users", userProfile.uid, "dailyMissions", today);

        const unsubscribe = onSnapshot(missionRef, (doc) => {
            if (doc.exists()) {
                setMissions(doc.data());
            } else {
                setMissions({ proteinAchieved: false, ironAchieved: false });
            }
        });
        return () => unsubscribe();
    }, [userProfile]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Misi Gizi Hari Ini</h3>
            <div className="space-y-2">
                <MissionItem label="Penuhi Target Protein" isComplete={missions.proteinAchieved} />
                <MissionItem label="Cukupi Kebutuhan Zat Besi" isComplete={missions.ironAchieved} />
            </div>
        </div>
    );
};

export default DailyMissionWidget;
