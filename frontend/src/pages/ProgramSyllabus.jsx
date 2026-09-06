import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, Loader2 } from "lucide-react";
import { PageHero } from "../components/shared";
import { api } from "../lib/api";
import { programSyllabi } from "../data/programSyllabi";

const ProgramSyllabus = () => {
  const { slug } = useParams();
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    const fallback = programSyllabi[slug];
    const fallbackSyllabus = fallback ? {
      slug,
      ...fallback,
      available: Boolean(fallback.source_document && fallback.subjects && fallback.subjects.length > 0)
    } : null;

    api.get(`/programs/${slug}`)
      .then(({ data }) => {
        if (!active) return;
        const isValidData = data && typeof data === "object" && typeof data !== "string" && data.title && Array.isArray(data.subjects) && data.subjects.length > 0;

        if (isValidData) {
          setSyllabus({
            slug,
            ...data,
            available: Boolean(data.source_document && data.subjects.length > 0)
          });
        } else if (fallbackSyllabus) {
          setSyllabus(fallbackSyllabus);
        } else if (data && typeof data === "object" && data.title) {
          setSyllabus({ slug, ...data, available: false });
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!active) return;
        if (fallbackSyllabus) {
          setSyllabus(fallbackSyllabus);
        } else {
          setError(true);
        }
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    document.title = syllabus?.title ? `${syllabus.title} | VOKTAA Solutions` : "Program Syllabus | VOKTAA Solutions";
  }, [syllabus]);

  return (
    <>
      <PageHero
        label="Programme Syllabus"
        title={syllabus?.title || "Programme details"}
        subtitle="Explore the course content mapped to this VOKTAA programme."
        bgImage="/classroom_training.jpg"
      />
      <main className="bg-[#F0F5FA] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-bold text-[#157082] hover:text-[#003366] mb-8">
            <ArrowLeft size={16} /> Back to Programs
          </Link>

          {loading && (
            <div className="bg-white rounded-3xl border border-[#CCE0F5] p-16 text-center text-[#003366]" data-testid="syllabus-loading">
              <Loader2 className="mx-auto animate-spin" size={28} />
              <p className="mt-4">Loading syllabus...</p>
            </div>
          )}

          {!loading && (error || !syllabus) && (
            <div className="bg-white rounded-3xl border border-[#CCE0F5] p-12 text-center" data-testid="syllabus-error">
              <FileText className="mx-auto text-[#157082]" size={40} />
              <h2 className="font-heading font-bold text-2xl text-[#003366] mt-5">Program not found</h2>
              <p className="text-[#333333]/70 mt-3">Please return to the Programs page and choose a valid program.</p>
            </div>
          )}

          {!loading && !error && syllabus && (
            <section className="bg-white rounded-3xl border border-[#CCE0F5] shadow-lg p-8 md:p-12" data-testid="syllabus-viewer">
              <div className="flex items-start gap-4 pb-6 border-b border-[#CCE0F5]">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#CCE0F5]/60 text-[#003366] flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#157082]">Course content</p>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#003366] mt-1">{syllabus.title}</h2>
                </div>
              </div>

              {syllabus.available ? (
                <ul className="grid sm:grid-cols-2 gap-3 mt-6" data-testid="syllabus-subjects">
                  {syllabus.subjects.map((subject) => (
                    <li key={subject} className="flex items-start gap-3 rounded-xl bg-[#F0F5FA] px-4 py-3 text-[#333333]">
                      <span className="text-[#157082] mt-0.5">&#8227;</span>
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-7" data-testid="syllabus-unavailable">
                  <div className="flex items-start gap-3">
                    <FileText className="text-amber-700 shrink-0 mt-0.5" size={22} />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-amber-950">Syllabus not available</h3>
                      <p className="text-amber-900/80 mt-2">The course document for this program has not been added yet. Please contact us for the latest details.</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default ProgramSyllabus;
