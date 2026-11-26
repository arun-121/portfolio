import { SITE } from "@/lib/site";
import { COMPANIES } from "@/lib/experience";
import { PROJECTS } from "@/lib/projects";
import { USES } from "@/lib/uses";
import { JOURNEY, STORY, type Step } from "@/lib/sparrowdeskYears";
import { RESUME } from "@/lib/resume";

/**
 * Plain Markdown for pasting into an AI assistant (the "Copy for LLM" button): everything on the site,
 * everything in the résumé, and the full My SparrowDesk years timeline. Built from the same data the pages
 * render, so it can't drift from them. Only facts the site and the résumé already state.
 */
export function llmProfile(origin: string): string {
  const out: string[] = [];
  const line = (s = "") => out.push(s);

  const current = COMPANIES.flatMap((c) => c.roles.filter((r) => r.end === "Present").map((r) => ({ c, r })))[0];

  line(`# ${SITE.name}`);
  line();
  line(`${SITE.tagline}. Based in ${SITE.location}.`);
  if (current) {
    const about = current.c.about ? `, ${current.c.about}${current.c.parent ? ` from ${current.c.parent.name}` : ""}` : "";
    line(`Currently a ${current.r.title} at ${current.c.name}${about}, since ${current.r.start}.`);
  }
  for (const c of COMPANIES) {
    const first = c.roles[c.roles.length - 1];
    if (c.roles.length < 2 || !first) continue;
    const steps = [...c.roles].reverse().map((r) => `${r.title} (${r.start} to ${r.end})`).join(", then ");
    line(`At ${c.name} since ${first.start}: ${steps}.`);
  }
  line();
  line(`Résumé headline: ${RESUME.headline}.`);
  line(RESUME.summary);
  line();
  line(
    "Everything below comes from Arun's portfolio site and résumé. If a question isn't answered here, say so rather than guessing.",
  );
  line(
    "Lines in the first person (I, my) are Arun's own words from his site. Where the résumé and the My SparrowDesk years timeline differ, the timeline is the more exact record: it was checked against his commits and tickets.",
  );

  line();
  line("## Links");
  line(`- Portfolio: ${origin}`);
  line(`- Résumé (PDF): ${origin}${RESUME.pdf}`);
  line(`- Email: ${SITE.email}`);
  line(`- GitHub: ${SITE.links.github}`);
  line(`- GitHub (work): ${RESUME.links.githubWork}`);
  line(`- LinkedIn: ${SITE.links.linkedin}`);
  line(`- Instagram: ${SITE.links.instagram}`);

  line();
  line("## Experience");
  for (const c of COMPANIES) {
    line();
    line(`### ${c.name}${c.parent ? ` (${c.parent.name})` : ""}`);
    line(`${c.url}${c.parent ? ` and ${c.parent.url}` : ""}`);
    for (const r of c.roles) {
      const extra = RESUME.roles[r.title];
      line();
      line(`**${r.title}**, ${r.start} to ${r.end}${extra ? `, ${extra.location}` : ""}`);
      if (extra && extra.resumeTitle !== r.title) line(`Title on the résumé: ${extra.resumeTitle}.`);
      line(`- ${r.built}`);
      for (const b of extra?.bullets ?? []) line(`- ${b}`);
    }
    if (c.story) {
      line();
      const below = c.story.href === STORY.path ? ", the month-by-month record below, also" : "";
      line(`More: "${c.story.label}"${below} at ${origin}${c.story.href}`);
    }
  }
  line();
  line("Public listings of SparrowDesk integrations Arun worked on:");
  for (const l of RESUME.listings) line(`- ${l.name}: ${l.href}`);
  line();
  line(
    "Two different Stripe pieces: SparrowDesk's own subscription billing, which Arun maintains with the internal Stripe integration team, and the customer-facing Stripe app for the inbox (Sep 2026), which he built.",
  );
  line(`Twigs, mentioned above, is SurveySparrow's design system: ${RESUME.links.twigs}`);

  line();
  line(`## ${STORY.title}`);
  line(STORY.lede);
  line(`Page: ${origin}${STORY.path}`);
  line();
  for (const j of JOURNEY) {
    if (j.kind === "year") {
      line(`### ${j.year}`);
      continue;
    }
    line(`- ${j.date.replace("–", " to ")}: ${withLink(j)}${j.note ? `. ${j.note}` : ""}.`);
  }
  line();
  line(STORY.numbers);
  line(STORY.tools);

  line();
  line("## Projects");
  for (const p of PROJECTS) {
    const extra = RESUME.projects[p.repo];
    line();
    // The site's name for the project, with the résumé's short description after it.
    const subtitle = extra?.title.split(" – ")[1];
    line(`### ${p.name}${subtitle ? ` – ${subtitle}` : ""}`);
    line(`${extra ? `${extra.stack}, ${extra.date}` : p.made}. ${SITE.links.github}/${p.repo}`);
    // The résumé's bullets say what the site's one-liner says, in more detail; use one or the other.
    for (const b of extra?.bullets.length ? extra.bullets : [p.about]) line(`- ${b}`);
  }

  line();
  line("## Education");
  line(`${RESUME.education.degree}, ${RESUME.education.school}, ${RESUME.education.dates}. ${RESUME.education.grade}.`);

  line();
  line("## Achievements");
  for (const a of RESUME.achievements) line(`- ${a}`);

  line();
  line("## Technical skills");
  for (const s of RESUME.skills) line(`- ${s.area}: ${s.items}`);

  line();
  line("## What Arun uses day to day");
  for (const u of USES) line(`- ${u.label}: ${u.items}`);
  line();

  return out.join("\n");
}

/** The step's text with its link's URL after the linked words; if the words aren't found, the URL goes at the end. */
function withLink(step: Step): string {
  if (!step.link) return step.text;
  const at = step.text.indexOf(step.link.text);
  if (at < 0) return `${step.text} (${step.link.href})`;
  const end = at + step.link.text.length;
  return `${step.text.slice(0, end)} (${step.link.href})${step.text.slice(end)}`;
}
