"use client";

import React from "react";
import { useState } from "react";
import AuthGuard from "../../context/AuthGuard";
import Sidebar from "../../components/Sidebar";
import BottomNavBar from "../../components/BottomNav";
import {
  FaCheckCircle,
  FaStar,
  FaRobot,
  FaUtensils,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const FeatureItem = ({ text }) => (
  <li className="flex items-center gap-3">
    <FaCheckCircle className="text-teal-500" />
    <span>{text}</span>
  </li>
);

const PremiumFeature = ({ icon, text }) => (
  <div className="flex items-center gap-4 p-3 bg-teal-50 rounded-xl">
    <div className="text-teal-600 text-xl">{icon}</div>
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

export default function UpgradePage() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth(); // Gunakan context auth jika tersedia

  const handleSubscribeClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mayar/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 25000,
          productName: "AsuhKembang Plus",
          customerEmail: userProfile?.email || "",
          customerName: userProfile?.displayName || "Bunda AsuhKembang",
          userId: userProfile?.uid || null,
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || "Gagal mendapatkan link pembayaran");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      const errorMsg =
        error.message ||
        "Maaf Bunda, sistem pembayaran sedang sibuk. Silakan coba lagi nanti.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar
          isExpanded={isSidebarExpanded}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        />
        <main
          className={`flex-1 pb-24 md:pb-0 transition-all duration-300 ease-in-out ${isSidebarExpanded ? "md:pl-[17.5rem]" : "md:pl-[6.5rem]"}`}
        >
          <div className="p-6 md:p-10 max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/images/logo-asuh-kembang.png"
                width={40}
                height={40}
                className="mx-auto"
                alt="logo"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
                Tingkatkan ke AsuhKembang Plus
              </h1>
              <p className="mt-2 text-gray-600">
                Dapatkan akses tak terbatas ke semua fitur cerdas kami dan
                percepat perjalanan Anda menuju gizi optimal.
              </p>
            </motion.div>

            <motion.div
              className="mt-8" // Added mt-8 here to match original spacing
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                <div className="bg-teal-600 p-8 text-white text-center">
                  <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    {userProfile?.isPremium
                      ? "Status Member Bunda:"
                      : "AsuhKembang Plus"}
                  </h2>
                  {userProfile?.isPremium && (
                    <div className="mt-2 flex items-center justify-center gap-2 bg-amber-400 text-teal-900 font-black px-4 py-1 rounded-full text-sm">
                      <FaStar /> MEMBER PLUS AKTIF
                    </div>
                  )}
                  <p className="opacity-90 mt-2">
                    Dukungan kecerdasan buatan terlengkap untuk si Kecil
                  </p>
                </div>

                <div className="p-8">
                  {userProfile?.isPremium ? (
                    <div className="text-center py-4">
                      <div className="text-teal-500 text-6xl mb-4 flex justify-center">
                        <FaCheckCircle />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Terima kasih atas dukungannya!
                      </h3>
                      <p className="text-gray-600 mb-8 lowercase italic">
                        Bunda sudah terdaftar sebagai member premium.
                      </p>
                      <Link
                        href="/dashboard"
                        className="block w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all text-center"
                      >
                        Ke Dashboard Utama
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-8">
                        <PremiumFeature
                          icon={<FaRobot />}
                          text="Chat Brocco AI Tanpa Batas"
                        />
                        <PremiumFeature
                          icon={<FaUtensils />}
                          text="Scan Nutrisi Makanan Lebih Akurat"
                        />
                        <PremiumFeature
                          icon={<FaChartLine />}
                          text="Lacak Grafik Pertumbuhan Premium"
                        />
                        <PremiumFeature
                          icon={<FaStar />}
                          text="Resep MPASI Eksklusif"
                        />
                      </div>

                      <div className="text-center mb-8">
                        <div className="text-sm text-gray-500 line-through">
                          Rp 50.000 / bulan
                        </div>
                        <div className="text-4xl font-black text-gray-800">
                          Rp 25.000
                        </div>
                        <div className="text-teal-600 font-bold">
                          Harga Promo Lomba VibeCoding!
                        </div>
                      </div>

                      <button
                        onClick={handleSubscribeClick}
                        disabled={isLoading} // Changed from 'loading' to 'isLoading'
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-teal-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
                        ) : (
                          <>
                            Berlangganan Sekarang <FaArrowRight />
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-gray-400 text-center mt-4 italic leading-tight">
                        *Pembayaran via Sandbox Mayar.id. Setelah bayar, silakan
                        klik tombol putih bertuliskan{" "}
                        <strong>"go Asuh kembang"</strong> di bagian bawah struk
                        sukses untuk kembali ke sini.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}
