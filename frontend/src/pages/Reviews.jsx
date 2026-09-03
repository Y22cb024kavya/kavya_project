import React, { useEffect, useState } from "react";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Reveal, StaggerGroup, StaggerItem } from "../components/Reveal";
import { SectionLabel, PageHero } from "../components/shared";
import { api, trackClick } from "../lib/api";

const ROLE_OPTIONS = ["Student", "Placement Officer", "Corporate Professional", "Educator", "Other"];
const PROGRAM_OPTIONS = [
  "Campus Recruitment Training", "Soft Skills Development", "Communication Skills",
  "Personality Development", "Public Speaking & Debate", "Interview Skills",
  "Leadership Development", "Corporate Training", "Train-the-Trainer", "Other",
];

const PLACEHOLDER_REVIEWS = [
  { id: "p1", name: "Student Name", role: "Student", organisation: "Engineering College · 2025 Batch", program: "Campus Recruitment Training", rating: 5, review: "The mock interviews and GD practice changed how I walked into placements. I stopped rehearsing fear and started rehearsing answers.", isPlaceholder: true },
  { id: "p2", name: "T&P Officer", role: "Placement Officer", organisation: "Partner Institution", program: "Corporate Training", rating: 5, review: "Structured, activity-based, and calibrated to our students. The feedback report after the programme was genuinely useful for our placement cell.", isPlaceholder: true },
  { id: "p3", name: "L&D Manager", role: "Corporate Professional", organisation: "Corporate Partner", program: "Corporate Training", rating: 5, review: "Practical scenarios, real practice, and a trainer who understood our team. Our associates came out sharper on both communication and workplace etiquette.", isPlaceholder: true },
];

const Stars = ({ value = 0, onChange, size = 20, testid }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" data-testid={testid}>
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type={onChange ? "button" : undefined}
          onClick={() => onChange && onChange(v)}
          onMouseEnter={() => onChange && setHover(v)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
          aria-label={`${v} star${v > 1 ? "s" : ""}`}
        >
          <Star size={size} className={(hover || value) >= v ? "text-purple-600 fill-purple-600" : "text-purple-200"} />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ r }) => (
  <div className="card-purple bg-white border border-purple-100 p-7 h-full rounded-2xl shadow-sm" data-testid={`review-card-${r.id}`}>
    <span className="font-heading font-bold text-6xl text-purple-200 leading-none block">“</span>
    <Stars value={r.rating} />
    <p className="font-heading text-lg text-purple-950 leading-snug mt-4">{r.review}</p>
    <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
      <div>
        <p className="font-bold text-purple-950">{r.name}</p>
        <p className="text-purple-900/60 text-xs">{r.role || "Student"}</p>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-purple-900 bg-purple-100/70 px-3 py-1.5 rounded-lg">
        {r.role || "Student"}
      </span>
    </div>
    {r.isPlaceholder && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-purple-900/40 mt-4">Sample layout</p>}
  </div>
);

const Reviews = () => {
  useEffect(() => { document.title = "Reviews | VOKTAA Solutions"; }, []);

  const [reviews, setReviews] = useState([]);
  const [visible, setVisible] = useState(6);
  const [loadingList, setLoadingList] = useState(true);
  const [sectionOn, setSectionOn] = useState(true);

  const empty = { name: "", email: "", phone: "", role: "", organisation: "", program: "", rating: 0, review: "" };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    setLoadingList(true);
    try {
      const [rev, cfg] = await Promise.all([
        api.get("/reviews"),
        api.get("/settings").catch(() => ({ data: { reviews_visible: true } })),
      ]);
      setReviews(rev.data);
      setSectionOn(cfg.data?.reviews_visible !== false);
    } catch { /* silent */ } finally { setLoadingList(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.role || !form.program || !form.review.trim() || !form.rating) {
      toast.error("Please fill all required fields and select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/reviews", form);
      setSubmitted(true);
      toast.success("Review posted!");
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const list = reviews.length ? reviews : PLACEHOLDER_REVIEWS;
  const shown = list.slice(0, visible);

  return (
    <>
      <PageHero
        testid="reviews-hero"
        label="Reviews"
        title="In their own"
        gold="words."
        subtitle="Real reactions from students, institutions, and partners, collected directly, in their own voice."
      />

      {/* DISPLAY */}
      {sectionOn && (
      <section className="bg-purple-50/40 py-20 md:py-28" data-testid="reviews-display">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loadingList ? (
            <p className="text-purple-900/50 text-center font-mono text-sm">Loading reviews…</p>
          ) : (
            <>
              <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shown.map((r) => (
                  <StaggerItem key={r.id}><ReviewCard r={r} /></StaggerItem>
                ))}
              </StaggerGroup>
              {list.length > visible && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisible((v) => v + 6)}
                    className="inline-flex items-center border border-purple-600 text-purple-600 font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-colors shadow-sm"
                    data-testid="reviews-load-more"
                  >
                    Load More <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      )}

      {/* SUBMIT */}
      <section className="bg-white py-20 md:py-28" data-testid="reviews-submit-section">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center">
            <Reveal><SectionLabel className="block mb-3">Your Turn</SectionLabel></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading font-bold text-purple-950 text-4xl md:text-5xl tracking-tight mb-6">Share your experience</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-purple-900/70 max-w-xl mx-auto">
                Just finished a VOKTAA session? Tell us what stayed with you. Your feedback helps the next batch of students know what to expect.
              </p>
            </Reveal>
          </div>

          <div className="card-purple bg-white border border-purple-100 p-8 md:p-10 rounded-3xl shadow-lg mt-10">
            {submitted ? (
              <div className="py-10 text-center" data-testid="review-success">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-purple-100 rounded-full">
                  <CheckCircle2 size={36} className="text-purple-600" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-purple-950 mt-6">Thank you!</h3>
                <p className="text-purple-900/70 mt-3 max-w-md mx-auto">
                  Your review is now live on the site.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-6 border border-purple-600 text-purple-600 font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-xl hover:bg-purple-600 hover:text-white transition-colors">
                  Write Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5" data-testid="review-form">
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">Full Name *</span>
                    <input className="input-brand w-full px-4 py-3" value={form.name} onChange={set("name")} data-testid="review-name" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">Email *</span>
                    <input type="email" className="input-brand w-full px-4 py-3" value={form.email} onChange={set("email")} data-testid="review-email" />
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">Phone / WhatsApp</span>
                    <input className="input-brand w-full px-4 py-3" value={form.phone} onChange={set("phone")} data-testid="review-phone" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">Role *</span>
                    <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                      <SelectTrigger className="input-brand w-full px-4 py-3 h-auto rounded-xl" data-testid="review-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">College / Organisation</span>
                    <input className="input-brand w-full px-4 py-3" value={form.organisation} onChange={set("organisation")} data-testid="review-organisation" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">Programme Attended *</span>
                    <Select value={form.program} onValueChange={(v) => setForm((f) => ({ ...f, program: v }))}>
                      <SelectTrigger className="input-brand w-full px-4 py-3 h-auto rounded-xl" data-testid="review-program">
                        <SelectValue placeholder="Select programme" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAM_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">Star Rating *</span>
                  <Stars value={form.rating} size={26} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} testid="review-stars" />
                </div>
                <label className="block">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">Your Review *</span>
                  <textarea rows={4} className="input-brand w-full px-4 py-3 resize-none" placeholder="What did you gain from the session? What would you tell someone considering VOKTAA training?" value={form.review} onChange={set("review")} data-testid="review-text" />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-60"
                  data-testid="review-submit-button"
                >
                  {submitting ? "Submitting..." : "Submit Review"} <ArrowRight size={18} className="ml-2" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Reviews;
