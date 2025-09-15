import { useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!userProfile) {
      router.push('/login');
    }
  }, [userProfile, loading, router]); 
  if (loading || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-sm p-8 space-y-4 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 text-center">
          
          {/* Animated Spinner */}
          <svg className="mx-auto w-12 h-12 text-teal-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>

          <h2 className="text-2xl font-bold text-gray-800">Akses Terbatas</h2>
          <p className="text-gray-600">
            Anda harus login terlebih dahulu untuk mengakses halaman ini. Kami akan mengalihkan Anda ke halaman login...
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}