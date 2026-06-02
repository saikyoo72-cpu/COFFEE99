import React from 'react';

export const Logo = ({ className = "h-10 w-auto", storeName }: { className?: string, storeName?: string }) => {
  // Premium modern neon brand colors
  const redColor = "#ff2a5f"; // Premium neon light pinkish-red
  const greenColor = "#00ff66"; // Premium vibrant neon green

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
        <span className="text-2xl font-black tracking-tight flex items-center" style={{ fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', sans-serif" }}>
          <span style={{ 
            color: redColor, 
            display: 'inline-block',
            textShadow: '0 0 10px rgba(255, 42, 95, 0.4)'
          }}>{firstPart}</span>
          <span style={{ 
            color: greenColor, 
            display: 'inline-block', 
            marginLeft: '0.12em',
            textShadow: '0 0 10px rgba(0, 255, 102, 0.4)'
          }}>{secondPart}</span>
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
      <defs>
        <filter id="neon-glow-red-logo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-glow-green-logo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Logo Text with original brand colors */}
      <g fontWeight="900" fontFamily="'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif" fontSize="44">
        <text x="5" y="46" letterSpacing="0">
          <tspan fill={redColor} filter="url(#neon-glow-red-logo)">Coffee</tspan>
          <tspan fill={greenColor} dx="4" filter="url(#neon-glow-green-logo)">99</tspan>
        </text>
      </g>
    </svg>
  );
};
