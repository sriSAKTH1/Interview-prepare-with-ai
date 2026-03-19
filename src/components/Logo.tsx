import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top Hexagon */}
      <path d="M50 15 L65 24 L65 41 L50 50 L35 41 L35 24 Z" fill="currentColor" />
      <line x1="50" y1="15" x2="50" y2="5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      
      {/* Bottom Left Hexagon */}
      <path d="M25 55 L40 64 L40 81 L25 90 L10 81 L10 64 Z" fill="currentColor" />
      <line x1="10" y1="81" x2="2" y2="89" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      
      {/* Bottom Right Hexagon */}
      <path d="M75 55 L90 64 L90 81 L75 90 L60 81 L60 64 Z" fill="currentColor" />
      <line x1="90" y1="81" x2="98" y2="89" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};
