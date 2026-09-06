import type { Metadata } from 'next'
import AdminShell from '@/components/AdminShell'

export const metadata: Metadata = {
  title: { absolute: 'FreelTools Admin' },
  description: 'Private FreelTools administration area.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
