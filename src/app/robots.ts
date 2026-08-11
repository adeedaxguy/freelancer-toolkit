import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/invoice/'],
      },
    ],
    sitemap: 'https://freeltools.com/sitemap.xml',
    host: 'https://freeltools.com',
  }
}
