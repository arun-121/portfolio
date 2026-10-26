import type { Metadata } from "next";
import Link from "next/link";
import Experience from "@/components/Experience";
import IntroLinks from "@/components/IntroLinks";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { getSiteUrl, SITE } from "@/lib/site";

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
        {/* Banner: the painting */}
        <div className="unit">
        <Panel variant="golden" golden className="banner" />

        <section className="intro introCard" id="intro" aria-labelledby="hero-title">
          <Reveal kind="up" delay={0} className="profileRow">
            <img className="avatar foxAvatar" src="/avatar.jpg" alt="" width={64} height={64} />
            <span className="profileText">
              <h1 id="hero-title" className="profileName">Hi, I&rsquo;m Arun.</h1>
              <span className="profileTitle">{SITE.role}</span>
            </span>
          </Reveal>
          <Reveal kind="up" delay={60} as="p" className="heroSub">
            I work on a customer support product: the billing module, third&#8209;party
            integrations, and the reusable pieces other features are built from.
          </Reveal>
          <Reveal kind="up" delay={120} as="p" className="quietLinks introLinks">
            <IntroLinks />
          </Reveal>
        </section>

        <Experience />
        </div>
      </main>


      <SiteFooter leaves />
    </>
  );
}
