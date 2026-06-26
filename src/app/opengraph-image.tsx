import { ImageResponse } from 'next/og'
import { ALL_TOOLS } from '@/lib/tools'

export const runtime = 'edge'
export const alt = 'FreelancerToolkit free freelancer tools'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#052e16',
          color: '#ffffff',
          display: 'flex',
          fontFamily: 'Inter, Arial, sans-serif',
          height: '100%',
          justifyContent: 'center',
          padding: '72px',
          width: '100%',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '34px',
            color: '#111827',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            height: '100%',
            justifyContent: 'space-between',
            padding: '56px',
            width: '100%',
          }}
        >
          <div style={{ alignItems: 'center', display: 'flex', gap: '18px' }}>
            <div
              style={{
                alignItems: 'center',
                background: '#16a34a',
                borderRadius: '18px',
                color: '#ffffff',
                display: 'flex',
                fontSize: 36,
                fontWeight: 900,
                height: 72,
                justifyContent: 'center',
                width: 72,
              }}
            >
              FT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#111827', fontSize: 32, fontWeight: 800 }}>FreelancerToolkit</div>
              <div style={{ color: '#16a34a', fontSize: 22, fontWeight: 700 }}>freeltools.com</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ color: '#111827', fontSize: 68, fontWeight: 900, letterSpacing: 0, lineHeight: 1.04 }}>
              Free tools for freelancers, agencies, and consultants
            </div>
            <div style={{ color: '#4b5563', fontSize: 30, lineHeight: 1.28 }}>
              Calculators, generators, passport photos, image tools, and PDF converters. No signup required.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {[`${ALL_TOOLS.length} free tools`, 'No login', 'Private browser tools'].map((item) => (
              <div
                key={item}
                style={{
                  background: '#dcfce7',
                  borderRadius: '999px',
                  color: '#166534',
                  fontSize: 24,
                  fontWeight: 800,
                  padding: '14px 24px',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  )
}
