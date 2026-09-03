import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Instagram, Youtube, Facebook, AtSign, Mail, Phone, MapPin } from "lucide-react";
import { trackClick, CONTACT } from "../lib/api";
import Logo from "./Logo";

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
  <footer className="bg-[#0F0C31] text-white border-t border-purple-800/40" data-testid="footer">
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <Logo light />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-purple-300 mt-4">
          Vision · Opportunity · Knowledge · Transformation · Ambition · Achievement
        </p>
        <p className="text-purple-200/60 text-sm mt-5 leading-relaxed max-w-xs">
          Corporate Learning &amp; Employability Solutions: building confident communicators, skilled professionals, and future-ready leaders.
        </p>
        <div className="flex gap-3 mt-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              onClick={() => trackClick("nav", `social-${s.label.toLowerCase()}`)}
              data-testid={`footer-social-${s.label.toLowerCase()}`}
              className="w-9 h-9 flex items-center justify-center border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-colors duration-300 rounded-xl"
            >
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-purple-400 mb-5">Explore</h4>
        <ul className="space-y-3">
          {explore.map((p) => (
            <li key={p.label}>
              <Link to={p.to} className="text-purple-200/70 hover:text-purple-300 text-sm transition-colors">{p.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-purple-400 mb-5">Connect</h4>
        <ul className="space-y-3">
          {connect.map((p) => (
            <li key={p.label}>
              <Link to={p.to} className="text-purple-200/70 hover:text-purple-300 text-sm transition-colors">{p.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-purple-400 mb-5">Get in Touch</h4>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3 text-purple-200/70">
            <MapPin size={16} className="text-purple-400 mt-0.5 shrink-0" />
            <span>{CONTACT.location}</span>
          </li>
          <li className="flex items-start gap-3 text-purple-200/70">
            <Phone size={16} className="text-purple-400 mt-0.5 shrink-0" />
            <a href={`tel:+91${CONTACT.phone}`} onClick={() => trackClick("contact", "phone")} className="hover:text-purple-300">{CONTACT.phoneDisplay}</a>
          </li>
          <li className="flex items-start gap-3 text-purple-200/70">
            <Mail size={16} className="text-purple-400 mt-0.5 shrink-0" />
            <a href={`mailto:${CONTACT.email}`} onClick={() => trackClick("contact", "email")} className="hover:text-purple-300 break-all">{CONTACT.email}</a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-purple-800/40 bg-[#0A0826]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-purple-300/50 text-xs">© 2026 VOKTAA Solutions. All rights reserved.</p>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400">Speak. Shine. Succeed.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
