import ExperienceRole from "@/components/ExperienceRole";
import Reveal from "@/components/Reveal";

type Company = {
  name: string;
  url: string;
  /** Parent company, shown quietly after the name. */
  parent?: { name: string; url: string };
  logo: string;
  /** Newest first. The rail fills upward, from the first role to the current one. */
  /** built: one plain sentence about the role, shown when the title is opened. */
  roles: { title: string; start: string; end: string; built: string }[];
};

const COMPANIES: Company[] = [
  {
    name: "SparrowDesk",
    url: "https://sparrowdesk.com",
    parent: { name: "SurveySparrow", url: "https://surveysparrow.com" },
    logo: "/logos/sparrowdesk.png",
    roles: [
      {
        title: "Member of Technical Staff",
        start: "May 2025",
        end: "Present",
        built:
          "I work on the billing module, build third\u2011party integrations that get listed on app marketplaces, and ship AI features end to end.",
      },
      {
        title: "Software Engineer Intern, Front End",
        start: "Jul 2024",
        end: "Apr 2025",
        built: "I built reusable components for the SparrowDesk frontend, on the Twigs design system.",
      },
    ],
  },
];

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
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
