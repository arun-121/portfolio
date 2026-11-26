import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";

/*
 * My SparrowDesk years: the path from front-end intern to full-stack work, July 2024 to November 2026.
 * Dates and numbers come from my own records: git, GitHub's contribution calendar, Jira, Confluence,
 * my write-ups and my Claude Code history. Results are measured ones. No revenue, customer or pricing figures.
 */

const PATH = "/my-sparrowdesk-years";
const TITLE = "My SparrowDesk years";
const DESCRIPTION =
  "How my work at SparrowDesk grew from front-end intern in July 2024 to full-stack work on billing, integrations and AI features.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/** contributions: GitHub's yearly count. tickets: Jira issues closed. */
type Year = { kind: "year"; year: string; span?: string; contributions: number; tickets: number };
/** note: one line on what a big piece of work involved. result: a measured outcome, shown as a chip. */
type Step = { kind: "step"; date: string; text: string; note?: string; result?: string; now?: boolean };

const JOURNEY: (Year | Step)[] = [
  { kind: "year", year: "2024", span: "from July", contributions: 312, tickets: 18 },
  { kind: "step", date: "Jul 2024", text: "Joined as a front‑end intern" },
  { kind: "step", date: "Aug 2024", text: "First commit: translation files for single sign‑on" },

  { kind: "year", year: "2025", contributions: 1029, tickets: 115 },
  { kind: "step", date: "Mar 2025", text: "Sparcade, the company’s AI hackathon, with my team" },
  { kind: "step", date: "Apr 2025", text: "First backend commit" },
  { kind: "step", date: "May 2025", text: "Member of Technical Staff" },
  { kind: "step", date: "Aug 2025", text: "Shipped AI filters in the inbox" },

  { kind: "year", year: "2026", span: "to November", contributions: 1770, tickets: 177 },
  { kind: "step", date: "Mar 2026", text: "Jira and Linear integrations" },
  { kind: "step", date: "Apr 2026", text: "Gmail add‑on for Google Workspace" },
  { kind: "step", date: "May 2026", text: "Free plan, and started pairing with Claude Code" },
  {
    kind: "step",
    date: "Jun 2026",
    text: "Started on usage‑based pricing for the AI add‑on",
    note: "Charging per resolution or per conversation, prepaid or postpaid, with usage caps",
  },
  { kind: "step", date: "Jun 2026", text: "HubSpot integration, version two" },
  { kind: "step", date: "Sep 2026", text: "AI add‑on pricing shipped, then the Stripe integration" },
  {
    kind: "step",
    date: "Oct 2026",
    text: "Moved Copilot from seats to credits",
    note: "Every AI call now reports its token usage, and credits are charged from what each call actually cost",
  },
  {
    kind: "step",
    date: "Nov 2026",
    text: "Rebuilt the AI inbox filter",
    result: "Median decision time 5 s \u2192 0.2 s; 2 in 3 searches skip the LLM",
  },
  { kind: "step", date: "Nov 2026", text: "RingCentral integration and live reports", now: true },
];
const MAX_CONTRIBUTIONS = Math.max(...JOURNEY.flatMap((j) => (j.kind === "year" ? [j.contributions] : [])));

/** From the messages I sent Claude Code, Aug to Nov 2026. Only patterns that kept showing up. */
const HOW_I_WORK = [
  "Ask why until the flow is clear, then build",
  "Start from the industry standard, or how a sister product did it",
  "Cut the rare edge case instead of building for it",
  "Several Claude Code sessions at once; commits, merges and deploys stay with me",
];

const LEARNED: { area: string; text: string }[] = [
  { area: "Backend", text: "Designing around data and failures, after a year of front‑end only" },
  { area: "Billing", text: "Subscriptions, proration and credits, and checking a real bill before shipping" },
  { area: "Integrations", text: "OAuth, webhooks, and the ways other people’s APIs fail" },
  { area: "AI", text: "Building on language models, and measuring their speed, accuracy and cost" },
];

const NUMBERS: { value: string; label: string }[] = [
  { value: "310", label: "tickets closed" },
  { value: "297", label: "pull requests since May 2026" },
  { value: "57", label: "reviews given" },
  { value: "10", label: "technical docs" },
];

const TOOLS = ["Cursor until 2025, then Claude Code", "Bitbucket, then GitHub", "Jira and Confluence", "Grafana, Loki, New Relic and Sentry"];

const fmt = (n: number) => n.toLocaleString("en-IN");

export default function MySparrowDeskYears() {
  let stepIndex = 0;
  return (
    <>
      <main id="main" className="column">
        <div className="unit story">
          <header className="storyHead">
            <Reveal kind="up" as="p" className="storyMeta">
              SparrowDesk <span aria-hidden="true">·</span> 2024 <span aria-hidden="true">–</span>
              <span className="sr-only">to</span> 2026
            </Reveal>
            <Reveal kind="up" delay={60} as="h1" className="storyTitle">
              {TITLE}
            </Reveal>
            <Reveal kind="up" delay={120} as="p" className="storyLede">
              The path from front&#8209;end intern to full&#8209;stack work, taken from my commits, tickets and notes.
            </Reveal>

            <Reveal kind="up" delay={180} className="arc" role="group" aria-label="Where I started and where I got to">
              <div className="arcEnd">
                <p className="arcLabel">July 2024</p>
                <p className="arcRole">Front&#8209;end intern</p>
              </div>
              <span className="arcArrow" aria-hidden="true">
                <ArrowRight size={16} weight="bold" />
              </span>
              <div className="arcEnd">
                <p className="arcLabel">November 2026</p>
                <p className="arcRole">Member of Technical Staff</p>
              </div>
            </Reveal>
          </header>

          <section className="storySection" aria-labelledby="path-title">
            <Reveal as="h2" id="path-title" className="expHead">
              The path
            </Reveal>
            <ol className="path">
              {JOURNEY.map((j) => {
                if (j.kind === "year") {
                  stepIndex = 0;
                  return (
                    <Reveal as="li" kind="fade" key={j.year} className="pathItem pathYear">
                      <span className="pathMargin pathYearNum">{j.year}</span>
                      <span className="pathNode" aria-hidden="true" />
                      <div className="pathBody">
                        <h3 className="sr-only">{j.year}</h3>
                        <p className="pathStats">
                          {j.span && <span>{j.span} · </span>}
                          {fmt(j.contributions)} contributions <span aria-hidden="true">·</span> {j.tickets} tickets
                        </p>
                        <div className="pathBar" aria-hidden="true">
                          <i style={{ width: `${(100 * j.contributions) / MAX_CONTRIBUTIONS}%` }} />
                        </div>
                      </div>
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
                    aria-current={j.now ? "step" : undefined}
                    data-big={j.note ? "" : undefined}
                  >
                    <span className="pathMargin pathDate">{j.date}</span>
                    <span className="pathNode" aria-hidden="true" />
                    <div className="pathBody">
                      <p className="pathText">{j.text}</p>
                      {j.note && <p className="pathNote">{j.note}</p>}
                      {j.result && (
                        <p className="pathResult">
                          <span className="pathResultLabel">Measured</span>
                          {j.result}
                        </p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </ol>
            <p className="storyNote">Contributions are GitHub&rsquo;s yearly count. Tickets are Jira issues closed.</p>
          </section>

          <section className="storySection takeaways" aria-label="What I take with me">
            <div className="takeCol">
              <Reveal as="h2" className="expHead">
                How I work
              </Reveal>
              <ul className="takeList">
                {HOW_I_WORK.map((t, i) => (
                  <Reveal as="li" kind="fade" key={t} delay={i * 40} className="takeItem">
                    {t}
                  </Reveal>
                ))}
              </ul>
              <p className="storyNote">From about 5,300 messages I sent Claude Code, Aug&ndash;Nov 2026.</p>
            </div>
            <div className="takeCol">
              <Reveal as="h2" className="expHead">
                What I learned
              </Reveal>
              <ul className="takeList">
                {LEARNED.map((l, i) => (
                  <Reveal as="li" kind="fade" key={l.area} delay={i * 40} className="takeItem">
                    <span className="takeArea">{l.area}</span>
                    {l.text}
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          <section className="storySection" aria-labelledby="numbers-title">
            <h2 id="numbers-title" className="sr-only">
              In numbers
            </h2>
            <dl className="statStrip">
              {NUMBERS.map((n, i) => (
                <Reveal as="div" kind="fade" key={n.label} delay={i * 40} className="stat">
                  <dt className="statLabel">{n.label}</dt>
                  <dd className="statValue">{n.value}</dd>
                </Reveal>
              ))}
            </dl>
            <p className="toolsLine">
              <span className="takeArea">Tools</span>
              {TOOLS.map((t, i) => (
                <span key={t}>
                  {t}
                  {i < TOOLS.length - 1 && <span className="toolsSep" aria-hidden="true"> · </span>}
                </span>
              ))}
            </p>
          </section>

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
