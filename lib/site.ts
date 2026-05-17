/** Site-wide copy and links — single source of truth for production. */
export const SITE = {
  name: "Arun S R",
  location: "Chennai, India",
  timeZone: "Asia/Kolkata",
  description:
    "Developer at SparrowDesk. A small page of work, writing, and dry leaves.",
  email: "arunramesh900@gmail.com",
  links: {
    github: "https://github.com/arun-121",
    linkedin: "https://www.linkedin.com/in/arun-ramesh900/",
    sparrowdesk: "https://sparrowdesk.com/",
  },
} as const;

/** Canonical URL for metadata, sitemap, and OG tags. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
