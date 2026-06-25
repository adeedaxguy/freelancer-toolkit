import { TOOL_CATEGORIES, type ToolCategory, type ToolMeta } from './tools'

export const CATEGORY_ROUTE_PREFIX = '/tools/category'

export function getCategoryUrl(category: ToolCategory | string): string {
  const slug = typeof category === 'string' ? category : category.slug
  return `${CATEGORY_ROUTE_PREFIX}/${slug}`
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((category) => category.slug === slug)
}

export function getCategoryForTool(tool: ToolMeta): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((category) => category.name === tool.category)
}

export function getCategoryUrlForTool(tool: ToolMeta): string {
  const category = getCategoryForTool(tool)
  return category ? getCategoryUrl(category) : '/#tools'
}

export function getCategoryKeywords(category: ToolCategory): string[] {
  const keywords = category.tools.flatMap((tool) => tool.keywords)
  return Array.from(new Set(keywords)).slice(0, 12)
}

export function getCategorySeoTitle(category: ToolCategory): string {
  const label = category.name.toLowerCase().endsWith('tools') ? category.name : `${category.name} Tools`
  return `Free ${label}`
}

export function getCategorySeoDescription(category: ToolCategory): string {
  const topTools = category.tools.slice(0, 3).map((tool) => tool.title).join(', ')
  return `${category.description} Browse ${category.tools.length} free tools including ${topTools}. No login required.`
}

export function getCategoryPlainText(category: ToolCategory): string {
  const firstKeyword = category.tools[0]?.keywords[0] ?? category.name.toLowerCase()
  return `${category.name.toLowerCase()} tools like ${firstKeyword}`
}
