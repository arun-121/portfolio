import type { Metadata } from "next";
import Link from "next/link";
import Experience from "@/components/Experience";
import IntroLinks from "@/components/IntroLinks";
import Panel from "@/components/Panel";
import Projects from "@/components/Projects";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import Uses from "@/components/Uses";
import { getSiteUrl, SITE } from "@/lib/site";

/** Re-render at most once a minute so the Spotify item in the header stays fresh. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | ${SITE.role}` },
  alternates: { canonical: "/" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: getSiteUrl(),
    email: `mailto:${SITE.email}`,
    jobTitle: SITE.role,
    address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
    sameAs: [SITE.links.github, SITE.links.linkedin, SITE.links.instagram],
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
        {/* Banner: the painting */}
        <div className="unit">
        <Panel variant="golden" golden className="banner" />

        <section className="intro introCard" id="intro" aria-labelledby="hero-title">
          <Reveal kind="up" delay={0} className="profileRow">
            <img className="avatar foxAvatar" src="/avatar.jpg" alt="" width={64} height={64} />
            <span className="profileText">
              <h1 id="hero-title" className="profileName">Hi, I&rsquo;m Arun.</h1>
              <span className="profileTitle">{SITE.tagline}</span>
            </span>
          </Reveal>
          <Reveal kind="up" delay={60} as="p" className="heroSub">
            Currently at{" "}
            <a className="heroLink" href="https://sparrowdesk.com" target="_blank" rel="noopener noreferrer">
              SparrowDesk
            </a>
            , the customer support platform from{" "}
            <a className="heroLink" href="https://surveysparrow.com" target="_blank" rel="noopener noreferrer">
              SurveySparrow
            </a>
            , as a Member of Technical Staff.
          </Reveal>
          <Reveal kind="up" delay={120} as="p" className="quietLinks introLinks">
            <IntroLinks />
          </Reveal>
        </section>

        <Experience />
        <Projects />
        <Uses />
        </div>
      </main>


      <SiteFooter leaves />
    </>
  );
}
