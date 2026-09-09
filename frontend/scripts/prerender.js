const fs = require("fs");
const path = require("path");

const SITE_URL = "https://voktaa.com";
const BRAND_NAME = "VOKTAA Solutions";
const PRIMARY_ORG_ID = `${SITE_URL}/#organization`;

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": PRIMARY_ORG_ID,
  "name": BRAND_NAME,
  "legalName": "VOKTAA Solutions Training Academy",
  "url": SITE_URL,
  "logo": `${SITE_URL}/voktaa_logo.png`,
  "image": `${SITE_URL}/voktaa_logo.png`,
  "description": "VOKTAA Solutions provides industry-focused soft skills, spoken English, public speaking, and campus placement training across Andhra Pradesh.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Guntur",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9390246684",
    "contactType": "customer service",
    "email": "voktaasolutions@gmail.com"
  }
};

const routeMetadata = {
  "/": {
    title: "VOKTAA Solutions | Soft Skills, Spoken English & Placement Training in AP",
    description: "VOKTAA Solutions provides industry-focused soft skills, spoken English, public speaking, and campus placement training across Andhra Pradesh. Empowering learners from classroom to career.",
    canonical: `${SITE_URL}/`,
    ogImage: `${SITE_URL}/voktaa_logo.png`,
    schemas: [
      ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": BRAND_NAME
      }
    ]
  },
  "/about": {
    title: "About VOKTAA Solutions | Founded by P. Raja Sekhar | Guntur, AP",
    description: "Learn about VOKTAA Solutions, founded by P. Raja Sekhar in Guntur, Andhra Pradesh. Discover our activity-based training methodology, mission, vision, and core team.",
    canonical: `${SITE_URL}/about`,
    ogImage: `${SITE_URL}/founder.png`,
    schemas: [
      ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${SITE_URL}/about/#webpage`,
        "url": `${SITE_URL}/about`,
        "name": "About VOKTAA Solutions"
      }
    ]
  },
  "/programs": {
    title: "Training Programmes & Syllabus | Soft Skills, Employability & TTT | VOKTAA",
    description: "Explore VOKTAA's training programmes: Campus to Cubicle employability, Soft Skills & Personality Development, Public Speaking, and Train-the-Trainer for educators.",
    canonical: `${SITE_URL}/programs`,
    ogImage: `${SITE_URL}/classroom_training.jpg`,
    schemas: [ORGANIZATION_SCHEMA]
  },
  "/programs/campus-to-cubicle": {
    title: "Campus to Cubicle Employability Programme | VOKTAA Solutions",
    description: "Comprehensive 60-120 hour placement preparation covering Group Discussions, mock interviews, corporate etiquette, aptitude, and resume building for engineering and degree graduates.",
    canonical: `${SITE_URL}/programs/campus-to-cubicle`,
    ogImage: `${SITE_URL}/career_guidance.jpg`,
    schemas: [ORGANIZATION_SCHEMA]
  },
  "/programs/soft-skills": {
    title: "Soft Skills & Personality Development Masterclass | VOKTAA Solutions",
    description: "Enhance interpersonal communication, emotional intelligence, body language, assertiveness, team collaboration, and professional workplace etiquette.",
    canonical: `${SITE_URL}/programs/soft-skills`,
    ogImage: `${SITE_URL}/interview_mock_gd.jpg`,
    schemas: [ORGANIZATION_SCHEMA]
  },
  "/programs/public-speaking": {
    title: "Public Speaking & Voice Modulation Masterclass | VOKTAA Solutions",
    description: "Master stage presence, speech delivery, voice modulation, fear elimination, and persuasive presentation skills for students, professionals, and job aspirants.",
    canonical: `${SITE_URL}/programs/public-speaking`,
    ogImage: `${SITE_URL}/leadership_development.jpg`,
    schemas: [ORGANIZATION_SCHEMA]
  },
  "/programs/train-the-trainer": {
    title: "Train-the-Trainer (TTT) Programme for Educators | VOKTAA Solutions",
    description: "Equip faculty members, educators, and corporate trainers with modern interactive pedagogy, activity-based training design, and evaluation frameworks.",
    canonical: `${SITE_URL}/programs/train-the-trainer`,
    ogImage: `${SITE_URL}/fdp_faculty_training.jpg`,
    schemas: [ORGANIZATION_SCHEMA]
  },
  "/institutions": {
    title: "Training for Engineering Colleges & Universities | VOKTAA Solutions",
    description: "Partner with VOKTAA Solutions for customized campus placement training, MOU partnerships, NAAC/NIRF accreditation support, and faculty development in Andhra Pradesh.",
    canonical: `${SITE_URL}/institutions`,
    ogImage: `${SITE_URL}/serve_institutions_clean.jpg`,
    schemas: [ORGANIZATION_SCHEMA]
  },
  "/reviews": {
    title: "Student & College Reviews | VOKTAA Solutions Success Stories",
    description: "Read real testimonials and reviews from students, engineering college management, and corporate clients trained by VOKTAA Solutions.",
    canonical: `${SITE_URL}/reviews`,
    ogImage: `${SITE_URL}/classroom_training.jpg`,
    schemas: [ORGANIZATION_SCHEMA]
  },
  "/contact": {
    title: "Contact VOKTAA Solutions | Book a Free Demo Class in Guntur, AP",
    description: "Get in touch with VOKTAA Solutions in Guntur, Andhra Pradesh. Call +91 93902 46684, email voktaasolutions@gmail.com, or book a free demo session today.",
    canonical: `${SITE_URL}/contact`,
    ogImage: `${SITE_URL}/voktaa_logo.png`,
    schemas: [ORGANIZATION_SCHEMA]
  }
};

function runPrerender() {
  console.log("Starting static pre-rendering pipeline...");
  const buildDir = path.join(__dirname, "../build");
  const templatePath = path.join(buildDir, "index.html");

  if (!fs.existsSync(templatePath)) {
    console.error("Error: build/index.html not found! Run npm run build first.");
    return;
  }

  const templateHtml = fs.readFileSync(templatePath, "utf8");

  Object.keys(routeMetadata).forEach((routePath) => {
    const meta = routeMetadata[routePath];
    let html = templateHtml;

    // Ensure absolute asset URLs from root domain
    html = html.replace(/src="\.\/static\//g, 'src="/static/');
    html = html.replace(/href="\.\/static\//g, 'href="/static/');
    html = html.replace(/href="\.\/manifest.json"/g, 'href="/manifest.json"');
    html = html.replace(/href="\.\/logo.png"/g, 'href="/logo.png"');

    // Replace title tag
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);

    // Replace or inject meta description
    const descTag = `<meta name="description" content="${meta.description}" />`;
    if (/meta name="description"/i.test(html)) {
      html = html.replace(/<meta name="description" content=".*?" \/>/gi, descTag);
    } else {
      html = html.replace("</head>", `  ${descTag}\n</head>`);
    }

    // Inject Canonical Link, Open Graph & Twitter Cards
    const headExtra = `
  <link rel="canonical" href="${meta.canonical}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta property="og:site_name" content="${BRAND_NAME}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${meta.canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${meta.ogImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.ogImage}" />
  <script type="application/ld+json">${JSON.stringify(meta.schemas)}</script>
`;
    html = html.replace("</head>", `${headExtra}\n</head>`);

    // Save to build output
    if (routePath === "/") {
      fs.writeFileSync(templatePath, html, "utf8");
      console.log(`Pre-rendered root / -> build/index.html`);
    } else {
      const targetDir = path.join(buildDir, routePath.replace(/^\//, ""));
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFile = path.join(targetDir, "index.html");
      fs.writeFileSync(targetFile, html, "utf8");
      console.log(`Pre-rendered route ${routePath} -> ${targetFile}`);
    }
  });

  console.log("Static pre-rendering pipeline completed successfully!");
}

runPrerender();
