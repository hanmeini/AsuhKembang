'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getScansForWeek } from '../lib/firestore';
import MacroWidget from './MacroWidget';

const WeeklyNutritionSummary = ({ week }) => {
    const { userProfile, activeProfile } = useAuth();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!userProfile || !activeProfile || !week) return;
            setIsLoading(true);

            try {
                const weeklyScans = await getScansForWeek(userProfile.uid, activeProfile.profileId, week);
                
                if (weeklyScans.length === 0) {
                    setIsLoading(false);
                    setSummary({ totals: null, aiSummary: "Belum ada makanan yang dipindai minggu ini. Catat makananmu untuk melihat rangkuman di sini!" });
                    return;
                }

                const totals = weeklyScans.reduce((acc, scan) => {
                    acc.calories += scan.nutritionData.calories || 0;
                    acc.protein += scan.nutritionData.protein || 0;
                    return acc;
                }, { calories: 0, protein: 0 });

                const targets = { calories: 2500 * 7, protein: 75 * 7 };

                const response = await fetch('/api/weeks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ week, totals, targets, profileType: activeProfile.type }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);

                setSummary({ totals, targets, aiSummary: data.summary });

            } catch (error) {
                console.error("Gagal mengambil rangkuman mingguan:", error);
                setSummary({ totals: null, aiSummary: "Gagal membuat rangkuman AI saat ini. Coba lagi nanti." });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [userProfile, activeProfile, week]);

    if (isLoading) {
        return <div className="bg-white p-6 rounded-2xl shadow-lg"><p className="text-center text-gray-500">Menganalisis gizi mingguan...</p></div>;
    }

    if (!summary) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ringkasan Gizi Minggu ke-{week}</h2>
            {summary.totals ? (
                <div className="space-y-4">
                    <MacroWidget label="Total Kalori Mingguan" current={summary.totals.calories} target={summary.targets.calories} unit=" kkal" colorClass="bg-red-500" />
                    <MacroWidget label="Total Protein Mingguan" current={summary.totals.protein} target={summary.targets.protein} unit=" g" colorClass="bg-teal-500" />
                    <div className="bg-teal-50 p-4 rounded-lg mt-4 border-l-4 border-teal-500">
                        <h4 className="font-semibold text-sm text-teal-800">Saran dari Brocco:</h4>
                        <p className="text-sm italic text-teal-700 mt-1">"{summary.aiSummary}"</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-sm">{summary.aiSummary}</p>
            )}
        </div>
    );
};

export default WeeklyNutritionSummary;