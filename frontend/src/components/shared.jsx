import React from "react";
import { Link } from "react-router-dom";
import { MaskLine } from "./Reveal";
import { trackClick } from "../lib/api";

export const SectionLabel = ({ children, dark = false, className = "" }) => (
  <span
    className={`font-mono text-xs uppercase tracking-[0.3em] ${dark ? "text-purple-300" : "text-purple-600"} ${className}`}
  >
    {children}
  </span>
);

export const GoldLink = ({ to, children, track, ...rest }) => (
  <Link
    to={to}
    onClick={() => track && trackClick(track.category, track.label)}
    className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300"
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
        ? "bg-white/10 border border-white/30 text-white hover:bg-white hover:text-purple-900"
        : "bg-white border border-purple-200 text-purple-900 shadow-sm hover:border-purple-300 hover:bg-purple-50"
    }`}
    {...rest}
  >
    {children}
  </Link>
);

// Reusable page hero with clearly visible background photo & custom focal position.
export const PageHero = ({ label, title, gold, subtitle, bgImage, imgPosition = "object-[center_20%]", testid }) => (
  <section
    className={`relative ${
      bgImage
        ? "bg-slate-950 text-white pt-36 pb-24 md:pt-44 md:pb-32 border-b border-slate-800/80"
        : "bg-gradient-to-b from-purple-50/80 via-white to-purple-50/40 text-slate-900 pt-36 pb-24 md:pt-44 md:pb-32 border-b border-purple-100"
    } overflow-hidden`}
    data-testid={testid}
  >
    {bgImage ? (
      <>
        {/* Background photo framed with object position so trainer's face is fully visible */}
        <img
          src={bgImage}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover ${imgPosition} opacity-60`}
        />
        {/* Professional dark slate overlay for maximum text readability */}
        <div className="absolute inset-0 bg-slate-950/70" />
      </>
    ) : (
      <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
    )}

    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center z-10">
      {label && (
        <span
          className={`font-mono text-xs uppercase tracking-[0.3em] block mb-5 ${
            bgImage ? "text-amber-400 font-bold" : "text-purple-600"
          }`}
        >
          {label}
        </span>
      )}
      <h1
        className={`font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] ${
          bgImage ? "text-white" : "text-purple-950"
        }`}
      >
        <MaskLine>{title}</MaskLine>
        {gold && (
          <MaskLine
            delay={0.15}
            className={
              bgImage
                ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300"
                : "text-purple-600"
            }
          >
            {gold}
          </MaskLine>
        )}
      </h1>
      {subtitle && (
        <p
          className={`text-lg md:text-xl leading-relaxed mt-7 max-w-2xl mx-auto font-medium ${
            bgImage ? "text-slate-200/90" : "text-purple-900/70"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default PageHero;
