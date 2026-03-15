import { MetadataRoute } from 'next'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talleresmecanicos.com'

  try {
    // Fetch workshops
    const workshopsRes = await axios.get(`${API_URL}/workshop?take=1000`)
    const workshops = workshopsRes.data?.body?.data || workshopsRes.data?.data || []

    const workshopEntries = workshops.map((workshop: any) => ({
      url: `${baseUrl}/taller/${workshop.id}`,
      lastModified: new Date(workshop.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/directorio`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/comunidad`,
        lastModified: new Date(),
        changeFrequency: 'always' as const,
        priority: 0.7,
      },
    ]

    return [...staticPages, ...workshopEntries]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ]
  }
}
