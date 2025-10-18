"use client"; 

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatModal from '../components/ChatModal'; 


const NavFooterManager = ({ children }) => {
  const pathname = usePathname();
  const noNavFooterPaths = ['/login', '/register', '/upgrade', '/dashboard', '/scan', '/tracker', '/profil', '/jurnal', '/komunitas', '/chat', '/lacak', '/resep', 'resep/[id]'];
  const shouldHideNavFooter = noNavFooterPaths.some(path => pathname.startsWith(path));
  const noBottomMarginPaths = ['/chat'];
  const shouldRemoveBottomMargin = noBottomMarginPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {!shouldHideNavFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!shouldHideNavFooter && <Footer />}
    </>
  );
};

export function LayoutManager({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavFooterManager>
        {children}
      </NavFooterManager>
      <ChatModal />
    </div>
  );
}

