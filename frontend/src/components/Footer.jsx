import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Instagram, Youtube, Facebook, AtSign, Mail, Phone, MapPin } from "lucide-react";
import { trackClick, CONTACT } from "../lib/api";

const socials = [
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
  { icon: Facebook, label: "Facebook" },
  { icon: AtSign, label: "Threads" },
];

const explore = [
  { label: "About Us", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "For Institutions", to: "/institutions" },
];

const connect = [
  { label: "Reviews", to: "/reviews" },
  { label: "Contact Us", to: "/contact" },
  { label: "Book a Demo", to: "/contact" },
];

const Footer = () => (
  <footer className="bg-navy-deep text-white border-t border-gold/20" data-testid="footer">
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <img src="/logo.png" alt="VOKTAA Solutions" className="h-12 w-auto" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/80 mt-4">
          Vision · Opportunity · Knowledge · Transformation · Ambition · Achievement
        </p>
        <p className="text-white/60 text-sm mt-5 leading-relaxed max-w-xs">
          Corporate Learning &amp; Employability Solutions — building confident communicators, skilled professionals, and future-ready leaders.
        </p>
        <div className="flex gap-3 mt-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              onClick={() => trackClick("nav", `social-${s.label.toLowerCase()}`)}
              data-testid={`footer-social-${s.label.toLowerCase()}`}
              className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/70 hover:text-navy-deep hover:bg-gold hover:border-gold transition-colors duration-300 rounded-xl"
            >
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-5">Explore</h4>
        <ul className="space-y-3">
          {explore.map((p) => (
            <li key={p.label}>
              <Link to={p.to} className="text-white/70 hover:text-gold text-sm transition-colors">{p.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-5">Connect</h4>
        <ul className="space-y-3">
          {connect.map((p) => (
            <li key={p.label}>
              <Link to={p.to} className="text-white/70 hover:text-gold text-sm transition-colors">{p.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-5">Get in Touch</h4>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3 text-white/70">
            <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
            <span>{CONTACT.location}</span>
          </li>
          <li className="flex items-start gap-3 text-white/70">
            <Phone size={16} className="text-gold mt-0.5 shrink-0" />
            <a href={`tel:+91${CONTACT.phone}`} onClick={() => trackClick("contact", "phone")} className="hover:text-gold">{CONTACT.phoneDisplay}</a>
          </li>
          <li className="flex items-start gap-3 text-white/70">
            <Mail size={16} className="text-gold mt-0.5 shrink-0" />
            <a href={`mailto:${CONTACT.email}`} onClick={() => trackClick("contact", "email")} className="hover:text-gold break-all">{CONTACT.email}</a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/50 text-xs">© 2026 VOKTAA Solutions. All rights reserved.</p>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Speak. Shine. Succeed.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
