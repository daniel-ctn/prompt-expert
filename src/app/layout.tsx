import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Geist_Mono, Inter } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageTransitionShell } from '@/components/layout/page-transition-shell'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Prompt Expert - Free Community Prompt Workflows',
    template: '%s | Prompt Expert',
  },
  description:
    'Create, test, improve, save, share, and fork prompts with a free community-oriented prompt workflow tool.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://prompt-expert.vercel.app',
  ),
  openGraph: {
    title: 'Prompt Expert - Free Community Prompt Workflows',
    description:
      'Create, test, improve, save, share, and fork prompts without payment tiers.',
    siteName: 'Prompt Expert',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Expert - Free Community Prompt Workflows',
    description:
      'Create, test, improve, save, share, and fork prompts without payment tiers.',
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
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="app-shell relative flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="bg-radial-spot absolute top-[-10rem] left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full" />
              <div className="bg-radial-spot-secondary absolute right-[-6rem] bottom-[-8rem] h-[26rem] w-[26rem] rounded-full" />
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
