import React, { useEffect } from "react";
import { ArrowRight, CheckCircle2, Building2, Users2, School, ShieldCheck } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, PageHero, GoldLink, OutlineLink } from "../components/shared";

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

const Institutions = () => {
  useEffect(() => { document.title = "For Institutions | VOKTAA Solutions"; }, []);

  return (
    <>
      <PageHero
        testid="institutions-hero"
        label="For Institutions"
        title="Partner with us to build an"
        gold="industry-confident student body."
        subtitle="A partnership designed for Training & Placement Officers, HR heads, and academic decision-makers who want measurable results, not just a workshop."
      />

      <section className="bg-purple-950 py-12 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <GoldLink to="/contact" track={{ category: "cta", label: "invite-demo-institutions" }} data-testid="invite-demo-button">
            Invite Us for a Free Demo <ArrowRight size={18} className="ml-2" />
          </GoldLink>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-purple-50/40 py-20 md:py-28">
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
      <section className="bg-white py-20 md:py-28">
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
      <section className="bg-purple-50/40 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">Who We Serve</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight mb-12">Trusted across education, industry, and government</h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serveList.map((s, i) => (
              <StaggerItem key={i}>
                <div className="card-purple bg-white border border-purple-100 p-7 h-full rounded-2xl shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-xl"><s.icon size={22} /></div>
                  <h3 className="font-heading font-bold text-lg text-purple-950 mt-5 leading-tight">{s.t}</h3>
                  <p className="text-purple-900/70 text-sm mt-3 leading-relaxed">{s.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* NETWORK / GEOGRAPHY */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="card-purple bg-gradient-to-br from-purple-900 to-indigo-950 p-10 md:p-14 rounded-3xl text-white relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
              <div className="relative max-w-3xl">
                <SectionLabel dark className="block mb-3">Reach &amp; Network</SectionLabel>
                <h3 className="font-heading font-bold text-white text-3xl md:text-4xl tracking-tight">
                  Headquartered in Guntur, serving institutions across India.
                </h3>
                <p className="text-purple-200/80 text-lg mt-4 leading-relaxed">
                  While our primary training footprint spans Andhra Pradesh and Telangana, VOKTAA SOLUTIONS delivers
                  programmes nationwide through on-campus deployments and hybrid formats.
                </p>
                <div className="mt-8">
                  <GoldLink to="/contact" track={{ category: "cta", label: "start-conversation-inst" }}>Start a Conversation <ArrowRight size={18} className="ml-2" /></GoldLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Institutions;
