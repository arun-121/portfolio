import type { Metadata } from "next";
import Link from "next/link";
import LocalClock from "@/components/LocalClock";

export const metadata: Metadata = {
  title: "Reflections — Arun S R",
  description: "Writing slowly, on things worth saying.",
};

const posts = [
  {
    slug: "pause-states",
    title: "Pause states",
    meta: "Reflection · 2025",
  },
];

export default function Reflections() {
  return (
    <>
      <main>
        <Link href="/" className="back">← Arun</Link>

        <h1 className="greeting" style={{ fontSize: "clamp(48px, 9vw, 88px)", marginBottom: "32px" }}>
          Reflections.
        </h1>

        <p className="reflectionsLead">
          Writing slowly, on things worth saying. Not very often.
        </p>

        <section className="writing" aria-label="Reflections list">
          <ul>
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/reflections/${p.slug}`}>
                  <span className="w-title">{p.title}</span>
                  <span className="w-meta">{p.meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <span>© 2026 Arun S R</span>
        <LocalClock />
      </footer>
    </>
  );
}
