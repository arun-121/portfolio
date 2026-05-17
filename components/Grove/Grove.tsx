"use client";

import dynamic from "next/dynamic";
import styles from "./grove.module.css";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <div className={styles.placeholder} aria-hidden="true" />,
});

export default function Grove() {
  return (
    <section className={styles.section}>
      <p className={styles.invite}>A few dry leaves, gathered for you.</p>
      <p className={styles.inviteSub}>Press them. They crack nicely.</p>

      <div className={styles.canvasWrap}>
        <Scene />
      </div>
    </section>
  );
}
