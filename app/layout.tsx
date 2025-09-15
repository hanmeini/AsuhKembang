import type { Metadata } from "next";
import './globals.css'
import { LayoutManager } from "./layoutManager"; 
import { Manrope } from 'next/font/google';
import { AuthProvider } from "../context/AuthContext";
import { Providers } from "./providers";


const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Healthier - Panduan Nutrisi untuk Ibu Hamil dan Menyusui",
  description: "Jelajahi wisata sesuai mood",
  icons: {
    icon: "/images/logo-pp.png?v=2", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={manrope.variable}>
      <body>
        <Providers>
          <LayoutManager>{children}</LayoutManager>
        </Providers>
      </body>
    </html>
  );
}