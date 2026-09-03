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
    <label className="font-mono text-xs uppercase tracking-[0.15em] text-purple-950 font-bold block mb-2">{label}</label>
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

      <section className="bg-purple-50/40 py-20 md:py-28" data-testid="contact-body">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-5 gap-8">

          {/* FORM */}
          <Reveal className="lg:col-span-3">
            <div className="card-purple bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-purple-100" data-testid="enquiry-form-card">
              <h3 className="font-heading font-bold text-2xl text-purple-950 mb-6">Send us a message</h3>
              {submitted ? (
                <div className="py-10 text-center" data-testid="enquiry-success">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center bg-purple-100 rounded-full">
                    <CheckCircle2 size={36} className="text-purple-600" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-purple-950 mt-6">Enquiry Received</h3>
                  <p className="text-purple-900/70 mt-3 max-w-md mx-auto">
                    We'll reach out within 24 hours to confirm your free demo session.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 border border-purple-600 text-purple-600 font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-colors" data-testid="enquiry-reset-button">
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
                    className="w-full inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-60"
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
            <div className="card-purple bg-gradient-to-br from-purple-900 to-indigo-950 text-white p-8 md:p-10 h-full rounded-3xl relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 dot-grid dot-grid-fade opacity-30" />
              <div className="relative">
                <SectionLabel dark className="block mb-6">Get in Touch</SectionLabel>
                <div className="space-y-5">
                  <div className="flex items-start gap-3 text-purple-100">
                    <MapPin size={18} className="text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-purple-300/60">Location</p>
                      <p>{CONTACT.location}</p>
                    </div>
                  </div>
                  <a href={`tel:+91${CONTACT.phone}`} onClick={() => trackClick("contact", "phone")} className="flex items-start gap-3 text-purple-100 hover:text-purple-300 transition-colors" data-testid="contact-phone-link">
                    <Phone size={18} className="text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-purple-300/60">Call / WhatsApp</p>
                      <p>{CONTACT.phoneDisplay}</p>
                    </div>
                  </a>
                  <a href={`mailto:${CONTACT.email}`} onClick={() => trackClick("contact", "email")} className="flex items-start gap-3 text-purple-100 hover:text-purple-300 transition-colors" data-testid="contact-email-link">
                    <Mail size={18} className="text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-purple-300/60">Email</p>
                      <p className="break-all">{CONTACT.email}</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 text-purple-100">
                    <Globe size={18} className="text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-purple-300/60">Website</p>
                      <p>{CONTACT.website}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-purple-800/60">
                  <SectionLabel dark className="block mb-3">Scheduling & Programme Enquiries</SectionLabel>
                  <div className="flex items-start gap-3 text-purple-200">
                    <Phone size={16} className="text-purple-400 mt-0.5 shrink-0" />
                    <span className="text-sm">Coordinator: <span className="font-mono text-purple-300/80">[Coordinator Name] | [Add phone] · [Add email]</span></span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-purple-800/60">
                  <SectionLabel dark className="block mb-4">Quick Links</SectionLabel>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/programs" className="text-purple-200 hover:text-white">→ View All Programmes</a></li>
                    <li><a href="/institutions" className="text-purple-200 hover:text-white">→ For Institutions</a></li>
                    <li><a href="#top" className="text-purple-200 hover:text-white">→ Book a Free Demo</a></li>
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-purple-800/60">
                  <div className="flex gap-3">
                    {socials.map((s) => (
                      <a key={s.label} href="#" aria-label={s.label} onClick={() => trackClick("nav", `social-${s.label.toLowerCase()}`)}
                        className="w-9 h-9 flex items-center justify-center border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-colors rounded-xl">
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
          <div className="card-purple bg-white border border-purple-100 rounded-3xl overflow-hidden shadow-md">
            <div className="bg-purple-50/50 h-72 md:h-80 flex flex-col items-center justify-center text-center px-6 relative">
              <div className="absolute inset-0 opacity-40 dot-grid" />
              <div className="relative">
                <div className="w-14 h-14 mx-auto flex items-center justify-center bg-purple-600 text-white rounded-full shadow-lg shadow-purple-500/30">
                  <MapPin size={22} />
                </div>
                <p className="font-heading font-bold text-2xl text-purple-950 mt-4">{CONTACT.location}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-purple-900/50 mt-3">Google Maps embed coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
