const fs = require("fs");
const path = require("path");

const SITE_URL = "https://voktaa.com";

// Only indexable public routes
const routes = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/about", priority: "0.8", changefreq: "monthly" },
  { url: "/programs", priority: "0.9", changefreq: "weekly" },
  { url: "/programs/campus-to-cubicle", priority: "0.8", changefreq: "monthly" },
  { url: "/programs/soft-skills", priority: "0.8", changefreq: "monthly" },
  { url: "/programs/public-speaking", priority: "0.8", changefreq: "monthly" },
  { url: "/programs/train-the-trainer", priority: "0.8", changefreq: "monthly" },
  { url: "/institutions", priority: "0.9", changefreq: "monthly" },
  { url: "/reviews", priority: "0.8", changefreq: "weekly" },
  { url: "/contact", priority: "0.9", changefreq: "monthly" }
];

function getFileLastMod(routeUrl) {
  try {
    let sourceFile = path.join(__dirname, "../src/pages/Home.jsx");
    if (routeUrl === "/about") sourceFile = path.join(__dirname, "../src/pages/About.jsx");
    if (routeUrl === "/programs") sourceFile = path.join(__dirname, "../src/pages/Programs.jsx");
    if (routeUrl.startsWith("/programs/")) sourceFile = path.join(__dirname, "../src/pages/ProgramSyllabus.jsx");
    if (routeUrl === "/institutions") sourceFile = path.join(__dirname, "../src/pages/Institutions.jsx");
    if (routeUrl === "/reviews") sourceFile = path.join(__dirname, "../src/pages/Reviews.jsx");
    if (routeUrl === "/contact") sourceFile = path.join(__dirname, "../src/pages/Contact.jsx");

    if (fs.existsSync(sourceFile)) {
      const stats = fs.statSync(sourceFile);
      return stats.mtime.toISOString().split("T")[0];
    }
  } catch (e) {
    // fallback
  }
  return "2026-09-08";
}

function generateSitemap() {
  console.log("Generating production sitemap.xml...");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => {
    const lastmod = getFileLastMod(r.url);
    const loc = `${SITE_URL}${r.url}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  const publicPath = path.join(__dirname, "../public/sitemap.xml");
  const buildDir = path.join(__dirname, "../build");
  const buildPath = path.join(buildDir, "sitemap.xml");

  fs.writeFileSync(publicPath, xml, "utf8");
  console.log(`Saved ${publicPath}`);

  if (fs.existsSync(buildDir)) {
    fs.writeFileSync(buildPath, xml, "utf8");
    console.log(`Saved ${buildPath}`);
  }
}

generateSitemap();
