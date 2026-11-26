import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import ExperienceRole from "@/components/ExperienceRole";
import Reveal from "@/components/Reveal";
import { COMPANIES } from "@/lib/experience";

function Span({ start, end }: { start: string; end: string }) {
  return (
    <>
      {start} <span aria-hidden="true">–</span>
      <span className="sr-only">to</span> {end}
    </>
  );
}

export default function Experience() {
  return (
    <section className="experience" id="experience" aria-labelledby="exp-title">
      <Reveal as="h2" id="exp-title" className="expHead">Experience</Reveal>
      <ol className="expList">
        {COMPANIES.map((co, i) => {
          return (
            <Reveal as="li" kind="fade" key={co.name} delay={i * 60} className="expCompany">
              <div className="expTop">
                <span className="expLogo">
                  <img src={co.logo} alt="" width={16} height={16} />
                </span>
                <span className="expMain">
                  <span className="expCo">
                    <a href={co.url} target="_blank" rel="noopener noreferrer">{co.name}</a>
                    {co.parent && (
                      <span className="expParent">
                        {" "}(<a href={co.parent.url} target="_blank" rel="noopener noreferrer">{co.parent.name}</a>)
                      </span>
                    )}
                  </span>
                </span>
              </div>
              <ol className="expRoles">
                {co.roles.map((r) => (
                  <ExperienceRole
                    key={r.title}
                    title={r.title}
                    dates={<Span start={r.start} end={r.end} />}
                    current={r.end === "Present"}
                    built={r.built}
                  />
                ))}
              </ol>
              {co.story && (
                <Link href={co.story.href} className="expStory">
                  {co.story.label}
                  <ArrowRight size={14} weight="bold" aria-hidden />
                </Link>
              )}
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
