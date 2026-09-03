import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, GraduationCap, MessageSquare, Building2, UserCog, School, Users2, Briefcase, ShieldCheck, CheckCircle2 } from "lucide-react";
import Marquee from "react-fast-marquee";
import { MaskLine, Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, GoldLink, OutlineLink } from "../components/shared";
import HeroWave from "../components/HeroWave";

const pills = ["Soft Skills", "Campus Recruitment Training (CRT)", "Employability Skills"];

const programs = [
  { icon: GraduationCap, t: "Campus Recruitment Training", d: "Interview-ready communication and workplace presence for engineering graduates." },
  { icon: MessageSquare, t: "Soft Skills Development", d: "Public speaking, debate, and confidence-building for school and college students." },
  { icon: Building2, t: "Corporate Training", d: "Communication and leadership programmes for HR teams and working professionals." },
  { icon: UserCog, t: "Train-the-Trainer", d: "Classroom communication upskilling for educators and internal L&D teams." },
];

const why = [
  "Industry-focused learning",
  "Experienced trainers",
  "Practical, activity-based methodology",
  "Customised corporate programmes",
  "Student-centred approach",
  "Measurable learning outcomes",
  "Strong academic and industry partnerships",
  "Commitment to continuous improvement",
];

const stats = [
  // Hidden until real numbers are available — restore when ready.
  // { n: "[X]+", label: "Students Trained" },
  // { n: "[Y]+", label: "Institutions Partnered" },
  // { n: "[Z]+", label: "Sessions Delivered" },
  { n: "Guntur, AP", label: "Base" },
];

const serve = [
  { icon: School, t: "Educational Institutions", d: "Engineering & degree colleges, universities, polytechnics." },
  { icon: Users2, t: "Students", d: "Undergraduates, final-years, fresh graduates, job aspirants." },
  { icon: Briefcase, t: "Corporate Organisations", d: "HR teams, L&D departments, managers." },
  { icon: ShieldCheck, t: "Government & Agencies", d: "Skill missions, training institutes, NGOs." },
];

// Placeholder placements — replace with real ones as they come in.
const placements = [
  { name: "[Student Name]", company: "[Company]", role: "[Role]" },
  { name: "[Student Name]", company: "[Company]", role: "[Role]" },
  { name: "[Student Name]", company: "[Company]", role: "[Role]" },
  { name: "[Student Name]", company: "[Company]", role: "[Role]" },
  { name: "[Student Name]", company: "[Company]", role: "[Role]" },
];

const Home = () => {
  useEffect(() => { document.title = "VOKTAA — Speak. Shine. Succeed."; }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const curveY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative bg-navy-deep pt-32 md:pt-40 pb-0 overflow-hidden" data-testid="hero-section">
        <motion.div style={{ y: gridY }} className="absolute inset-0 dot-grid dot-grid-fade opacity-70" />
        {/* skyline silhouette */}
        <svg viewBox="0 0 1200 90" className="absolute bottom-0 inset-x-0 w-full text-white/[0.04]" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 90 V60 L40 60 L40 30 L70 30 L70 55 L110 55 L110 20 L140 20 L140 10 L170 10 L170 45 L210 45 L210 25 L250 25 L250 55 L300 55 L300 15 L340 15 L340 45 L390 45 L390 30 L430 30 L430 55 L480 55 L480 20 L520 20 L520 40 L560 40 L560 15 L600 15 L600 45 L650 45 L650 25 L690 25 L690 55 L730 55 L730 15 L780 15 L780 40 L820 40 L820 25 L860 25 L860 55 L900 55 L900 20 L940 20 L940 45 L980 45 L980 30 L1020 30 L1020 55 L1070 55 L1070 20 L1110 20 L1110 45 L1160 45 L1160 30 L1200 30 L1200 90 Z" />
        </svg>

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 min-h-[72vh] pb-40 md:pb-48 flex flex-col justify-center text-center items-center" data-testid="hero-content">
          <div>
            <Reveal>
              <SectionLabel dark className="block mb-6">— Corporate Learning & Employability Solutions</SectionLabel>
            </Reveal>
            <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1] whitespace-nowrap">
              <MaskLine>Speak. <span className="text-gold">Shine.</span> Succeed.</MaskLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-white/70 text-lg md:text-xl leading-relaxed mt-8 max-w-2xl mx-auto"
            >
              VOKTAA SOLUTIONS helps engineering graduates, college students, educators, and corporate teams
              communicate with confidence, think critically, and lead effectively — turning potential into performance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8 }}
              className="flex flex-wrap gap-3 mt-8 justify-center"
              data-testid="hero-tags"
            >
              {pills.map((p) => (
                <span key={p} className="font-mono text-[11px] uppercase tracking-[0.15em] border border-gold/50 text-gold px-3 py-1.5 rounded-md">
                  {p}
                </span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="flex flex-wrap gap-4 mt-8 justify-center"
            >
              <GoldLink to="/programs" track={{ category: "cta", label: "explore-programmes-hero" }} data-testid="hero-explore-button">
                Explore Programmes <ArrowRight size={18} className="ml-2" />
              </GoldLink>
              <OutlineLink to="/contact" dark track={{ category: "cta", label: "book-demo-hero" }} data-testid="hero-demo-button">
                Book a Free Demo
              </OutlineLink>
            </motion.div>
          </div>
        </div>
        <HeroWave />
      </section>

      {/* WHO WE ARE */}
      <section className="bg-ivory py-24 md:py-32" data-testid="who-we-are">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><SectionLabel className="block mb-3">Who We Are</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight leading-tight">
                Communication changes <span className="text-gold">destinies.</span>
              </h2>
            </Reveal>
            <div className="w-12 h-[3px] bg-gold my-6" />
            <Reveal delay={0.1}>
              <p className="text-ink/75 text-lg leading-relaxed">
                VOKTAA SOLUTIONS was born in Guntur, Andhra Pradesh from that simple observation. We work across three
                core areas — Employability & Corporate Communication Training for engineering graduates, Public Speaking
                and Personality Development for students, and Train-the-Trainer programmes for educators.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-ink/75 text-lg leading-relaxed mt-4">
                Ours is a training culture, not a tuition culture. Learners speak, present, discuss, question, and
                practise until confidence becomes second nature.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <OutlineLink to="/about" track={{ category: "cta", label: "read-our-story" }}>Read Our Story <ArrowRight size={16} className="ml-2" /></OutlineLink>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="card-gold bg-navy-deep p-10 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
              <div className="relative">
                <span className="font-heading font-bold text-6xl text-gold/40 leading-none block">“</span>
                <p className="font-heading text-xl md:text-2xl text-white leading-snug -mt-4">
                  Learning is not merely about acquiring knowledge; it is about transforming potential into performance.
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mt-6">— VOKTAA Solutions</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="bg-white py-24 md:py-32" data-testid="programs-preview-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">What We Do</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight leading-tight">
              Programmes built for real-world outcomes
            </h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold my-6" />
          <Reveal delay={0.1}>
            <p className="text-ink/70 text-lg max-w-2xl mb-14">
              From campus placements to corporate leadership — every VOKTAA programme is built on one principle:
              practice creates confidence.
            </p>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {programs.map((p, i) => (
              <StaggerItem key={i}>
                <div className="card-gold bg-ivory border border-black/5 p-7 h-full rounded-xl" data-testid={`home-program-${i}`}>
                  <div className="w-12 h-12 flex items-center justify-center bg-gold/15 text-gold rounded-xl"><p.icon size={22} /></div>
                  <h3 className="font-heading font-bold text-lg text-navy mt-5 leading-tight">{p.t}</h3>
                  <p className="text-ink/70 text-sm mt-3 leading-relaxed">{p.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <div className="mt-10">
            <OutlineLink to="/programs" track={{ category: "cta", label: "view-all-programmes" }}>View All Programmes <ArrowRight size={16} className="ml-2" /></OutlineLink>
          </div>
        </div>
      </section>

      {/* WHY VOKTAA */}
      <section className="bg-navy-deep py-24 md:py-32 relative overflow-hidden" data-testid="why-voktaa">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel dark className="block mb-3">Why VOKTAA</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl tracking-tight">What sets our training apart</h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold my-6" />
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
            {why.map((p, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-3 bg-navy border border-white/10 p-4 rounded-xl">
                  <CheckCircle2 size={18} className="text-gold mt-0.5 shrink-0" />
                  <span className="text-white/85">{p}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="flex flex-wrap gap-4 mt-14 pt-10 border-t border-white/10">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div>
                  <div className="font-heading font-bold text-3xl md:text-4xl text-gold tracking-tight">{s.n}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 mt-2">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="bg-ivory py-24 md:py-32" data-testid="who-we-serve">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">Who We Serve</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight">Trusted across education, industry, and government</h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold my-6 mb-14" />
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {serve.map((s, i) => (
              <StaggerItem key={i}>
                <div className="card-gold bg-white border border-black/5 p-7 h-full rounded-xl">
                  <div className="w-12 h-12 flex items-center justify-center bg-gold/15 text-gold rounded-xl"><s.icon size={22} /></div>
                  <h3 className="font-heading font-bold text-lg text-navy mt-5 leading-tight">{s.t}</h3>
                  <p className="text-ink/70 text-sm mt-3 leading-relaxed">{s.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* RECENT PLACEMENTS STRIP */}
      <section className="bg-navy-deep py-14 md:py-16 relative overflow-hidden border-y border-gold/20" data-testid="placements-strip">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel dark className="block mb-2">Recent Placements</SectionLabel>
            <h3 className="font-heading font-bold text-white text-2xl md:text-3xl tracking-tight">Where our students are going.</h3>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Updated as new offers roll in</p>
        </div>
        <Marquee speed={40} gradient={false} autoFill pauseOnHover>
          {placements.map((p, i) => (
            <div key={i} className="mx-3 flex items-center gap-4 border-t-[3px] border-t-gold bg-navy border border-white/10 px-6 py-4 rounded-xl min-w-[280px]">
              <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center font-heading font-bold text-sm shrink-0">
                {(p.name.match(/[A-Z]/g) || ["V"])[0]}
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm leading-tight">{p.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mt-1">
                  {p.role} <span className="text-white/40">·</span> {p.company}
                </p>
              </div>
            </div>
          ))}
        </Marquee>
      </section>

      {/* CTA BANNER */}
      <section className="bg-white py-20 md:py-24" data-testid="cta-band">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="card-gold bg-ivory border border-black/5 p-10 md:p-14 rounded-2xl text-center">
            <h2 className="font-heading font-bold text-navy text-3xl md:text-5xl tracking-tight leading-tight">
              Ready to build a confident, <span className="text-gold">work-ready workforce?</span>
            </h2>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <GoldLink to="/institutions" track={{ category: "cta", label: "invite-campus" }}>Invite Us to Your Campus <ArrowRight size={18} className="ml-2" /></GoldLink>
              <OutlineLink to="/programs" track={{ category: "cta", label: "see-programmes-cta" }}>See Programmes</OutlineLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
