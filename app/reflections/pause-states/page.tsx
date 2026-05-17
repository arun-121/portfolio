import type { Metadata } from "next";
import Link from "next/link";
import LocalClock from "@/components/LocalClock";

export const metadata: Metadata = {
  title: "Pause states — Arun S R",
  description: "On the value of the pending state — in software and in life.",
};

export default function PauseStates() {
  return (
    <>
      <main>
        <Link href="/reflections" className="back">← Reflections</Link>

        <p className="articleMeta">Reflection · 2025</p>
        <h1 className="articleTitle">Pause states</h1>

        <div className="articleBody">
          <p>
            There's a term in frontend state machines for the moment between
            actions: the <em>pending</em> state. Not loading, not done — just
            pending. Something was requested and hasn't resolved yet.
          </p>
          <p>
            I think about this when I'm waiting. Not for anything in particular.
            Just waiting, the way you do when a thought hasn't formed yet but you
            know one is coming.
          </p>
          <p>
            We've gotten very good at eliminating the pending state from
            software. Hot module replacement means changes appear before you've
            put your hands back on the keyboard. AI completions arrive before
            you've finished typing the sentence. The latency between intent and
            outcome approaches zero.
          </p>
          <p>
            But I notice that the best ideas I have about code don't come while
            I'm writing it. They come when I've stepped away — walking, making
            tea, lying in that flat zone between sleep and waking. The pause
            state.
          </p>
          <p>
            There's something about the active, typing, clicking mode that's
            fundamentally reactive. You respond to what's in front of you. The
            pause is where you're not responding to anything, and so you start to
            generate.
          </p>
          <p>
            I'm not nostalgic for slow builds. I don't miss waiting 45 seconds
            for webpack. But I wonder what I was doing in those 45 seconds.
            Looking out the window, usually. Letting the implications of what I'd
            just written settle. Noticing that the approach was off before I'd
            gotten far enough in to be committed.
          </p>
          <p>
            Now I notice it later. When the thing is built and deployed and
            something feels wrong, I trace it back. Usually to a decision I made
            fast.
          </p>
          <p>
            The pause states haven't disappeared — they've just moved. They
            happen in code review, in bugs filed weeks later, in the quiet moment
            when you realize a pattern doesn't scale the way you thought it
            would.
          </p>
          <p>
            Maybe the question isn't how to eliminate the pending state, but
            where you want it to occur. Early, where you still have room to
            change direction. Or late, where you're already committed.
          </p>
          <p>I've started taking longer walks.</p>
        </div>
      </main>

      <footer>
        <span>© 2026 Arun S R</span>
        <LocalClock />
      </footer>
    </>
  );
}
