import React, { useEffect } from "react";
import { CheckCircle2, ArrowRight, Award, Sparkles, Handshake, Zap, Lightbulb, ShieldCheck, Mail, User } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem, MaskLine } from "../components/Reveal";
import { SectionLabel, GoldLink, OutlineLink, GlassBubble } from "../components/shared";
import SEO from "../components/SEO";
import Breadcrumbs from "../components/Breadcrumbs";
import { PAGE_SEO, ORGANIZATION_SCHEMA, PRIMARY_ORG_ID, SITE_URL } from "../data/seoData";

const acronym = [
  { l: "V", w: "Voice" },
  { l: "O", w: "Opportunity" },
  { l: "K", w: "Knowledge" },
  { l: "T", w: "Transformation" },
  { l: "A", w: "Action" },
  { l: "A", w: "Achievement" },
];

const mission = [
  "Develop confident communicators",
  "Enhance employability and workplace readiness",
  "Deliver globally relevant corporate training",
  "Foster leadership and professional excellence",
  "Bridge the gap between education and industry",
  "Build lifelong learning cultures within organisations",
];

const values = [
  { icon: Award, t: "Excellence", d: "We pursue the highest standards in every programme." },
  { icon: ShieldCheck, t: "Integrity", d: "We act with honesty, transparency, and accountability." },
  { icon: Lightbulb, t: "Innovation", d: "We continuously adopt modern learning methodologies." },
  { icon: Sparkles, t: "Professionalism", d: "We uphold discipline and ethical conduct." },
  { icon: Handshake, t: "Collaboration", d: "Meaningful learning is built through teamwork." },
  { icon: Zap, t: "Continuous Learning", d: "We encourage curiosity and lifelong growth." },
];

const About = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about/#webpage`,
    "url": `${SITE_URL}/about`,
    "name": PAGE_SEO.about.title,
    "description": PAGE_SEO.about.description,
    "isPartOf": { "@id": `${SITE_URL}/#website` },
    "about": { "@id": PRIMARY_ORG_ID }
  };

  return (
    <>
      <SEO
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        canonical={PAGE_SEO.about.canonical}
        ogImage={PAGE_SEO.about.ogImage}
        ogType={PAGE_SEO.about.ogType}
        schemas={[ORGANIZATION_SCHEMA, aboutSchema]}
      />
      <Breadcrumbs items={[{ label: "About Us" }]} />
      {/* GLASSMORPHIC HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#F0F5FA] via-[#F2FAFC] to-white pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-[#CCE0F5]" data-testid="about-hero">
        {/* Floating Glassmorphism Bubbles */}
        <GlassBubble size="w-48 h-48 sm:w-64 sm:h-64" className="-top-10 -left-10" delay={0} duration={7} />
        <GlassBubble size="w-40 h-40 sm:w-52 sm:h-52" className="top-1/4 -right-10" delay={1.5} duration={6} />
        <GlassBubble size="w-28 h-28 sm:w-36 sm:h-36" className="bottom-8 left-1/3" delay={3} duration={8} />

        {/* Large Glowing Ambient Spheres/Orbs */}
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#157082]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-20 w-[580px] h-[580px] rounded-full bg-[#003366]/15 blur-3xl pointer-events-none" />

        {/* Background Dot Grid */}
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center z-10">
          <span className="font-heading text-xs uppercase tracking-normal block mb-5 text-[#157082] font-black">
            About VOKTAA Solutions
          </span>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-[#003366] mb-4">
            <MaskLine>Communication changes</MaskLine>
            <MaskLine
              delay={0.15}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#003366] via-[#157082] to-[#68CEDB]"
            >
              destinies.
            </MaskLine>
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed mt-6 max-w-2xl mx-auto font-bold text-[#333333] text-center">
            That single observation, made across classrooms, training halls, and placement interviews in Guntur, Andhra Pradesh, is why VOKTAA SOLUTIONS exists.
          </p>

          {/* Glassmorphic Micro-Badge Card (Enlarged Size) */}
          <div className="mt-10 inline-flex items-center gap-4 bg-white/90 backdrop-blur-2xl border-2 border-[#CCE0F5] shadow-[0_20px_40px_rgba(21,112,130,0.18)] px-8 py-4 sm:px-10 sm:py-5 rounded-full text-sm sm:text-base font-mono font-black text-[#003366] uppercase tracking-widest hover:scale-105 transition-all">
            <Sparkles size={22} className="text-[#157082]" />
            <span>Empowering Careers & Leadership</span>
          </div>
        </div>
      </section>

      {/* ACRONYM SECTION WITH BUBBLE GLASS CARDS */}
      <section className="bg-gradient-to-br from-[#003366] via-[#157082] to-[#002244] text-white py-20 md:py-24 relative overflow-hidden" data-testid="acronym-section">
        {/* Floating Glass Bubbles */}
        <GlassBubble size="w-36 h-36" className="top-5 left-10" delay={0.5} duration={6} />
        <GlassBubble size="w-44 h-44" className="bottom-5 right-10" delay={2} duration={8} />
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
          <Reveal><SectionLabel dark className="block mb-3">The Meaning</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-extrabold text-white text-3xl md:text-5xl tracking-tight mb-12">
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-sky-200 to-cyan-300">VOKTAA</span> stands for.
            </h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {acronym.map((a, i) => (
              <StaggerItem key={i}>
                <div className="card-purple bg-white/15 backdrop-blur-2xl border-2 border-white/30 p-6 h-full flex flex-col items-center text-center rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.25)] hover:bg-white/25 hover:border-white/50 transition-all duration-300 group cursor-pointer">
                  <span className="font-heading font-black text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-teal-200 group-hover:scale-110 transition-transform duration-300">{a.l}</span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-teal-200 font-extrabold mt-3">{a.w}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* OUR STORY WITH AMBIENT GLASS CARDS */}
      <section className="relative bg-gradient-to-b from-white via-[#F0F5FA] to-[#F2FAFC] py-20 md:py-24 overflow-hidden" data-testid="story-section">
        {/* Floating Glass Bubbles */}
        <GlassBubble size="w-40 h-40" className="top-10 right-12" delay={1} duration={7} />
        <GlassBubble size="w-32 h-32" className="bottom-12 left-10" delay={2.5} duration={6} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-start z-10">
          <div>
            <Reveal><SectionLabel className="block mb-3">Our Story</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-[#003366] text-4xl md:text-5xl tracking-tight leading-tight mb-6">
                Born from what we saw in the classroom
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 text-[#333333] text-base sm:text-lg leading-relaxed font-medium text-left">
                <p className="text-left">Some students know more than they can say. Some graduates know exactly what to do but hesitate when asked to speak. Some teachers carry years of knowledge yet struggle to make it travel from their minds to their students. VOKTAA SOLUTIONS began with these realities.</p>
                <p className="text-left">VOKTAA SOLUTIONS was born in Guntur, Andhra Pradesh from that simple observation: communication changes destinies: sometimes quietly, sometimes all at once. An interview goes differently. A classroom responds differently. A child begins raising a hand that has stayed down for years.</p>
                <p className="text-left">We work across three core areas: Employability & Corporate Communication Training (including CRT) for engineering graduates, Public Speaking, Debate & Personality Development for school and college students, and Train-the-Trainer programmes for educators.</p>
              </div>
            </Reveal>
          </div>
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="card-purple bg-gradient-to-br from-[#003366] via-[#157082] to-[#002244] p-10 rounded-3xl text-white text-left relative overflow-hidden shadow-[0_20px_50px_rgba(21,112,130,0.3)] border border-[#CCE0F5]/40 backdrop-blur-2xl">
                <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />
                <div className="relative text-left">
                  <span className="font-heading font-bold text-6xl text-white/70 leading-none block text-left">“</span>
                  <p className="text-white text-base sm:text-lg leading-relaxed font-bold -mt-4 text-left">
                    Ours is a training culture, not a tuition culture. Conversations matter here. Participation matters. Practice matters even more.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card-purple bg-white/90 backdrop-blur-xl border border-[#CCE0F5] p-8 rounded-3xl shadow-lg text-left">
                <div className="w-12 h-12 flex items-center justify-center bg-[#157082] text-white rounded-xl shadow-md"><Sparkles size={22} /></div>
                <h3 className="font-heading font-bold text-2xl text-[#003366] mt-5">Speak. Shine. Succeed.</h3>
                <p className="text-[#333333] mt-3 text-base sm:text-lg leading-relaxed font-bold text-left">
                  Learners speak, present, discuss, question, disagree, rethink, and try again until confidence becomes second nature.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOUNDER'S MESSAGE, VISION & MISSION WITH CO-ORDINATOR DETAILS */}
      <section className="relative bg-[#F0F5FA] py-20 md:py-24 overflow-hidden" data-testid="founder-section">
        {/* Floating Glass Bubbles */}
        <GlassBubble size="w-48 h-48 sm:w-60 sm:h-60" className="-top-12 -left-12" delay={0} duration={8} />
        <GlassBubble size="w-36 h-36" className="bottom-8 right-10" delay={2} duration={7} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-3 gap-8 z-10">
          <Reveal className="lg:col-span-2">
            <div className="card-purple bg-white/90 backdrop-blur-2xl border-2 border-white/95 p-8 md:p-12 rounded-3xl h-full shadow-[0_20px_50px_rgba(0,51,102,0.15)] text-left">
              <SectionLabel className="block mb-4">Founder's Message</SectionLabel>
              <h2 className="font-heading font-bold text-[#003366] text-3xl md:text-4xl tracking-tight leading-tight mb-6">
                Welcome to VOKTAA Solutions
              </h2>
              <div className="space-y-5 text-[#333333] text-base sm:text-lg leading-relaxed font-medium text-left">
                <p>Every successful professional journey begins with confident communication, critical thinking, effective leadership, and continuous learning. VOKTAA SOLUTIONS was established to bridge the gap between academic education and industry expectations, because while technical knowledge creates opportunities, it is communication, professionalism, and adaptability that build lasting careers.</p>
                <p>Our training extends beyond the classroom. We focus on developing individuals who can excel in interviews, contribute effectively within teams, and lead with integrity. Our mission remains unwavering: to create confident communicators, skilled professionals, and future-ready leaders.</p>
              </div>
              
              {/* FOUNDER DETAILS */}
              <div className="mt-10 pt-8 border-t border-[#CCE0F5] text-left">
                <div>
                  <p className="font-heading font-black text-[#003366] text-xl md:text-2xl">P. RAJA SEKHAR</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#157082] font-extrabold mt-1">Founder & Director, VOKTAA Solutions</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="card-purple bg-gradient-to-br from-[#003366] via-[#157082] to-[#002244] p-8 rounded-3xl text-white h-full shadow-[0_20px_45px_rgba(21,112,130,0.3)] border border-[#CCE0F5]/40 backdrop-blur-xl text-left">
                <SectionLabel dark className="block mb-4">Vision</SectionLabel>
                <p className="text-white text-base sm:text-lg leading-relaxed font-bold">
                  To become India's most trusted Corporate Learning and Employability Solutions organisation, empowering
                  individuals and institutions to achieve excellence through transformative learning experiences.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card-purple bg-gradient-to-br from-[#003366] via-[#157082] to-[#002244] p-8 rounded-3xl text-white shadow-[0_20px_45px_rgba(21,112,130,0.3)] border border-[#CCE0F5]/40 backdrop-blur-xl text-left">
                <SectionLabel dark className="block mb-4">Mission</SectionLabel>
                <ul className="space-y-3.5">
                  {mission.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-white text-base font-bold">
                      <CheckCircle2 size={18} className="text-teal-300 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CORE VALUES WITH GLASSMORPHISM BUBBLE ORBS */}
      <section className="relative bg-gradient-to-br from-[#F0F5FA] via-[#F2FAFC] to-white py-20 md:py-28 overflow-hidden" data-testid="values-section">
        {/* Floating Glass Bubbles */}
        <GlassBubble size="w-44 h-44" className="top-10 left-8" delay={1} duration={7} />
        <GlassBubble size="w-36 h-36" className="bottom-10 right-10" delay={3} duration={6} />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10 text-left">
          <Reveal><SectionLabel className="block mb-3">What We Stand For</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-black text-[#003366] text-4xl md:text-5xl tracking-tight mb-14">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#157082]">Values</span>
            </h2>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <div className="card-purple bg-white/90 backdrop-blur-2xl border-2 border-white/95 p-8 h-full rounded-3xl shadow-[0_20px_45px_rgba(0,51,102,0.12)] hover:shadow-[0_30px_60px_rgba(0,51,102,0.22)] hover:-translate-y-2 transition-all duration-300 group cursor-pointer text-left">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#F0F5FA] text-[#157082] rounded-2xl shadow-inner group-hover:scale-110 group-hover:bg-[#157082] group-hover:text-white transition-all duration-300">
                    <v.icon size={26} className="stroke-[2.2]" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-[#003366] mt-6 tracking-tight">{v.t}</h3>
                  <p className="text-[#333333] text-base sm:text-lg mt-3 leading-relaxed font-bold">{v.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA BANNER WITH GLASSMORPHIC GLOW */}
      <section className="bg-gradient-to-r from-[#003366] via-[#157082] to-[#002244] py-20 md:py-24 relative overflow-hidden text-white">
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <h2 className="font-heading font-extrabold text-white text-3xl md:text-4xl tracking-tight leading-tight">
            Want to know how VOKTAA can work with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-sky-200 to-cyan-300">institution or team?</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <GoldLink to="/institutions" track={{ category: "cta", label: "about-for-institutions" }}>For Institutions <ArrowRight size={18} className="ml-2" /></GoldLink>
            <OutlineLink to="/contact" dark track={{ category: "cta", label: "about-contact" }}>Contact Us</OutlineLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
