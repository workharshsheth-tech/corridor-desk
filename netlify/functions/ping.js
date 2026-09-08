import { getStore } from "@netlify/blobs";
import { whoIs, json } from "./_auth.js";

export default async (req) => {
  const who = whoIs(req);
  if (who.error) return json({ ok: false, error: who.error });
  try {
    const store = getStore("corridor");
    const { blobs } = await store.list();
    return json({ ok: true, role: who.role, records: blobs.length, at: new Date().toISOString() });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
};
