import { SITE } from "@/lib/site";

/**
 * Plain Markdown profile for pasting into an AI assistant (the "Copy for LLM" button).
 * Only facts the site and the résumé already state; keep it in step with them.
 */
export function llmProfile(origin: string): string {
  return [
    `# ${SITE.name}`,
    "",
    `${SITE.role}, based in ${SITE.location}.`,
    "",
    "## Work",
    "- SparrowDesk (SurveySparrow), Member of Technical Staff, May 2025 to present. Works on the billing module, builds third-party integrations that are listed on app marketplaces, and ships AI features end to end.",
    "- SparrowDesk (SurveySparrow), Software Engineer Intern, Front End, Jul 2024 to Apr 2025. Built reusable components for the SparrowDesk frontend, on the Twigs design system.",
    `- The longer, factual story of those years: ${origin}/my-sparrowdesk-years`,
    "",
    "## Projects",
    "- Recall (Swift): a macOS app that searches your documents by meaning, not just keywords. Everything stays on your machine. https://github.com/arun-121/Recall",
    "- onefit (TypeScript): an Android calorie tracker. You type what you ate and AI estimates the calories and macros. Data stays on the phone. https://github.com/arun-121/onefit",
    "",
    "## Links",
    `- Résumé (PDF): ${origin}/Arun-S-R-Resume.pdf`,
    `- Email: ${SITE.email}`,
    `- GitHub: ${SITE.links.github}`,
    `- LinkedIn: ${SITE.links.linkedin}`,
    `- Site: ${origin}`,
    "",
  ].join("\n");
}
