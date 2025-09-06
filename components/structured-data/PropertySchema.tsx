import PropertyGetData from "@/dto/getproperty.dto"
import { URI } from "./url"


export function PropertySchema({ property }: { property: PropertyGetData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `${URI}/listings/${property._id}`,
    "image": property.images?.map(img => img),
    "datePosted": property.createdAt,
    "price": {
      "@type": "PriceSpecification",
      "price": property.price,
      "priceCurrency": "TRY"
    },
    "hasOccupation": property.listingType === "Kiralık" ? "Rental" : "Sale",
    "location": {
      "@type": "Place",
      "name": `${property.location.district}, ${property.location.city}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.location.district,
        "addressRegion": property.location.city,
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": property.location.geo.coordinates[0],
        "longitude": property.location.geo.coordinates[1]
      }
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.net,
      "unitCode": "MTK"
    },
    "numberOfRooms": property.numberOfRoom,
    "numberOfBathroomsTotal": property.numberOfBathrooms,
    "yearBuilt": property.buildingAge,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "TRY",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "RealEstateAgent",
        "name": "Derya Emlak"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}