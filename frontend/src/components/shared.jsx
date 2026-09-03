import React from "react";
import { Link } from "react-router-dom";
import { MaskLine } from "./Reveal";
import HeroWave from "./HeroWave";
import { trackClick } from "../lib/api";

export const SectionLabel = ({ children, dark = false, className = "" }) => (
  <span
    className={`font-mono text-xs uppercase tracking-[0.3em] ${dark ? "text-gold-light" : "text-gold"} ${className}`}
  >
    {children}
  </span>
);

export const GoldLink = ({ to, children, track, ...rest }) => (
  <Link
    to={to}
    onClick={() => track && trackClick(track.category, track.label)}
    className="inline-flex items-center justify-center bg-gold text-navy-deep font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-gold-light transition-colors duration-300"
    {...rest}
  >
    {children}
  </Link>
);

export const OutlineLink = ({ to, children, dark = false, track, ...rest }) => (
  <Link
    to={to}
    onClick={() => track && trackClick(track.category, track.label)}
    className={`inline-flex items-center justify-center border font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-colors duration-300 ${
      dark
        ? "border-gold text-gold hover:bg-gold hover:text-navy-deep"
        : "border-navy text-navy hover:bg-navy hover:text-white"
    }`}
    {...rest}
  >
    {children}
  </Link>
);

// Reusable dark navy page hero with dot-grid texture and a wave transition into the next section.
export const PageHero = ({ label, title, gold, subtitle, testid }) => (
  <section className="relative bg-navy-deep pt-40 pb-40 md:pt-48 md:pb-48 overflow-hidden" data-testid={testid}>
    <div className="absolute inset-0 dot-grid dot-grid-fade opacity-70" />
    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
      {label && <SectionLabel dark className="block mb-6">— {label}</SectionLabel>}
      <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
        <MaskLine>{title}</MaskLine>
        {gold && <MaskLine delay={0.15} className="text-gold">{gold}</MaskLine>}
      </h1>
      {subtitle && (
        <p className="text-white/70 text-lg md:text-xl leading-relaxed mt-8 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
    <HeroWave />
  </section>
);
