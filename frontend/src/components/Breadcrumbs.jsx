import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { SITE_URL } from "../data/seoData";

const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const allItems = [{ label: "Home", to: "/" }, ...items];

  // Generate BreadcrumbList JSON-LD Schema
  const schemaList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.to ? `${SITE_URL}${item.to}` : undefined
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-2">
      {/* Schema injected into JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }}
      />
      <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-purple-900/70 font-medium">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight size={14} className="text-purple-400 shrink-0" />}
              {isLast ? (
                <span className="text-purple-950 font-bold tracking-tight" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-purple-600 transition-colors flex items-center gap-1.5"
                >
                  {index === 0 && <Home size={14} className="text-purple-600 -mt-0.5" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
