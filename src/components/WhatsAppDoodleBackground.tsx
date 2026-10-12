import React from 'react';

/**
 * WhatsApp SVG Doodle pattern matching the exact background seen in WhatsApp chat
 */
export const WhatsAppDoodleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.06] overflow-hidden select-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="wa-doodles" width="280" height="280" patternUnits="userSpaceOnUse">
            {/* Coffee cup */}
            <path d="M20 40 h25 a5 5 0 0 1 5 5 v10 a15 15 0 0 1 -15 15 h-5 a15 15 0 0 1 -15 -15 v-10 a5 5 0 0 1 5 -5 z M45 45 h6 a6 6 0 0 1 6 6 v2 a6 6 0 0 1 -6 6 h-6" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            {/* Heart */}
            <path d="M110 35 c-5 -10 -20 -10 -25 0 c-5 10 0 20 25 35 c25 -15 30 -25 25 -35 c-5 -10 -20 -10 -25 0 z" fill="none" stroke="#000" strokeWidth="2.5" />
            {/* Clock */}
            <circle cx="210" cy="50" r="16" fill="none" stroke="#000" strokeWidth="2.5" />
            <path d="M210 40 v10 h8" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            {/* Speech bubble */}
            <path d="M40 120 h30 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-18 l-10 8 v-8 h-2 a8 8 0 0 1 -8 -8 v-14 a8 8 0 0 1 8 -8 z" fill="none" stroke="#000" strokeWidth="2.5" />
            {/* Smiley face */}
            <circle cx="140" cy="130" r="15" fill="none" stroke="#000" strokeWidth="2.5" />
            <circle cx="135" cy="126" r="2" fill="#000" />
            <circle cx="145" cy="126" r="2" fill="#000" />
            <path d="M134 135 q6 8 12 0" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            {/* Football / Soccer */}
            <circle cx="230" cy="130" r="16" fill="none" stroke="#000" strokeWidth="2.5" />
            <polygon points="230,122 237,127 234,135 226,135 223,127" fill="none" stroke="#000" strokeWidth="2" />
            {/* Calendar icon */}
            <rect x="35" y="195" width="28" height="26" rx="4" fill="none" stroke="#000" strokeWidth="2.5" />
            <line x1="35" y1="203" x2="63" y2="203" stroke="#000" strokeWidth="2" />
            <line x1="42" y1="191" x2="42" y2="197" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="56" y1="191" x2="56" y2="197" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            {/* Paper plane */}
            <path d="M120 200 l40 12 l-25 15 l-5 18 l-6 -14 l-4 -31 z" fill="none" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Padlock / Encryption */}
            <rect x="210" y="210" width="24" height="20" rx="3" fill="none" stroke="#000" strokeWidth="2.5" />
            <path d="M216 210 v-6 a6 6 0 0 1 12 0 v6" fill="none" stroke="#000" strokeWidth="2.5" />
            {/* Music note */}
            <path d="M80 80 v20 m0 -5 a6 6 0 1 1 -6 -6 h6" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            {/* Star */}
            <polygon points="170,30 173,38 181,38 175,43 177,51 170,46 163,51 165,43 159,38 167,38" fill="none" stroke="#000" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wa-doodles)" />
      </svg>
    </div>
  );
};
