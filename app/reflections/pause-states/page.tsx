import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Pause states",
  description: "On the pending state — in software and in the pauses between.",
};

export default function PauseStates() {
  return (
    <>
      <main>
        <Link href="/reflections" className="back">← Reflections</Link>

        <p className="articleMeta">Reflection · 2025</p>
        <h1 className="articleTitle">Pause states</h1>

        <div className="articleBody">
          <p>
            There&apos;s a term in frontend state machines called the{" "}
            <em>pending</em> state.
          </p>
          <p>
            Not loading.
            <br />
            Not done.
            <br />
            Just pending.
          </p>
          <p>
            Something was requested and hasn&apos;t resolved yet.
          </p>
          <p>
            I think about that sometimes while waiting. Or walking. Or staring out
            the window after writing something that technically works but still
            feels slightly wrong.
          </p>
          <p>
            We&apos;ve become very good at removing waiting from software.
            Changes appear instantly. Suggestions arrive before thoughts fully
            form.
          </p>
          <p>But most good ideas still seem to arrive later.</p>
          <p>Somewhere between stepping away and coming back.</p>
          <p>I don&apos;t miss slow builds.</p>
          <p>I just wonder what the pause was doing to my thinking.</p>
          <p>
            The pending states never disappeared.
            <br />
            They just moved somewhere else.
          </p>
          <p>I&apos;ve started taking longer walks.</p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
