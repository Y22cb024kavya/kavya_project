import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, GraduationCap, MessageSquare, Building2, UserCog, CheckCircle2, Play, Brain, TrendingUp, Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";
import { MaskLine, Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, GoldLink, OutlineLink } from "../components/shared";

const pills = [
  { icon: Sparkles, text: "SOFT SKILLS" },
  { icon: GraduationCap, text: "CAMPUS RECRUITMENT TRAINING (CRT)" },
  { icon: TrendingUp, text: "EMPLOYABILITY SKILLS" },
];

const programCategories = [
  {
    icon: GraduationCap,
    title: "Campus Recruitment Training (CRT)",
    bullets: [
      "Mock Interviews & Group Discussion (GD) Practice",
      "Resume Building, LinkedIn Profiling & Public Speaking",
      "Technical & HR Interview Preparation Strategy"
    ]
  },
  {
    icon: MessageSquare,
    title: "Soft Skills & Spoken English",
    bullets: [
      "Public Speaking, Debate & Stage Confidence",
      "Personality Development & Professional Etiquette",
      "Group Presentation Skills & Body Language Mastery"
    ]
  },
  {
    icon: Building2,
    title: "Corporate & Executive Training",
    bullets: [
      "Executive Business & Leadership Communication",
      "Cross-Functional Team Collaboration & Work Ethics",
      "Managerial Conduct & Workplace Professionalism"
    ]
  },
  {
    icon: UserCog,
    title: "Train-the-Trainer (Educator Upskilling)",
    bullets: [
      "Interactive Pedagogy & Active Classroom Management",
      "Modern Facilitation Techniques for Higher Ed",
      "Internal Corporate L&D Team Upskilling"
    ]
  }
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

const serve = [
  {
    t: "Educational Institutions",
    d: "Engineering & degree colleges, universities, polytechnics.",
    img: "/serve_institutions_clean.jpg"
  },
  {
    t: "Students",
    d: "Undergraduates, final-years, fresh graduates, job aspirants.",
    img: "/serve_students_clean.jpg"
  },
  {
    t: "Corporate Organisations",
    d: "HR teams, L&D departments, managers.",
    img: "/serve_corporate_clean.jpg"
  },
  {
    t: "Government & Agencies",
    d: "Skill missions, training institutes, NGOs.",
    img: "/serve_government_clean.jpg"
  },
];

const companyLogos = [
  {
    name: "Amazon",
    render: () => (
      <div className="flex flex-col items-center justify-center">
        <span className="font-heading font-black text-2xl tracking-tighter text-slate-900 leading-none">amazon</span>
        <svg viewBox="0 0 90 20" className="w-16 h-3.5 -mt-0.5" fill="none">
          <path d="M8 6 Q 45 20 82 4" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" />
          <path d="M75 2 L85 4 L80 12" stroke="#FF9900" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  },
  {
    name: "Cognizant",
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 rotate-45 flex items-center justify-center shadow-sm">
          <div className="w-2.5 h-2.5 bg-white rounded-sm" />
        </div>
        <span className="font-heading font-bold text-xl text-slate-800 tracking-tight">cognizant</span>
      </div>
    )
  },
  {
    name: "Data Economy",
    render: () => (
      <div className="flex items-center gap-2">
        <div className="flex gap-1 items-end h-5">
          <div className="w-1.5 h-2.5 bg-rose-500 rounded-t-sm" />
          <div className="w-1.5 h-5 bg-amber-500 rounded-t-sm" />
          <div className="w-1.5 h-4 bg-emerald-500 rounded-t-sm" />
          <div className="w-1.5 h-6 bg-cyan-500 rounded-t-sm" />
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="font-heading font-extrabold text-xs text-slate-800 tracking-wider">DATA</span>
          <span className="font-heading font-semibold text-[9px] text-slate-500 tracking-widest mt-0.5">ECONOMY</span>
        </div>
      </div>
    )
  },
  {
    name: "TCS",
    render: () => (
      <div className="flex flex-col items-center leading-none">
        <span className="font-heading font-black text-2xl text-slate-900 tracking-tighter">tcs</span>
        <span className="font-mono text-[7px] font-bold text-slate-600 tracking-widest uppercase mt-1">TATA CONSULTANCY SERVICES</span>
      </div>
    )
  },
  {
    name: "THIS",
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 relative flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
          <div className="absolute top-0 right-0 w-1 h-1 rounded-full bg-indigo-500" />
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="font-heading font-black text-xl text-slate-900 tracking-wider">THIS</span>
          <span className="font-mono text-[6px] text-slate-500 tracking-tight">TONY HARRIS INTEGRATION</span>
        </div>
      </div>
    )
  },
  {
    name: "Accenture",
    render: () => (
      <div className="flex items-center gap-1">
        <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">accenture</span>
        <span className="text-purple-600 font-extrabold text-xl leading-none font-mono">&gt;</span>
      </div>
    )
  },
  {
    name: "Infosys",
    render: () => (
      <div className="flex items-center">
        <span className="font-heading font-bold text-2xl text-blue-600 tracking-tight">Infosys</span>
      </div>
    )
  },
  {
    name: "Wipro",
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-cyan-500 border-r-indigo-500 border-b-purple-500" />
        <span className="font-heading font-bold text-xl text-slate-800 tracking-wide">wipro</span>
      </div>
    )
  },
  {
    name: "Capgemini",
    render: () => (
      <div className="flex items-center gap-1.5">
        <span className="text-blue-600 font-bold text-lg">♠</span>
        <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">Capgemini</span>
      </div>
    )
  },
  {
    name: "Tech Mahindra",
    render: () => (
      <div className="flex flex-col items-center leading-none">
        <span className="font-heading font-bold text-sm text-red-600 tracking-tight">Tech</span>
        <span className="font-heading font-black text-base text-slate-900 tracking-wide">Mahindra</span>
      </div>
    )
  },
  {
    name: "HCL Tech",
    render: () => (
      <div className="flex items-center gap-1">
        <span className="font-heading font-black text-2xl text-blue-700 tracking-tighter">HCL</span>
        <span className="font-mono text-xs font-bold text-slate-600">Tech</span>
      </div>
    )
  },
  {
    name: "Deloitte",
    render: () => (
      <div className="flex items-center gap-0.5">
        <span className="font-heading font-bold text-2xl text-slate-900 tracking-tight">Deloitte</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500 self-end mb-1" />
      </div>
    )
  }
];

const Home = () => {
  useEffect(() => { document.title = "VOKTAA | Speak. Shine. Succeed."; }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <>
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative bg-gradient-to-b from-purple-100/70 via-purple-50/30 to-white pt-28 sm:pt-32 pb-8 md:pb-12 overflow-hidden" data-testid="hero-section">
        <motion.div style={{ y: gridY }} className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />

        {/* Ambient background glow elements */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center" data-testid="hero-content">
          {/* Left Column: Clean Headline, Description, Feature Pills & CTAs (Removed Image Card) */}
          <div className="lg:col-span-6 text-left relative z-10">
            <h1 className="font-heading font-bold text-purple-950 text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] mb-5">
              <MaskLine>
                Speak. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Shine.</span> Succeed.
              </MaskLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-purple-900/70 text-sm sm:text-base leading-relaxed mb-8 max-w-lg text-justify"
            >
              VOKTAA SOLUTIONS helps engineering graduates, college students, educators, and corporate teams
              communicate with confidence, think critically, and lead effectively to turn potential into performance.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              <GoldLink to="/programs" track={{ category: "cta", label: "explore-programmes-hero" }} data-testid="hero-explore-button">
                Explore Programmes <ArrowRight size={18} className="ml-2" />
              </GoldLink>
              <OutlineLink to="/contact" track={{ category: "cta", label: "book-demo-hero" }} data-testid="hero-demo-button" className="group">
                <span>Book a Free Demo</span>
                <span className="ml-3 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Play size={12} className="fill-current ml-0.5" />
                </span>
              </OutlineLink>
            </motion.div>
          </div>

          {/* Right Column: 3 Real Classroom Photo Cards Assembly Matching User Reference Image media_1788439319154.png */}
          <div className="lg:col-span-6 relative flex items-center justify-center overflow-visible">
            {/* Ambient Glowing Background Light */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-300/30 via-indigo-200/40 to-purple-300/30 rounded-full blur-3xl pointer-events-none" />

            {/* 3 Real Photo Cards Row with Numbered Badges 01, 02, 03 */}
            <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 w-full">
              {/* Card 01: Main Presentation Photo (Largest) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-3xl border-2 border-white shadow-xl overflow-hidden w-64 sm:w-80 h-72 sm:h-88 shrink-0 group cursor-pointer"
              >
                <img
                  src="/classroom_training.jpg"
                  alt="Practical Training 01"
                  className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent" />
                {/* Circle Badge 01 */}
                <div className="absolute bottom-4 left-4 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-purple-950 font-heading font-black text-sm sm:text-base flex items-center justify-center shadow-lg border border-purple-100">
                  01
                </div>
              </motion.div>

              {/* Card 02: Students Hands-On Practice (Medium Vertical) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8 }}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl border-2 border-white shadow-lg overflow-hidden w-36 sm:w-44 h-64 sm:h-80 shrink-0 group cursor-pointer"
              >
                <img
                  src="/interview_mock_gd.jpg"
                  alt="Practical Training 02"
                  className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-transparent" />
                {/* Circle Badge 02 */}
                <div className="absolute bottom-4 left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-purple-950 font-heading font-black text-xs sm:text-sm flex items-center justify-center shadow-lg border border-purple-100">
                  02
                </div>
              </motion.div>

              {/* Card 03: Interactive Session (Compact Vertical) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 35 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl border-2 border-white shadow-md overflow-hidden w-28 sm:w-36 h-56 sm:h-72 shrink-0 group cursor-pointer hidden sm:block"
              >
                <img
                  src="/leadership_development.jpg"
                  alt="Practical Training 03"
                  className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-transparent" />
                {/* Circle Badge 03 */}
                <div className="absolute bottom-4 left-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white text-purple-950 font-heading font-black text-xs flex items-center justify-center shadow-lg border border-purple-100">
                  03
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-white pt-12 md:pt-16 pb-6 md:pb-8" data-testid="who-we-are">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><SectionLabel className="block mb-3">Who We Are</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight leading-tight mb-6">
                Communication changes <span className="text-purple-600">destinies.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-purple-900/75 text-lg leading-relaxed text-justify">
                VOKTAA SOLUTIONS was born in Guntur, Andhra Pradesh from that simple observation. We work across three
                core areas: Employability & Corporate Communication Training for engineering graduates, Public Speaking
                and Personality Development for students, and Train-the-Trainer programmes for educators.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-purple-900/75 text-lg leading-relaxed mt-4 text-justify">
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
            <div className="card-purple bg-gradient-to-br from-purple-900 to-indigo-950 p-10 rounded-3xl text-white relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
              <div className="relative">
                <span className="font-heading font-bold text-6xl text-purple-400/40 leading-none block">“</span>
                <p className="font-heading text-xl md:text-2xl text-white leading-snug -mt-4">
                  Learning is not merely about acquiring knowledge; it is about transforming potential into performance.
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-300 mt-6">VOKTAA Solutions</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMMES - 2-COLUMN SPLIT SHOWCASE WITH REAL CLASSROOM TRAINING PHOTO */}
      <section className="bg-purple-50/40 pt-8 md:pt-12 pb-20 md:pb-28" data-testid="programs-preview-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">What We Do</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight leading-tight mb-6">
              Programmes built for real-world outcomes
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-purple-900/70 text-lg max-w-2xl mb-14 text-justify">
              From campus placements to corporate leadership, every VOKTAA programme is built on one principle:
              practice creates confidence.
            </p>
          </Reveal>

          {/* 2-COLUMN SPLIT GRID */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Showcase Card: Real Classroom Training Photo */}
            <div className="lg:col-span-5 flex">
              <Reveal className="w-full">
                <div className="card-purple bg-white border border-purple-100 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between relative h-full group min-h-[460px]">
                  <div className="relative h-full min-h-[460px] overflow-hidden flex flex-col justify-end p-8">
                    <img
                      src="/classroom_training.jpg"
                      alt="VOKTAA Practical Classroom Training"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/95 via-purple-950/45 to-purple-900/10" />

                    {/* Top Badge */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md text-purple-950 font-mono text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                        <Sparkles size={12} className="text-purple-600" />
                        Practical Training Culture
                      </span>
                    </div>

                    {/* Bottom Caption & Content */}
                    <div className="relative z-10 text-white mt-auto">
                      <h3 className="font-heading font-bold text-2xl text-white tracking-tight leading-snug">
                        Practical, Activity-Based Learning Architecture
                      </h3>
                      <p className="text-purple-200/90 text-sm mt-3 leading-relaxed text-justify">
                        Learners actively present, discuss, question, and practice under expert trainer supervision until workplace confidence becomes second nature.
                      </p>
                      <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-purple-200 uppercase tracking-widest">100% Activity-Driven</span>
                        <GoldLink to="/programs" track={{ category: "cta", label: "explore-left-image-card" }} className="!px-5 !py-2.5 !text-xs">
                          Explore Syllabus <ArrowRight size={14} className="ml-1" />
                        </GoldLink>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Vertical Program Category Cards matching user screenshot */}
            <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
              {programCategories.map((cat, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div className="card-purple bg-white border border-purple-100 border-l-4 border-l-purple-600 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-x-1 group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                        <cat.icon size={20} />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-purple-950 tracking-tight">{cat.title}</h3>
                    </div>

                    {/* Bullet List */}
                    <ul className="space-y-2.5 mt-4 ml-1">
                      {cat.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-purple-900/80 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <OutlineLink to="/programs" track={{ category: "cta", label: "view-all-programmes" }}>View Detailed Course Syllabus <ArrowRight size={16} className="ml-2" /></OutlineLink>
          </div>
        </div>
      </section>

      {/* WHY VOKTAA */}
      <section className="bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-950 py-20 md:py-28 relative overflow-hidden text-white" data-testid="why-voktaa">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel dark className="block mb-3">Why VOKTAA</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl tracking-tight mb-8">What sets our training apart</h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {why.map((p, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-3 bg-white/10 border border-white/15 p-4 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 size={18} className="text-purple-300 mt-0.5 shrink-0" />
                  <span className="text-purple-100">{p}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* WHO WE SERVE - FULL IMAGE OVERLAY CARDS WITHOUT ICONS */}
      <section className="bg-white py-20 md:py-28" data-testid="who-we-serve">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">Who We Serve</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight mb-12">
              Trusted across education, industry, and government
            </h2>
          </Reveal>

          {/* SINGLE ROW 4-COLUMN GRID */}
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serve.map((s, i) => (
              <StaggerItem key={i}>
                <div className="card-purple bg-purple-900 rounded-2xl overflow-hidden shadow-lg border border-purple-800 flex flex-col justify-end relative min-h-[360px] md:min-h-[400px] group hover:-translate-y-2 transition-all duration-300">
                  {/* Clean Background Photo without baked-in text */}
                  <img
                    src={s.img}
                    alt={s.t}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Smooth Dark Gradient Overlay for Maximum Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-900/40 to-transparent" />

                  {/* Overlaid Content Directly Inside Image Card (No Icons) */}
                  <div className="relative z-10 p-6 text-white flex flex-col justify-end">
                    <h3 className="font-heading font-bold text-xl text-white tracking-tight leading-snug">{s.t}</h3>
                    <p className="text-purple-200/90 text-xs sm:text-sm mt-2.5 leading-relaxed text-left font-medium">{s.d}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* SCROLLING COMPANY PLACEMENT CARDS */}
      <section className="bg-gradient-to-r from-purple-900/90 via-indigo-900/95 to-purple-900/90 py-16 md:py-20 relative overflow-hidden text-white" data-testid="placements-strip">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 mb-8 text-left">
          <Reveal><SectionLabel dark className="block mb-2">Recent Placements</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-white text-3xl md:text-5xl tracking-tight">Where our students are going.</h2>
          </Reveal>
        </div>

        {/* Smooth Scrolling Marquee of Corporate Company Tiles */}
        <div className="relative py-2">
          <Marquee speed={35} gradient={false} pauseOnHover autoFill>
            {companyLogos.map((comp, i) => (
              <div
                key={i}
                className="mx-3 bg-white border border-purple-100/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg flex items-center justify-center h-24 sm:h-28 w-44 sm:w-52 shrink-0 transition-all duration-300 hover:scale-105"
                data-testid={`company-tile-${comp.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <comp.render />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* COMPACT & ATTRACTIVE CTA BANNER WITH BRIGHT WHITE BUTTON TEXT */}
      <section className="bg-gradient-to-b from-white via-purple-50/40 to-purple-100/60 py-12 md:py-16 relative overflow-hidden" data-testid="cta-band">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="relative card-purple bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 border border-purple-700/60 p-8 sm:p-10 md:p-12 rounded-[2rem] text-center shadow-xl overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-200 font-mono text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-4 shadow-inner">
                <Sparkles size={12} className="text-purple-300" />
                PARTNER WITH VOKTAA SOLUTIONS
              </span>

              <h2 className="font-heading font-extrabold text-white text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug mb-4">
                Ready to build a confident,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
                  work-ready workforce?
                </span>
              </h2>

              <p className="text-purple-200/85 text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed font-medium">
                Elevate your students and team members with industry-proven CRT, soft skills, and leadership communication training.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
                <Link
                  to="/institutions"
                  className="inline-flex items-center justify-center font-heading font-bold px-6 py-3 rounded-xl text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/40 hover:scale-105 transition-all"
                >
                  Invite Us to Your Campus <ArrowRight size={16} className="ml-2" />
                </Link>
                <OutlineLink to="/programs" track={{ category: "cta", label: "see-programmes-cta" }} className="!py-3 !px-6 !text-xs sm:!text-sm font-bold !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 backdrop-blur-md">
                  See Programmes
                </OutlineLink>
              </div>

              {/* Bottom Feature Micro-Badges */}
              <div className="pt-6 border-t border-purple-800/60 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs text-purple-200/80 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Customised Campus Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Experienced Industry Trainers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Measurable Learning Outcomes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
