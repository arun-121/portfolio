/**
 * What the résumé (public/Arun-S-R-Resume.pdf) says beyond the site, so the LLM profile carries it too.
 * Transcribed from the PDF; keep it in step whenever the PDF changes. The phone number is left out of the copied
 * profile on purpose, since that text gets pasted into chatbots. It is still printed in the hosted PDF itself.
 */
export const RESUME = {
  pdf: "/Arun-S-R-Resume.pdf",
  headline: "Full Stack Software Engineer | React, TypeScript, Node.js | SaaS Integrations, Billing, AI Workflows",
  summary:
    "Full-stack software engineer with 2+ years of experience building B2B SaaS products with React, TypeScript, Node.js, Express, and REST APIs.",
  links: {
    portfolio: "https://arunsr.vercel.app/",
    githubWork: "https://github.com/arun-sd",
    twigs: "https://twigs.surveysparrow.com/",
  },
  /** Bullets per role, keyed by the role title used on the site. */
  roles: {
    "Member of Technical Staff": {
      resumeTitle: "Software Engineer, Member of Technical Staff",
      location: "Chennai, India",
      bullets: [
        "Maintain the billing and payments module, working with the internal Stripe integration team on subscription workflows, payment-state handling, integration points, and releases for live customers.",
        "Design, develop, test, and deploy full-stack product features across React front-end interfaces, Node.js/Express services, REST APIs, and customer-facing SaaS workflows.",
        "Worked on the SparrowDesk Gmail Add-on from scoping through development, validation, and public release on the Google Workspace Marketplace.",
        "Implemented third-party integrations with Stripe, Jira, Linear, and HubSpot, covering authentication, API contracts, and data mapping.",
        "Built reusable UI components, including filters and nested dropdowns, with the Twigs design system.",
        "Built natural-language filtering for the ticket inbox, converting plain-language requests into structured filters.",
        "Developed customer-facing knowledge-gap workflows to help users find support content and surface missing information.",
        "Improved onboarding by simplifying setup steps and clarifying first-use actions.",
      ],
    },
    "Software Engineer Intern, Front End": {
      resumeTitle: "Software Engineer Intern, Front End",
      location: "Chennai, India",
      bullets: [
        "Delivered production UI across SLA management, macros, billing, reusable filters, and nested dropdowns using React, JavaScript, and the Twigs design system.",
        "Worked with product, design, and engineering partners to turn requirements into reusable components and tested SparrowDesk workflows.",
      ],
    },
  } as Record<string, { resumeTitle: string; location: string; bullets: string[] }>,
  /** Public listings of SparrowDesk integrations I worked on, as linked from the résumé. */
  listings: [
    { name: "Gmail add-on (Google Workspace Marketplace)", href: "https://workspace.google.com/marketplace/app/sparrowdesk_ai_help_desk_ticketing_softw/707848370732" },
    { name: "Jira (Atlassian Marketplace)", href: "https://marketplace.atlassian.com/apps/3523690630/sparrowdesk" },
    { name: "Linear", href: "https://linear.app/integrations/sparrowdesk" },
    { name: "HubSpot (HubSpot Marketplace)", href: "https://ecosystem.hubspot.com/marketplace/listing/sparrowdesk" },
    { name: "Stripe (Stripe App Marketplace)", href: "https://marketplace.stripe.com/apps/sparrowdesk" },
  ],
  /** Extra detail per project, keyed by the repo name used on the site. */
  projects: {
    Recall: {
      title: "Recall – Local Semantic Document Search",
      stack: "Swift, SQLite, Ollama",
      date: "Oct 2026",
      bullets: [
        "Native macOS app that finds local documents by meaning as well as keywords, combining local embeddings with SQLite full-text search.",
        "Runs fully on-device with Ollama (nomic-embed-text); indexes PDF, Markdown and plain text incrementally, skipping unchanged files.",
      ],
    },
    onefit: {
      title: "onefit – Calorie Tracker",
      stack: "React Native, Expo, TypeScript, SQLite, Groq",
      date: "Nov 2026",
      bullets: [
        "Android app for logging food, exercise and weight, with progress views over 7, 30 and 90 days and home-screen widgets.",
        "Uses Groq AI to estimate calories and macros from typed food entries, writes to Health Connect, and keeps data on the device with backup and restore.",
      ],
    },
  } as Record<string, { title: string; stack: string; date: string; bullets: string[] }>,
  education: {
    school: "Bannari Amman Institute of Technology",
    degree: "Bachelor of Engineering, Computer Science and Engineering",
    dates: "Nov 2021 – Apr 2025",
    grade: "CGPA: 8.2 / 10",
  },
  achievements: ["First place in an internal college hackathon, with a cash award of INR 15,000."],
  skills: [
    { area: "Front End", items: "React.js, Next.js, TypeScript, JavaScript ES6+, HTML5, CSS3, TanStack Query, Twigs, Tailwind CSS, Chakra UI, Figma" },
    { area: "Back End & APIs", items: "Node.js, Express.js, REST APIs, JSON, Socket.io, Model Context Protocol (MCP)" },
    { area: "Databases & Search", items: "PostgreSQL, MongoDB, DynamoDB, OpenSearch, Valkey" },
    { area: "Languages", items: "JavaScript, TypeScript, Java, Python, C++, C" },
    { area: "Tools and Practices", items: "Git, CI/CD, Agile delivery, code review, unit and integration testing" },
    { area: "Domain", items: "Billing workflows, subscription management, Stripe integration, SaaS marketplace integrations, CRM integrations" },
  ],
};
