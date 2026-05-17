import LeavesLayer from "@/components/Leaves/LeavesLayer";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <h1 className="greeting">Hi, I&apos;m Arun.</h1>

        <div className="prose">
          <p>
            I&apos;m a developer interested in thoughtful systems, calm
            experiences, and well-crafted details.
          </p>
          <p>
            I&apos;m currently part of the team building{" "}
            <a href={SITE.links.sparrowdesk}>SparrowDesk</a>, where
            I work on product modules and reusable systems.
          </p>
          <p className="muted">
            Outside of work, I overthink — but in a good way, go for long walks,
            and slowly write here from time to time.
          </p>
        </div>

        <section className="writing" aria-label="Writing">
          <p className="lead">
            A few things I&apos;m writing — slowly, and as I have something
            worth saying.
          </p>
          <ul>
            <li>
              <Link href="/reflections/pause-states">
                <span className="w-title">Pause states</span>
                <span className="w-meta">Reflection · 2025</span>
              </Link>
            </li>
          </ul>
        </section>

        <p className="find">
          Say hello at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, or find me on{" "}
          <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          and{" "}
          <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          . My{" "}
          <a href="/Arun-S-R-Resume.docx" download>
            résumé is here
          </a>{" "}
          if you&apos;d like it.
        </p>
      </main>

      <LeavesLayer />

      <SiteFooter />
    </>
  );
}
