import LeavesLayer from "@/components/Leaves/LeavesLayer";
import LocalClock from "@/components/LocalClock";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <h1 className="greeting">Hi, I&apos;m Arun.</h1>

        <div className="prose">
          <p>
            A frontend engineer at{" "}
            <a href="https://surveysparrow.com/">SparrowDesk</a> in Chennai. I
            work on product modules, reusable systems, and integrations across a
            customer support platform.
          </p>
          <p className="muted">
            Outside of work I read, take long walks, and slowly write here.
          </p>
        </div>

        <section className="writing" aria-label="Writing">
          <p className="lead">
            A few things I&apos;m writing — slowly, and as I have something
            worth saying.
          </p>
          <ul>
            <li>
              <a href="#" aria-disabled="true">
                <span className="w-title">
                  What I learned shipping a Gmail Add-on
                </span>
                <span className="w-meta">Technical · 2026</span>
              </a>
            </li>
            <li>
              <Link href="/reflections/on-slow-tooling">
                <span className="w-title">On slow tooling</span>
                <span className="w-meta">Reflection · 2026</span>
              </Link>
            </li>
            <li>
              <a href="#" aria-disabled="true">
                <span className="w-title">Migrating SparrowDesk to Rspack</span>
                <span className="w-meta">Technical · 2025</span>
              </a>
            </li>
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
          <a href="mailto:arunramesh900@gmail.com">arunramesh900@gmail.com</a>,
          or find me on{" "}
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          ,{" "}
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          , and{" "}
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            X
          </a>
          . My{" "}
          <a href="/Arun-S-R-Resume.docx" download>
            résumé is here
          </a>{" "}
          if you&apos;d like it.
        </p>
      </main>

      <LeavesLayer />

      <footer>
        <span>© 2026 Arun S R · Chennai</span>
        <LocalClock />
      </footer>
    </>
  );
}
