import PropertyGetData from "@/dto/getproperty.dto";
import api from "@/lib/axios";
import { Metadata } from 'next'
import Property from "@/components/public/Property";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}


const getProperty = async (id: any): Promise<PropertyGetData> => {
  const res = await api.get(`/properties/${id}`)
  return res.data
}

export async function generateMetadata({ params }: EditPropertyPageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  
  if (!property) {
    return {
      title: 'İlan Bulunamadı',
    }
  }

  return {
    title: `${property.title} - ${property.price} TL | Derya Emlak`,
    description: `${property.location.district}, ${property.location.city} bölgesinde ${property.propertyType} ${property.listingType}. ${property.numberOfRoom} oda, ${property.net}m², ${property.price} TL.`,
    keywords: [
      property.propertyType,
      property.listingType,
      property.location.city,
      property.location.district,
      `${property.numberOfRoom} oda`,
      `${property.net}m²`,
    ],
    openGraph: {
      title: property.title,
      description: property.description,
      url: `https://deryaemlak.com/ilanlar/${id}`,
      images: property.images?.map(img => ({
        url: img,
        width: 800,
        height: 600,
        alt: property.title,
      })),
      type: 'article',
      publishedTime: property.createdAt,
      modifiedTime: property.updatedAt,
    },
    alternates: {
      canonical: `https://deryaemlak.com/listings/${id}`,
    },
  }
}

export default async function PropertyDetailPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  
  return (
    <div>
      <Property id={id}/>
    </div>
  );
}