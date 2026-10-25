import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Experience from "@/components/Experience";
import LiveClock from "@/components/LiveClock";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { getSiteUrl, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | Developer` },
  alternates: { canonical: "/" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: getSiteUrl(),
    email: `mailto:${SITE.email}`,
    jobTitle: "Developer",
    address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
    sameAs: [SITE.links.github, SITE.links.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main id="main" className="column">
        {/* Banner: the painting, with Chennai time */}
        <div className="unit">
        <Panel variant="golden" golden className="banner">
          <div className="bannerTime">
            <LiveClock />
          </div>
        </Panel>

        <section className="intro introCard" id="intro" aria-labelledby="hero-title">
          <Reveal kind="up" delay={0} className="profileRow">
            <img className="avatar foxAvatar" src="/avatar.jpg" alt="" width={64} height={64} />
            <span className="profileText">
              <h1 id="hero-title" className="profileName">{SITE.name}</h1>
              <span className="profileTitle">Software Engineer in {SITE.location}</span>
            </span>
          </Reveal>
          <Reveal kind="up" delay={60} as="p" className="heroSub">
            I&rsquo;m a full-stack engineer on a customer support product. I look after
            billing and payments, build third&#8209;party integrations, and make the
            reusable pieces other features are built from.
          </Reveal>
          <Reveal kind="up" delay={120} className="introActions">
            <a className="btnSolid" href={SITE.links.github} target="_blank" rel="noopener noreferrer">
              GitHub
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
            <a className="btnOutline" href="/Arun-S-R-Resume.pdf" download>
              Résumé
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
          </Reveal>
          <Reveal kind="up" delay={160} as="p" className="quietLinks">
            <a href={`mailto:${SITE.email}`}>Email</a>
            <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </Reveal>
        </section>

        <Experience />
        </div>
      </main>

      <div className="drift" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <img key={n} className={`driftLeaf driftLeaf${n}`} src={`/leaves/leaf-${[1, 2, 3, 5, 2, 3][n]}.${[1, 2, 3, 5, 2, 3][n] === 5 ? "png" : "webp"}`} alt="" />
        ))}
      </div>

      <SiteFooter leaves />
    </>
  );
}
