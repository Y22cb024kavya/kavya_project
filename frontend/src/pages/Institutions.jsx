import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Building2, Users2, School, ShieldCheck, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem, MaskLine } from "../components/Reveal";
import { SectionLabel, GoldLink, OutlineLink } from "../components/shared";

const whyPoints = [
  "Customised curriculum matching student skill levels and target companies",
  "Pre- and post-training assessments with detailed feedback reports",
  "Activity-driven methodology focused on practice, not passive listening",
  "Experienced trainers with industry and corporate backgrounds",
  "Flexible delivery options: on-campus, hybrid, or online workshops",
  "End-to-end management, from schedule alignment to progress tracking",
];

const steps = [
  { n: "01", t: "Initial Consultation", d: "Understanding your student profile, placement goals, and schedule." },
  { n: "02", t: "Needs Assessment", d: "Evaluating current skill levels to benchmark progress." },
  { n: "03", t: "Custom Proposal", d: "Designing a module with clear learning outcomes and schedule." },
  { n: "04", t: "Program Delivery", d: "Interactive, activity-driven sessions led by senior trainers." },
  { n: "05", t: "Feedback & Report", d: "Post-training assessment and cell recommendations." },
];

const serveList = [
  { icon: School, t: "Engineering & Degree Colleges", d: "CRT, soft skills, interview prep, and career readiness." },
  { icon: Building2, t: "Universities & Autonomous Institutions", d: "Multi-batch programmes and faculty development." },
  { icon: Users2, t: "Corporate L&D Teams", d: "Communication, etiquette, and leadership for employees." },
  { icon: ShieldCheck, t: "Government & Skill Missions", d: "Employability drives and train-the-trainer initiatives." },
];

// 3 Distinct Institutional Showcase Photos for the Carousel
const heroImages = [
  {
    src: "/serve_institutions_clean.jpg",
    title: "Campus Recruitment & Placement Drive",
    badge: "01 • Campus Drive"
  },
  {
    src: "/fdp_faculty_training.jpg",
    title: "Faculty Development & Pedagogical Upskilling",
    badge: "02 • Educator Upskilling"
  },
  {
    src: "/serve_corporate_clean.jpg",
    title: "Corporate & Institutional Skill Alignment",
    badge: "03 • Executive L&D"
  }
];

const Institutions = () => {
  useEffect(() => { document.title = "For Institutions | VOKTAA Solutions"; }, []);

  // 3-Image Auto Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <>
      {/* HERO SECTION WITH 3-IMAGE CAROUSEL BESIDE TEXT MATCHING USER REQUEST */}
      <section className="relative bg-gradient-to-br from-purple-100/70 via-indigo-50/40 to-cyan-50/50 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-purple-100/80" data-testid="institutions-hero">
        {/* Ambient Glowing Color Orbs */}
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-purple-300/35 blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-20 w-[520px] h-[520px] rounded-full bg-cyan-300/30 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 items-center z-10">
          {/* Left Column: Left-Aligned Text */}
          <div className="lg:col-span-7 text-left">
            <span className="font-heading text-xs uppercase tracking-normal text-purple-600 font-bold block mb-4">
              For Institutions
            </span>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-purple-950 mb-5">
              <MaskLine>Partner with us to build an</MaskLine>
              <MaskLine
                delay={0.15}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 block mt-1"
              >
                industry-confident student body.
              </MaskLine>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-purple-900/80 max-w-2xl text-left font-medium mb-8">
              A partnership designed for Training & Placement Officers, HR heads, and academic decision-makers who want measurable results, not just a workshop.
            </p>

            <div className="flex flex-wrap gap-4">
              <GoldLink to="/contact" track={{ category: "cta", label: "invite-demo-hero" }}>
                Invite Us for a Free Demo <ArrowRight size={18} className="ml-2" />
              </GoldLink>
              <OutlineLink to="/programs" track={{ category: "cta", label: "explore-modules-hero" }}>
                Explore Modules
              </OutlineLink>
            </div>
          </div>

          {/* Right Column: 3-Image Auto Carousel Showcase Beside Text */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full relative bg-white/85 backdrop-blur-2xl p-3 border-2 border-white/95 rounded-3xl shadow-[0_20px_50px_rgba(108,92,231,0.18)] overflow-hidden group">
              
              {/* Image Container with AnimatePresence */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={heroImages[currentSlide].src}
                      alt={heroImages[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-bold text-purple-950 tracking-wider shadow-md">
                      {heroImages[currentSlide].badge}
                    </div>

                    {/* Title Banner */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="font-heading font-bold text-base sm:text-lg text-white leading-snug drop-shadow-md">
                        {heroImages[currentSlide].title}
                      </h4>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Left / Right Arrow Controls */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-purple-950 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-purple-950 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Bottom Dot Navigators (3 Slides) */}
              <div className="flex items-center justify-center gap-2 pt-3 pb-1">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "w-8 bg-purple-600" : "w-2.5 bg-purple-200 hover:bg-purple-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-purple-50/40 pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">Why Institutions Choose Us</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight mb-12">What partnering with VOKTAA looks like</h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyPoints.map((p, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 bg-white border border-purple-100 border-t-[3px] border-t-purple-600 p-5 rounded-2xl shadow-sm">
                  <CheckCircle2 size={20} className="text-purple-600 mt-0.5 shrink-0" />
                  <span className="text-purple-950/85 font-medium">{p}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="bg-white pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">How We Work</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight mb-14">A five-step engagement, start to finish</h2>
          </Reveal>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-[2px] bg-purple-200" />
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {steps.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-heading font-bold text-lg relative z-10 shadow-lg shadow-purple-500/25">
                      {s.n}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-purple-950 mt-5">{s.t}</h3>
                    <p className="text-purple-900/70 text-sm mt-2 leading-relaxed">{s.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="bg-purple-50/40 pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">Who We Serve</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight mb-12">Tailored for every academic level</h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serveList.map((s, i) => (
              <StaggerItem key={i}>
                <div className="bg-white border border-purple-100 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                      <s.icon size={22} />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-purple-950 mb-2">{s.t}</h3>
                    <p className="text-purple-900/70 text-sm leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
};

export default Institutions;
