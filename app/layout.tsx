import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { SmoothScroll } from "@/components/smooth-scroll";
import { HtmlDirUpdater } from "@/components/html-dir-updater";
import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "@/components/ui/sonner";
import { Preloader } from "@/components/layout/preloader";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { SiteSettingsProvider } from "@/contexts/site-settings-context";
import "./globals.css";
import "../public/fonts/fonts.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asu.edu.sy"),
  title: {
    template: "%s | Antioch Syrian University",
    default: "Antioch Syrian University | جامعة أنطاكية السورية",
  },
  description:
    "Antioch Syrian University - Excellence in Higher Education since 2017. Offering programs in Engineering, Pharmacy, Dentistry, Law, Arts, and Administrative Sciences.",
  keywords: ["جامعة أنطاكية", "جامعة سورية", "Antioch Syrian University", "ASU", "Education in Syria", "الهندسة", "الصيدلة", "طب الأسنان", "Business School"],
  authors: [{ name: "ASU IT Department" }],
  creator: "Antioch Syrian University",
  publisher: "Antioch Syrian University",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Antioch Syrian University | جامعة أنطاكية السورية",
    description: "Excellence in Higher Education since 2017.",
    url: "https://asu.edu.sy",
    siteName: "Antioch Syrian University",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Antioch Syrian University Campus",
      },
    ],
    locale: "en_US",
    alternateLocale: "ar_SY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antioch Syrian University | جامعة أنطاكية السورية",
    description: "Excellence in Higher Education since 2017.",
    images: ["/images/og-image.jpg"],
  },
  generator: 'Next.js',
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#800000" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable}`} suppressHydrationWarning>
      <body
        className="font-sans antialiased"
      >
        <QueryProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <SiteSettingsProvider>
                  <HtmlDirUpdater />
                  <AuthGuard>
                    <Preloader />
                    <SmoothScroll>{children}</SmoothScroll>
                  </AuthGuard>
                  <Toaster position="top-center" />
                </SiteSettingsProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}