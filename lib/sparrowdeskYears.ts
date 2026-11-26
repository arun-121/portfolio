/*
 * My SparrowDesk years: what I built, July 2024 to November 2026.
 * Rendered by app/my-sparrowdesk-years/page.tsx and copied into the LLM profile, so both stay in step.
 * Dates and numbers come from my own records: git, GitHub, Jira, Confluence and my write-ups.
 * Results are measured ones. No revenue, customer or pricing figures.
 * Every month from July 2024 to November 2026 sits inside some step's range, so the path has no gaps.
 * It ends in November 2026, my last month at SparrowDesk.
 */

export const STORY = {
  path: "/my-sparrowdesk-years",
  title: "My SparrowDesk years",
  description: "What I built at SparrowDesk from July 2024 to November 2026, across billing, integrations and AI features.",
  lede: "What I built at SparrowDesk from July 2024 to November 2026, taken from my commits, tickets and notes.",
  /** The two quiet lines after the path. */
  numbers: "310 tickets closed and 10 technical docs written. On GitHub since May 2026: 297 pull requests opened and 57 reviews given.",
  tools: "Tools: Cursor until 2025, then Claude Code; Bitbucket, then GitHub; Jira, Confluence, Grafana, Loki, New Relic and Sentry.",
} as const;

export type Year = { kind: "year"; year: string };
/**
 * date: one month ("Nov 2026") or a range in one year ("Aug–Sep 2024").
 * note: one plain line on what a piece of work involved, or what it measurably changed.
 * link: part of the text that links out, to something public.
 */
export type Step = {
  kind: "step";
  date: string;
  text: string;
  note?: string;
  link?: { text: string; href: string };
  /** The last stop: the path ends here, in November 2026. */
  last?: boolean;
};

export const JOURNEY: (Year | Step)[] = [
  { kind: "year", year: "2024" },
  { kind: "step", date: "Jul 2024", text: "Joined as a front‑end intern" },
  {
    kind: "step",
    date: "Aug–Sep 2024",
    text: "Built settings screens for single sign‑on, macros and contact fields",
    note: "React and TypeScript, with translations, error handling and tests",
  },
  { kind: "step", date: "Oct–Dec 2024", text: "Built the SLA settings screens: goals, reminders and conditions" },

  { kind: "year", year: "2025" },
  {
    kind: "step",
    date: "Jan–Apr 2025",
    text: "Built the billing screens for plans, add‑ons, seats and invoices",
    note: "Also the chat widget’s settings: colours, visibility rules and install options",
  },
  { kind: "step", date: "May 2025", text: "Became a Member of Technical Staff after ten months as an intern" },
  {
    kind: "step",
    date: "Jun–Aug 2025",
    text: "Built AI filters for the inbox and contacts",
    note: "A plain‑English search turns into inbox or contact filters",
  },
  {
    kind: "step",
    date: "Aug–Oct 2025",
    text: "Built knowledge‑gap tracking for the AI agent",
    note: "Questions it couldn’t answer, grouped by topic, with scheduled rechecks",
  },
  {
    kind: "step",
    date: "Nov–Dec 2025",
    text: "Built the knowledge base screens for the AI agent",
    note: "Articles, documents, web pages and Q&As in one place, each with an AI agent and Copilot switch",
  },

  { kind: "year", year: "2026" },
  {
    kind: "step",
    date: "Jan–Mar 2026",
    text: "Built the onboarding for new sign‑ups",
    note: "A questionnaire, connecting email or the chat widget, training the AI agent, and a getting‑started checklist",
  },
  {
    kind: "step",
    date: "Feb–Mar 2026",
    text: "Built the Jira and Linear integrations",
    note: "Also wrote the technical docs for both",
  },
  {
    kind: "step",
    date: "Mar–Apr 2026",
    text: "Built the Gmail add‑on for Google Workspace with teammates",
    link: {
      text: "Gmail add‑on for Google Workspace",
      href: "https://workspace.google.com/marketplace/app/sparrowdesk_ai_help_desk_ticketing_softw/707848370732",
    },
  },
  {
    kind: "step",
    date: "May–Jun 2026",
    text: "Built the new HubSpot integration",
    note: "Syncs contacts and conversation notes; added install from the HubSpot Marketplace in August",
  },
  {
    kind: "step",
    date: "Jun–Sep 2026",
    text: "Shipped AI add‑on billing modes and usage caps",
    note: "Prepaid or postpaid, per resolution or per conversation",
  },
  {
    kind: "step",
    date: "Sep 2026",
    text: "Built the Stripe integration for the inbox",
    note: "Agents see a customer’s Stripe subscriptions and payments beside the conversation, read‑only",
  },
  {
    kind: "step",
    date: "Oct 2026",
    text: "Moved Copilot from seats to credits",
    note: "AI calls now report their token usage, and credits are charged from what each call actually cost",
  },
  {
    kind: "step",
    date: "Oct–Nov 2026",
    text: "Rebuilt the AI inbox filter: a classifier first, an LLM only if unsure",
    note: "On a realistic test setup: median decision time 5 s → 0.2 s, and 2 in 3 searches skip the LLM",
  },
  {
    kind: "step",
    date: "Nov 2026",
    text: "Built RingCentral calling and live reports",
    note: "Calls from inside SparrowDesk, matched to contacts, with call logs and voicemail text; live conversation, member and phone reports",
    last: true,
  },
];
