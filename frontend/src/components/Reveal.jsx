import React from "react";
import { motion } from "framer-motion";

// Line-by-line reveal used for kinetic hero headlines.
export const MaskLine = ({ children, delay = 0, className = "" }) => (
  <span className="reveal-mask">
    <motion.span
      className={`block ${className}`}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.span>
  </span>
);

// Scroll-reveal wrapper.
export const Reveal = ({ children, y = 40, delay = 0, className = "", once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

// Staggered container + item.
export const StaggerGroup = ({ children, className = "", stagger = 0.1 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "", y = 40 }) => (
  <motion.div
    className={className}
    variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
  >
    {children}
  </motion.div>
);
