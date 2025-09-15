'use client';

import React from 'react';

const MacroWidget = ({ label, current, target, unit = 'g', colorClass }) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const barWidth = Math.min(percentage, 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-xs font-semibold text-gray-500">{Math.round(current)} / {Math.round(target)}{unit}</span>
      </div>
      <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-gray-200">
        <div 
          style={{ width: `${barWidth}%` }} 
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${colorClass} transition-all duration-500`}
        ></div>
      </div>
    </div>
  );
};

export default MacroWidget;