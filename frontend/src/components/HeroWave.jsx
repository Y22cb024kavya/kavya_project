import React from "react";

// Smooth wave divider that transitions the dark hero into the light section below.
// Renders two overlapping curves (a soft mid tone + solid ivory) for a subtle 3D effect.
const HeroWave = ({ className = "" }) => (
  <div className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`} data-testid="hero-wave">
    <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[110px]">
      {/* soft translucent mid-wave */}
      <path
        d="M0,90 C240,140 480,40 720,70 C960,100 1200,20 1440,60 L1440,140 L0,140 Z"
        fill="rgba(255,255,255,0.06)"
      />
      {/* solid ivory front wave */}
      <path
        d="M0,110 C220,150 520,60 780,90 C1020,118 1240,60 1440,100 L1440,140 L0,140 Z"
        fill="#FAF7F2"
      />
    </svg>
  </div>
);

export default HeroWave;
