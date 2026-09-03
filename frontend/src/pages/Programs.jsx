import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, PageHero, GoldLink } from "../components/shared";

const programs = [
  {
    t: "Campus Recruitment Training (CRT)",
    badge: "Placement Season",
    duration: "6 - 8 Weeks",
    schedule: "Session Starts: Upcoming Batch",
    img: "/serve_students_clean.jpg",
    d: "Interview skills, group discussions, and workplace communication built specifically for placement season, designed to get final-year students job-ready."
  },
  {
    t: "Soft Skills Development",
    badge: "Foundational",
    duration: "4 - 6 Weeks",
    schedule: "Session Starts: Flexible Schedule",
    img: "/classroom_training.jpg",
    d: "Foundational communication, teamwork, and interpersonal skills for students entering college life and, eventually, the workplace."
  },
  {
    t: "Communication & Business Skills",
    badge: "Professional",
    duration: "4 - 6 Weeks",
    schedule: "Session Starts: Next Batch",
    img: "/serve_corporate_clean.jpg",
    d: "Professional writing, presentation, and verbal communication for students and working professionals alike."
  },
  {
    t: "Personality Development",
    badge: "Confidence Building",
    duration: "4 Weeks",
    schedule: "Session Starts: Upcoming Batch",
    img: "/serve_students_clean.jpg",
    d: "Confidence-building, body language, and self-presentation for students who have ideas worth sharing and just need the stage."
  },
  {
    t: "Public Speaking & Debate",
    badge: "Intermediate",
    duration: "4 - 6 Weeks",
    schedule: "Session Starts: Next Batch",
    img: "/serve_institutions_clean.jpg",
    d: "Structured practice in public speaking and argumentation for school and college students."
  },
  {
    t: "Interview Skills & Mock GDs",
    badge: "Placement Ready",
    duration: "3 - 4 Weeks",
    schedule: "Session Starts: Weekly Cohorts",
    img: "/interview_mock_gd.jpg",
    d: "Mock interviews, common-question preparation, and real-time feedback to remove hesitation under pressure."
  },
  {
    t: "Career Guidance Programme",
    badge: "Career Advisory",
    duration: "2 - 4 Weeks",
    schedule: "Session Starts: On Demand",
    img: "/career_guidance.jpg",
    d: "Helping students understand career pathways, aptitude, and next steps after graduation."
  },
  {
    t: "Leadership Development",
    badge: "Advanced",
    duration: "6 - 8 Weeks",
    schedule: "Session Starts: Next Month",
    img: "/leadership_development.jpg",
    d: "Team management, decision-making, and workplace leadership for students and working professionals."
  },
  {
    t: "Corporate Training Modules",
    badge: "Executive",
    duration: "Custom Duration",
    schedule: "Session Starts: Customized Schedule",
    img: "/serve_corporate_clean.jpg",
    d: "Customised communication and professional-development sessions for HR teams, managers, and employees."
  },
  {
    t: "Faculty Development Programmes",
    badge: "Educator Upskilling",
    duration: "1 - 2 Weeks",
    schedule: "Session Starts: Academic Cycle",
    img: "/fdp_faculty_training.jpg",
    d: "Helping educators sharpen classroom delivery and student engagement."
  },
  {
    t: "Train-the-Trainer Programme",
    badge: "Master Trainer",
    duration: "4 - 6 Weeks",
    schedule: "Session Starts: Next Cohort",
    img: "/classroom_training.jpg",
    d: "Equipping educators and internal L&D teams to run their own communication-training sessions."
  },
];

const Programs = () => {
  useEffect(() => { document.title = "Programs | VOKTAA Solutions"; }, []);

  return (
    <>
      {/* PAGE HERO WITH RICH BACKGROUND IMAGE */}
      <PageHero
        testid="programs-hero"
        label="Our Programmes"
        title="Practice creates"
        gold="confidence."
        subtitle="From campus-ready communication to boardroom leadership, every VOKTAA programme is built on one principle. Explore our programmes below, or contact us for tailored modules."
        bgImage="/classroom_training.jpg"
      />

      {/* RICH COURSE CARDS GRID WITH COMPACT BOTTOM PADDING */}
      <section className="bg-purple-50/40 pt-16 pb-10 md:pt-20 md:pb-12" data-testid="programs-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((p, i) => (
              <StaggerItem key={i}>
                <div
                  className="card-purple bg-white border border-purple-100/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group hover:-translate-y-1.5"
                  data-testid={`program-card-${i}`}
                >
                  <div>
                    {/* Top Header Image */}
                    <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
                      <img
                        src={p.img}
                        alt={p.t}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent" />
                      {/* Level Badge Pill */}
                      <div className="absolute top-3.5 right-3.5 bg-amber-100/95 border border-amber-300/80 text-amber-900 font-mono text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                        {p.badge}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 sm:p-7">
                      <h3 className="font-heading font-extrabold text-xl text-purple-950 leading-snug mb-4">{p.t}</h3>

                      {/* Duration & Start Metadata */}
                      <div className="space-y-2 mb-4 pt-2 border-t border-purple-100/80">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-purple-900/75 font-medium">
                          <Clock size={16} className="text-purple-600 shrink-0" />
                          <span>{p.duration}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-purple-900/75 font-medium">
                          <Calendar size={16} className="text-purple-600 shrink-0" />
                          <span>{p.schedule}</span>
                        </div>
                      </div>

                      <p className="text-purple-900/70 text-sm leading-relaxed text-justify mt-2">{p.d}</p>
                    </div>
                  </div>

                  {/* View Program Action Button */}
                  <div className="p-6 sm:p-7 pt-0">
                    <Link
                      to="/contact"
                      className="w-full py-3 px-4 rounded-xl border-2 border-purple-200 text-purple-700 font-heading font-bold text-sm hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      View Program <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* FORMATS WITH TIGHT TOP PADDING */}
      <section className="bg-white pt-10 pb-20 md:pt-12 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><SectionLabel className="block mb-3">Formats</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight leading-tight mb-6">
                Built around your calendar, not the other way round.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-purple-900/75 text-lg leading-relaxed text-justify">
                Programmes are available as single workshops, multi-day modules, or ongoing engagements, tailored to
                your institution's academic calendar or your organisation's training cycle. Specific durations and batch
                sizes are confirmed during consultation, based on your student or team profile.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="card-purple bg-gradient-to-br from-purple-900 to-indigo-950 p-10 rounded-3xl text-white relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
              <div className="relative">
                <span className="font-heading font-bold text-6xl text-purple-400/40 leading-none block">“</span>
                <p className="font-heading text-xl md:text-2xl text-white leading-snug -mt-4">
                  Practice creates confidence. Ours is a training culture, not a tuition culture: activity-driven,
                  interactive, and built for involvement, not instruction.
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-300 mt-6">VOKTAA Solutions</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-950 py-20 md:py-24 relative overflow-hidden text-white">
        <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
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
