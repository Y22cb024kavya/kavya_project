import React, { useEffect } from "react";
import { CheckCircle2, ArrowRight, Award, Sparkles, Handshake, Zap, Lightbulb, ShieldCheck } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, PageHero, GoldLink, OutlineLink } from "../components/shared";

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
      <PageHero
        testid="about-hero"
        label="About Us"
        title="Communication changes"
        gold="destinies."
        subtitle="That single observation, made across classrooms, training halls, and placement interviews in Guntur, Andhra Pradesh, is why VOKTAA SOLUTIONS exists."
      />

      {/* ACRONYM */}
      <section className="bg-navy py-24 md:py-28" data-testid="acronym-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel dark className="block mb-3">The Meaning</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-white text-3xl md:text-4xl tracking-tight">
              What <span className="text-gold">VOKTAA</span> stands for.
            </h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold my-6 mb-12" />
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {acronym.map((a, i) => (
              <StaggerItem key={i}>
                <div className="card-gold bg-navy-deep border border-white/10 p-6 h-full flex flex-col items-center text-center rounded-xl">
                  <span className="font-heading font-bold text-5xl md:text-6xl text-gold">{a.l}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 mt-3">{a.w}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-white py-24 md:py-32" data-testid="story-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Reveal><SectionLabel className="block mb-3">Our Story</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight leading-tight">
                Born from what we saw in the room
              </h2>
            </Reveal>
            <div className="w-12 h-[3px] bg-gold my-6" />
            <Reveal delay={0.1}>
              <div className="space-y-4 text-ink/80 text-lg leading-relaxed">
                <p>Some students know more than they can say. Some graduates know exactly what to do but hesitate when asked to speak. Some teachers carry years of knowledge yet struggle to make it travel from their minds to their students. VOKTAA SOLUTIONS began with these realities.</p>
                <p>We grew out of a simple observation: communication changes destinies — sometimes quietly, sometimes all at once. An interview goes differently. A classroom responds differently. A child begins raising a hand that has stayed down for years.</p>
                <p>We work across three core areas: Employability & Corporate Communication Training (including CRT) for engineering graduates, Public Speaking, Debate & Personality Development for school and college students, and Train-the-Trainer programmes for educators.</p>
              </div>
            </Reveal>
          </div>
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="card-gold bg-navy-deep p-10 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
                <div className="relative">
                  <span className="font-heading font-bold text-6xl text-gold/40 leading-none block">“</span>
                  <p className="font-heading text-xl md:text-2xl text-white leading-snug -mt-4">
                    Ours is a training culture, not a tuition culture. Conversations matter here. Participation matters. Practice matters even more.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card-gold bg-ivory border border-black/5 p-8 rounded-2xl">
                <div className="w-12 h-12 flex items-center justify-center bg-gold text-navy-deep rounded-xl"><Sparkles size={22} /></div>
                <h3 className="font-heading font-bold text-2xl text-navy mt-5">Speak. Shine. Succeed.</h3>
                <p className="text-ink/75 mt-3 leading-relaxed">
                  Learners speak, present, discuss, question, disagree, rethink, and try again — until confidence becomes second nature.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOUNDER'S MESSAGE */}
      <section className="bg-ivory py-24 md:py-32" data-testid="founder-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-3 gap-8">
          <Reveal className="lg:col-span-2">
            <div className="card-gold bg-white border border-black/5 p-8 md:p-12 rounded-2xl h-full">
              <SectionLabel className="block mb-4">Founder's Message</SectionLabel>
              <h2 className="font-heading font-bold text-navy text-3xl md:text-4xl tracking-tight leading-tight">
                Welcome to VOKTAA Solutions
              </h2>
              <div className="w-12 h-[3px] bg-gold my-6" />
              <div className="space-y-4 text-ink/80 leading-relaxed">
                <p>Every successful professional journey begins with confident communication, critical thinking, effective leadership, and continuous learning. VOKTAA SOLUTIONS was established to bridge the gap between academic education and industry expectations — because while technical knowledge creates opportunities, it is communication, professionalism, and adaptability that build lasting careers.</p>
                <p>Our training extends beyond the classroom. We focus on developing individuals who can excel in interviews, contribute effectively within teams, and lead with integrity. Our mission remains unwavering: to create confident communicators, skilled professionals, and future-ready leaders.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-black/10">
                <p className="font-heading font-bold text-navy text-xl">P. RAJA SEKHAR</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mt-1">Founder & Director, VOKTAA Solutions</p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="card-gold bg-navy-deep p-8 rounded-2xl h-full">
                <SectionLabel dark className="block mb-4">Vision</SectionLabel>
                <p className="text-white font-heading text-lg md:text-xl leading-snug">
                  To become India's most trusted Corporate Learning and Employability Solutions organisation, empowering
                  individuals and institutions to achieve excellence through transformative learning experiences.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card-gold bg-navy p-8 rounded-2xl">
                <SectionLabel dark className="block mb-4">Mission</SectionLabel>
                <ul className="space-y-3">
                  {mission.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/85 text-sm">
                      <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-white py-24 md:py-32" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">What We Stand For</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight">Our Core Values</h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold my-6 mb-14" />
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <div className="card-gold bg-ivory border border-black/5 p-7 h-full rounded-xl">
                  <div className="w-12 h-12 flex items-center justify-center bg-gold/15 text-gold rounded-xl"><v.icon size={22} /></div>
                  <h3 className="font-heading font-bold text-lg text-navy mt-5">{v.t}</h3>
                  <p className="text-ink/70 text-sm mt-3 leading-relaxed">{v.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-navy-deep py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl tracking-tight leading-tight">
            Want to know how VOKTAA can work with your <span className="text-gold">institution or team?</span>
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
