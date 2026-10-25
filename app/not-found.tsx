import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="notFound">
      <p className="pageMeta">Error 404</p>
      <h1 className="pageTitle">This page wandered off.</h1>
      <Link href="/" className="btn btnPrimary">
        <ArrowLeft size={16} weight="bold" aria-hidden />
        Back home
      </Link>
    </main>
  );
}
