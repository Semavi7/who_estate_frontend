import { URI } from "./url"

// components/structured-data/WebsiteSchema.tsx
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Derya Emlak",
    "alternateName": "Derya Emlak Who Estate",
    "url": URI,
    "description": "Türkiye'nin en güvenilir emlak platformu",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${URI}/ara?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.youtube.com/@deryaemlak",
      "https://www.instagram.com/deryaemlakwhoestate"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}