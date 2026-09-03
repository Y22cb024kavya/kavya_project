import React, { useEffect, useState } from "react";
import { CheckCircle2, Mail, Phone, MapPin, Globe, ArrowRight, Linkedin, Instagram, Youtube, Facebook, AtSign } from "lucide-react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Reveal } from "../components/Reveal";
import { SectionLabel, PageHero } from "../components/shared";
import { api, trackClick, CONTACT } from "../lib/api";

const programOptions = [
  "Campus Recruitment Training", "Soft Skills Development", "Corporate Training",
  "Train-the-Trainer", "Other", "Not Sure Yet",
];

const socials = [
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
  { icon: Facebook, label: "Facebook" },
  { icon: AtSign, label: "Threads" },
];

const Field = ({ label, children }) => (
  <div>
    <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60 block mb-2">{label}</label>
    {children}
  </div>
);

const Contact = () => {
  useEffect(() => { document.title = "Contact Us | VOKTAA Solutions"; }, []);

  const empty = { first_name: "", last_name: "", email: "", phone: "", program: "", city: "", message: "" };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/enquiries", form);
      trackClick("contact", "enquiry-submit");
      setSubmitted(true);
      toast.success("Message sent successfully!");
      setForm(empty);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        testid="contact-hero"
        label="Contact Us"
        title="Let's start a"
        gold="conversation."
        subtitle="Tell us about your institution or organisation, and we'll get back to you about your next training programme."
      />

      <section className="bg-ivory py-20 md:py-28" data-testid="contact-body">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-5 gap-8">

          {/* FORM */}
          <Reveal className="lg:col-span-3">
            <div className="card-gold bg-white p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(11,31,61,0.08)]" data-testid="enquiry-form-card">
              <h3 className="font-heading font-bold text-2xl text-navy mb-6">Send us a message</h3>
              {submitted ? (
                <div className="py-10 text-center" data-testid="enquiry-success">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gold/20 rounded-full">
                    <CheckCircle2 size={36} className="text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-navy mt-6">Enquiry Received</h3>
                  <p className="text-ink/70 mt-3 max-w-md mx-auto">
                    We'll reach out within 24 hours to confirm your free demo session.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 border border-navy text-navy font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-navy hover:text-white transition-colors" data-testid="enquiry-reset-button">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5" data-testid="enquiry-form">
                  <Field label="Full Name *">
                    <input className="input-brand w-full px-4 py-3" value={form.first_name} onChange={set("first_name")} data-testid="input-first-name" />
                  </Field>
                  <Field label="Institution / Organisation">
                    <input className="input-brand w-full px-4 py-3" value={form.last_name} onChange={set("last_name")} data-testid="input-organisation" />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Email *">
                      <input type="email" className="input-brand w-full px-4 py-3" value={form.email} onChange={set("email")} data-testid="input-email" />
                    </Field>
                    <Field label="Phone (+91)">
                      <input className="input-brand w-full px-4 py-3" value={form.phone} onChange={set("phone")} data-testid="input-phone" />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Programme Interested In">
                      <Select value={form.program} onValueChange={(v) => setForm((f) => ({ ...f, program: v }))}>
                        <SelectTrigger className="input-brand w-full px-4 py-3 h-auto rounded-xl" data-testid="select-program">
                          <SelectValue placeholder="Select a programme" />
                        </SelectTrigger>
                        <SelectContent>
                          {programOptions.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="City">
                      <input className="input-brand w-full px-4 py-3" value={form.city} onChange={set("city")} data-testid="input-city" />
                    </Field>
                  </div>
                  <Field label="Message">
                    <textarea rows={4} className="input-brand w-full px-4 py-3 resize-none" value={form.message} onChange={set("message")} data-testid="input-message" />
                  </Field>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center bg-gold text-navy-deep font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-gold-light transition-colors disabled:opacity-60"
                    data-testid="enquiry-submit-button"
                  >
                    {loading ? "Sending..." : "Send Message"} <ArrowRight size={18} className="ml-2" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* INFO */}
          <Reveal className="lg:col-span-2" delay={0.1}>
            <div className="card-gold bg-navy-deep p-8 md:p-10 h-full rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
              <div className="relative">
                <SectionLabel dark className="block mb-6">Get in Touch</SectionLabel>
                <div className="space-y-5">
                  <div className="flex items-start gap-3 text-white/85">
                    <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Location</p>
                      <p>{CONTACT.location}</p>
                    </div>
                  </div>
                  <a href={`tel:+91${CONTACT.phone}`} onClick={() => trackClick("contact", "phone")} className="flex items-start gap-3 text-white/85 hover:text-gold transition-colors" data-testid="contact-phone-link">
                    <Phone size={18} className="text-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Call / WhatsApp</p>
                      <p>{CONTACT.phoneDisplay}</p>
                    </div>
                  </a>
                  <a href={`mailto:${CONTACT.email}`} onClick={() => trackClick("contact", "email")} className="flex items-start gap-3 text-white/85 hover:text-gold transition-colors" data-testid="contact-email-link">
                    <Mail size={18} className="text-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Email</p>
                      <p className="break-all">{CONTACT.email}</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 text-white/85">
                    <Globe size={18} className="text-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Website</p>
                      <p>{CONTACT.website}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <SectionLabel dark className="block mb-3">Scheduling & Programme Enquiries</SectionLabel>
                  <div className="flex items-start gap-3 text-white/75">
                    <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                    <span className="text-sm">Coordinator: <span className="font-mono text-white/50">[Coordinator Name] — [Add phone] · [Add email]</span></span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <SectionLabel dark className="block mb-4">Quick Links</SectionLabel>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/programs" className="text-white/80 hover:text-gold">→ View All Programmes</a></li>
                    <li><a href="/institutions" className="text-white/80 hover:text-gold">→ For Institutions</a></li>
                    <li><a href="#top" className="text-white/80 hover:text-gold">→ Book a Free Demo</a></li>
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex gap-3">
                    {socials.map((s) => (
                      <a key={s.label} href="#" aria-label={s.label} onClick={() => trackClick("nav", `social-${s.label.toLowerCase()}`)}
                        className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/70 hover:text-navy-deep hover:bg-gold hover:border-gold transition-colors rounded-xl">
                        <s.icon size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* MAP PLACEHOLDER */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12" data-testid="map-section">
          <div className="card-gold bg-white border border-black/5 rounded-2xl overflow-hidden">
            <div className="bg-ivory h-72 md:h-80 flex flex-col items-center justify-center text-center px-6 relative">
              <div className="absolute inset-0 opacity-40 dot-grid" />
              <div className="relative">
                <div className="w-14 h-14 mx-auto flex items-center justify-center bg-gold text-navy-deep rounded-full">
                  <MapPin size={22} />
                </div>
                <p className="font-heading font-bold text-2xl text-navy mt-4">{CONTACT.location}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50 mt-3">Google Maps embed coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
