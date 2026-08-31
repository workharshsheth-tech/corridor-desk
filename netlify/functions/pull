import { getStore } from "@netlify/blobs";
import { checkKey, json } from "./_auth.js";

// GET /api/pull?since=<ms>   ->  every record touched after that moment
export default async (req) => {
  const bad = checkKey(req);
  if (bad) return json({ ok: false, error: bad }, 401);

  const since = Number(new URL(req.url).searchParams.get("since") || 0);
  const store = getStore("corridor");
  const { blobs } = await store.list();

  const out = [];
  for (const b of blobs) {
    const rec = await store.get(b.key, { type: "json" });
    if (rec && Number(rec.ts || 0) > since) out.push(rec);
  }
  out.sort((a, b) => a.ts - b.ts);
  return json({ ok: true, now: Date.now(), records: out });
};
