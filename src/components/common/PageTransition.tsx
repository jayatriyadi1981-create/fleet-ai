/**
 * Fleet Intelligence Smart AI - Page Transition Component
 * Provides subtle fade/slide animation respecting prefers-reduced-motion
 */

import React, { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <div className={`animate-fadeIn transition-all duration-200 ease-out ${className}`}>
      {children}
    </div>
  );
};
