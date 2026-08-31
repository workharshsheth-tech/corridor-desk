import { getStore } from "@netlify/blobs";
import { checkKey, json } from "./_auth.js";

// POST /api/push  { by, records: [{ col, id, data, deleted }] }
export default async (req) => {
  const bad = checkKey(req);
  if (bad) return json({ ok: false, error: bad }, 401);

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const list = Array.isArray(body.records) ? body.records : [];
  if (!list.length) return json({ ok: true, written: 0, now: Date.now() });

  const store = getStore("corridor");
  const now = Date.now();
  let n = 0;

  for (const r of list) {
    if (!r || !r.col || !r.id) continue;
    const key = `${r.col}__${r.id}`;
    await store.setJSON(key, {
      col: r.col,
      id: r.id,
      data: r.data ?? null,
      deleted: !!r.deleted,
      ts: now,
      by: String(body.by || "someone").slice(0, 40)
    });
    n++;
  }
  return json({ ok: true, written: n, now });
};
