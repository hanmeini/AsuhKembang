"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartBar, FaUsers, FaUserCircle } from "react-icons/fa";
import { IoScan, IoJournal } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { motion } from "framer-motion";

// Komponen internal untuk setiap item navigasi
const NavItem = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="flex-1">
      <motion.div
        className={`flex flex-col items-center transition-colors duration-200 ${
          isActive ? "text-teal-600" : "text-gray-500 hover:text-teal-600"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
        <span
          className={`text-xs mt-1 ${isActive ? "font-bold" : "font-medium"}`}
        >
          {label}
        </span>
      </motion.div>
    </Link>
  );
};

const BottomNavBar = () => {
  const { userProfile } = useAuth();
  const [currentProfilePic, setCurrentProfilePic] = React.useState(
    userProfile?.photoURL,
  );
  const fallbackAvatar =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAoAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUCAwYBB//EADMQAAICAQEFBgQGAgMAAAAAAAABAgMEEQUSITFREyJBUmFxMkKBoRRikbHB0SM0M1Pw/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oAPAMBAAIRAxEAPwD7iAAAAAABgBqQ8jaNNOqi+0kvCP8AZXXbTyLH3Gq4/lXH9S4L0xdkFznFfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5nU6EfKw6shd5aS8y5jTHPA25NE8e1wmvZ9UaiiXiZ9uO9JPfr8r8PYuqLoXV79ctV90c0bcbIsx7FOt8PmT5Mlg6UGrHuhfUrIPg+a6G0yoAAAAA8k1FNyeiXM5/PyXk3N/JHhEsNr37lXZLnPn7FMakQABUEX+zsdUY8dV3pd6RSURUrq4vk5Jfc6YlWAAMqAACLtDH7fHlou9HjE586o5m+O5fZFclJo1EawAUScHJeNbq+MJcJL+ToE00mnqmcsXOx73ZU6pPjDl7EsFiADKh4emrJn2dFk/LFsCiz7u2yrJeCe6vZf8AmRwDbIAAM6pblsJ+WSZ06RQfU5qdtlj1nOUvdmGgwdQrIPlOL+p7qcsZwsnW9YTlF+jGI6cFFTtPIhpvNWL1RYY+0abtE/8cukhipoC5AgAAAAAAAAAGrJuhRU7LOS5LqAvvhRBzsei8PUpcvOsyHonu1+VfyacjIsybHOb9l4I1GpEADbj0TyLNyv3bfgUavHTxN8MPJmtY0z+vD9y7xsSrHXdinLzNcWSCaY5yeHkw4ypn9FqaHw5|Jlb7+GP8mGZnwoe5X37eWngjViYc7LFkZnGfNRfgUe7Oxp7zyb+Nk+SfgWIBAAAAAAAAA0ImXg1ZCbfdn5kSwBUqzNwuFke1rXj6EqnaWPauMtx9Jf2TCPdhY93x1rXrHgUbozjJaxkmvRmRWy2TBPWq2UfoefgMqPwZb+uoFmYynGK1lJJdW9Cu/AZUvjy39Nf7PY7Ki3rbbOYG27aWPX8Mu0f5OP3I7szM5aVw7Kp+PVEynCx6dNypa9XxJIETEwasdby1lPzMl6AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//Z";

  React.useEffect(() => {
    setCurrentProfilePic(userProfile?.photoURL);
  }, [userProfile?.photoURL]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center p-2 z-50">
      <NavItem
        href="/dashboard"
        icon={<FaChartBar size={22} />}
        label="Dashboard"
      />
      <NavItem href="/jurnal" icon={<IoJournal size={22} />} label="Jurnal" />

      {/* Tombol Scan di Tengah */}
      <Link href="/scan" className="flex-1">
        <motion.div
          className="transform -translate-y-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg mx-auto">
            <IoScan size={32} />
          </div>
        </motion.div>
      </Link>

      <NavItem
        href="/komunitas"
        icon={<FaUsers size={22} />}
        label="Komunitas"
      />

      {/* Item Profil dengan Logika Avatar */}
      <NavItem
        href="/profile"
        label="Profil"
        icon={
          currentProfilePic ? (
            <Image
              src={currentProfilePic}
              alt="Foto Profil"
              width={24}
              height={24}
              className="rounded-full object-cover w-6 h-6"
              onError={() => setCurrentProfilePic(fallbackAvatar)}
            />
          ) : (
            <FaUserCircle size={22} />
          )
        }
      />
    </nav>
  );
};

export default BottomNavBar;
