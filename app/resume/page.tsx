import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { ORG_LINKS, RESUME, RESUME_PDF } from "@/lib/resume";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${SITE.name}, ${SITE.role.toLowerCase()} in ${SITE.location}: experience, skills, projects and education.`,
  alternates: { canonical: "/resume" },
};

function Dates({ start, end }: { start: string; end: string }) {
  return (
    <>
      {start} <span aria-hidden="true">–</span>
      <span className="sr-only">to</span> {end}
    </>
  );
}

/** The résumé as a page: readable on any screen, with the PDF one click away. */
export default function ResumePage() {
  return (
    <main id="main" className="column">
      <article className="resume">
        <Link href="/" className="resumeBack">
          <ArrowLeft size={14} weight="bold" aria-hidden />
          Home
        </Link>

        <header className="resumeHead">
          <h1 className="resumeName">{SITE.name}</h1>
          <p className="resumeRole">
            {SITE.role} in {SITE.location}
          </p>
          <p className="resumeContact">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
          <p className="resumeActions">
            <a className="resumeBtn resumeBtnMain" href={RESUME_PDF} download>
              <DownloadSimple size={16} weight="bold" aria-hidden />
              Download PDF
            </a>
            <a className="resumeBtn" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">
              Open PDF
              <ArrowUpRight size={14} weight="bold" aria-hidden />
            </a>
          </p>
        </header>

        <section className="resumeSection" aria-labelledby="r-summary">
          <h2 id="r-summary" className="resumeH2">Summary</h2>
          <p className="resumeText">{RESUME.summary}</p>
        </section>

        <section className="resumeSection" aria-labelledby="r-experience">
          <h2 id="r-experience" className="resumeH2">Experience</h2>
          {RESUME.experience.map((job) => (
            <div key={job.title} className="resumeItem">
              <div className="resumeItemHead">
                <h3 className="resumeItemTitle">{job.title}</h3>
                <span className="resumeWhen"><Dates start={job.start} end={job.end} /></span>
              </div>
              <p className="resumeItemSub">
                <a href={ORG_LINKS[job.org]} target="_blank" rel="noopener noreferrer">{job.org}</a> (
                <a href={ORG_LINKS[job.parent]} target="_blank" rel="noopener noreferrer">{job.parent}</a>), {job.place}
              </p>
              <ul className="resumePoints">
                {job.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="resumeSection" aria-labelledby="r-skills">
          <h2 id="r-skills" className="resumeH2">Skills</h2>
          <dl className="resumeSkills">
            {RESUME.skills.map((g) => (
              <div key={g.label}>
                <dt>{g.label}</dt>
                <dd>{g.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="resumeSection" aria-labelledby="r-projects">
          <h2 id="r-projects" className="resumeH2">Projects</h2>
          {RESUME.projects.map((pr) => (
            <div key={pr.name} className="resumeItem">
              <div className="resumeItemHead">
                <h3 className="resumeItemTitle">{pr.name}</h3>
                <span className="resumeWhen">{pr.when}</span>
              </div>
              <p className="resumeItemSub">{pr.what}. {pr.stack}</p>
              <ul className="resumePoints">
                {pr.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="resumeSection" aria-labelledby="r-education">
          <h2 id="r-education" className="resumeH2">Education</h2>
          <div className="resumeItem">
            <div className="resumeItemHead">
              <h3 className="resumeItemTitle">{RESUME.education.degree}</h3>
              <span className="resumeWhen">{RESUME.education.when}</span>
            </div>
            <p className="resumeItemSub">{RESUME.education.school}, {RESUME.education.note}</p>
          </div>
        </section>

        <section className="resumeSection" aria-labelledby="r-achievements">
          <h2 id="r-achievements" className="resumeH2">Achievements</h2>
          <ul className="resumePoints">
            {RESUME.achievements.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </section>
      </article>
    </main>
  );
}
