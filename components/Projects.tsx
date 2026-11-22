import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

/** Things I built outside work. One true sentence each, taken from the repo's own README. */
const PROJECTS: { name: string; repo: string; made: string; about: string }[] = [
  {
    name: "Recall",
    repo: "Recall",
    made: "Swift",
    about: "A macOS app that searches your documents by meaning, not just keywords. Everything stays on your machine.",
  },
  {
    name: "OneFit",
    repo: "onefit",
    made: "TypeScript",
    about: "An Android calorie tracker. Type what you ate and AI estimates the calories and macros. Your data stays on the phone.",
  },
];

export default function Projects() {
  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <Reveal as="h2" id="projects-title" className="expHead">Recent projects</Reveal>
      <ul className="projList">
        {PROJECTS.map((p, i) => (
          <Reveal as="li" kind="fade" key={p.name} delay={i * 60} className="projRow">
            <a className="projName" href={`${SITE.links.github}/${p.repo}`} target="_blank" rel="noopener noreferrer">
              {p.name}
            </a>
            <span className="projMade">{p.made}</span>
            <p className="projAbout">{p.about}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
