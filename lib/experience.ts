/** Where I have worked. Rendered by components/Experience.tsx and copied into the LLM profile. */
export type Company = {
  name: string;
  url: string;
  /** Parent company, shown quietly after the name. */
  parent?: { name: string; url: string };
  logo: string;
  /** What the company is, in a few words; used in the LLM profile's opening line. */
  about?: string;
  /** Newest first. The rail fills upward, from the first role to the current one. */
  /** built: one plain sentence about the role, shown when the title is opened. */
  roles: { title: string; start: string; end: string; built: string }[];
  /** Optional page with the longer, factual story of the time there. */
  story?: { href: string; label: string };
};

export const COMPANIES: Company[] = [
  {
    name: "SparrowDesk",
    url: "https://sparrowdesk.com",
    parent: { name: "SurveySparrow", url: "https://surveysparrow.com" },
    logo: "/logos/sparrowdesk.png",
    about: "the customer support platform",
    story: { href: "/my-sparrowdesk-years", label: "My SparrowDesk years" },
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
