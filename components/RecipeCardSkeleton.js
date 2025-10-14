import React from 'react';

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

export default RecipeCardSkeleton;