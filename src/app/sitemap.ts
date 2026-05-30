import type { MetadataRoute } from 'next'
import { ALL_TOOLS } from '@/lib/tools'
import { getAllPosts } from '@/lib/blog'

const BASE_URL = 'https://freelancertoolkit.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Blog posts (published only)
  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Main tool pages
  const toolPages: MetadataRoute.Sitemap = ALL_TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Programmatic variant pages
  const variantPages: MetadataRoute.Sitemap = ALL_TOOLS.flatMap((tool) =>
    (tool.programmaticVariants ?? []).map((variant) => ({
      url: `${BASE_URL}/tools/${tool.slug}/${variant.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...toolPages, ...variantPages, ...blogPages]
}
