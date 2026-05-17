import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import AmbientAtmosphere from "@/components/AmbientAtmosphere";
import { getSiteUrl, SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary",
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <AmbientAtmosphere />
        {children}
      </body>
    </html>
  );
}
