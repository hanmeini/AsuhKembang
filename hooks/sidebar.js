'use client';

import { useState } from 'react';

export const useSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const expandSidebar = () => setIsExpanded(true);
  const collapseSidebar = () => setIsExpanded(false);

  return { isExpanded, expandSidebar, collapseSidebar };
};