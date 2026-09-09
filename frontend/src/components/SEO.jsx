import React, { useEffect } from "react";
import { SITE_URL, BRAND_NAME, DEFAULT_SEO } from "../data/seoData";

const SEO = ({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  canonical = DEFAULT_SEO.canonical,
  ogImage = DEFAULT_SEO.ogImage,
  ogType = DEFAULT_SEO.ogType,
  noindex = false,
  schemas = []
}) => {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title;
    }

    // Helper function to set or update meta tag
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper function to set or update link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', "name", "description", description);
    }

    // 3. Meta Robots
    const robotsContent = noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    setMetaTag('meta[name="robots"]', "name", "robots", robotsContent);

    // 4. Canonical URL
    const fullCanonical = canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical}`;
    setLinkTag("canonical", fullCanonical);

    // 5. Open Graph Tags
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", BRAND_NAME);
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:url"]', "property", "og:url", fullCanonical);
    setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
    setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);

    // 6. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // 7. JSON-LD Schemas
    const existingSchemaScript = document.getElementById("voktaa-json-ld");
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schemas && schemas.length > 0) {
      const script = document.createElement("script");
      script.id = "voktaa-json-ld";
      script.type = "application/ld+json";
      const validSchemas = schemas.filter(Boolean);
      script.textContent = JSON.stringify(validSchemas.length === 1 ? validSchemas[0] : validSchemas);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, ogType, noindex, schemas]);

  return null;
};

export default SEO;
