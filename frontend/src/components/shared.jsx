import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MaskLine } from "./Reveal";
import { trackClick } from "../lib/api";

export const SectionLabel = ({ children, dark = false, className = "" }) => (
  <span
    className={`font-heading text-xs sm:text-sm font-bold uppercase tracking-normal ${dark ? "text-teal-300" : "text-[#157082]"} ${className}`}
  >
    {children}
  </span>
);

export const GoldLink = ({ to, children, track, ...rest }) => (
  <Link
    to={to}
    onClick={() => track && trackClick(track.category, track.label)}
    className="inline-flex items-center justify-center bg-gradient-to-r from-[#003366] to-[#157082] text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full shadow-lg shadow-[#157082]/25 hover:shadow-[#157082]/40 hover:scale-[1.02] transition-all duration-300"
    {...rest}
  >
    {children}
  </Link>
);

export const OutlineLink = ({ to, children, dark = false, track, ...rest }) => (
  <Link
    to={to}
    onClick={() => track && trackClick(track.category, track.label)}
    className={`inline-flex items-center justify-center font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all duration-300 ${
      dark
        ? "bg-white/10 border border-white/30 text-white hover:bg-white hover:text-[#003366]"
        : "bg-white border border-[#CCE0F5] text-[#003366] shadow-sm hover:border-[#157082] hover:bg-[#F0F5FA]"
    }`}
    {...rest}
  >
    {children}
  </Link>
);

// Reusable page hero with clearly visible background photo & custom focal position
export const PageHero = ({ label, title, gold, subtitle, bgImage, imgPosition = "object-[center_20%]", inlineGold = false, testid, children }) => (
  <section
    className={`relative ${
      bgImage
        ? "bg-[#001730] text-white pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#003366]/60"
        : "bg-gradient-to-b from-[#F0F5FA] via-[#F2FAFC] to-white text-[#333333] pt-24 pb-12 md:pt-32 md:pb-16 border-b border-[#CCE0F5]"
    } overflow-hidden`}
    data-testid={testid}
  >
    {bgImage ? (
      <>
        {/* Background photo framed with object position - bright, large & clear */}
        <img
          src={bgImage}
          alt={title ? `${title} ${gold || ""} - VOKTAA Solutions` : "VOKTAA Training Architecture"}
          className={`absolute inset-0 w-full h-full object-cover ${imgPosition} opacity-95`}
        />
        {/* Soft, subtle translucent overlay so photo is clear & dark shade is not dominating */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001730]/65 via-[#002244]/40 to-transparent" />
      </>
    ) : (
      <>
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#157082]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-[#003366]/20 rounded-full blur-3xl pointer-events-none" />
      </>
    )}

    <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
      <div className={children ? "grid lg:grid-cols-12 gap-8 lg:gap-12 items-center" : "max-w-3xl text-left"}>
        <div className={children ? "lg:col-span-6 text-left" : ""}>
          {label && (
            <span
              className={`font-heading text-xs uppercase tracking-normal block mb-4 ${
                bgImage ? "text-teal-300 font-bold" : "text-[#157082] font-bold"
              }`}
            >
              {label}
            </span>
          )}
          <h1
            className={`font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight ${
              bgImage ? "text-white" : "text-[#003366]"
            }`}
          >
            {inlineGold ? (
              <MaskLine className="block">
                {title}{" "}
                <span
                  className={
                    bgImage
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-sky-200 to-cyan-300 font-black inline-block"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#157082] font-black inline-block"
                  }
                >
                  {gold}
                </span>
              </MaskLine>
            ) : (
              <>
                <MaskLine className="block">{title}</MaskLine>
                {gold && (
                  <MaskLine
                    delay={0.15}
                    className={
                      bgImage
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-sky-200 to-cyan-300 font-black block mt-1"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#157082] font-black block mt-1"
                    }
                  >
                    {gold}
                  </MaskLine>
                )}
              </>
            )}
          </h1>
          {subtitle && (
            <p
              className={`text-base sm:text-lg md:text-xl leading-relaxed mt-5 max-w-2xl text-left font-medium ${
                bgImage ? "text-slate-100 drop-shadow-sm" : "text-[#333333]"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="lg:col-span-6 relative flex items-center justify-center pt-6 lg:pt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  </section>
);

// 3D Stage Circular Pedestal Platform Disc (Prussian Blue & Deep Sky-Blue/Teal style)
export const StagePedestalDisc = () => (
  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[115%] max-w-2xl pointer-events-none z-0">
    {/* Outer Glow Ambient Aura */}
    <div className="absolute -inset-4 bg-gradient-to-r from-[#003366]/35 via-[#157082]/45 to-teal-300/35 rounded-[100%] blur-3xl opacity-80" />
    
    {/* 3D Pedestal Stage SVG */}
    <svg viewBox="0 0 500 130" className="w-full drop-shadow-[0_20px_45px_rgba(21,112,130,0.3)]">
      <defs>
        <linearGradient id="pedestalTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#D4F3F7" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="pedestalSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A1E2EA" />
          <stop offset="50%" stopColor="#157082" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
        <linearGradient id="pedestalBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CCE0F5" />
          <stop offset="50%" stopColor="#157082" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
      </defs>

      {/* Base Tier Ring */}
      <ellipse cx="250" cy="100" rx="245" ry="24" fill="url(#pedestalBaseGrad)" opacity="0.4" />
      <ellipse cx="250" cy="90" rx="235" ry="25" fill="none" stroke="#157082" strokeWidth="2.5" opacity="0.7" />

      {/* 3D Stage Cylinder Side Wall */}
      <path d="M 15,48 A 235 28 0 0 0 485,48 L 485,78 A 235 28 0 0 1 15,78 Z" fill="url(#pedestalSideGrad)" />

      {/* Top Pedestal Disc Surface */}
      <ellipse cx="250" cy="48" rx="235" ry="28" fill="url(#pedestalTopGrad)" stroke="#ffffff" strokeWidth="4" />

      {/* Glowing Inner Stage Rings */}
      <ellipse cx="250" cy="48" rx="215" ry="22" fill="none" stroke="#D4F3F7" strokeWidth="3" opacity="0.9" />
      <ellipse cx="250" cy="48" rx="195" ry="17" fill="none" stroke="#157082" strokeWidth="2" strokeDasharray="8 5" opacity="0.75" />
    </svg>
  </div>
);

// Floating Glassmorphism Bubble Element
export const GlassBubble = ({ className = "", size = "w-32 h-32", delay = 0, duration = 6, yOffset = 25 }) => (
  <motion.div
    animate={{ y: [0, -yOffset, 0], scale: [1, 1.05, 1], rotate: [0, 10, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute rounded-full bg-gradient-to-tr from-white/60 via-[#A1E2EA]/35 to-teal-100/40 backdrop-blur-md border border-white/80 shadow-[0_12px_35px_rgba(21,112,130,0.18)] pointer-events-none z-0 ${size} ${className}`}
  >
    <div className="absolute top-2 left-3 w-1/3 h-1/3 rounded-full bg-white/80 blur-[1px]" />
  </motion.div>
);

export default PageHero;
