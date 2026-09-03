import React, { useEffect } from "react";
import { GraduationCap, MessageSquare, PenTool, Sparkles, Mic, ClipboardCheck, Compass, Users2, Building2, BookOpen, UserCog, ArrowRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, PageHero, GoldLink } from "../components/shared";

const programs = [
  { icon: GraduationCap, t: "Campus Recruitment Training (CRT)", d: "Interview skills, group discussions, and workplace communication built specifically for placement season — designed to get final-year students job-ready." },
  { icon: MessageSquare, t: "Soft Skills Development", d: "Foundational communication, teamwork, and interpersonal skills for students entering college life and, eventually, the workplace." },
  { icon: PenTool, t: "Communication Skills & Business Communication", d: "Professional writing, presentation, and verbal communication for students and working professionals alike." },
  { icon: Sparkles, t: "Personality Development", d: "Confidence-building, body language, and self-presentation for students who have ideas worth sharing and just need the stage." },
  { icon: Mic, t: "Public Speaking & Debate", d: "Structured practice in public speaking and argumentation for school and college students." },
  { icon: ClipboardCheck, t: "Interview Skills", d: "Mock interviews, common-question preparation, and real-time feedback to remove hesitation under pressure." },
  { icon: Compass, t: "Career Guidance Programme", d: "Helping students understand career pathways, aptitude, and next steps after graduation." },
  { icon: Users2, t: "Leadership Development", d: "Team management, decision-making, and workplace leadership for students and working professionals." },
  { icon: Building2, t: "Corporate Training", d: "Customised communication and professional-development sessions for HR teams, managers, and employees." },
  { icon: BookOpen, t: "Faculty Development Programmes", d: "Helping educators sharpen classroom delivery and student engagement." },
  { icon: UserCog, t: "Train-the-Trainer Programme", d: "Equipping educators and internal L&D teams to run their own communication-training sessions." },
];

const Programs = () => {
  useEffect(() => { document.title = "Programs | VOKTAA Solutions"; }, []);

  return (
    <>
      <PageHero
        testid="programs-hero"
        label="Our Programmes"
        title="Practice creates"
        gold="confidence."
        subtitle="From campus-ready communication to boardroom leadership, every VOKTAA programme is built on one principle. Explore our programmes below, or request a custom plan for your institution or organisation."
      />
      <section className="bg-navy-deep py-14 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <GoldLink to="/contact" track={{ category: "cta", label: "request-custom-plan" }} data-testid="request-custom-plan">
            Request a Custom Plan <ArrowRight size={18} className="ml-2" />
          </GoldLink>
        </div>
      </section>

      <section className="bg-ivory py-24 md:py-32" data-testid="programs-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <StaggerItem key={i}>
                <div className="card-gold bg-white border border-black/5 p-8 h-full rounded-xl" data-testid={`program-card-${i}`}>
                  <div className="w-12 h-12 flex items-center justify-center bg-gold/15 text-gold rounded-xl">
                    <p.icon size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-navy mt-6 leading-tight">{p.t}</h3>
                  <p className="text-ink/70 text-sm mt-3 leading-relaxed">{p.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* FORMATS */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><SectionLabel className="block mb-3">Formats</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight leading-tight">
                Built around your calendar, not the other way round.
              </h2>
            </Reveal>
            <div className="w-12 h-[3px] bg-gold my-6" />
            <Reveal delay={0.1}>
              <p className="text-ink/75 text-lg leading-relaxed">
                Programmes are available as single workshops, multi-day modules, or ongoing engagements — tailored to
                your institution's academic calendar or your organisation's training cycle. Specific durations and batch
                sizes are confirmed during consultation, based on your student or team profile.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="card-gold bg-navy-deep p-10 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
              <div className="relative">
                <span className="font-heading font-bold text-6xl text-gold/40 leading-none block">“</span>
                <p className="font-heading text-xl md:text-2xl text-white leading-snug -mt-4">
                  Practice creates confidence. Ours is a training culture, not a tuition culture — activity-driven,
                  interactive, and built for involvement, not instruction.
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mt-6">— VOKTAA Solutions</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-deep py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl tracking-tight">
            Not sure which programme fits your students or team?
          </h2>
          <div className="mt-8"><GoldLink to="/contact" track={{ category: "cta", label: "talk-to-us" }}>Talk to Us <ArrowRight size={18} className="ml-2" /></GoldLink></div>
        </div>
      </section>
    </>
  );
};

export default Programs;
