import Reveal from "@/components/Reveal";

/** What I use day to day. One short line per row; keep it to things actually in use. */
const USES: { label: string; items: string }[] = [
  { label: "Machine", items: "MacBook Pro 14″, M3 Pro, 36 GB" },
  { label: "Editor", items: "Kiro and WebStorm" },
  { label: "AI", items: "Claude Code in the Claude app, mostly on Opus 5.5" },
  { label: "Local AI", items: "Ollama, with Gemma 3 12B, Gemma 4 12B and nomic-embed-text" },
  { label: "Terminal", items: "Warp" },
  { label: "Browser", items: "Brave, and Chrome for work" },
  { label: "Memory", items: "Goldfish, a local archive of what I do on my Mac" },
  { label: "Also", items: "Maccy, Wispr Flow, Spotify and Hammerspoon" },
  { label: "This site", items: "Next.js and React Three Fiber, set in Young Serif and Schibsted Grotesk" },
];

export default function Uses() {
  return (
    <section className="uses" id="uses" aria-labelledby="uses-title">
      <Reveal as="h2" id="uses-title" className="expHead">Uses</Reveal>
      <dl className="usesList">
        {USES.map((u, i) => (
          <Reveal as="div" kind="fade" key={u.label} delay={i * 35} className="usesRow">
            <dt>{u.label}</dt>
            <dd>{u.items}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
