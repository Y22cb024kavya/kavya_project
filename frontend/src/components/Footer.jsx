import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Instagram, Youtube, Facebook, AtSign, Mail, Phone, MapPin } from "lucide-react";
import { trackClick, CONTACT } from "../lib/api";
import Logo from "./Logo";

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/voktaa-undefined-6331a8434/" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/voktaasolutions/" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/search/top?q=voktaa%20solutions" },
  { icon: AtSign, label: "Threads", href: "#" },
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
  <footer className="bg-[#002244] text-white border-t border-[#003366]" data-testid="footer">
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <Logo light />
        <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#68CEDB] mt-4 space-y-1">
          <p>Vision · Opportunity · Knowledge</p>
          <p>Transformation · Ambition · Achievement</p>
        </div>
        <div className="font-mono text-[11px] text-slate-300 mt-3">
          <p><strong className="text-[#68CEDB]">CIN:</strong> U85302AP2026PTC127560</p>
        </div>
        <p className="text-slate-300 text-sm mt-4 leading-relaxed max-w-xs">
          Corporate Learning &amp; Employability Solutions: building confident communicators, skilled professionals, and future-ready leaders.
        </p>
        <div className="flex gap-3 mt-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href !== "#" ? "_blank" : undefined}
              rel={s.href !== "#" ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              onClick={() => trackClick("nav", `social-${s.label.toLowerCase()}`)}
              data-testid={`footer-social-${s.label.toLowerCase()}`}
              className="w-9 h-9 flex items-center justify-center border border-[#157082]/40 text-teal-200 hover:text-white hover:bg-[#157082] hover:border-[#157082] transition-colors duration-300 rounded-xl"
            >
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-wide text-[#68CEDB] mb-5">Explore</h4>
        <ul className="space-y-3">
          {explore.map((p) => (
            <li key={p.label}>
              <Link to={p.to} className="text-slate-300 hover:text-white text-sm transition-colors">{p.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-wide text-[#68CEDB] mb-5">Connect</h4>
        <ul className="space-y-3">
          {connect.map((p) => (
            <li key={p.label}>
              <Link to={p.to} className="text-slate-300 hover:text-white text-sm transition-colors">{p.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-mono text-xs uppercase tracking-wide text-[#68CEDB] mb-5">Get in Touch</h4>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3 text-slate-300">
            <MapPin size={16} className="text-[#157082] mt-0.5 shrink-0" />
            <span>{CONTACT.location}</span>
          </li>
          <li className="flex items-start gap-3 text-slate-300">
            <Phone size={16} className="text-[#157082] mt-0.5 shrink-0" />
            <a href={`tel:+91${CONTACT.phone}`} onClick={() => trackClick("contact", "phone")} className="hover:text-white">{CONTACT.phoneDisplay}</a>
          </li>
          <li className="flex items-start gap-3 text-slate-300">
            <Mail size={16} className="text-[#157082] mt-0.5 shrink-0" />
            <a href={`mailto:${CONTACT.email}`} onClick={() => trackClick("contact", "email")} className="hover:text-white break-all">{CONTACT.email}</a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-[#003366] bg-[#001730]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div>
          <p className="text-slate-400 text-xs">© 2026 VOKTAA Solutions. All rights reserved.</p>
          <p className="font-mono text-[11px] text-slate-400 mt-1">
            <strong className="text-[#68CEDB]">CIN:</strong> U85302AP2026PTC127560
          </p>
        </div>
        <p className="font-mono text-xs uppercase tracking-wide text-[#157082]">Speak. Shine. Succeed.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
