import { readRequests } from '@/app/api/request-tool/route'

export const dynamic = 'force-dynamic'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'just now'
}

export default function AdminRequestsPage() {
  const isVercel = !!process.env.VERCEL

  // On Vercel, file system is read-only — requests arrive via email
  const requests = isVercel ? [] : readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const totalVotes = requests.reduce((sum, r) => sum + r.votes, 0)
  const withEmail = requests.filter((r) => r.email).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tool Requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submissions from freelancers requesting new tools to be built.
        </p>
      </div>

      {isVercel ? (
        /* Production notice */
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📬</span>
            <div>
              <h3 className="font-semibold text-brand-900">Requests arrive via email on production</h3>
              <p className="mt-1 text-sm text-brand-700">
                Because Vercel uses a read-only filesystem, each tool request triggers an instant email
                notification to <strong>adnan.webexpert@gmail.com</strong>. Check your inbox — every submission
                is delivered there in real time.
              </p>
              <p className="mt-3 text-sm text-brand-600">
                To persist requests on Vercel, connect a database (Vercel KV, PlanetScale, Supabase) and
                update <code className="bg-brand-100 px-1 rounded">src/app/api/request-tool/route.ts</code>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Requests', value: requests.length },
              { label: 'Total Votes', value: totalVotes },
              { label: 'With Contact Email', value: withEmail },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Requests list */}
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-4xl mb-3">🛠️</p>
              <p className="font-medium text-gray-700">No requests yet</p>
              <p className="mt-1 text-sm text-gray-400">
                When visitors submit tool requests on the homepage, they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-start gap-5"
                >
                  {/* Vote badge */}
                  <div className="flex flex-col items-center min-w-[48px]">
                    <span className="text-xl font-bold text-brand-600">{req.votes}</span>
                    <span className="text-xs text-gray-400">votes</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-gray-900">{req.toolName}</h3>
                      <span className="shrink-0 text-xs text-gray-400">{timeAgo(req.createdAt)}</span>
                    </div>
                    {req.description && (
                      <p className="mt-1 text-sm text-gray-600">{req.description}</p>
                    )}
                    {req.email && (
                      <p className="mt-2 text-xs text-gray-400">
                        From: <a href={`mailto:${req.email}`} className="text-brand-600 hover:underline">{req.email}</a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
