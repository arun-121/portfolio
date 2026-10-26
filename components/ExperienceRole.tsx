"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus } from "@phosphor-icons/react";

/** One role on the stem. What was built stays folded until the title is clicked. */
export default function ExperienceRole({
  title,
  dates,
  current,
  built,
}: {
  title: string;
  dates: ReactNode;
  current: boolean;
  built: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <li className="expRoleRow" aria-current={current ? "step" : undefined} data-open={open || undefined}>
      <span className="expRoleDate">{dates}</span>
      <span className="expNode" aria-hidden="true" />
      <button
        type="button"
        className="expRoleToggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="expRoleName">{title}</span>
        <Plus className="expRoleMark" size={12} weight="bold" aria-hidden />
      </button>
      <div id={panelId} className="expBuiltWrap" inert={!open}>
        <div className="expBuiltInner">
          <p className="expBuilt">{built}</p>
        </div>
      </div>
    </li>
  );
}
