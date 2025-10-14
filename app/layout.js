import './globals.css';
import { LayoutManager } from "./layoutManager";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from "./providers";
import NextTopLoader from 'nextjs-toploader';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap'
});

export const metadata = {
  title: "Asuh Kembang - Panduan Nutrisi untuk Ibu Hamil dan Menyusui",
  description: "Aplikasi web untuk membantu ibu hamil dan menyusui memantau asupan nutrisi harian mereka.",
  icons: [
    { rel: 'icon', url: '/images/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/images/favicon.ico' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={jakarta.variable} style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
      </head>
      <body>
        <Providers>
          <NextTopLoader 
            color="#00897B"
            height={4}
            showSpinner={false}
          />
          <LayoutManager>{children}</LayoutManager>
        </Providers>
      </body>
    </html>
  );
}