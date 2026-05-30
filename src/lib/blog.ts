import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  publishDate: string
  status: 'published' | 'draft' | 'scheduled'
  tags: string[]
  author: string
  content: string
  readingTime?: number
  image?: string
}

export interface BlogPostMeta extends Omit<BlogPost, 'content'> {}

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true })
  }
}

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function getAllPosts(includeAll = false): BlogPostMeta[] {
  ensureBlogDir()
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    const slug = file.replace(/\.mdx$/, '')
    return {
      slug,
      title: data.title ?? 'Untitled',
      description: data.description ?? '',
      date: data.date ?? new Date().toISOString().split('T')[0],
      publishDate: data.publishDate ?? data.date ?? new Date().toISOString().split('T')[0],
      status: data.status ?? 'draft',
      tags: data.tags ?? [],
      author: data.author ?? 'FreelancerToolkit',
      image: data.image ?? '',
      readingTime: calcReadingTime(content),
    } as BlogPostMeta
  })

  return posts
    .filter((p) => includeAll || p.status === 'published')
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureBlogDir()
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? 'Untitled',
    description: data.description ?? '',
    date: data.date ?? new Date().toISOString().split('T')[0],
    publishDate: data.publishDate ?? data.date ?? new Date().toISOString().split('T')[0],
    status: data.status ?? 'draft',
    tags: data.tags ?? [],
    author: data.author ?? 'FreelancerToolkit',
    image: data.image ?? '',
    content,
    readingTime: calcReadingTime(content),
  }
}

export function savePost(slug: string, data: Partial<BlogPost> & { content: string }): void {
  ensureBlogDir()
  const frontmatter = {
    title: data.title ?? 'Untitled',
    description: data.description ?? '',
    date: data.date ?? new Date().toISOString().split('T')[0],
    publishDate: data.publishDate ?? data.date ?? new Date().toISOString().split('T')[0],
    status: data.status ?? 'draft',
    tags: data.tags ?? [],
    author: data.author ?? 'FreelancerToolkit',
    image: data.image ?? '',
  }
  const fileContent = matter.stringify(data.content, frontmatter)
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), fileContent, 'utf-8')
}

export function deletePost(slug: string): void {
  ensureBlogDir()
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

export function publishScheduledPosts(): string[] {
  ensureBlogDir()
  const now = new Date()
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  const published: string[] = []

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    if (data.status === 'scheduled' && data.publishDate) {
      const pubDate = new Date(data.publishDate)
      if (pubDate <= now) {
        const updated = matter.stringify(content, { ...data, status: 'published' })
        fs.writeFileSync(filePath, updated, 'utf-8')
        published.push(file.replace('.mdx', ''))
      }
    }
  }
  return published
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
