import { createHash } from "node:crypto";

/** Leaves cracked by every visitor, kept in Upstash Redis (its REST API, no client library). */

const KEY = "leaves:total";
/** Most a single visitor can add per minute; more than a person can crack by hand. */
const PER_MINUTE = 150;

function redis() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return async (commands: (string | number)[][]) => {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`redis ${res.status}`);
    return ((await res.json()) as { result: unknown }[]).map((r) => r.result);
  };
}

const json = (body: unknown, init?: ResponseInit) => Response.json(body, init);

export async function GET() {
  const run = redis();
  if (!run) return json({ total: null }, { status: 404 });
  try {
    const [total] = await run([["GET", KEY]]);
    return json({ total: Number(total ?? 0) }, { headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30" } });
  } catch {
    return json({ total: null }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const run = redis();
  if (!run) return json({ total: null }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { n?: unknown } | null;
  const n = Math.floor(Number(body?.n));
  if (!Number.isFinite(n) || n < 1 || n > 60) return json({ error: "n must be 1–60" }, { status: 400 });

  // Only the live site counts; local dev and preview builds share the store, so they just echo.
  if (process.env.VERCEL_ENV !== "production") {
    const [total] = await run([["GET", KEY]]).catch(() => [0]);
    return json({ total: Number(total ?? 0) + n });
  }

  // Rate limit per visitor; the address is hashed so it never sits in the store as-is.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const who = `leaves:ip:${createHash("sha256").update(ip).digest("hex").slice(0, 16)}`;

  try {
    const [used] = await run([["INCRBY", who, n], ["EXPIRE", who, 60, "NX"]]);
    if (Number(used) > PER_MINUTE) {
      const [total] = await run([["GET", KEY]]);
      return json({ total: Number(total ?? 0) }, { status: 429 });
    }
    const [total] = await run([["INCRBY", KEY, n]]);
    return json({ total: Number(total) });
  } catch {
    return json({ total: null }, { status: 502 });
  }
}
