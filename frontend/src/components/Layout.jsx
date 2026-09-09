import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import Chatbot from "./Chatbot";
import { trackVisit } from "../lib/api";

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    let lenis;
    let raf;
    try {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const loop = (time) => {
        if (lenis) lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } catch (e) {
      console.warn("Lenis smooth scroll warning:", e);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (lenis) lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackVisit(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default Layout;
