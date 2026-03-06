"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Home,
  Send,
  Mail,
  ChevronDown,
} from "lucide-react";
import { FaStar } from "react-icons/fa";

// Komponen internal untuk link navigasi (tidak ada perubahan)
const NavLink = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative font-semibold text-gray-700 transition-colors duration-300 ${isActive ? "text-teal-600" : "hover:text-teal-600"}`}
    >
      {children}
      <span
        className={`absolute bottom-[-4px] left-0 h-0.5 bg-teal-500 transition-all duration-300 ease-in-out ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      />
    </Link>
  );
};

// Komponen utama Navbar
export default function Navbar() {
  const { userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLayananOpen, setIsLayananOpen] = useState(false); // State untuk dropdown di mobile
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <header className="fixed left-1/2 -translate-x-1/2 container z-50 max-w-6xl">
      <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg">
        <nav className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl items-center flex flex-row font-semibold text-gray-800"
          >
            <Image
              src="/images/logo-asuh-kembang.png"
              width={40}
              height={40}
              alt="logo"
            />
            <span className="ml-2 inline">Asuh Kembang</span>
          </Link>

          {/* Navigasi Desktop (tetap sama) */}
          <ul className="hidden md:flex items-center space-x-8 -ml-10">
            {userProfile ? (
              <li>
                <NavLink href="/dashboard">Dashboard</NavLink>
              </li>
            ) : (
              <li>
                <NavLink href="/">Beranda</NavLink>
              </li>
            )}
            <li>
              <NavLink href="/scan">Scan Makanan</NavLink>
            </li>
            <li>
              <NavLink href="/jurnal">Jurnal</NavLink>
            </li>
            <li>
              <NavLink href="/komunitas">Komunitas</NavLink>
            </li>
          </ul>

          {/* Aksi Pengguna (Desktop - tetap sama) */}
          <div className="hidden md:flex items-center space-x-4">
            {userProfile ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  {userProfile.photoURL ? (
                    <Image
                      src={userProfile.photoURL}
                      alt="Profil"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={24} />
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} /> Profil
                      </Link>
                      <hr />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-semibold text-gray-700 hover:text-teal-600"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-full text-white px-5 py-2.5 bg-teal-600 hover:bg-teal-700 transition-transform font-semibold duration-300 hover:scale-105"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Tombol Menu Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="focus:outline-none p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* ================== MENU MOBILE BARU (SLIDE-IN) ================== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 right-0 h-full w-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <div className="flex items-center text-xl font-semibold text-gray-800">
                  <Image
                    src="/images/logo-asuh-kembang.png"
                    width={40}
                    height={40}
                    alt="logo"
                  />
                  <span className="ml-2 inline">Asuh Kembang</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 transition hover:rotate-90 duration-300"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col p-4 space-y-1 bg-white">
                {userProfile ? (
                  <div className="p-3 mb-2 rounded-lg bg-gray-100">
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3"
                    >
                      {userProfile.photoURL ? (
                        <Image
                          src={userProfile.photoURL}
                          alt="Profil"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User />
                        </div>
                      )}
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-gray-800">
                            {userProfile.displayName || "Pengguna"}
                          </p>
                          {userProfile?.isPremium && (
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5 shadow-sm">
                              <FaStar size={6} /> PLUS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {userProfile.email}
                        </p>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-3 mb-2 text-gray-700 font-medium rounded-lg bg-teal-50 hover:bg-teal-100"
                  >
                    <span className="flex items-center gap-3">
                      <User />
                      Daftar atau Masuk
                    </span>
                  </Link>
                )}

                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                >
                  <Home size={20} /> Beranda
                </Link>

                <button
                  onClick={() => setIsLayananOpen(!isLayananOpen)}
                  className="flex items-center justify-between w-full p-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                >
                  <span className="flex items-center gap-3">
                    <Send size={20} /> Layanan
                  </span>
                  <ChevronDown
                    className={`transition-transform ${isLayananOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isLayananOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-8 space-y-1"
                    >
                      <Link
                        href="/scan"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-2 font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        Scan Makanan
                      </Link>
                      <Link
                        href="/jurnal"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-2 font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        Jurnal
                      </Link>
                      <Link
                        href="/komunitas"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-2 font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        Komunitas
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  href="/kontak"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                >
                  <Mail size={20} /> Kontak Kami
                </Link>

                {userProfile && (
                  <>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 text-red-600 font-medium rounded-lg hover:bg-red-50 w-full"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
