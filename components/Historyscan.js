'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HistoryItem = ({ scan }) => {
  if (!scan || !scan.aiScanResult) return null;

  return (
    <Link href={`/scan?scanId=${scan.id}`} passHref>
      <motion.div
        className="bg-white mb-2 p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer border-2 border-transparent hover:shadow-md transition-transform"
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <Image 
            src={scan.imageUrl}
            alt={scan.aiScanResult.display_name || 'Makanan'}
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
          <div className="overflow-hidden">
            <p className='font-semibold truncate text-gray-800'>{scan.aiScanResult.display_name || 'Makanan'}</p>
            <p className="text-xs text-gray-500">
              {new Date(scan.timestamp?.toDate()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <span className="font-bold text-sm md:text-base text-gray-700 flex-shrink-0 ml-4">
          {Math.round(scan.nutritionData?.calories || 0)} kkal
        </span>
      </motion.div>
    </Link>
  );
};

export default HistoryItem;
