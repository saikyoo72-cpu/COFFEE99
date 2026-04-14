import React from 'react';

export const Logo = ({ className = "h-10 w-auto", storeName }: { className?: string, storeName?: string }) => {
  // Original brand colors - hardcoded to prevent global CSS overrides
  const redColor = "#D00000";
  const cyanColor = "#00BB9F";

  if (storeName) {
    // Handle "Coffee99" or "Coffee 99" correctly
    let firstPart = storeName;
    let secondPart = "";

    if (storeName.toLowerCase().startsWith("coffee")) {
      firstPart = storeName.substring(0, 6); // "Coffee"
      secondPart = storeName.substring(6);    // Everything after "Coffee"
    } else if (storeName.includes(' ')) {
      const parts = storeName.split(' ');
      firstPart = parts[0];
      secondPart = parts.slice(1).join(' ');
    }

    return (
      <div className={`${className} flex items-center`} style={{ color: 'inherit', filter: 'none', mixBlendMode: 'normal', opacity: 1 }}>
        <span className="text-2xl font-black tracking-tight flex items-center">
          <span style={{ color: redColor, display: 'inline-block' }}>{firstPart}</span>
          <span style={{ color: cyanColor, display: 'inline-block', marginLeft: '0.1em' }}>{secondPart}</span>
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
      style={{ filter: 'none', mixBlendMode: 'normal', opacity: 1 }}
    >
      {/* Logo Text with original brand colors */}
      <g fontWeight="900" fontFamily="'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" fontSize="44">
        <text x="5" y="46" letterSpacing="0">
          <tspan fill={redColor} style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))' }}>Coffee</tspan>
          <tspan fill={cyanColor} dx="4">99</tspan>
        </text>
      </g>
    </svg>
  );
};
