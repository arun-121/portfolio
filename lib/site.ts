/** Site-wide copy and links — single source of truth for production. */
export const SITE = {
  name: "Arun S R",
  location: "Chennai, India",
  timeZone: "Asia/Kolkata",
  description:
    "Arun S R is a developer who builds product modules and reusable systems, and writes slowly about software and attention.",
  email: "arunramesh900@gmail.com",
  links: {
    github: "https://github.com/arun-121",
    linkedin: "https://www.linkedin.com/in/arun-ramesh900/",
  },
} as const;

/** Canonical URL for metadata, sitemap, and OG tags. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
