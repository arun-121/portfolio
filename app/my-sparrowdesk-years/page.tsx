import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { JOURNEY, STORY, type Step } from "@/lib/sparrowdeskYears";

/* My SparrowDesk years. The content lives in lib/sparrowdeskYears.ts; this file only lays it out, kept minimal on purpose. */

const { path: PATH, title: TITLE, description: DESCRIPTION } = STORY;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { title: TITLE, description: DESCRIPTION },
};

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
              {STORY.lede}
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
            <p>{STORY.numbers}</p>
            <p>{STORY.tools}</p>
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
