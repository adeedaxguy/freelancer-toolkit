import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function StatCard({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href?: string }) {
  const content = (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
  return href ? <Link href={href} className="hover:shadow-md transition-shadow block">{content}</Link> : content
}

export default async function AdminDashboard() {
  const allPosts = getAllPosts(true)
  const published = allPosts.filter((p) => p.status === 'published')
  const drafts = allPosts.filter((p) => p.status === 'draft')
  const scheduled = allPosts.filter((p) => p.status === 'scheduled')

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your FreelancerToolkit site</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Published Posts" value={published.length} sub="Live on blog" href="/admin/blog" />
        <StatCard label="Drafts" value={drafts.length} sub="In progress" href="/admin/blog" />
        <StatCard label="Scheduled" value={scheduled.length} sub="Auto-publishing" href="/admin/blog" />
        <StatCard label="Tools Live" value={17} sub="Across 4 categories" />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/blog/new" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">✍️</span>
            <span>Write New Post</span>
          </Link>
          <Link href="/admin/subscribers" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">📧</span>
            <span>View Subscribers</span>
          </Link>
          <Link href="/admin/traffic" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">📈</span>
            <span>Traffic Report</span>
          </Link>
          <Link href="/admin/seo" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">🔍</span>
            <span>SEO Audit</span>
          </Link>
        </div>
      </div>

      {/* Recent posts */}
      {allPosts.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Posts</h2>
            <Link href="/admin/blog" className="text-xs font-medium text-brand-600 hover:underline">View all →</Link>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Publish Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allPosts.slice(0, 5).map((post) => (
                  <tr key={post.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                      <Link href={`/admin/blog/${post.slug}/edit`} className="hover:text-brand-600">{post.title}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === 'published' ? 'bg-green-50 text-green-700'
                        : post.status === 'scheduled' ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                      {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scheduled post notice */}
      {scheduled.length > 0 && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          <strong>{scheduled.length} post(s) scheduled</strong> — the hourly Cowork task will auto-publish them when their date arrives.
          You can also trigger publishing manually from the blog manager.
        </div>
      )}
    </div>
  )
}
