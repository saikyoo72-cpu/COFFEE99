import React from 'react';

export const Logo = ({ className = "h-10 w-auto", storeName }: { className?: string, storeName?: string }) => {
  if (storeName) {
    return (
      <div className={`${className} flex items-center`}>
        <span className="text-2xl font-black tracking-tighter">
          <span className="text-brand-red">{storeName.split(' ')[0]}</span>
          <span className="text-dark-roast">{storeName.split(' ').slice(1).join(' ')}</span>
        </span>
      </div>
    );
  }

  return (
    <svg 
      viewBox="0 0 280 60" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Coffee99 Logo"
    >
      {/* Logo Text with enhanced vibrant dark red for "Coffee" and no space before "99" */}
      <g fontWeight="900" fontFamily="'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" fontSize="44">
        <text x="5" y="46" letterSpacing="-2">
          <tspan fill="#D00000" style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))' }}>Coffee</tspan>
          <tspan fill="#00BB9F">99</tspan>
        </text>
      </g>
    </svg>
  );
};
