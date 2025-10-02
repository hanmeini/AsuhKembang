import type { Metadata } from "next";
import './globals.css';
import { LayoutManager } from "./layoutManager"; 
import { Manrope } from 'next/font/google';
import { AuthProvider } from "../context/AuthContext";
import { Providers } from "./providers";
import { Head } from 'next/document'


const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Asuh Kembang - Panduan Nutrisi untuk Ibu Hamil dan Menyusui",
  description: "Aplikasi web untuk membantu ibu hamil dan menyusui memantau asupan nutrisi harian mereka.",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={manrope.variable} style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="icon" type="image/png" href="/images/favicon.ico" />
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
      </head>
      <body>
        <Providers>
          <LayoutManager>{children}</LayoutManager>
        </Providers>
      </body>
    </html>
  );
}