"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Check, Copy, EnvelopeSimple, FileText, GithubLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";
import { SITE } from "@/lib/site";
import { llmProfile } from "@/lib/llmProfile";

/** Résumé, GitHub, LinkedIn, Instagram, Email, Copy for LLM. Email copies the address on a plain click; modified clicks still open mail. */
export default function IntroLinks() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [llmCopied, setLlmCopied] = useState(false);
  const llmTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => {
    clearTimeout(timer.current);
    clearTimeout(llmTimer.current);
  }, []);

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

  const copyForLlm = async () => {
    try {
      await navigator.clipboard.writeText(llmProfile(window.location.origin));
    } catch {
      return; // no clipboard access: nothing to confirm
    }
    setLlmCopied(true);
    clearTimeout(llmTimer.current);
    llmTimer.current = setTimeout(() => setLlmCopied(false), 1600);
  };

  return (
    <>
      <a href="/Arun-S-R-Resume.pdf" target="_blank" rel="noopener noreferrer">
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
      <a href={SITE.links.instagram} target="_blank" rel="noopener noreferrer">
        <InstagramLogo size={16} aria-hidden />
        Instagram
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
      <button type="button" onClick={copyForLlm} data-copied={llmCopied || undefined} title="Copy a plain-text profile for AI assistants">
        <span className="linkSwap">
          <span className="linkSwapA">
            <Copy size={16} aria-hidden />
            Copy for LLM
          </span>
          <span className="linkSwapB" aria-hidden="true">
            <Check size={16} weight="bold" aria-hidden />
            Copied
          </span>
        </span>
      </button>
      <span className="sr-only" role="status">{copied ? "Email address copied" : llmCopied ? "Profile copied" : ""}</span>
    </>
  );
}
