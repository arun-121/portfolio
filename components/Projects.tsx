import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";


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
