import type { Metadata } from "next";
import Link from "next/link";
import LocalClock from "@/components/LocalClock";

export const metadata: Metadata = {
  title: "On slow tooling — Arun S R",
  description: "Tool speed changes your relationship with your work.",
};

export default function OnSlowTooling() {
  return (
    <>
      <main>
        <Link href="/reflections" className="back">← Reflections</Link>

        <p className="articleMeta">Reflection · 2026</p>
        <h1 className="articleTitle">On slow tooling</h1>

        <div className="articleBody">
          <p>
            I've been thinking about the speed of tools and what it costs. Not in
            performance terms — in the other kind. The cost to your understanding
            of what you're building.
          </p>
          <p>
            I started writing JavaScript when my laptop took about twenty seconds
            to lint and bundle a small project. Not a big project — a small one.
            In those twenty seconds, I'd reread what I'd written. Sometimes I'd
            spot the problem before the linter did.
          </p>
          <p>
            Now I work in an environment where changes appear in the browser
            before I've let go of the save keystroke. This is genuinely good. I
            find layout bugs faster, I iterate more freely, I spend less time on
            things that don't work.
          </p>
          <p>
            But I also notice I move differently. I change things and look at the
            result before I've thought about what the result should be. I confirm
            by seeing rather than by reasoning. When something looks right, I
            stop — even if I couldn't have predicted it would look right before I
            tried.
          </p>
          <p>
            There's a mode of working that fast tools encourage that I'd call
            reactive fluency. You're moving fast, you're not stuck, you're making
            progress. But the understanding underneath is thin. You know that it
            works. You don't quite know why.
          </p>
          <p>
            This shows up during debugging. When something breaks in an
            environment I've never run before, my mental model of the system is
            less detailed than I expected. I know the shape of what I built. I
            don't always know why I made it that shape.
          </p>
          <p>
            I don't think slow tools are the answer. I'd rather have fast
            feedback and do the thinking deliberately. But <em>deliberately</em>{" "}
            is the key word — it means choosing to sit with a problem before you
            reach for the keyboard. Not every time. When it matters.
          </p>
          <p>
            The thing about fast tools is they don't make you think faster. They
            make it easier not to think at all. And for a while, that feels like
            flow.
          </p>
        </div>
      </main>

      <footer>
        <span>© 2026 Arun S R · Chennai</span>
        <LocalClock />
      </footer>
    </>
  );
}
