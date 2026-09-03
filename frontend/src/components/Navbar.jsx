import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { trackClick } from "../lib/api";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/programs", label: "Programs" },
  { to: "/institutions", label: "For Institutions" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact Us" },
];

const Logo = () => (
  <img src="/logo.png" alt="VOKTAA Solutions" className="h-11 md:h-12 w-auto" />
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const goDemo = () => {
    trackClick("cta", "book-free-demo-nav");
    setOpen(false);
    navigate("/contact");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy-deep/95 backdrop-blur-xl border-b border-white/10" : "bg-navy-deep/70 backdrop-blur-md"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)} data-testid="navbar-logo">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 whitespace-nowrap ${
                  isActive ? "text-gold" : "text-white/70 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <button
            onClick={goDemo}
            data-testid="navbar-demo-button"
            className="bg-gold text-navy-deep font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-full hover:bg-gold-light transition-colors duration-300 whitespace-nowrap"
          >
            Book a Demo
          </button>
        </div>

        <button
          className="lg:hidden text-gold"
          onClick={() => setOpen((v) => !v)}
          data-testid="navbar-hamburger"
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DRAWER (portalled to body so backdrop-blur on <header> doesn't collapse it) */}
      {typeof document !== "undefined" && createPortal(
        <div
          className={`lg:hidden fixed inset-0 bg-navy-deep z-[55] overflow-y-auto transition-opacity duration-300 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          data-testid="mobile-drawer"
          aria-hidden={!open}
        >
          <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40 pointer-events-none" />
          {/* internal top bar with logo + close */}
          <div className="relative h-20 px-6 flex items-center justify-between border-b border-white/10">
            <Link to="/" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="VOKTAA" className="h-10 w-auto" />
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-gold"
              data-testid="mobile-drawer-close"
            >
              <X size={28} />
            </button>
          </div>
          <div className="relative flex flex-col px-8 pt-10 pb-16 gap-6">
            {links.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `font-heading text-3xl font-bold tracking-tight ${isActive ? "text-gold" : "text-white"}`
                }
              >
                <span className="font-mono text-xs text-gold/60 mr-3">0{i + 1}</span>
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={goDemo}
              data-testid="mobile-demo-button"
              className="mt-4 bg-gold text-navy-deep font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full self-start"
            >
              Book a Demo
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Navbar;
