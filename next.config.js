/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Required for next-mdx-remote/rsc in App Router
  serverExternalPackages: ['gray-matter'],
}

module.exports = nextConfig
