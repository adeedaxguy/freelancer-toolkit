export type AdvancedToolConfig =
  | {
      kind: 'document-photo'
      documentName: string
      widthMm: number
      heightMm: number
      dpi: number
      background: string
      headSize?: string
      sourceLabel?: string
      sourceUrl?: string
      warning?: string
      printSheet?: boolean
    }
  | {
      kind: 'image-resizer'
      presetName: string
      targetWidth: number
      targetHeight: number
      format: 'jpeg' | 'png' | 'webp'
      maxSizeKb?: number
      dpi?: number
      fit: 'cover' | 'contain'
      note?: string
    }
  | {
      kind: 'image-to-pdf'
      presetName: string
      pageSize: 'a4' | 'letter' | '4x6'
      orientation: 'portrait' | 'landscape'
      note?: string
    }
  | {
      kind: 'text-generator'
      template:
        | 'nda'
        | 'contract-clause'
        | 'proposal-follow-up'
        | 'late-payment'
        | 'testimonial-request'
        | 'offboarding-checklist'
        | 'seo-meta'
        | 'case-study'
        | 'payment-terms'
        | 'rate-card'
      resultLabel: string
      note?: string
    }

type AdvancedTool = {
  slug: string
  title: string
  headline: string
  description: string
  icon: string
  category: string
  keywords: string[]
  faqs: { q: string; a: string }[]
  answerBox?: { short: string; bullets?: string[] }
  seoTitle?: string
  bodySections?: { heading: string; body: string }[]
  advancedTool: AdvancedToolConfig
}

type AdvancedCategory = {
  name: string
  slug: string
  description: string
  tools: AdvancedTool[]
}

const photoSources = {
  germany: {
    label: 'German biometric photo guidance',
    url: 'https://www.bmi.bund.de/SharedDocs/downloads/DE/publikationen/themen/moderne-verwaltung/BMI24037-fotomustertafel.html',
  },
  us: {
    label: 'U.S. Department of State passport photo rules',
    url: 'https://travel.state.gov/en/passports/apply/help/photos.html',
  },
  uk: {
    label: 'GOV.UK passport photo rules',
    url: 'https://www.gov.uk/photos-for-passports',
  },
  canada: {
    label: 'Canada passport photo requirements',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html',
  },
  india: {
    label: 'India e-Visa upload requirements',
    url: 'https://indianvisaonline.gov.in/evisa/tvoa.html',
  },
}

const photoPresets: Array<{
  slug: string
  title: string
  keyword: string
  documentName: string
  widthMm: number
  heightMm: number
  headSize?: string
  background: string
  source?: keyof typeof photoSources
}> = [
  { slug: 'germany-visa-photo-generator', title: 'Germany Visa Photo Generator', keyword: 'germany visa photo generator', documentName: 'Germany visa photo', widthMm: 35, heightMm: 45, headSize: 'Face height around 32-36 mm', background: 'plain light gray or white', source: 'germany' },
  { slug: 'germany-passport-photo-maker', title: 'Germany Passport Photo Maker', keyword: 'germany passport photo maker', documentName: 'Germany passport photo', widthMm: 35, heightMm: 45, headSize: 'Face height around 32-36 mm', background: 'plain light gray or white', source: 'germany' },
  { slug: 'us-passport-photo-maker', title: 'US Passport Photo Maker', keyword: 'us passport photo maker', documentName: 'U.S. passport photo', widthMm: 51, heightMm: 51, headSize: 'Head size 25-35 mm', background: 'plain white or off-white', source: 'us' },
  { slug: 'us-visa-photo-maker', title: 'US Visa Photo Maker', keyword: 'us visa photo maker', documentName: 'U.S. visa photo', widthMm: 51, heightMm: 51, headSize: 'Head size 25-35 mm', background: 'plain white or off-white', source: 'us' },
  { slug: 'uk-passport-photo-maker', title: 'UK Passport Photo Maker', keyword: 'uk passport photo maker', documentName: 'UK passport digital photo', widthMm: 35, heightMm: 45, headSize: 'Digital uploads should keep head and shoulders visible', background: 'plain light-coloured', source: 'uk' },
  { slug: 'canada-passport-photo-maker', title: 'Canada Passport Photo Maker', keyword: 'canada passport photo maker', documentName: 'Canada passport photo', widthMm: 50, heightMm: 70, headSize: 'Face height 31-36 mm', background: 'plain white or light-coloured', source: 'canada' },
  { slug: 'canada-visa-photo-maker', title: 'Canada Visa Photo Maker', keyword: 'canada visa photo maker', documentName: 'Canada visa photo', widthMm: 35, heightMm: 45, headSize: 'Keep face centered and clearly visible', background: 'plain white or light-coloured', source: 'canada' },
  { slug: 'india-visa-photo-maker', title: 'India Visa Photo Maker', keyword: 'india visa photo maker', documentName: 'India e-Visa photo', widthMm: 51, heightMm: 51, headSize: 'Full face, front view, eyes open', background: 'plain light-coloured or white', source: 'india' },
  { slug: 'india-passport-photo-maker', title: 'India Passport Photo Maker', keyword: 'india passport photo maker', documentName: 'India passport photo', widthMm: 51, heightMm: 51, headSize: 'Head centered from top of hair to chin', background: 'plain light-coloured or white', source: 'india' },
  { slug: 'schengen-visa-photo-maker', title: 'Schengen Visa Photo Maker', keyword: 'schengen visa photo maker', documentName: 'Schengen visa photo', widthMm: 35, heightMm: 45, headSize: 'Face should be centered and large enough for biometric checks', background: 'plain light gray or white', source: 'germany' },
  { slug: 'china-visa-photo-maker', title: 'China Visa Photo Maker', keyword: 'china visa photo maker', documentName: 'China visa photo', widthMm: 33, heightMm: 48, headSize: 'Keep full head visible and centered', background: 'plain white or light-coloured' },
  { slug: 'uae-visa-photo-maker', title: 'UAE Visa Photo Maker', keyword: 'uae visa photo maker', documentName: 'UAE visa photo', widthMm: 35, heightMm: 45, headSize: 'Keep face centered and fully visible', background: 'plain white' },
  { slug: 'saudi-visa-photo-maker', title: 'Saudi Visa Photo Maker', keyword: 'saudi visa photo maker', documentName: 'Saudi visa photo', widthMm: 51, heightMm: 51, headSize: 'Front-facing head and shoulders', background: 'plain white' },
  { slug: 'turkey-visa-photo-maker', title: 'Turkey Visa Photo Maker', keyword: 'turkey visa photo maker', documentName: 'Turkey visa photo', widthMm: 50, heightMm: 60, headSize: 'Keep full head and upper shoulders visible', background: 'plain white' },
  { slug: 'japan-visa-photo-maker', title: 'Japan Visa Photo Maker', keyword: 'japan visa photo maker', documentName: 'Japan visa photo', widthMm: 45, heightMm: 45, headSize: 'Center face with even margins', background: 'plain white or light-coloured' },
  { slug: 'australia-passport-photo-maker', title: 'Australia Passport Photo Maker', keyword: 'australia passport photo maker', documentName: 'Australia passport photo', widthMm: 35, heightMm: 45, headSize: 'Face should be centered with shoulders visible', background: 'plain light-coloured' },
  { slug: 'new-zealand-passport-photo-maker', title: 'New Zealand Passport Photo Maker', keyword: 'new zealand passport photo maker', documentName: 'New Zealand passport photo', widthMm: 35, heightMm: 45, headSize: 'Keep head and shoulders centered', background: 'plain light-coloured' },
  { slug: 'baby-passport-photo-maker', title: 'Baby Passport Photo Maker', keyword: 'baby passport photo maker', documentName: 'Baby passport photo', widthMm: 51, heightMm: 51, headSize: 'Keep only the child visible; no hands or toys', background: 'plain white or light-coloured', source: 'us' },
  { slug: 'passport-photo-4x6-print-maker', title: 'Passport Photo 4x6 Print Maker', keyword: 'passport photo 4x6 print maker', documentName: '2 x 2 inch passport photo sheet', widthMm: 51, heightMm: 51, headSize: 'Creates a 4 x 6 inch print sheet', background: 'plain white or off-white', source: 'us' },
  { slug: 'passport-size-photo-maker', title: 'Passport Size Photo Maker', keyword: 'passport size photo maker', documentName: 'passport size photo', widthMm: 35, heightMm: 45, headSize: 'Use the preset required by your application', background: 'plain white or light-coloured' },
  { slug: '35x45mm-photo-maker', title: '35x45mm Photo Maker', keyword: '35 x 45 mm photo', documentName: '35 x 45 mm photo', widthMm: 35, heightMm: 45, headSize: 'Keep the face centered with even headroom', background: 'plain white or light-coloured', source: 'germany' },
  { slug: 'biometric-photo-maker', title: 'Biometric Photo Maker', keyword: 'biometric photo maker', documentName: 'biometric ID photo', widthMm: 35, heightMm: 45, headSize: 'Front-facing, centered, neutral expression', background: 'plain white or light gray' },
  { slug: 'visa-photo-generator', title: 'Visa Photo Generator', keyword: 'visa photo generator', documentName: 'visa photo', widthMm: 35, heightMm: 45, headSize: 'Check your destination country before submitting', background: 'plain white or light-coloured' },
  { slug: 'green-card-photo-tool', title: 'Green Card Photo Tool', keyword: 'green card photo tool', documentName: 'green card photo', widthMm: 51, heightMm: 51, headSize: 'Use the same 2 x 2 inch U.S. photo crop before checking application rules', background: 'plain white or off-white', source: 'us' },
  { slug: 'emirates-id-photo-maker', title: 'Emirates ID Photo Maker', keyword: 'emirates id photo size online free', documentName: 'Emirates ID photo', widthMm: 35, heightMm: 45, headSize: 'Keep the face centered and clearly visible', background: 'plain white' },
  { slug: 'passport-size-photo-sheet-maker', title: 'Passport Size Photo Sheet Maker', keyword: 'passport size photo sheet maker', documentName: 'passport size photo sheet', widthMm: 35, heightMm: 45, headSize: 'Creates repeated passport-size prints on a 4 x 6 inch sheet', background: 'plain white or light-coloured' },
]

function makePhotoTool(preset: (typeof photoPresets)[number]): AdvancedTool {
  const source = preset.source ? photoSources[preset.source] : undefined
  return {
    slug: preset.slug,
    title: preset.title,
    headline: `Free ${preset.title}`,
    description: `Create a ${preset.widthMm}x${preset.heightMm} mm ${preset.documentName} in your browser. Upload a photo, crop it to the right ratio, export a high-resolution file, and make a 4x6 print sheet for free.`,
    seoTitle: `Free ${preset.title} | ${preset.widthMm}x${preset.heightMm} mm Online`,
    icon: '🪪',
    category: 'Passport & Visa Photo Tools',
    keywords: [preset.keyword, `${preset.documentName} size`, `${preset.widthMm}x${preset.heightMm} photo maker`, 'passport photo online free'],
    faqs: [
      { q: `What size does this ${preset.title.toLowerCase()} export?`, a: `It exports a ${preset.widthMm}x${preset.heightMm} mm image at 300 DPI, which is the standard print resolution used by most photo labs.` },
      { q: 'Are my photos uploaded to a server?', a: 'No. The crop and export happen locally in your browser using canvas. Your photo does not leave your device.' },
      { q: 'Does this guarantee official acceptance?', a: 'No online cropper can guarantee acceptance. Use this to size and print the photo, then verify current government rules for lighting, expression, background, recency, and head position before submitting.' },
    ],
    bodySections: [
      {
        heading: `${preset.keyword} without paid credits`,
        body: `Many passport-photo apps charge for the final download. This free tool gives you the crop, high-resolution export, and printable sheet without an account or watermark.`,
      },
      {
        heading: 'Built for privacy',
        body: 'The image is processed on your own device. That makes it useful for sensitive ID photos because there is no upload step and no remote storage.',
      },
    ],
    advancedTool: {
      kind: 'document-photo',
      documentName: preset.documentName,
      widthMm: preset.widthMm,
      heightMm: preset.heightMm,
      dpi: 300,
      background: preset.background,
      headSize: preset.headSize,
      sourceLabel: source?.label,
      sourceUrl: source?.url,
      printSheet: true,
      warning: 'Always confirm the current rules on the official application site before submitting.',
    },
  }
}

const imagePresets: Array<{
  slug: string
  title: string
  keyword: string
  width: number
  height: number
  format: 'jpeg' | 'png' | 'webp'
  maxKb?: number
  dpi?: number
  fit?: 'cover' | 'contain'
  note?: string
  useCase?: string
}> = [
  { slug: 'resize-image-to-35x45mm', title: 'Resize Image to 35x45mm', keyword: 'resize image to 35x45mm', width: 413, height: 531, format: 'jpeg', dpi: 300, note: '35x45 mm at 300 DPI' },
  { slug: 'resize-image-to-2x2-inch', title: 'Resize Image to 2x2 Inch', keyword: 'resize image to 2x2 inch', width: 600, height: 600, format: 'jpeg', dpi: 300, note: '2x2 inches at 300 DPI' },
  { slug: 'resize-photo-to-600x600', title: 'Resize Photo to 600x600', keyword: 'resize photo to 600x600', width: 600, height: 600, format: 'jpeg' },
  { slug: 'resize-photo-to-300x300', title: 'Resize Photo to 300x300', keyword: 'resize photo to 300x300', width: 300, height: 300, format: 'jpeg' },
  { slug: 'resize-photo-to-413x531', title: 'Resize Photo to 413x531', keyword: 'resize photo to 413x531', width: 413, height: 531, format: 'jpeg' },
  { slug: 'resize-image-to-20kb', title: 'Resize Image to 20KB', keyword: 'resize image to 20kb', width: 300, height: 300, format: 'jpeg', maxKb: 20 },
  { slug: 'resize-image-to-50kb', title: 'Resize Image to 50KB', keyword: 'resize image to 50kb', width: 600, height: 600, format: 'jpeg', maxKb: 50 },
  { slug: 'resize-image-to-100kb', title: 'Resize Image to 100KB', keyword: 'resize image to 100kb', width: 800, height: 800, format: 'jpeg', maxKb: 100 },
  { slug: 'resize-image-to-10kb', title: 'Resize Image to 10KB', keyword: 'resize image to 10kb', width: 240, height: 240, format: 'jpeg', maxKb: 10 },
  { slug: 'resize-image-to-15kb', title: 'Resize Image to 15KB', keyword: 'resize image to 15kb', width: 300, height: 300, format: 'jpeg', maxKb: 15 },
  { slug: 'resize-image-to-25kb', title: 'Resize Image to 25KB', keyword: 'resize image to 25kb', width: 400, height: 400, format: 'jpeg', maxKb: 25 },
  { slug: 'resize-image-to-30kb', title: 'Resize Image to 30KB', keyword: 'resize image to 30kb', width: 450, height: 450, format: 'jpeg', maxKb: 30 },
  { slug: 'resize-image-to-40kb', title: 'Resize Image to 40KB', keyword: 'resize image to 40kb', width: 500, height: 500, format: 'jpeg', maxKb: 40 },
  { slug: 'resize-image-to-75kb', title: 'Resize Image to 75KB', keyword: 'resize image to 75kb', width: 700, height: 700, format: 'jpeg', maxKb: 75 },
  { slug: 'resize-image-to-150kb', title: 'Resize Image to 150KB', keyword: 'resize image to 150kb', width: 1000, height: 1000, format: 'jpeg', maxKb: 150 },
  { slug: 'resize-image-to-200kb', title: 'Resize Image to 200KB', keyword: 'resize image to 200kb', width: 1200, height: 1200, format: 'jpeg', maxKb: 200 },
  { slug: 'resize-image-to-250kb', title: 'Resize Image to 250KB', keyword: 'resize image to 250kb', width: 1200, height: 1200, format: 'jpeg', maxKb: 250 },
  { slug: 'resize-image-to-500kb', title: 'Resize Image to 500KB', keyword: 'resize image to 500kb', width: 1600, height: 1600, format: 'jpeg', maxKb: 500 },
  { slug: 'compress-image-to-50kb', title: 'Compress Image to 50KB', keyword: 'compress image to 50kb', width: 800, height: 800, format: 'jpeg', maxKb: 50, fit: 'contain' },
  { slug: 'compress-image-to-100kb', title: 'Compress Image to 100KB', keyword: 'compress image to 100kb', width: 1000, height: 1000, format: 'jpeg', maxKb: 100, fit: 'contain' },
  { slug: 'compress-image-to-200kb', title: 'Compress Image to 200KB', keyword: 'compress image to 200kb', width: 1400, height: 1400, format: 'jpeg', maxKb: 200, fit: 'contain' },
  { slug: 'jpg-resize-to-50kb', title: 'JPG Resize to 50KB', keyword: 'jpg resize to 50kb', width: 600, height: 600, format: 'jpeg', maxKb: 50 },
  { slug: 'jpg-resize-to-100kb', title: 'JPG Resize to 100KB', keyword: 'jpg resize to 100kb', width: 800, height: 800, format: 'jpeg', maxKb: 100 },
  { slug: 'png-to-webp-converter', title: 'PNG to WebP Converter', keyword: 'png to webp converter', width: 1600, height: 1200, format: 'webp', fit: 'contain' },
  { slug: 'webp-to-png-converter', title: 'WebP to PNG Converter', keyword: 'webp to png converter', width: 1600, height: 1200, format: 'png', fit: 'contain' },
  { slug: 'resume-photo-resizer', title: 'Resume Photo Resizer', keyword: 'resume photo resizer', width: 600, height: 600, format: 'jpeg', maxKb: 100 },
  { slug: 'job-application-photo-resizer', title: 'Job Application Photo Resizer', keyword: 'job application photo resizer', width: 600, height: 600, format: 'jpeg', maxKb: 50 },
  { slug: 'online-form-photo-resizer', title: 'Online Form Photo Resizer', keyword: 'online form photo resizer', width: 500, height: 500, format: 'jpeg', maxKb: 50 },
  { slug: 'compress-image-to-20kb', title: 'Compress Image to 20KB', keyword: 'compress image to 20kb', width: 1000, height: 1000, format: 'jpeg', maxKb: 20, fit: 'contain' },
  { slug: 'jpg-resize-to-20kb', title: 'JPG Resize to 20KB', keyword: 'jpg resize 20kb', width: 300, height: 300, format: 'jpeg', maxKb: 20 },
  { slug: 'make-photo-100kb', title: 'Make Photo 100KB', keyword: 'make 100 kb photo', width: 800, height: 800, format: 'jpeg', maxKb: 100, fit: 'contain' },
  { slug: 'passport-size-photo-resizer', title: 'Passport Size Photo Resizer', keyword: 'resize picture passport size', width: 413, height: 531, format: 'jpeg', dpi: 300, note: '35x45 mm passport-style output at 300 DPI' },
  { slug: 'resize-signature-to-20kb', title: 'Resize Signature to 20KB', keyword: 'resize signature to 20kb', width: 400, height: 160, format: 'jpeg', maxKb: 20, fit: 'contain' },
  { slug: 'resize-signature-to-50kb', title: 'Resize Signature to 50KB', keyword: 'resize signature to 50kb', width: 600, height: 240, format: 'jpeg', maxKb: 50, fit: 'contain' },
  { slug: 'resize-photo-under-20kb', title: 'Resize Photo Under 20KB', keyword: 'resize photo under 20kb', width: 300, height: 300, format: 'jpeg', maxKb: 20 },
  { slug: 'resize-photo-under-50kb', title: 'Resize Photo Under 50KB', keyword: 'resize photo under 50kb', width: 600, height: 600, format: 'jpeg', maxKb: 50 },
  { slug: 'resize-photo-under-100kb', title: 'Resize Photo Under 100KB', keyword: 'resize photo under 100kb', width: 800, height: 800, format: 'jpeg', maxKb: 100 },
  { slug: 'make-photo-300-dpi', title: 'Make Photo 300 DPI', keyword: 'make photo 300 dpi', width: 1200, height: 1800, format: 'jpeg', dpi: 300, fit: 'contain' },
  { slug: 'jpg-to-webp-converter', title: 'JPG to WebP Converter', keyword: 'jpg to webp converter', width: 1600, height: 1200, format: 'webp', fit: 'contain' },
  { slug: 'png-to-jpg-converter', title: 'PNG to JPG Converter', keyword: 'png to jpg converter', width: 1600, height: 1200, format: 'jpeg', fit: 'contain' },
  { slug: 'webp-to-jpg-converter', title: 'WebP to JPG Converter', keyword: 'webp to jpg converter', width: 1600, height: 1200, format: 'jpeg', fit: 'contain' },
  { slug: 'favicon-generator', title: 'Favicon Generator', keyword: 'favicon generator', width: 512, height: 512, format: 'png' },
  { slug: 'app-icon-generator', title: 'App Icon Generator', keyword: 'app icon generator', width: 1024, height: 1024, format: 'png' },
  { slug: 'youtube-thumbnail-resizer', title: 'YouTube Thumbnail Resizer', keyword: 'youtube thumbnail resizer', width: 1280, height: 720, format: 'jpeg' },
  { slug: 'linkedin-banner-resizer', title: 'LinkedIn Banner Resizer', keyword: 'linkedin banner resizer', width: 1584, height: 396, format: 'jpeg' },
  { slug: 'instagram-profile-picture-resizer', title: 'Instagram Profile Picture Resizer', keyword: 'instagram profile picture resizer', width: 320, height: 320, format: 'jpeg', fit: 'cover', useCase: 'Instagram profile uploads' },
  { slug: 'instagram-post-resizer', title: 'Instagram Post Resizer', keyword: 'instagram post resizer', width: 1080, height: 1080, format: 'jpeg', fit: 'cover', useCase: 'Instagram square posts' },
  { slug: 'instagram-story-resizer', title: 'Instagram Story Resizer', keyword: 'instagram story resizer', width: 1080, height: 1920, format: 'jpeg', fit: 'cover', useCase: 'Instagram Stories and Reels covers' },
  { slug: 'facebook-cover-photo-resizer', title: 'Facebook Cover Photo Resizer', keyword: 'facebook cover photo resizer', width: 1640, height: 924, format: 'jpeg', fit: 'cover', useCase: 'Facebook cover photos' },
  { slug: 'facebook-profile-picture-resizer', title: 'Facebook Profile Picture Resizer', keyword: 'facebook profile picture resizer', width: 400, height: 400, format: 'jpeg', fit: 'cover', useCase: 'Facebook profile uploads' },
  { slug: 'linkedin-profile-picture-resizer', title: 'LinkedIn Profile Picture Resizer', keyword: 'linkedin profile picture resizer', width: 400, height: 400, format: 'jpeg', fit: 'cover', useCase: 'LinkedIn profile uploads' },
  { slug: 'twitter-header-resizer', title: 'Twitter Header Resizer', keyword: 'twitter header resizer', width: 1500, height: 500, format: 'jpeg', fit: 'cover', useCase: 'X/Twitter profile headers' },
  { slug: 'twitter-post-image-resizer', title: 'Twitter Post Image Resizer', keyword: 'twitter post image resizer', width: 1600, height: 900, format: 'jpeg', fit: 'cover', useCase: 'X/Twitter post images' },
  { slug: 'youtube-channel-art-resizer', title: 'YouTube Channel Art Resizer', keyword: 'youtube channel art resizer', width: 2560, height: 1440, format: 'jpeg', fit: 'cover', useCase: 'YouTube channel art' },
  { slug: 'tiktok-profile-picture-resizer', title: 'TikTok Profile Picture Resizer', keyword: 'tiktok profile picture resizer', width: 200, height: 200, format: 'jpeg', fit: 'cover', useCase: 'TikTok profile uploads' },
  { slug: 'tiktok-video-cover-resizer', title: 'TikTok Video Cover Resizer', keyword: 'tiktok video cover resizer', width: 1080, height: 1920, format: 'jpeg', fit: 'cover', useCase: 'TikTok video covers' },
  { slug: 'pinterest-pin-resizer', title: 'Pinterest Pin Resizer', keyword: 'pinterest pin resizer', width: 1000, height: 1500, format: 'jpeg', fit: 'cover', useCase: 'Pinterest pins' },
  { slug: 'google-business-profile-photo-resizer', title: 'Google Business Profile Photo Resizer', keyword: 'google business profile photo resizer', width: 720, height: 720, format: 'jpeg', fit: 'cover', useCase: 'Google Business Profile photos' },
  { slug: 'shopify-product-image-resizer', title: 'Shopify Product Image Resizer', keyword: 'shopify product image resizer', width: 2048, height: 2048, format: 'jpeg', fit: 'contain', useCase: 'Shopify product images' },
  { slug: 'amazon-product-image-resizer', title: 'Amazon Product Image Resizer', keyword: 'amazon product image resizer', width: 2000, height: 2000, format: 'jpeg', fit: 'contain', useCase: 'Amazon product images' },
  { slug: 'etsy-listing-photo-resizer', title: 'Etsy Listing Photo Resizer', keyword: 'etsy listing photo resizer', width: 2000, height: 2000, format: 'jpeg', fit: 'contain', useCase: 'Etsy listing photos' },
  { slug: 'website-hero-image-resizer', title: 'Website Hero Image Resizer', keyword: 'website hero image resizer', width: 1920, height: 1080, format: 'jpeg', fit: 'cover', useCase: 'website hero sections' },
  { slug: 'open-graph-image-resizer', title: 'Open Graph Image Resizer', keyword: 'open graph image resizer', width: 1200, height: 630, format: 'jpeg', fit: 'cover', useCase: 'Open Graph and social share cards' },
  { slug: 'blog-featured-image-resizer', title: 'Blog Featured Image Resizer', keyword: 'blog featured image resizer', width: 1200, height: 675, format: 'jpeg', fit: 'cover', useCase: 'blog featured images' },
  { slug: 'email-header-image-resizer', title: 'Email Header Image Resizer', keyword: 'email header image resizer', width: 600, height: 200, format: 'jpeg', fit: 'cover', useCase: 'email newsletter headers' },
]

const imageToolOverrides: Record<
  string,
  Partial<Pick<AdvancedTool, 'description' | 'seoTitle' | 'keywords' | 'faqs' | 'bodySections' | 'answerBox'>>
> = {
  'resize-image-to-10kb': {
    description: 'Free resize image to 10KB tool. Compress a JPG, PNG, or WebP into a tiny upload-ready image in your browser without signup.',
    seoTitle: 'Resize Image to 10KB Online Free',
    keywords: ['resize image to 10kb', 'image under 10kb', 'compress photo to 10kb', '10kb image resizer', 'photo size 10kb'],
    faqs: [
      { q: 'Can an image still look clear at 10KB?', a: 'Only simple profile photos, icons, signatures, and small headshots usually hold up at 10KB. Use a higher limit if the upload form allows it.' },
      { q: 'Is this good for strict application forms?', a: 'Yes. Use it when a portal gives a very small maximum file size and rejects anything larger.' },
      { q: 'Are files uploaded to a server?', a: 'No. The resize and compression process runs locally in your browser.' },
    ],
    bodySections: [
      { heading: 'Resize image to 10KB for strict upload portals', body: 'A 10KB image limit is unusually tight, so this preset focuses on small square outputs that can pass older forms, profile uploads, and lightweight attachment checks.' },
      { heading: 'Start from a simple crop', body: 'For the best result, crop out empty background first. A clean face photo or signature compresses better than a full-resolution phone image.' },
    ],
  },
  'resize-image-to-15kb': {
    description: 'Free resize image to 15KB tool. Reduce a photo below 15KB in your browser for application portals, profile images, and small form uploads.',
    seoTitle: 'Resize Image to 15KB Online Free',
    keywords: ['resize image to 15kb', 'image under 15kb', 'compress image to 15kb', 'photo under 15kb', '15kb image resizer'],
  },
  'resize-image-to-30kb': {
    description: 'Free resize image to 30KB tool. Make a photo or form image fit under a 30KB upload limit without installing software.',
    seoTitle: 'Resize Image to 30KB Online Free',
    keywords: ['resize image to 30kb', 'photo under 30kb', 'compress image to 30kb', 'image size 30kb', '30kb photo resizer'],
  },
  'resize-image-to-200kb': {
    description: 'Free resize image to 200KB tool. Compress large photos into a cleaner 200KB upload file while keeping more detail than tiny 20KB limits.',
    seoTitle: 'Resize Image to 200KB Online Free',
    keywords: ['resize image to 200kb', 'compress image to 200kb', 'photo under 200kb', 'image size 200kb', '200kb image resizer'],
  },
  'resize-image-to-500kb': {
    description: 'Free resize image to 500KB tool. Reduce a large image under 500KB for web uploads, forms, CMS images, and email attachments.',
    seoTitle: 'Resize Image to 500KB Online Free',
    keywords: ['resize image to 500kb', 'compress image to 500kb', 'photo under 500kb', '500kb image resizer', 'reduce image size to 500kb'],
  },
  'compress-image-to-50kb': {
    description: 'Free compress image to 50KB tool. Reduce a photo or form image below 50KB in your browser without an account or watermark.',
    seoTitle: 'Compress Image to 50KB Online Free',
    keywords: ['compress image to 50kb', 'image under 50kb', 'reduce photo size to 50kb', 'photo compressor 50kb', 'resize image to 50kb'],
  },
  'compress-image-to-100kb': {
    description: 'Free compress image to 100KB tool. Make a photo smaller for upload forms, web profiles, and document portals while keeping useful detail.',
    seoTitle: 'Compress Image to 100KB Online Free',
    keywords: ['compress image to 100kb', 'image under 100kb', 'reduce photo size to 100kb', 'photo compressor 100kb', 'resize image to 100kb'],
  },
  'job-application-photo-resizer': {
    description: 'Free job application photo resizer. Resize and compress a profile photo for job portals, resumes, and application forms in your browser.',
    seoTitle: 'Job Application Photo Resizer Online Free',
    keywords: ['job application photo resizer', 'resume photo resizer', 'profile photo for job application', 'photo under 50kb', 'application photo resizer'],
  },
  'online-form-photo-resizer': {
    description: 'Free online form photo resizer. Prepare a small JPG photo for portals that require specific dimensions or a strict file-size limit.',
    seoTitle: 'Online Form Photo Resizer Free',
    keywords: ['online form photo resizer', 'application form photo resizer', 'resize photo for form', 'photo upload size reducer', 'profile photo resizer'],
  },
  'resize-image-to-20kb': {
    description: 'Free resize image to 20KB tool. Upload a JPG, PNG, or photo, reduce the file to 20KB or less, and download the result in your browser without signup.',
    seoTitle: 'Resize Image to 20KB Online Free | Photo Under 20KB',
    keywords: ['resize image to 20kb', 'photo under 20kb', 'image size 20kb', 'compress image to 20kb', 'resize photo under 20kb'],
    answerBox: {
      short: 'To resize an image to 20KB, start with the smallest clean crop possible, then reduce dimensions and JPEG quality until the file lands at 20KB or less. This tool is built for that exact upload-form workflow.',
      bullets: ['Best fit: government, school, and job portals with strict size limits', 'Outperformance angle: exact-size workflow plus private in-browser processing'],
    },
    faqs: [
      { q: 'Can I resize an image to exactly 20KB?', a: 'The tool targets 20KB or less by adjusting dimensions and JPEG quality. Exact file size can vary slightly by the source image, but it is built for strict upload limits.' },
      { q: 'Does this work for photos and scanned documents?', a: 'Yes. It works best for JPG-style photos, form uploads, passport images, signatures, and other files that need a small size target.' },
      { q: 'Are my files uploaded to a server?', a: 'No. The resize and compression workflow runs in your browser, so the file stays on your device.' },
    ],
    bodySections: [
      {
        heading: 'Resize image to 20KB for strict upload forms',
        body: 'Many government, job, and school portals reject uploads above a tiny limit. This tool is designed for that exact workflow: reduce the image, preview it, and keep trying until the file is ready for the form.',
      },
      {
        heading: 'Better than guessing in a photo editor',
        body: 'Instead of exporting the same file again and again, use a preset built for the 20KB target. It saves time when you need a small file for an application, profile photo, or form attachment.',
      },
    ],
  },
  'compress-image-to-20kb': {
    description: 'Free compress image to 20KB tool. Reduce a photo or document image under a 20KB limit without installing software or sending the file to a server.',
    seoTitle: 'Compress Image to 20KB Online Free',
    keywords: ['compress image to 20kb', 'image under 20kb', 'reduce photo size to 20kb', 'photo compressor 20kb', 'resize image to 20kb'],
    faqs: [
      { q: 'What is the difference between compressing and resizing to 20KB?', a: 'Compression lowers quality and file weight, while resizing changes the dimensions too. This preset uses both when needed to help you reach the 20KB target.' },
      { q: 'Will the compressed image still be readable?', a: 'Usually yes for common upload use cases. If text becomes blurry, try a cleaner source image or a slightly larger target preset like 50KB.' },
      { q: 'Can I use this for application photo uploads?', a: 'Yes. It is useful for profile photos, supporting documents, and other portals that set a strict maximum image size.' },
    ],
    bodySections: [
      {
        heading: 'Compress image to 20KB without trial and error',
        body: 'The tool is built for users who know the upload limit but do not want to manually test multiple exports. Start with the source image and let the browser workflow push it toward the 20KB goal.',
      },
      {
        heading: 'Good fit for forms, IDs, and lightweight uploads',
        body: 'If a website rejects larger files, this preset gives you a fast path to a smaller version without uploading the image anywhere else.',
      },
    ],
  },
  'jpg-resize-to-20kb': {
    description: 'Free JPG resize to 20KB tool. Reduce a JPG photo under a 20KB limit and download the compressed version instantly in your browser.',
    seoTitle: 'JPG Resize to 20KB Online | Free JPG Compressor',
    keywords: ['jpg resize 20kb', 'jpg to 20kb', 'resize jpg to 20kb', 'compress jpg under 20kb', 'jpg file size 20kb'],
    answerBox: {
      short: 'JPG is usually the fastest format for hitting a 20KB limit because JPEG compression removes more weight than PNG on photo-style images. This page focuses on the strict JPG upload use case rather than generic image editing.',
      bullets: ['Best fit: JPG-only forms, signatures, profile photos, and attachments', 'Outperformance angle: JPG-first workflow for repeat low-KB uploads'],
    },
    faqs: [
      { q: 'Does this work only for JPG images?', a: 'This preset is optimized for JPG output because JPEG compression is usually the fastest way to reach a strict 20KB size target.' },
      { q: 'Can I convert a PNG photo and still hit 20KB?', a: 'Yes. Upload the file and the tool can export it as a JPG to help reduce the final size for upload forms.' },
      { q: 'Is there a watermark or account wall?', a: 'No. You can resize the JPG and download it directly without signing in.' },
    ],
    bodySections: [
      {
        heading: 'JPG resize to 20KB for upload-ready photos',
        body: 'This page is useful when a form specifically accepts JPG or JPEG files and gives you a very small file-size ceiling. It focuses on that exact use case instead of a generic image editor workflow.',
      },
      {
        heading: 'Fast for repeat document uploads',
        body: 'If you regularly prepare profile photos, signatures, or scanned JPG attachments, this preset helps you get under 20KB faster than resizing by hand.',
      },
    ],
  },
  'resize-photo-to-413x531': {
    description: 'Free resize photo to 413x531 tool. Export a 35x45mm-style photo at 300 DPI for passport, visa, and form uploads without using desktop software.',
    seoTitle: 'Resize Photo to 413x531 Online Free',
    keywords: ['resize photo to 413x531', '413x531 photo resize', '413x531 passport photo', '35x45mm photo in pixels', '413x531 image resizer'],
    answerBox: {
      short: 'A 35x45mm passport-style photo exported at 300 DPI is about 413x531 pixels. This page is for people who already know the exact pixel target and need the file quickly for a visa, passport, or application upload without guessing the conversion.',
      bullets: ['Best fit: 35x45mm digital uploads and print-ready passport photos', 'Outperformance angle: exact 413x531 export instead of generic square passport croppers'],
    },
    faqs: [
      { q: 'Why is 35x45mm often saved as 413x531 pixels?', a: 'At 300 DPI, 35x45mm converts to roughly 413x531 pixels. That is why many passport-style digital workflows use this exact pixel size.' },
      { q: 'Is 413x531 the same as every passport photo size?', a: 'No. It matches the common 35x45mm format, but some countries and portals ask for 2x2 inch, 600x600, or other exact dimensions.' },
      { q: 'Can I print the result after resizing?', a: 'Yes. This output is aligned with 300 DPI print sizing, but you should still confirm the official photo rules before submitting or printing.' },
    ],
    bodySections: [
      {
        heading: 'Resize photo to 413x531 for 35x45mm requirements',
        body: 'People searching for 413x531 usually already know the target and want the file, not a long tutorial. This page gives them the exact pixel workflow tied to the common 35x45mm passport-photo format.',
      },
      {
        heading: 'Useful for passport, visa, and portal uploads',
        body: 'Use this preset when a portal asks for 35x45mm sizing in pixel form or when you want to prepare a clean digital file before creating a print sheet or country-specific photo export.',
      },
      {
        heading: 'Matches the exact 413x531 search job',
        body: 'Searchers using this query usually do not need photo theory. They need the exact pixel output tied to the 35x45mm standard, plus a quick explanation of why the conversion lands at 413x531.',
      },
    ],
  },
  'passport-photo-4x6-print-maker': {
    description: 'Free passport photo 4x6 print maker. Place passport-size photos on a 4x6 sheet, export a clean print-ready image, and avoid manual photo-sheet layouts.',
    seoTitle: 'Passport Photo 4x6 Print Maker Online Free',
    keywords: ['passport photo 4x6 print maker', 'passport photo print sheet', '4x6 passport photo template', 'print passport photo at home', 'passport photo 4x6 layout'],
    answerBox: {
      short: 'A passport photo 4x6 print maker should take a correctly sized portrait and place multiple copies on a 4x6 sheet you can print at home or at a photo counter. This page is built for that exact print-sheet workflow.',
      bullets: ['Best fit: printing passport-style photos on a standard 4x6 sheet', 'Outperformance angle: print-sheet output instead of only a single cropped passport image'],
    },
    faqs: [
      { q: 'Why print passport photos on a 4x6 sheet?', a: 'A 4x6 print is a common low-cost photo size at home printers and retail photo counters. A print sheet lets you place multiple passport photos on that format instead of printing one small image at a time.' },
      { q: 'Does this replace country-specific passport rules?', a: 'No. Use it after you have the right crop and photo dimensions for your country or visa process. The print maker helps with layout, not the underlying legal photo requirements.' },
      { q: 'Can I use this for U.S. 2x2 passport photos?', a: 'Yes. A 4x6 sheet is a common way to print multiple 2x2 inch passport photos as long as the source image already matches the correct U.S. passport requirements.' },
    ],
    bodySections: [
      {
        heading: 'Passport photo 4x6 print maker for home and retail printing',
        body: 'Use this when you already have the correct passport-style crop and need a clean print sheet fast. The page focuses on arranging multiple copies on a 4x6 layout without opening desktop photo software.',
      },
      {
        heading: 'Useful after resizing a passport or visa photo',
        body: 'The usual workflow is resize first, then build the print sheet. This tool fits that search intent by giving users the layout step they need after preparing a compliant digital passport image.',
      },
    ],
  },
  'passport-size-photo-resizer': {
    description: 'Free passport size photo resizer. Resize a portrait into a passport-style crop, export a 35x45mm-ready JPG, and prepare a clean upload file in your browser.',
    seoTitle: 'Passport Size Photo Resizer Online Free',
    keywords: ['passport size photo resizer', 'resize picture passport size', 'passport photo resizer online', 'passport size photo maker', 'passport image resizer'],
    answerBox: {
      short: 'A passport size photo resizer should do more than shrink the file. It needs the right crop ratio, a clean export, and enough detail for form uploads or print sheets.',
      bullets: ['Best fit: generic passport-style crops before country-specific checks', 'Outperformance angle: privacy-safe cropper for both upload and print prep'],
    },
    faqs: [
      { q: 'What passport size does this resizer make?', a: 'This preset is built around a common 35x45mm passport-style output at 300 DPI. Always confirm whether your application wants that size or another format such as 2x2 inches.' },
      { q: 'Can I use this for visa photos too?', a: 'Yes, when the visa application uses a passport-style crop. If you already know the country format, a country-specific preset can be a safer choice.' },
      { q: 'Will the file stay private?', a: 'Yes. The crop and export happen in your browser, so the source photo is not uploaded to a remote server.' },
    ],
    bodySections: [
      {
        heading: 'Passport size photo resizer for fast form prep',
        body: 'Many searchers want a general passport-size workflow before they know the exact country rule. This page gives them a practical crop-and-export step without asking them to install photo software.',
      },
      {
        heading: 'Use this before a country-specific final check',
        body: 'The safest workflow is to resize the portrait into a clean passport-style image first, then compare it against the government or visa portal rules for background, head size, and final upload format.',
      },
    ],
  },
  'resize-photo-under-20kb': {
    description: 'Free resize photo under 20KB tool. Upload a passport photo, profile picture, or form image and reduce it below 20KB in your browser.',
    seoTitle: 'Resize Photo Under 20KB Online Free',
    keywords: ['resize photo under 20kb', 'photo under 20kb', 'reduce photo size under 20kb', 'passport photo under 20kb', 'resize image to 20kb'],
    faqs: [
      { q: 'Can I make a passport-style photo under 20KB?', a: 'Yes. Many users need a small profile or document photo for application forms. The tool helps reduce the file size while keeping the picture usable.' },
      { q: 'Why would a website require a photo under 20KB?', a: 'Some older forms and public-sector portals still enforce very small upload limits. This tool is designed for those exact cases.' },
      { q: 'Will the photo stay private?', a: 'Yes. The file is processed locally in your browser and is not uploaded to a server.' },
    ],
    bodySections: [
      {
        heading: 'Resize photo under 20KB for application portals',
        body: 'When a form asks for a tiny image upload, the real challenge is getting the file small enough without opening desktop software. This preset gives you a browser-based shortcut.',
      },
      {
        heading: 'Helpful for profile photos, IDs, and signatures',
        body: 'Use it for any lightweight photo requirement where the final file needs to stay below a strict 20KB threshold.',
      },
    ],
  },
  'favicon-generator': {
    description: 'Free favicon generator. Upload a square image, export a clean favicon-ready PNG, and prepare a browser-tab icon without opening design software.',
    seoTitle: 'Favicon Generator Online Free | Create a Browser Icon',
    keywords: ['favicon generator', 'create favicon online', 'website icon generator', 'browser tab icon generator', 'favicon maker free'],
    faqs: [
      { q: 'What image should I upload to make a favicon?', a: 'Start with a square logo or symbol that stays clear at very small sizes. Simple shapes and strong contrast work best for browser tabs.' },
      { q: 'Is this good for website favicons and app shortcuts?', a: 'Yes. It helps you create a clean square source image that can be used for browser tabs, bookmarks, and related icon workflows.' },
      { q: 'Do I need Photoshop or Figma for this?', a: 'No. The tool handles the resize and export in your browser so you can create a favicon-ready asset quickly.' },
    ],
    bodySections: [
      {
        heading: 'Create a favicon without opening design software',
        body: 'If you already have a logo or simple mark, this tool is the fastest way to turn it into a favicon-ready asset for a browser tab or website header.',
      },
      {
        heading: 'Useful before exporting a full icon set',
        body: 'Many teams start by testing a favicon in the browser before making larger app or social icon exports. This page gives you that lightweight first step.',
      },
    ],
  },
  'app-icon-generator': {
    description: 'Free app icon generator. Upload artwork, fit it to a clean 1024x1024 canvas, and export an app-store-ready icon in your browser.',
    seoTitle: 'App Icon Generator Online Free | 1024x1024 Icon Tool',
    keywords: ['app icon generator', 'app icon maker', '1024x1024 app icon', 'ios app icon generator', 'android app icon generator'],
    answerBox: {
      short: 'An app icon generator should give you a clean 1024x1024 master icon with enough padding and contrast to test store-readiness quickly. This page is built for that fast iteration workflow before you export platform-specific variants.',
      bullets: ['Best fit: app-store master icon prep and fast icon iteration', 'Outperformance angle: simple browser workflow for a clean 1024x1024 source asset'],
    },
    faqs: [
      { q: 'What size does this app icon generator export?', a: 'This preset creates a 1024x1024 PNG, which is a common master size for app-store and launcher icon workflows.' },
      { q: 'Can I use this for iOS and Android icon prep?', a: 'Yes. It is useful as a clean master icon before you generate platform-specific sizes in your build or design workflow.' },
      { q: 'Will it remove the background automatically?', a: 'No. Start with artwork that already looks the way you want. The tool focuses on sizing, fitting, and exporting the final icon canvas.' },
    ],
    bodySections: [
      {
        heading: 'App icon generator for launch checklists',
        body: 'Use this when you have a logo or mark and need a clean 1024x1024 icon asset quickly for an app listing, test build, or design handoff.',
      },
      {
        heading: 'Good for fast iteration before a design polish pass',
        body: 'Teams often need a usable icon before they finalize every detail. This preset helps you test composition, padding, and readability without opening a heavier design tool.',
      },
      {
        heading: 'Useful when the search intent is 1024x1024 app icon prep',
        body: 'Many searchers are not looking for a full design suite. They just need a clean 1024x1024 output to test an app listing, send to a developer, or validate how the icon reads at small sizes.',
      },
    ],
  },
}

function makeImageTool(preset: (typeof imagePresets)[number]): AdvancedTool {
  const overrides = imageToolOverrides[preset.slug]

  return {
    slug: preset.slug,
    title: preset.title,
    headline: `${preset.title} Online`,
    description: overrides?.description ?? `Free ${preset.keyword} tool. Upload an image, crop or fit it to ${preset.width}x${preset.height}px, compress it, and download a file ready for ${preset.useCase ?? 'forms and uploads'} in your browser.`,
    seoTitle: overrides?.seoTitle ?? `Free ${preset.title} Online | No Signup`,
    icon: '🖼️',
    category: 'Image & Application File Tools',
    keywords: overrides?.keywords ?? [preset.keyword, 'resize image online free', 'compress photo online', `${preset.width}x${preset.height} image resizer`],
    faqs: overrides?.faqs ?? [
      { q: 'Does this tool upload my image?', a: 'No. Image processing runs in your browser. The file stays on your device.' },
      { q: 'Can I control the final file size?', a: preset.maxKb ? `Yes. This preset targets ${preset.maxKb}KB or less by lowering JPEG quality when possible.` : 'Yes. Use the quality slider to reduce file size before downloading.' },
      { q: 'Will resizing reduce quality?', a: 'Resizing and JPEG compression can reduce quality. The preview and file-size estimate help you choose the best balance before downloading.' },
    ],
    bodySections: overrides?.bodySections ?? [
      {
        heading: `${preset.keyword} for ${preset.useCase ?? 'forms and uploads'}`,
        body: preset.useCase
          ? 'Social platforms, marketplaces, websites, and email tools often crop images awkwardly when the aspect ratio is wrong. This preset gives you a targeted output without opening design software.'
          : 'Application portals often reject files that are the wrong pixel size or too large. This tool gives you a targeted output without installing design software.',
      },
      {
        heading: 'Fast private browser processing',
        body: 'The file is drawn on a browser canvas and downloaded directly. There is no queue, watermark, or account gate.',
      },
    ],
    advancedTool: {
      kind: 'image-resizer',
      presetName: preset.title,
      targetWidth: preset.width,
      targetHeight: preset.height,
      format: preset.format,
      maxSizeKb: preset.maxKb,
      dpi: preset.dpi,
      fit: preset.fit ?? 'cover',
      note: preset.note,
    },
  }
}

const pdfTools: AdvancedTool[] = [
  {
    slug: 'jpg-to-pdf-converter',
    title: 'JPG to PDF Converter',
    headline: 'Convert JPG Images to PDF Free',
    description: 'Free JPG to PDF converter. Upload one or more images and export a clean PDF in your browser with no watermark or signup.',
    seoTitle: 'Free JPG to PDF Converter | No Watermark',
    icon: '📄',
    category: 'PDF & Document Tools',
    keywords: ['jpg to pdf converter', 'convert jpg to pdf free', 'image to pdf online', 'jpg to pdf no watermark'],
    faqs: [
      { q: 'Can I convert multiple JPGs into one PDF?', a: 'Yes. Upload multiple images and each one becomes a page in the same PDF.' },
      { q: 'Are images uploaded?', a: 'No. PDF creation happens in your browser using JavaScript.' },
      { q: 'Does the PDF have a watermark?', a: 'No. The exported PDF is clean and free.' },
    ],
    advancedTool: { kind: 'image-to-pdf', presetName: 'JPG to PDF', pageSize: 'a4', orientation: 'portrait', note: 'Best for receipts, forms, scans, and photo documents.' },
  },
  {
    slug: 'png-to-pdf-converter',
    title: 'PNG to PDF Converter',
    headline: 'Convert PNG Images to PDF Free',
    description: 'Free PNG to PDF converter. Turn transparent or standard PNG images into a downloadable PDF locally in your browser.',
    seoTitle: 'Free PNG to PDF Converter | Private Browser Tool',
    icon: '📄',
    category: 'PDF & Document Tools',
    keywords: ['png to pdf converter', 'convert png to pdf free', 'png images to pdf', 'image to pdf no signup'],
    faqs: [
      { q: 'Does this support transparent PNGs?', a: 'Yes, though PDF pages use a white page background.' },
      { q: 'Can I change the page size?', a: 'This preset uses A4 portrait, which works for most document uploads.' },
      { q: 'Is this free?', a: 'Yes. There is no account, watermark, or daily limit built into this tool.' },
    ],
    advancedTool: { kind: 'image-to-pdf', presetName: 'PNG to PDF', pageSize: 'a4', orientation: 'portrait' },
  },
  {
    slug: 'image-to-pdf-converter',
    title: 'Image to PDF Converter',
    headline: 'Convert Images to PDF in Your Browser',
    description: 'Free image to PDF converter for JPG, PNG, and WebP images. Combine multiple images into a single PDF without uploading them.',
    seoTitle: 'Free Image to PDF Converter Online',
    icon: '📄',
    category: 'PDF & Document Tools',
    keywords: ['image to pdf converter', 'convert images to pdf free', 'multiple images to pdf', 'photo to pdf converter'],
    faqs: [
      { q: 'What image types work?', a: 'JPG, PNG, and WebP files are supported by modern browsers.' },
      { q: 'Can I reorder images?', a: 'Images are added in the order you select them. Select them in the order you want the PDF pages to appear.' },
      { q: 'Is there a file limit?', a: 'There is no server limit. Very large image batches may be limited by your device memory.' },
    ],
    advancedTool: { kind: 'image-to-pdf', presetName: 'Image to PDF', pageSize: 'letter', orientation: 'portrait' },
  },
]

const textToolData: Array<{
  slug: string
  title: string
  keyword: string
  template: AdvancedToolConfig extends infer T ? T extends { kind: 'text-generator'; template: infer U } ? U : never : never
  resultLabel: string
}> = [
  { slug: 'nda-generator', title: 'NDA Generator', keyword: 'free nda generator', template: 'nda', resultLabel: 'NDA outline' },
  { slug: 'freelance-contract-clause-generator', title: 'Freelance Contract Clause Generator', keyword: 'freelance contract clause generator', template: 'contract-clause', resultLabel: 'contract clauses' },
  { slug: 'proposal-follow-up-email-generator', title: 'Proposal Follow Up Email Generator', keyword: 'proposal follow up email generator', template: 'proposal-follow-up', resultLabel: 'follow-up email' },
  { slug: 'late-payment-email-generator', title: 'Late Payment Email Generator', keyword: 'late payment email generator', template: 'late-payment', resultLabel: 'payment reminder email' },
  { slug: 'testimonial-request-generator', title: 'Testimonial Request Generator', keyword: 'testimonial request generator', template: 'testimonial-request', resultLabel: 'testimonial request' },
  { slug: 'client-offboarding-checklist-generator', title: 'Client Offboarding Checklist Generator', keyword: 'client offboarding checklist generator', template: 'offboarding-checklist', resultLabel: 'offboarding checklist' },
  { slug: 'seo-meta-description-generator', title: 'SEO Meta Description Generator', keyword: 'seo meta description generator', template: 'seo-meta', resultLabel: 'meta descriptions' },
  { slug: 'case-study-outline-generator', title: 'Case Study Outline Generator', keyword: 'case study outline generator', template: 'case-study', resultLabel: 'case study outline' },
  { slug: 'payment-terms-generator', title: 'Payment Terms Generator', keyword: 'payment terms generator', template: 'payment-terms', resultLabel: 'payment terms' },
  { slug: 'freelance-rate-card-generator', title: 'Freelance Rate Card Generator', keyword: 'freelance rate card generator', template: 'rate-card', resultLabel: 'rate card' },
]

function makeTextTool(data: (typeof textToolData)[number]): AdvancedTool {
  return {
    slug: data.slug,
    title: data.title,
    headline: `${data.title} for Freelancers`,
    description: `Free ${data.keyword}. Fill in a few details and generate a polished ${data.resultLabel} you can copy, edit, and send.`,
    seoTitle: `${data.title} | Free Template Tool`,
    icon: '✍️',
    category: 'PDF & Document Tools',
    keywords: [data.keyword, 'free business document generator', 'freelance template generator'],
    faqs: [
      { q: 'Is this a legal substitute for a lawyer?', a: 'No. It creates a practical draft or checklist. Have important legal documents reviewed by a qualified professional in your jurisdiction.' },
      { q: 'Can I edit the output?', a: 'Yes. The generated text is plain text so you can copy it into email, Google Docs, Notion, or your proposal software.' },
      { q: 'Does this use my private data?', a: 'No. The template is generated in your browser from the fields you enter.' },
    ],
    advancedTool: { kind: 'text-generator', template: data.template, resultLabel: data.resultLabel },
  }
}

export const ADVANCED_TOOL_CATEGORIES: AdvancedCategory[] = [
  {
    name: 'Passport & Visa Photo Tools',
    slug: 'passport-visa-photo-tools',
    description: 'Create free passport, visa, biometric, and print-sheet photos in your browser.',
    tools: photoPresets.map(makePhotoTool),
  },
  {
    name: 'Image & Application File Tools',
    slug: 'image-application-file-tools',
    description: 'Resize, compress, and convert images for application portals, social media, and upload limits.',
    tools: imagePresets.map(makeImageTool),
  },
  {
    name: 'PDF & Document Tools',
    slug: 'pdf-document-tools',
    description: 'Free PDF converters and business document generators with no account gate.',
    tools: [...pdfTools, ...textToolData.map(makeTextTool)],
  },
]
