import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import { PageHero } from "../components/shared";
import { programSyllabi } from "../data/programSyllabi";
import SEO from "../components/SEO";
import Breadcrumbs from "../components/Breadcrumbs";
import { PROGRAM_SLUG_SEO, ORGANIZATION_SCHEMA, SITE_URL, PRIMARY_ORG_ID } from "../data/seoData";

const ProgramSyllabus = () => {
  const { slug } = useParams();

  const fallback = programSyllabi[slug];
  const syllabus = fallback
    ? {
        slug,
        ...fallback,
        available: Boolean(fallback.source_document && fallback.subjects && fallback.subjects.length > 0),
      }
    : null;

  const seoInfo = PROGRAM_SLUG_SEO[slug] || {
    title: syllabus?.title ? `${syllabus.title} | VOKTAA Solutions` : "Program Syllabus | VOKTAA Solutions",
    description: `Explore syllabus details for ${syllabus?.title || "VOKTAA training programme"} mapped for students and professionals.`,
    canonical: `${SITE_URL}/programs/${slug}`,
    ogImage: `${SITE_URL}/classroom_training.jpg`
  };

  const courseSchema = syllabus
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": syllabus.title,
        "description": seoInfo.description,
        "provider": { "@id": PRIMARY_ORG_ID },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "InPerson",
          "location": "VOKTAA Training Center, Guntur, AP"
        }
      }
    : null;

  return (
    <>
      <SEO
        title={seoInfo.title}
        description={seoInfo.description}
        canonical={seoInfo.canonical}
        ogImage={seoInfo.ogImage}
        ogType="website"
        schemas={[ORGANIZATION_SCHEMA, courseSchema]}
      />
      <Breadcrumbs
        items={[
          { label: "Programmes", to: "/programs" },
          { label: syllabus?.title || "Syllabus" }
        ]}
      />
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

          {!syllabus && (
            <div className="bg-white rounded-3xl border border-[#CCE0F5] p-12 text-center" data-testid="syllabus-error">
              <FileText className="mx-auto text-[#157082]" size={40} />
              <h2 className="font-heading font-bold text-2xl text-[#003366] mt-5">Program not found</h2>
              <p className="text-[#333333]/70 mt-3">Please return to the Programs page and choose a valid program.</p>
            </div>
          )}

          {syllabus && (
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
