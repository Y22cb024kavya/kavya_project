import React from "react";

export const Logo = ({ light = false, className = "", height = "h-10 sm:h-11 md:h-12 lg:h-14" }) => {
  if (light) {
    return (
      <div className={`inline-flex items-center bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/90 shadow-md select-none ${className}`} data-testid="site-logo-light">
        <img
          src="/voktaa_logo.png"
          alt="VOKTAA SOLUTIONS"
          className={`${height} w-auto object-contain`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`} data-testid="site-logo">
      <img
        src="/voktaa_logo.png"
        alt="VOKTAA SOLUTIONS"
        className={`${height} w-auto object-contain mix-blend-multiply`}
      />
    </div>
  );
};

export default Logo;
