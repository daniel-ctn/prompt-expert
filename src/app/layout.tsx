import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
