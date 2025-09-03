import { URI } from "./url"

// components/structured-data/OrganizationSchema.tsx
export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Derya Emlak",
        "alternateName": "Derya Emlak Who Estate",
        "url": URI,
        "logo": `${URI}/e76e564c-c0ae-4241-97a0-4df87dec2b07.png`,
        "description": "Türkiye'nin en güvenilir emlak platformu",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Bağlarbaşı Mah. Selahattin Bey Sok. No: 1/A ",
            "addressLocality": "İstanbul",
            "addressRegion": "İstanbul",
            "postalCode": "34000",
            "addressCountry": "TR"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-216-399-3443",
            "contactType": "customer service",
            "availableLanguage": ["Turkish"]
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