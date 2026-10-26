import type { Metadata, Viewport } from "next";
import { Geist_Mono, Schibsted_Grotesk, Young_Serif } from "next/font/google";
import CommandPalette from "@/components/CommandPalette";
import LastPlayed from "@/components/LastPlayed";
import SiteNav from "@/components/SiteNav";
import { getWeather } from "@/lib/weather";
import { getSiteUrl, SITE } from "@/lib/site";
import "./scenery.css";
import "./globals.css";

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const serif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | ${SITE.role}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.role}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.role}`,
    description: SITE.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F3EEE1",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const weather = await getWeather();
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        <SiteNav song={<LastPlayed />} weather={weather} />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
