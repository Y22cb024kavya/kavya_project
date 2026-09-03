import React, { useEffect } from "react";
import { CheckCircle2, ArrowRight, Award, Sparkles, Handshake, Zap, Lightbulb, ShieldCheck } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem, MaskLine } from "../components/Reveal";
import { SectionLabel, GoldLink, OutlineLink } from "../components/shared";

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
  useEffect(() => { document.title = "About Us | VOKTAA Solutions"; }, []);

  return (
    <>
      {/* GLASSMORPHIC HERO SECTION MATCHING USER REFERENCE IMAGE media_1788437508822.png */}
      <section className="relative bg-gradient-to-br from-purple-100/80 via-indigo-50/50 to-cyan-100/60 pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden border-b border-purple-100/80" data-testid="about-hero">
        {/* Large Glowing Ambient Spheres/Orbs matching media_1788437508822.png */}
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-400/45 via-purple-300/35 to-indigo-300/20 blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-20 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-cyan-400/40 via-sky-300/30 to-indigo-400/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-indigo-300/30 blur-3xl pointer-events-none" />

        {/* Background Dot Grid */}
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center z-10">
          <span className="font-mono text-xs uppercase tracking-[0.3em] block mb-5 text-purple-700 font-extrabold">
            About VOKTAA Solutions
          </span>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-purple-950 mb-4">
            <MaskLine>Communication changes</MaskLine>
            <MaskLine
              delay={0.15}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 drop-shadow-[0_8px_20px_rgba(108,92,231,0.25)]"
            >
              destinies.
            </MaskLine>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mt-6 max-w-2xl mx-auto font-medium text-purple-900/80">
            That single observation, made across classrooms, training halls, and placement interviews in Guntur, Andhra Pradesh, is why VOKTAA SOLUTIONS exists.
          </p>

          {/* Glassmorphic Micro-Badge Card */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white/75 backdrop-blur-2xl border border-white/90 shadow-[0_15px_35px_rgba(108,92,231,0.15)] px-6 py-3 rounded-full text-xs font-mono font-bold text-purple-950 uppercase tracking-widest">
            <Sparkles size={16} className="text-purple-600" />
            <span>Empowering Careers & Leadership</span>
          </div>
        </div>
      </section>

      {/* ACRONYM SECTION WITH GLASSMORPHIC GLOW CARDS */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white py-20 md:py-24 relative overflow-hidden" data-testid="acronym-section">
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
          <Reveal><SectionLabel dark className="block mb-3">The Meaning</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-extrabold text-white text-3xl md:text-4xl tracking-tight mb-12">
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">VOKTAA</span> stands for.
            </h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {acronym.map((a, i) => (
              <StaggerItem key={i}>
                <div className="card-purple bg-white/10 backdrop-blur-xl border border-white/20 p-6 h-full flex flex-col items-center text-center rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                  <span className="font-heading font-black text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-300 group-hover:scale-110 transition-transform duration-300">{a.l}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-purple-200 font-bold mt-3">{a.w}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* OUR STORY WITH AMBIENT GLASS CARDS */}
      <section className="relative bg-gradient-to-b from-white via-purple-50/30 to-purple-100/40 py-20 md:py-28 overflow-hidden" data-testid="story-section">
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-start z-10">
          <div>
            <Reveal><SectionLabel className="block mb-3">Our Story</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight leading-tight mb-6">
                Born from what we saw in the room
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-4 text-purple-900/80 text-lg leading-relaxed text-justify font-medium">
                <p>Some students know more than they can say. Some graduates know exactly what to do but hesitate when asked to speak. Some teachers carry years of knowledge yet struggle to make it travel from their minds to their students. VOKTAA SOLUTIONS began with these realities.</p>
                <p>We grew out of a simple observation: communication changes destinies: sometimes quietly, sometimes all at once. An interview goes differently. A classroom responds differently. A child begins raising a hand that has stayed down for years.</p>
                <p>We work across three core areas: Employability & Corporate Communication Training (including CRT) for engineering graduates, Public Speaking, Debate & Personality Development for school and college students, and Train-the-Trainer programmes for educators.</p>
              </div>
            </Reveal>
          </div>
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="card-purple bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 p-10 rounded-3xl text-white relative overflow-hidden shadow-2xl border border-purple-400/30 backdrop-blur-2xl">
                <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />
                <div className="relative">
                  <span className="font-heading font-bold text-6xl text-purple-400/40 leading-none block">“</span>
                  <p className="font-heading text-xl md:text-2xl text-white leading-snug -mt-4">
                    Ours is a training culture, not a tuition culture. Conversations matter here. Participation matters. Practice matters even more.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card-purple bg-white/85 backdrop-blur-xl border border-purple-100 p-8 rounded-3xl shadow-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white rounded-xl shadow-md"><Sparkles size={22} /></div>
                <h3 className="font-heading font-bold text-2xl text-purple-950 mt-5">Speak. Shine. Succeed.</h3>
                <p className="text-purple-950/85 mt-3 leading-relaxed font-semibold">
                  Learners speak, present, discuss, question, disagree, rethink, and try again until confidence becomes second nature.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOUNDER'S MESSAGE, VISION & MISSION WITH GLASS CARDS */}
      <section className="bg-purple-50/50 py-20 md:py-28 relative overflow-hidden" data-testid="founder-section">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-3 gap-8 z-10">
          <Reveal className="lg:col-span-2">
            <div className="card-purple bg-white/90 backdrop-blur-2xl border border-purple-100 p-8 md:p-12 rounded-3xl h-full shadow-lg">
              <SectionLabel className="block mb-4">Founder's Message</SectionLabel>
              <h2 className="font-heading font-bold text-purple-950 text-3xl md:text-4xl tracking-tight leading-tight mb-6">
                Welcome to VOKTAA Solutions
              </h2>
              <div className="space-y-4 text-purple-900/85 leading-relaxed text-justify font-medium">
                <p>Every successful professional journey begins with confident communication, critical thinking, effective leadership, and continuous learning. VOKTAA SOLUTIONS was established to bridge the gap between academic education and industry expectations, because while technical knowledge creates opportunities, it is communication, professionalism, and adaptability that build lasting careers.</p>
                <p>Our training extends beyond the classroom. We focus on developing individuals who can excel in interviews, contribute effectively within teams, and lead with integrity. Our mission remains unwavering: to create confident communicators, skilled professionals, and future-ready leaders.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-purple-100">
                <p className="font-heading font-extrabold text-purple-950 text-xl">P. RAJA SEKHAR</p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-600 font-bold mt-1">Founder & Director, VOKTAA Solutions</p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="card-purple bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 p-8 rounded-3xl text-white h-full shadow-xl border border-purple-400/30 backdrop-blur-xl">
                <SectionLabel dark className="block mb-4">Vision</SectionLabel>
                <p className="text-white font-heading text-lg md:text-xl leading-snug">
                  To become India's most trusted Corporate Learning and Employability Solutions organisation, empowering
                  individuals and institutions to achieve excellence through transformative learning experiences.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card-purple bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 p-8 rounded-3xl text-white shadow-xl border border-purple-400/30 backdrop-blur-xl">
                <SectionLabel dark className="block mb-4">Mission</SectionLabel>
                <ul className="space-y-3">
                  {mission.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-purple-100 text-sm font-medium">
                      <CheckCircle2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CORE VALUES WITH GLASSMORPHISM AMBIENT ORBS & CRISP HIGH-CONTRAST TEXT */}
      <section className="relative bg-gradient-to-br from-purple-100/70 via-indigo-50/40 to-cyan-50/50 py-20 md:py-28 overflow-hidden" data-testid="values-section">
        {/* Ambient Glowing Color Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
          <Reveal><SectionLabel className="block mb-3">What We Stand For</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-black text-purple-950 text-4xl md:text-5xl tracking-tight mb-14">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Values</span>
            </h2>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <div className="card-purple bg-white/85 backdrop-blur-2xl border-2 border-white/95 p-8 h-full rounded-3xl shadow-[0_20px_45px_rgba(108,92,231,0.14)] hover:shadow-[0_30px_60px_rgba(108,92,231,0.25)] hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                  <div className="w-14 h-14 flex items-center justify-center bg-purple-100/90 text-purple-600 rounded-2xl shadow-inner group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <v.icon size={26} className="stroke-[2.2]" />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-purple-950 mt-6 tracking-tight">{v.t}</h3>
                  <p className="text-purple-950/85 text-sm sm:text-base mt-3 leading-relaxed font-semibold">{v.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA BANNER WITH GLASSMORPHIC GLOW */}
      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 py-20 md:py-24 relative overflow-hidden text-white">
        <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <h2 className="font-heading font-extrabold text-white text-3xl md:text-4xl tracking-tight leading-tight">
            Want to know how VOKTAA can work with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">institution or team?</span>
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
