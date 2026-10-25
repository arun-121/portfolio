import ExperienceRole from "@/components/ExperienceRole";
import Reveal from "@/components/Reveal";

type Company = {
  name: string;
  logo: string;
  place: string;
  /** Newest first. The rail fills upward, from the first role to the current one. */
  roles: { title: string; start: string; end: string; built: string[] }[];
};

const COMPANIES: Company[] = [
  {
    name: "SparrowDesk",
    logo: "/logos/sparrowdesk.png",
    place: "Chennai, India",
    roles: [
      {
        title: "Member of Technical Staff",
        start: "May 2025",
        end: "Present",
        built: [
          "I handle billing and payments for SparrowDesk.",
          "I build third\u2011party integrations that get listed on app marketplaces.",
        ],
      },
      {
        title: "Software Engineer Intern, Front End",
        start: "Jul 2024",
        end: "Apr 2025",
        built: [
          "I built reusable components for the SparrowDesk frontend.",
        ],
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
            <Reveal as="li" key={co.name} delay={i * 60} className="expCompany">
              <div className="expTop">
                <span className="expLogo">
                  <img src={co.logo} alt="" width={16} height={16} />
                </span>
                <span className="expMain">
                  <span className="expCo">{co.name}</span>
                  <span className="expLoc">{co.place}</span>
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
