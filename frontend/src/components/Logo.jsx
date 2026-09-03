import React from "react";

export const Logo = ({ light = false, className = "" }) => {
  const textColor = light ? "text-white" : "text-[#1E1B4B]";
  const subColor = light ? "text-purple-300" : "text-purple-900/70";
  const lineColor = light ? "bg-purple-400/50" : "bg-purple-300/80";

  return (
    <div className={`inline-flex flex-col items-start leading-none select-none ${className}`} data-testid="site-logo">
      <div className="flex items-center gap-[2px]">
        {/* VOKT text */}
        <span className={`font-heading font-extrabold text-2xl md:text-[28px] tracking-tight ${textColor}`}>
          VOKT
        </span>

        {/* Stylized AA with growth arrow */}
        <div className="relative inline-flex items-center justify-center ml-0.5">
          <svg viewBox="0 0 54 36" className="h-8 md:h-9 w-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            {/* Double A merged stroke */}
            <path d="M4 30 L15 8 L24 26 L33 8 L44 30" stroke="url(#logoArrowGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Crossbar 1 */}
            <line x1="8" y1="21" x2="20" y2="21" stroke="url(#logoArrowGrad)" strokeWidth="3" strokeLinecap="round" />
            {/* Crossbar 2 */}
            <line x1="27" y1="21" x2="39" y2="21" stroke="url(#logoArrowGrad)" strokeWidth="3" strokeLinecap="round" />
            {/* Upward growth trend arrow */}
            <path d="M10 26 C 22 20, 34 10, 48 4" stroke="url(#logoArrowGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M38 4 L49 3 L48 14" stroke="url(#logoArrowGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Divider line spanning full width + SOLUTIONS subtitle */}
      <div className="w-full mt-1">
        <div className={`h-[1.5px] w-full ${lineColor} rounded-full mb-1`} />
        <div className={`font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.38em] text-center ${subColor}`}>
          SOLUTIONS
        </div>
      </div>
    </div>
  );
};

export default Logo;
