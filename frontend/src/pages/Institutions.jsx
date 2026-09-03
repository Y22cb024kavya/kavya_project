import React, { useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, PageHero, GoldLink, OutlineLink } from "../components/shared";

const whyPoints = [
  "Industry-focused learning",
  "Experienced trainers",
  "Practical, activity-based methodology",
  "Customised programmes for your student profile",
  "Student-centred approach",
  "Measurable learning outcomes",
  "Strong academic and industry partnerships",
  "Commitment to continuous improvement",
];

const steps = [
  { n: "01", t: "Consultation", d: "We understand your student profile, placement goals, and academic calendar." },
  { n: "02", t: "Needs Assessment", d: "We identify the specific communication and employability gaps to address." },
  { n: "03", t: "Programme Design", d: "Sessions are built around your institution's timeline and student strengths." },
  { n: "04", t: "Delivery", d: "On-campus, hands-on, activity-based training." },
  { n: "05", t: "Feedback & Outcomes", d: "Post-programme review shared with your placement or training cell." },
];

const audiences = [
  { t: "Educational Institutions", items: ["Engineering colleges", "Degree colleges & universities", "Polytechnics"] },
  { t: "Students", items: ["Undergraduates & final-years", "Fresh graduates", "Job aspirants"] },
  { t: "Corporate Organisations", items: ["HR teams", "L&D departments", "Managers & employees"] },
  { t: "Government & Agencies", items: ["Skill missions", "Training institutes", "NGOs"] },
];

const Institutions = () => {
  useEffect(() => { document.title = "For Institutions | VOKTAA Solutions"; }, []);

  return (
    <>
      <PageHero
        testid="institutions-hero"
        label="For Institutions"
        title="Build a placement-ready,"
        gold="industry-confident student body."
        subtitle="A partnership designed for Training & Placement Officers, HR heads, and academic decision-makers who want measurable results, not just a workshop."
      />

      <section className="bg-navy-deep py-14 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <GoldLink to="/contact" track={{ category: "cta", label: "invite-demo-institutions" }} data-testid="invite-demo-button">
            Invite Us for a Free Demo <ArrowRight size={18} className="ml-2" />
          </GoldLink>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">Why Institutions Choose Us</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight mb-3">What partnering with VOKTAA looks like</h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold mb-14" />
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyPoints.map((p, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 bg-white border border-black/5 border-t-[3px] border-t-gold p-5 rounded-xl">
                  <CheckCircle2 size={20} className="text-gold mt-0.5 shrink-0" />
                  <span className="text-ink/85">{p}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">How We Work</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight mb-3">A five-step engagement, start to finish</h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold mb-14" />

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-[2px] bg-gold/40" />
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {steps.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gold text-navy-deep flex items-center justify-center font-heading font-bold text-lg relative z-10">
                      {s.n}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-navy mt-5">{s.t}</h3>
                    <p className="text-ink/70 text-sm mt-2 leading-relaxed">{s.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel className="block mb-3">Who We Serve</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-navy text-4xl md:text-5xl tracking-tight mb-3">Trusted across education, industry, and government</h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold mb-14" />
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {audiences.map((a, i) => (
              <StaggerItem key={i}>
                <div className="card-gold bg-white border border-black/5 p-8 h-full rounded-xl">
                  <h3 className="font-heading font-bold text-xl text-navy">{a.t}</h3>
                  <ul className="mt-4 space-y-2">
                    {a.items.map((x, j) => (
                      <li key={j} className="flex items-start gap-3 text-ink/75 text-sm">
                        <span className="text-gold mt-1">→</span>{x}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* PARTNER INSTITUTIONS */}
      <section className="bg-navy-deep py-24 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Reveal><SectionLabel dark className="block mb-3">Our Network</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading font-bold text-white text-3xl md:text-4xl tracking-tight mb-3">Growing our campus network</h2>
          </Reveal>
          <div className="w-12 h-[3px] bg-gold mb-10" />
          <div className="border border-dashed border-white/20 rounded-xl p-10 text-center">
            <p className="text-white/60 font-mono text-xs uppercase tracking-[0.2em]">
              Partner institution logos will appear here as our campus network grows.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="card-gold bg-ivory border border-black/5 p-10 md:p-14 rounded-2xl text-center">
            <h2 className="font-heading font-bold text-navy text-3xl md:text-4xl tracking-tight">
              Invite VOKTAA SOLUTIONS for a <span className="text-gold">free demo session</span> on your campus.
            </h2>
            <div className="mt-8"><GoldLink to="/contact" track={{ category: "cta", label: "institutions-get-in-touch" }}>Get in Touch <ArrowRight size={18} className="ml-2" /></GoldLink></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Institutions;
