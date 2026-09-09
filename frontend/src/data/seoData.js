export const SITE_URL = "https://voktaa.com";
export const BRAND_NAME = "VOKTAA Solutions";
export const PRIMARY_ORG_ID = `${SITE_URL}/#organization`;

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": PRIMARY_ORG_ID,
  "name": BRAND_NAME,
  "legalName": "VOKTAA Solutions Training Academy",
  "url": SITE_URL,
  "logo": `${SITE_URL}/voktaa_logo.png`,
  "image": `${SITE_URL}/voktaa_logo.png`,
  "description": "VOKTAA Solutions provides industry-focused soft skills, spoken English, public speaking, and campus placement training across Andhra Pradesh. Empowering learners from classroom to career.",
  "founder": {
    "@type": "Person",
    "name": "P. Raja Sekhar"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Guntur",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-7416113199",
    "contactType": "customer service",
    "email": "voktaasolutions@gmail.com",
    "areaServed": "IN",
    "availableLanguage": ["English", "Telugu"]
  },
  "sameAs": [
    "https://www.facebook.com/voktaasolutions",
    "https://www.linkedin.com/company/voktaa-solutions",
    "https://www.instagram.com/voktaasolutions"
  ]
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "url": SITE_URL,
  "name": BRAND_NAME,
  "publisher": {
    "@id": PRIMARY_ORG_ID
  }
};

export const DEFAULT_SEO = {
  title: "VOKTAA Solutions | Soft Skills, Spoken English & Placement Training in AP",
  description: "VOKTAA Solutions provides industry-focused soft skills, spoken English, public speaking, and campus placement training across Andhra Pradesh. Empowering learners from classroom to career.",
  canonical: SITE_URL,
  ogImage: `${SITE_URL}/voktaa_logo.png`,
  ogType: "website",
  twitterCard: "summary_large_image"
};

export const PAGE_SEO = {
  home: {
    title: "VOKTAA Solutions | Soft Skills, Spoken English & Placement Training in AP",
    description: "VOKTAA Solutions provides industry-focused soft skills, spoken English, public speaking, and campus placement training across Andhra Pradesh. Empowering learners from classroom to career.",
    canonical: `${SITE_URL}/`,
    ogImage: `${SITE_URL}/voktaa_logo.png`,
    ogType: "website"
  },
  about: {
    title: "About VOKTAA Solutions | Founded by P. Raja Sekhar | Guntur, AP",
    description: "Learn about VOKTAA Solutions, founded by P. Raja Sekhar in Guntur, Andhra Pradesh. Discover our activity-based training methodology, mission, vision, and core team.",
    canonical: `${SITE_URL}/about`,
    ogImage: `${SITE_URL}/founder.png`,
    ogType: "article"
  },
  programs: {
    title: "Training Programmes & Syllabus | Soft Skills, Employability & TTT | VOKTAA",
    description: "Explore VOKTAA's training programmes: Campus to Cubicle employability, Soft Skills & Personality Development, Public Speaking, and Train-the-Trainer for educators.",
    canonical: `${SITE_URL}/programs`,
    ogImage: `${SITE_URL}/classroom_training.jpg`,
    ogType: "website"
  },
  institutions: {
    title: "Training for Engineering Colleges & Universities | VOKTAA Solutions",
    description: "Partner with VOKTAA Solutions for customized campus placement training, MOU partnerships, NAAC/NIRF accreditation support, and faculty development in Andhra Pradesh.",
    canonical: `${SITE_URL}/institutions`,
    ogImage: `${SITE_URL}/serve_institutions_clean.jpg`,
    ogType: "website"
  },
  reviews: {
    title: "Student & College Reviews | VOKTAA Solutions Success Stories",
    description: "Read real testimonials and reviews from students, engineering college management, and corporate clients trained by VOKTAA Solutions.",
    canonical: `${SITE_URL}/reviews`,
    ogImage: `${SITE_URL}/classroom_training.jpg`,
    ogType: "website"
  },
  contact: {
    title: "Contact VOKTAA Solutions | Book a Free Demo Class in Guntur, AP",
    description: "Get in touch with VOKTAA Solutions in Guntur, Andhra Pradesh. Call +91 74161 13199, email voktaasolutions@gmail.com, or book a free demo session today.",
    canonical: `${SITE_URL}/contact`,
    ogImage: `${SITE_URL}/voktaa_logo.png`,
    ogType: "website"
  }
};

export const PROGRAM_SLUG_SEO = {
  "campus-to-cubicle": {
    title: "Campus to Cubicle Employability Programme | VOKTAA Solutions",
    description: "Comprehensive 60-120 hour placement preparation covering Group Discussions, mock interviews, corporate etiquette, aptitude, and resume building for engineering and degree graduates.",
    canonical: `${SITE_URL}/programs/campus-to-cubicle`,
    ogImage: `${SITE_URL}/career_guidance.jpg`,
    courseName: "Campus to Cubicle Employability Programme"
  },
  "soft-skills": {
    title: "Soft Skills & Personality Development Masterclass | VOKTAA Solutions",
    description: "Enhance interpersonal communication, emotional intelligence, body language, assertiveness, team collaboration, and professional workplace etiquette.",
    canonical: `${SITE_URL}/programs/soft-skills`,
    ogImage: `${SITE_URL}/interview_mock_gd.jpg`,
    courseName: "Soft Skills & Personality Development"
  },
  "public-speaking": {
    title: "Public Speaking & Voice Modulation Masterclass | VOKTAA Solutions",
    description: "Master stage presence, speech delivery, voice modulation, fear elimination, and persuasive presentation skills for students, professionals, and job aspirants.",
    canonical: `${SITE_URL}/programs/public-speaking`,
    ogImage: `${SITE_URL}/leadership_development.jpg`,
    courseName: "Public Speaking & Communication Masterclass"
  },
  "train-the-trainer": {
    title: "Train-the-Trainer (TTT) Programme for Educators | VOKTAA Solutions",
    description: "Equip faculty members, educators, and corporate trainers with modern interactive pedagogy, activity-based training design, and evaluation frameworks.",
    canonical: `${SITE_URL}/programs/train-the-trainer`,
    ogImage: `${SITE_URL}/fdp_faculty_training.jpg`,
    courseName: "Train-the-Trainer (TTT) Programme"
  }
};
