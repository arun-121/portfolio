"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type Kind = "rise" | "card" | "up" | "fade";

/**
 * Scroll reveal. Fades up from below and resolves from blur to sharp the
 * first time about 20% of the element is visible, then stops observing.
 * Hidden state lives in CSS and only applies when scripting is on and
 * reduced motion is off, so the page is complete without JavaScript.
 */
export default function Reveal({
  children,
  kind = "rise",
  delay = 0,
  as = "div",
  className = "",
  style,
  ...rest
}: {
  children: ReactNode;
  kind?: Kind;
  /** Stagger in milliseconds, in reading order inside a section. */
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `reveal reveal-${kind} ${className}`.trim(),
      "data-in": shown ? "true" : "false",
      style: { ...style, "--d": `${delay}ms` } as CSSProperties,
      ...rest,
    },
    children,
  );
}
