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
    let rafId;
    let resizeRafId;
    try {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoResize: false });
      const loop = (time) => {
        if (lenis) lenis.raf(time);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);

      const handleResize = () => {
        if (resizeRafId) cancelAnimationFrame(resizeRafId);
        resizeRafId = requestAnimationFrame(() => {
          if (lenis) lenis.resize();
        });
      };
      window.addEventListener("resize", handleResize);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (resizeRafId) cancelAnimationFrame(resizeRafId);
        window.removeEventListener("resize", handleResize);
        if (lenis) lenis.destroy();
      };
    } catch (e) {
      console.warn("Lenis smooth scroll warning:", e);
    }
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
