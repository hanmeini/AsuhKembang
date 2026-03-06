"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCheckCircle, FaStar, FaArrowRight } from "react-icons/fa";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  useEffect(() => {
    // Efek kembang api perayaan
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaCheckCircle className="text-teal-500 text-7xl" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <FaStar className="text-amber-400 text-2xl" />
            </motion.div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Selamat Bunda!
        </h1>
        <p className="text-teal-600 font-semibold mb-6 flex items-center justify-center gap-2">
          <FaStar /> Sekarang Bunda adalah Member Plus
        </p>

        <div className="bg-teal-50 rounded-2xl p-6 mb-8 text-left">
          <p className="text-sm text-gray-700 leading-relaxed">
            Terima kasih telah mempercayakan perjalanan kehamilan dan tumbuh
            kembang si Kecil kepada <strong>AsuhKembang Plus</strong>. Sekarang
            Bunda bisa menikmati akses tak terbatas ke Brocco AI dan fitur
            premium lainnya!
          </p>
        </div>

        {/* Info khusus untuk integrasi Sandbox/Localhost */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-left">
          <p className="text-[10px] text-amber-800 italic leading-tight">
            <strong>Catatan Testing:</strong> Karena Bunda sedang menggunakan
            akses lokal (localhost), pembaruan lencana PLUS otomatis (via
            Webhook) mungkin tidak masuk ke komputer Bunda. Untuk keperluan
            lomba, Bunda bisa memperbarui status user di Firestore secara manual
            menjadi <code>isPremium: true</code>.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/scan"
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-200 flex items-center justify-center gap-2"
          >
            Mulai Scan Makanan <FaArrowRight />
          </Link>
          <Link
            href="/"
            className="block w-full text-teal-600 font-medium py-2 hover:underline"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
