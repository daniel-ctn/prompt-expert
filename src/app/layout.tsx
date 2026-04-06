import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { DM_Sans, Geist_Mono, Sora } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageTransitionShell } from '@/components/layout/page-transition-shell'
import { Providers } from '@/components/providers'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Prompt Expert - Build Better AI Prompts',
    template: '%s | Prompt Expert',
  },
  description:
    'Create efficient, optimized prompts for any AI model. Adjust tone, format, constraints, and more with an intuitive builder.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://prompt-expert.vercel.app',
  ),
  openGraph: {
    title: 'Prompt Expert - Build Better AI Prompts',
    description:
      'Create efficient, optimized prompts for any AI model with an intuitive builder.',
    siteName: 'Prompt Expert',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Expert - Build Better AI Prompts',
    description:
      'Create efficient, optimized prompts for any AI model with an intuitive builder.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
      >
        <Providers>
          <div className="app-shell relative flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="bg-grid-mask absolute inset-0 opacity-60" />
              <div className="bg-radial-spot absolute top-[-8rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full" />
              <div className="bg-radial-spot-secondary absolute top-[24rem] right-[-8rem] h-[22rem] w-[22rem] rounded-full" />
            </div>
            <Header />
            <PageTransitionShell>{children}</PageTransitionShell>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
