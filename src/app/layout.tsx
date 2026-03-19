import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Geist_Mono, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Prompt Expert - Build Better AI Prompts",
    template: "%s | Prompt Expert",
  },
  description:
    "Create efficient, optimized prompts for any AI model. Adjust tone, format, constraints, and more with an intuitive builder.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://prompt-expert.vercel.app",
  ),
  openGraph: {
    title: "Prompt Expert - Build Better AI Prompts",
    description:
      "Create efficient, optimized prompts for any AI model with an intuitive builder.",
    siteName: "Prompt Expert",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Expert - Build Better AI Prompts",
    description:
      "Create efficient, optimized prompts for any AI model with an intuitive builder.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
