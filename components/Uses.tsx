import Reveal from "@/components/Reveal";
import { USES } from "@/lib/uses";


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
