import React from "react";
import { motion } from "framer-motion";

// Animated gold ascending growth-curve used in the hero.
const AscentCurve = ({ className = "" }) => (
  <svg viewBox="0 0 400 400" fill="none" className={className} data-testid="ascent-curve">
    <defs>
      <linearGradient id="goldStroke" x1="0" y1="400" x2="400" y2="0">
        <stop offset="0%" stopColor="#27A9CC" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#62C1DE" />
      </linearGradient>
    </defs>

    {/* baseline dots */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle key={i} cx={30 + i * 70} cy={370} r="2.5" fill="#27A9CC" opacity="0.4" />
    ))}

    {/* ascending curve */}
    <motion.path
      d="M20 360 C 120 340, 150 240, 220 200 S 330 90, 380 30"
      stroke="url(#goldStroke)"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
    />

    {/* ascending bars */}
    {[
      { x: 90, h: 60 },
      { x: 160, h: 120 },
      { x: 230, h: 200 },
      { x: 300, h: 300 },
    ].map((b, i) => (
      <motion.rect
        key={i}
        x={b.x}
        width="26"
        fill="#27A9CC"
        fillOpacity={0.12 + i * 0.06}
        initial={{ height: 0, y: 360 }}
        animate={{ height: b.h, y: 360 - b.h }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 + i * 0.15 }}
      />
    ))}

    {/* arrow head */}
    <motion.path
      d="M355 30 L380 30 L380 55"
      stroke="#62C1DE"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 2.2 }}
    />
  </svg>
);

export default AscentCurve;
