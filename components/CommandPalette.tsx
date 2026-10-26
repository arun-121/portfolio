"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITE } from "@/lib/site";

type Cmd = { id: string; label: string; hint: string; run: () => void };

/** ⌘K / Ctrl+K palette. Keyboard driven, so it opens with no animation. */
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const cmds: Cmd[] = useMemo(
    () => [
      { id: "email", label: "Send an email", hint: SITE.email, run: () => (location.href = `mailto:${SITE.email}`) },
      { id: "copy", label: "Copy email address", hint: "clipboard", run: () => navigator.clipboard?.writeText(SITE.email) },
      { id: "gh", label: "Open GitHub", hint: "github.com", run: () => window.open(SITE.links.github, "_blank", "noopener") },
      { id: "in", label: "Open LinkedIn", hint: "linkedin.com", run: () => window.open(SITE.links.linkedin, "_blank", "noopener") },
      { id: "cv", label: "Read résumé", hint: "/resume", run: () => router.push("/resume") },
      { id: "pdf", label: "Download résumé", hint: ".pdf", run: () => { const a = document.createElement("a"); a.href = "/Arun-S-R-Resume.pdf"; a.download = ""; a.click(); } },
      { id: "leaves", label: "Crack some leaves", hint: "#leaves", run: () => (location.hash = "leaves") },
    ],
    [router],
  );
  const shown = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  if (!open) return null;
  const go = (c?: Cmd) => {
    if (!c) return;
    setOpen(false);
    c.run();
  };

  return (
    <div className="palBackdrop" onMouseDown={() => setOpen(false)}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={input}
          className="palInput"
          placeholder="Type a command"
          value={q}
          onChange={(e) => { setQ(e.target.value); setI(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(v + 1, shown.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(v - 1, 0)); }
            if (e.key === "Enter") go(shown[i]);
          }}
        />
        <ul className="palList" role="listbox">
          {shown.length === 0 && <li className="palEmpty">No match</li>}
          {shown.map((c, n) => (
            <li key={c.id} role="option" aria-selected={n === i}>
              <button type="button" className="palItem" data-active={n === i} onMouseEnter={() => setI(n)} onClick={() => go(c)}>
                <span>{c.label}</span>
                <span className="palHint">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
