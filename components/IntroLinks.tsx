"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Check, EnvelopeSimple, FileText, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { SITE } from "@/lib/site";

/** Résumé, GitHub, LinkedIn, Email. Email copies the address on a plain click; modified clicks still open mail. */
export default function IntroLinks() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      return; // no clipboard access: let the mailto link do its job
    }
    e.preventDefault();
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <a href="/resume">
        <FileText size={16} aria-hidden />
        Résumé
      </a>
      <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">
        <GithubLogo size={16} aria-hidden />
        GitHub
      </a>
      <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">
        <LinkedinLogo size={16} aria-hidden />
        LinkedIn
      </a>
      <a href={`mailto:${SITE.email}`} onClick={copyEmail} data-copied={copied || undefined} title={SITE.email}>
        <span className="linkSwap">
          <span className="linkSwapA">
            <EnvelopeSimple size={16} aria-hidden />
            Email
          </span>
          <span className="linkSwapB" aria-hidden="true">
            <Check size={16} weight="bold" aria-hidden />
            Copied
          </span>
        </span>
      </a>
      <span className="sr-only" role="status">{copied ? "Email address copied" : ""}</span>
    </>
  );
}
