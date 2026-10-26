/**
 * The résumé as data, copied from public/Arun-S-R-Resume.pdf. Keep the two in step when either changes.
 * The phone number is left out of the web page on purpose; it stays in the PDF.
 */
export const RESUME_PDF = "/Arun-S-R-Resume.pdf";

export const ORG_LINKS = { SparrowDesk: "https://sparrowdesk.com", SurveySparrow: "https://surveysparrow.com" };

export const RESUME = {
  summary:
    "Full-stack software engineer with 2+ years of experience delivering B2B SaaS products using React, TypeScript, Node.js, Express, and REST APIs. Experience includes billing and subscription workflows, third-party integrations, AI-powered natural-language ticket filtering, and cache debugging tools.",
  experience: [
    {
      title: "Software Engineer, Member of Technical Staff",
      org: "SparrowDesk",
      parent: "SurveySparrow",
      start: "May 2025",
      end: "Present",
      place: "Chennai, India",
      points: [
        "Own the production billing and payments module end to end, partnering with the internal Stripe integration team on subscription workflows, payment-state handling, integration points, and release readiness for live customers.",
        "Design, develop, test, and deploy full-stack product features across React front-end interfaces, Node.js/Express services, REST APIs, and customer-facing SaaS workflows.",
        "Led the SparrowDesk Gmail Add-on from scoping through development, validation, and public release on the Google Workspace Marketplace.",
        "Implemented third-party integrations with Stripe, Jira, Linear, and HubSpot, covering authentication, API contracts, data mapping, and integration-specific product constraints.",
        "Built reusable UI primitives including advanced filters and nested dropdowns with the Twigs design system, improving consistency and delivery speed across product modules.",
        "Owned end-to-end development and optimization of AI-powered ticket filtering: replaced LLM API calls with Jev (TypeSafe AI), converted natural-language requests into structured filter chips, and implemented typed decision handling with deterministic logic to improve speed and accuracy.",
        "Developed customer-facing knowledge-gap workflows that help users find relevant support content and surface missing information.",
        "Implemented a Valkey Model Context Protocol (MCP) integration to streamline cache inspection and debugging.",
        "Improved onboarding flows by simplifying setup steps, clarifying first-use actions, and reducing friction across early adoption journeys.",
      ],
    },
    {
      title: "Software Engineer Intern, Front End",
      org: "SparrowDesk",
      parent: "SurveySparrow",
      start: "Jul 2024",
      end: "Apr 2025",
      place: "Chennai, India",
      points: [
        "Delivered production UI across SLA management, macros, billing, reusable filters, and nested dropdowns using React, JavaScript, and the Twigs design system.",
        "Collaborated with product, design, and engineering partners to translate requirements into reusable components and polished, tested SparrowDesk workflows.",
      ],
    },
  ],
  skills: [
    { label: "Front end", items: "React.js, Next.js, TypeScript, JavaScript ES6+, HTML5, CSS3, TanStack Query, Twigs, Tailwind CSS, Chakra UI, Figma" },
    { label: "Back end and APIs", items: "Node.js, Express.js, REST APIs, JSON, Socket.io, Model Context Protocol (MCP)" },
    { label: "Databases and search", items: "PostgreSQL, MongoDB, DynamoDB, OpenSearch, Valkey" },
    { label: "Languages", items: "JavaScript, TypeScript, Java, Python, C++, C" },
    { label: "Tools and practices", items: "Git, CI/CD, Agile delivery, code review, unit and integration testing" },
    { label: "Domain", items: "Billing workflows, subscription management, Stripe integration, SaaS marketplace integrations, CRM integrations" },
  ],
  projects: [
    {
      name: "SoundSync",
      what: "Real-time streaming web application",
      stack: "React.js, Express.js, Socket.io, Tailwind CSS",
      when: "Oct 2023 – Nov 2023",
      points: [
        "Built and deployed a real-time music streaming application supporting custom listening rooms, private sessions, and live chat over WebSockets.",
        "Improved backend efficiency using debounced API calls and cached search results to reduce redundant requests.",
      ],
    },
    {
      name: "Sorting Visualizer",
      what: "Interactive algorithm visualizer",
      stack: "React, Chakra UI, Gemini API",
      when: "Mar 2024 – Apr 2024",
      points: [
        "Developed an interactive algorithm visualizer for Bubble Sort, Insertion Sort, and Selection Sort with configurable input arrays.",
        "Integrated Gemini API to generate contextual explanations of sorting behavior.",
      ],
    },
  ],
  education: {
    degree: "Bachelor of Engineering, Computer Science and Engineering",
    school: "Bannari Amman Institute of Technology",
    when: "Nov 2021 – Apr 2025",
    note: "CGPA 8.2 / 10",
  },
  achievements: [
    "First place, BIT Software Hackathon 2023 in Web Development as UI Developer, with a cash prize of INR 15,000.",
    "JavaScript Certification, Infosys Springboard.",
  ],
} as const;
