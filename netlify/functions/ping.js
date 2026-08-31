import { getStore } from "@netlify/blobs";
import { checkKey, json } from "./_auth.js";

export default async (req) => {
  const bad = checkKey(req);
  if (bad) return json({ ok: false, error: bad }, 401);
  try {
    const store = getStore("corridor");
    const { blobs } = await store.list();
    return json({ ok: true, records: blobs.length, at: new Date().toISOString() });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
};
