import React from 'react';

interface TreeTextLogoProps {
  className?: string;
}

const TreeTextLogo: React.FC<TreeTextLogoProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        {/* Curly bracket left */}
        <text 
          x="30" 
          y="55" 
          fontSize="70" 
          fontWeight="bold" 
          fontFamily="monospace" 
          fill="currentColor"
          className="text-primary"
        >
          {'{'}
        </text>
        
        {/* Leaf emoji */}
        <text 
          x="50" 
          y="50" 
          fontSize="50" 
          fontFamily="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Android Emoji, EmojiSymbols, EmojiOne Mozilla, Twemoji Mozilla, Segoe UI Symbol, Noto Color Emoji Compat, emoji"
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          🌿
        </text>
        
        {/* Curly bracket right */}
        <text 
          x="70" 
          y="55" 
          fontSize="70" 
          fontWeight="bold" 
          fontFamily="monospace" 
          fill="currentColor"
          className="text-primary"
        >
          {'}'}
        </text>
      </g>
    </svg>
  );
};

export default TreeTextLogo;
