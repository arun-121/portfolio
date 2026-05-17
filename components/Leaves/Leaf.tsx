"use client";

import { useCallback, useId, useRef, useState, useMemo } from "react";
import { playCrack, warmAudio } from "@/lib/leafAudio";
import {
  SHAPES,
  PIECE_NAMES,
  lighten,
  darken,
} from "./leafShapes";
import { type LeafConfig, type ShapeKey } from "./leafConfigs";
import styles from "./leaves.module.css";

interface Props extends LeafConfig {}

export default function Leaf(props: Props) {
  const {
    top,
    left,
    size,
    rotation,
    color,
    shape = "almond" as ShapeKey,
    flipped = false,
    pitch = 1,
    swayAmp = 2.4,
    swayDur = 6,
    swayDelay = 0,
  } = props;

  const id = useId().replace(/:/g, "");
  const cooldown = useRef(false);
  const [cracked, setCracked] = useState(false);

  const shapeDef = SHAPES[shape];

  const colors = useMemo(() => {
    if (flipped) {
      const pale = lighten(color, 0.32);
      return {
        light: lighten(pale, 0.15),
        mid: pale,
        dark: darken(pale, 0.18),
        veinAlpha: 0.42,
        stemColor: "#7A5F3A",
      };
    }
    return {
      light: lighten(color, 0.22),
      mid: color,
      dark: darken(color, 0.28),
      veinAlpha: 0.7,
      stemColor: "#3D2918",
    };
  }, [color, flipped]);

  const handleClick = useCallback(() => {
    if (cooldown.current) return;
    cooldown.current = true;
    playCrack(pitch);
    setCracked(true);
    window.setTimeout(() => setCracked(false), 440);
    window.setTimeout(() => {
      cooldown.current = false;
    }, 1600);
  }, [pitch]);

  const gradientId = `leaf-grad-${id}`;
  const shadowId = `leaf-shadow-${id}`;

  return (
    <button
      type="button"
      className={`${styles.leaf} ${cracked ? styles.cracked : ""}`}
      style={
        {
          top,
          left,
          width: size,
          height: size * 1.65,
          "--rotation": `${rotation}deg`,
          "--sway-amp": `${swayAmp}deg`,
          "--sway-dur": `${swayDur}s`,
          "--sway-delay": `${swayDelay}s`,
        } as React.CSSProperties
      }
      onClick={handleClick}
      onPointerEnter={warmAudio}
      aria-label="A dry leaf — press to crack"
    >
      <svg viewBox="-40 -65 80 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient
            id={gradientId}
            cx="0.35"
            cy="0.3"
            r="0.85"
            fx="0.32"
            fy="0.28"
          >
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="45%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.dark} />
          </radialGradient>
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* soft cast shadow under the leaf */}
        <ellipse
          cx="0"
          cy="58"
          rx="26"
          ry="3.5"
          fill="rgba(40, 25, 12, 0.22)"
          filter={`url(#${shadowId})`}
        />

        {/* five irregular pieces — each crack-animated independently */}
        {PIECE_NAMES.map((p) => (
          <g key={p} className={`${styles.piece} ${styles[p]}`}>
            <path
              d={shapeDef.pieces[p]}
              fill={`url(#${gradientId})`}
              stroke={colors.dark}
              strokeWidth={0.35}
              strokeLinejoin="round"
            />
            {shapeDef.veins[p].map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={flipped ? "#7A5F3A" : "#2A1B0A"}
                strokeWidth={i === 0 ? 1.3 : 0.85}
                fill="none"
                opacity={i === 0 ? colors.veinAlpha + 0.05 : colors.veinAlpha - 0.18}
                strokeLinecap="round"
              />
            ))}
          </g>
        ))}

        {/* stem — doesn't crack with the blade */}
        <path
          d={shapeDef.stem}
          stroke={colors.stemColor}
          strokeWidth={1.7}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
