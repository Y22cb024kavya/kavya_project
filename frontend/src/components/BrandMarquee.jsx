import React from "react";
import Marquee from "react-fast-marquee";

const items = [
  "SPEAK. SHINE. SUCCEED.",
  "EVERY VOICE HAS AN ASCENT",
];

const BrandMarquee = () => (
  <div className="bg-navy-deep border-y border-gold/20 py-5 overflow-hidden" data-testid="brand-marquee">
    <Marquee speed={38} gradient={false} autoFill>
      {items.map((t, i) => (
        <span key={i} className="marquee-item font-mono uppercase text-gold-light/80 text-lg md:text-2xl tracking-[0.35em] mx-8 flex items-center">
          {t}
          <span className="text-gold mx-8">&#9670;</span>
        </span>
      ))}
    </Marquee>
  </div>
);

export default BrandMarquee;
