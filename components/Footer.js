import React from 'react';
import Link from 'next/link';
// Impor ikon dari library (pastikan Anda sudah menginstalnya: npm install react-icons)
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        {/* Main grid for links and info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Kolom 1: Brand & Misi */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl items-center flex flex-row font-semibold text-white mb-4">
              <Image src='/images/logo-asuh-kembang.png' width={40} height={40} className='rounded-full' alt='logo'/>
              <span className="ml-2 inline">Asuh Kembang</span>
            </Link>
            <p className="text-sm text-gray-400">
              Menyediakan sumber daya terbaik bagi orang tua untuk menemukan tempat penitipan anak yang aman dan terpercaya, serta panduan nutrisi.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" className="hover:text-white"><FaFacebook size={20} /></a>
              <a href="https://instagram.com" className="hover:text-white"><FaInstagram size={20} /></a>
              <a href="https://x.com" className="hover:text-white"><FaTwitter size={20} /></a>
              <a href="https://www.youtube.com" className="hover:text-white"><FaYoutube size={20} /></a>
            </div>
          </div>

          {/* Kolom 2: Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#about" className="hover:text-white">About</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white">Press</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
            </ul>
          </div>
          
          {/* Kolom 4: Newsletter Signup */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Connected</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-emerald-600 text-white px-4 py-2 rounded-r-md hover:bg-emerald-500"
                >
                  Go
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom bar for copyright and legal links */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2025 Healthier. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;