'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '../../context/AuthGuard';
import Sidebar from '../../components/Sidebar';
import BottomNavBar from '../../components/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import AddRecipeModal from '../../components/ModalAddResep'; 

const RecipeCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="relative w-full h-40 bg-gray-200"></div>
    <div className="p-4">
      <h3 className="font-bold text-gray-800 truncate bg-gray-200 h-6 w-3/4 mb-2"></h3>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
        <p className="text-xs text-gray-500 bg-gray-200 h-4 w-1/2"></p>
      </div>
    </div>
  </div>
);

const RecipeCard = ({ recipe }) => (
    <Link href={`/resep/${recipe.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden group">
        <div className="relative w-full h-40">
            <Image 
                src={recipe.imageUrl || '/images/placeholder-resep.jpg'} // Gambar cadangan
                alt={recipe.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
        </div>
        <div className="p-4">
            <h3 className="font-bold text-gray-800 truncate">{recipe.title}</h3>
            {/* Menampilkan informasi penulis resep */}
            <div className="flex items-center gap-2 mt-2">
                <Image 
                    src={recipe.author.avatar || '/images/avatar-default.png'} 
                    alt={recipe.author.name} 
                    width={24} 
                    height={24} 
                    className="w-6 h-6 rounded-full object-cover"
                />
                <p className="text-xs text-gray-500">oleh {recipe.author.name}</p>
            </div>
        </div>
    </Link>
);

export default function RecipePage() {
  const { userProfile } = useAuth();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  
  // State untuk data dan UI
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal

  // Mengambil data saat halaman dimuat
  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchRecipes(); 
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredRecipes = allRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setRecipes(filteredRecipes);
  };

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resep');
      const data = await response.json();
      setAllRecipes(data);
      setRecipes(data); 
    } catch (error) {
      console.error("Gagal memuat resep:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthGuard>
      {isModalOpen && <AddRecipeModal onClose={handleCloseModal} />}
      
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar isExpanded={isSidebarExpanded} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)} />
        <main className={`flex-1 pb-24 md:pb-0 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}`}>
          <div className="">
            <header 
                className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center text-center text-white p-4"
                style={{ backgroundImage: `url('/images/anaksehat.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <svg className='absolute animate-rotate-swing left-0 md:left-1/6 top-1/8 md:top-1/4' width="67" height="68" viewBox="0 0 67 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M46.0212 22.8817L44.3651 21.076L44.6203 19.8138C45.5501 15.124 38.1075 12.1252 35.2783 16.0479C34.9728 16.4633 34.4938 16.7214 33.7042 16.889C32.2519 17.1865 27.6863 18.544 26.7786 18.8661C23.753 19.9075 25.2123 20.9136 26.501 20.4297C29.4197 19.3679 29.2848 19.2401 28.9237 20.3846C28.3716 22.179 31.7159 26.5008 34.5743 27.6953C37.1614 28.7802 41.6842 27.8309 42.3626 26.0474C43.7 22.49 48.3214 33.6918 47.383 38.2648C44.4749 52.5373 22.7792 50.7359 19.301 35.9261L18.8896 34.1905L20.8036 34.4422C24.1457 34.8923 24.7713 33.546 21.7865 32.3406C16.9119 30.3876 15.8114 25.4061 20.5179 26.6182C22.0997 27.0321 23.5347 26.5009 23.7294 25.4619C24.2845 22.3348 25.682 22.6691 26.8648 25.1415C27.5137 26.4707 27.3272 27.6751 25.9308 31.3099C24.7039 34.4987 24.9497 35.2501 26.9044 34.2959C28.214 33.6565 30.0032 26.5624 29.4108 24.4069C28.5835 21.3736 23.7237 20.9384 22.3447 23.7658C22.0369 24.4244 21.7623 24.6552 21.4714 24.5552C21.1806 24.4552 21.0479 24.0842 21.5016 23.427C21.9553 22.7699 22.7795 22.0286 22.2782 21.5472C21.6033 20.9085 19.9299 22.9841 19.7225 23.3032C19.5057 23.6027 18.7841 24.8021 17.885 25.241C14.7966 26.7487 14.0819 28.2595 15.4334 30.3833C16.1809 31.5675 16.2745 31.9575 16.1815 33.552C15.441 45.9675 28.8708 54.6362 40.4982 49.2504C52.3402 43.8082 54.7155 32.3615 46.0212 22.8817ZM41.0804 22.7764C40.1144 26.1526 39.8494 26.403 37.6136 26.2358C35.825 26.0924 33.6512 24.5152 32.3192 22.3819C30.9301 20.1313 31.8366 18.9142 34.5956 19.31L35.9556 19.5175L36.6475 18.3567C38.6153 14.9998 43.3338 14.9474 41.0804 22.7764Z" fill="#FAFAFA"/>
                <path d="M23.8914 39.0826C24.2286 39.4263 25.1897 40.6514 26.0445 41.8074C32.4122 50.4382 47.5336 42.8384 43.6779 32.9571C43.2031 31.7366 42.9123 30.5956 43.021 30.4216C43.9598 28.874 39.7321 29.4856 37.4001 31.2534C36.675 31.801 33.6253 33.3383 29.9224 35.0249C23.0638 38.1311 23.0247 38.1502 23.8914 39.0826ZM40.7818 31.6357L41.4879 33.0822C44.1121 38.4575 35.9555 46.0943 30.6129 43.2322C28.7835 42.2615 28.3546 41.3332 26.8146 38.5753C35.6629 33.8927 35.897 33.8268 40.7818 31.6357Z" fill="#FAFAFA"/>
                </svg>
                <svg className='absolute animate-float-y left-0 md:left-1/10 lg:left-1/6 bottom-1/6 md:bottom-1/4 w-10 h-10 md:w-20 md:h-20' viewBox="0 0 84 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M49.132 12.82C46.2428 13.9837 50.7494 17.2342 57.5287 18.8795L61.0336 19.7222C50.1719 24.2969 39.9261 28.3899 32.4922 37.8201C30.5279 40.3081 29.95 40.7896 28.3708 41.231C17.5474 44.2408 4.9909 56.3195 0.946578 67.5555C-0.555598 71.6889 -0.286016 73.5346 1.87096 74.1366C4.182 74.7787 4.64423 74.4176 6.7242 70.1237C11.6159 59.9308 23.1711 46.8891 27.2924 46.8891C27.3695 46.8891 27.1769 47.5716 26.9073 48.4142C22.9014 60.2118 33.9175 68.4786 45.8577 62.6196C56.0263 57.6036 52.3286 42.2744 40.5809 40.6291C35.4581 39.9068 48.0917 30.3563 61.6115 24.7383C64.6157 23.4943 67.2349 22.4911 67.4276 22.4911C67.6586 22.4911 65.8867 24.5375 63.4985 26.9854C56.1418 34.6499 54.3703 38.0208 56.9507 39.2648C59.1847 40.3081 61.6497 39.1043 64.3847 35.5329C69.4302 28.9518 74.1682 24.5375 80.5237 20.3641C88.0727 15.4283 81.6018 14.1042 77.3266 15.6692C71.2408 17.9565 58.0679 16.8731 53.6768 13.6628C52.4828 12.7398 50.2874 12.3385 49.132 12.82ZM41.8135 44.8829C47.822 49.0162 45.0874 59.0882 37.4224 60.8939C32.6077 62.0175 31.6064 52.2666 35.8048 44.8424C36.7677 43.1572 39.3099 43.1573 41.8135 44.8829Z" fill="#FAFAFA"/>
                </svg>
                <svg className='absolute animate-float-x right-0 md:right-1/6 top-2/10 md:top-1/4 w-20 h-20' viewBox="0 0 99 156" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.8409 66.1825C56.9866 57.8513 54.4872 48.7214 53.5332 39.5828C52.802 32.5412 52.2568 20.078 52.6213 18.4097C53.1894 15.8102 48.6519 11.6439 47.5497 16.6877C46.9817 19.2872 41.936 33.2361 34.6381 38.7934C27.7115 44.1058 25.2819 45.0441 21.4247 44.2054C19.2209 43.6946 19.4031 44.5229 22.051 47.3641C28.5954 54.3958 30.5098 62.256 32.0889 88.4777C33.0247 103.724 35.4132 104.844 40.3693 92.3437C45.2687 79.8955 55.7386 68.9636 61.1561 70.5572C62.943 71.1056 62.9001 70.6785 60.8409 66.1825ZM38.7494 80.0199L37.2317 83.018C37.092 81.9953 36.7001 62.1824 30.4319 52.848C28.7172 50.307 28.4699 49.5687 29.6218 50.3224C33.3157 52.7395 41.1692 46.9249 44.9347 38.8345C46.6929 35.1513 46.846 35.0741 47.3022 38.3881C48.2177 45.4173 50.5912 53.0457 54.3603 61.1438L56.8256 66.4824C56.2785 66.7009 46.5955 64.267 38.7494 80.0199Z" fill="#FFC107"/>
                <path d="M74.3354 128.659C69.2299 119.683 66.611 107.981 68.184 100.784C68.8738 97.6281 65.3725 91.1984 61.798 99.1081C57.3981 108.941 55.4341 111.13 50.0339 112.564C45.5979 113.706 45.609 113.449 49.947 117.699C53.9867 121.665 55.9649 129.297 55.8732 140.632C55.8183 147.679 60.4454 151.018 62.0219 144.835C64.2407 136.125 67.4128 132.528 72.7774 132.698C76.1822 132.773 76.3872 132.247 74.3354 128.659ZM69.1642 127.604C67.6851 127.163 63.2461 127.906 62.077 128.724C60.4667 129.913 60.5061 129.939 59.5989 126.881C58.8214 124.26 56.4714 120.389 54.6964 118.83C53.3461 117.594 53.4022 117.543 56.1656 116.845C57.4953 116.528 59.4937 115.417 60.6178 114.394C63.1216 112.206 62.8768 112.09 63.9896 115.855C64.8516 118.707 66.4986 122.294 68.722 126.126C69.3608 127.116 69.5045 127.695 69.1642 127.604Z" fill="#FFC107"/>
                </svg>
                <div className="absolute inset-0 bg-blue-900/20"></div>
                <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Resep Kebutuhan <span className="font-light">Gizi</span>-mu
                </h1>
                <p className="mt-4 max-w-xl text-lg opacity-90">
                    Yuk, jelajahi resep makanan yang paling sehat untuk memenuhi gizi harian.
                </p>
                <div className="mt-8 w-full max-w-lg">
                    <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="text"
                        placeholder="Cari resep bergizi..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="bg-white w-full py-4 pl-6 pr-16 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-full transition-colors">
                        <FaSearch className="w-5 h-5" />
                    </button>
                    </form>
                </div>
                </div>
            </header>

            {/* Daftar Resep */}
            {isLoading ? (
                <div className='p-10'>
                    <h1 className='md:font-bold font-semibold text-lg md:text-2xl'>Memuat resep...</h1>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(8).fill(0).map((_, index) => (
                            <RecipeCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className='p-10'>
                    <h1 className='md:font-bold font-semibold text-lg md:text-2xl'>Jelajahi berbagai resep buatan bunda hebat</h1>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* Floating Action Button */}
          <Link
            href="/resep/tambah"
            className="fixed bottom-20 right-6 md:right-8 w-14 h-14 bg-teal-600 hover:bg-teal-700 
                     rounded-full shadow-lg flex items-center justify-center transition-all 
                     hover:scale-110 z-50 text-white"
            aria-label="Tambah Resep"
          >
            <FaPlus className="w-5 h-5" />
          </Link>
        </main>
        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}