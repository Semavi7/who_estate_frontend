import { URI } from '@/components/structured-data/url'
import PropertyGetData from '@/dto/getproperty.dto'
import api from '@/lib/axios'
import { MetadataRoute } from 'next'

const getAllProperties = async (): Promise<PropertyGetData[]> => {
  try {
    const res = await api.get('/properties')
    return res.data
  } catch (error) {
    console.warn('Failed to fetch properties for sitemap during build:', error)
    return [] // Boş array döndür, sadece statik sayfalar olsun
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = URI
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ]
  const properties = await getAllProperties()
  const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/listings/${property._id}`,
    lastModified: new Date(property.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticPages, ...propertyPages]
}