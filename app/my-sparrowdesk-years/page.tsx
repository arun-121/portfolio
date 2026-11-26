import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";

/*
 * My SparrowDesk years: what I built, July 2024 to November 2026.
 * Dates and numbers come from my own records: git, GitHub, Jira, Confluence and my write-ups.
 * Results are measured ones. No revenue, customer or pricing figures.
 * Kept minimal on purpose: the path is the page; everything else is one quiet line.
 * Every month from July 2024 to November 2026 sits inside some step's range, so the path has no gaps.
 * It ends in November 2026, my last month at SparrowDesk.
 */

const PATH = "/my-sparrowdesk-years";
const TITLE = "My SparrowDesk years";
const DESCRIPTION =
  "What I built at SparrowDesk from July 2024 to November 2026, across billing, integrations and AI features.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { title: TITLE, description: DESCRIPTION },
};

type Year = { kind: "year"; year: string };
/**
 * date: one month ("Nov 2026") or a range in one year ("Aug–Sep 2024").
 * note: one plain line on what a piece of work involved, or what it measurably changed.
 * link: part of the text that links out, to something public.
 */
type Step = {
  kind: "step";
  date: string;
  text: string;
  note?: string;
  link?: { text: string; href: string };
  /** The last stop: the path ends here, in November 2026. */
  last?: boolean;
};

const JOURNEY: (Year | Step)[] = [
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

/** "Aug–Sep 2024" reads as "Aug to Sep 2024" to a screen reader. */
function StepDate({ date }: { date: string }) {
  const [from, to] = date.split("–");
  if (!to) return <>{date}</>;
  return (
    <>
      {from}
      <span aria-hidden="true">–</span>
      <span className="sr-only"> to </span>
      {to}
    </>
  );
}

/** The step's text, with its link (if any) on the words it names. */
function StepText({ step }: { step: Step }) {
  const at = step.link ? step.text.indexOf(step.link.text) : -1;
  if (!step.link || at < 0) return <>{step.text}</>;
  return (
    <>
      {step.text.slice(0, at)}
      <a className="inlineLink" href={step.link.href} target="_blank" rel="noopener noreferrer">
        {step.link.text}
      </a>
      {step.text.slice(at + step.link.text.length)}
    </>
  );
}

export default function MySparrowDeskYears() {
  let stepIndex = 0;
  return (
    <>
      <main id="main" className="column">
        <div className="unit story">
          <header className="storyHead">
            <Reveal kind="up" as="h1" className="storyTitle">
              {TITLE}
            </Reveal>
            <Reveal kind="up" delay={60} as="p" className="storyLede">
              What I built at SparrowDesk from July 2024 to November 2026, taken from my commits, tickets and notes.
            </Reveal>
          </header>

          <section className="storySection" aria-labelledby="path-title">
            <h2 id="path-title" className="sr-only">
              What I built
            </h2>
            <ol className="path">
              {JOURNEY.map((j) => {
                if (j.kind === "year") {
                  stepIndex = 0;
                  return (
                    <Reveal as="li" kind="fade" key={j.year} className="pathItem pathYear">
                      <span className="pathMargin pathYearNum">{j.year}</span>
                      <span className="pathNode" aria-hidden="true" />
                    </Reveal>
                  );
                }
                const delay = 40 * stepIndex++;
                return (
                  <Reveal
                    as="li"
                    kind="fade"
                    key={`${j.date}-${j.text}`}
                    delay={delay}
                    className="pathItem pathStep"
                    data-last={j.last ? "" : undefined}
                  >
                    <span className="pathMargin pathDate">
                      <StepDate date={j.date} />
                    </span>
                    <span className="pathNode" aria-hidden="true" />
                    <div className="pathBody">
                      <p className="pathText">
                        <StepText step={j} />
                      </p>
                      {j.note && <p className="pathNote">{j.note}</p>}
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </section>

          <Reveal as="section" kind="fade" className="storySection storyFacts" aria-label="In numbers, and the tools I used">
            <p>310 tickets closed and 10 technical docs written. On GitHub since May 2026: 297 pull requests opened and 57 reviews given.</p>
            <p>Tools: Cursor until 2025, then Claude Code; Bitbucket, then GitHub; Jira, Confluence, Grafana, Loki, New Relic and Sentry.</p>
          </Reveal>

          <footer className="storyEnd">
            <p>Thank you to everyone at SparrowDesk I worked with.</p>
            <Link href="/" className="storyBack">
              <ArrowLeft size={14} weight="bold" aria-hidden />
              Back home
            </Link>
          </footer>
        </div>
      </main>

      <SiteFooter leaves />
    </>
  );
}
