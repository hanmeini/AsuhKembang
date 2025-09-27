'use client';

import React from 'react';
import { FaBaby, FaFemale } from 'react-icons/fa'; 
import { MdPregnantWoman } from "react-icons/md";
import { ImManWoman } from "react-icons/im";

const ProfileSelector = ({ profiles, activeProfile, onProfileChange }) => {
  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-700 mb-2">Pindai Makanan Untuk:</h3>
      <div className="flex flex-wrap gap-2">
        {profiles.map(profile => (
          <button 
            key={profile.profileId}
            onClick={() => onProfileChange(profile)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors
              ${activeProfile?.profileId === profile.profileId 
                ? 'bg-teal-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }
          >
            {profile.type === 'pregnant' ? (
              <MdPregnantWoman size={20}/>
            ) : profile.type === 'child' ? (
              <FaBaby />
            ) : (
              <ImManWoman />
            )}
            {profile.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSelector;
