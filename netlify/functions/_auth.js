// Two roles, two passwords. Both set as environment variables on Netlify.
//   CORRIDOR_KEY      -> admin (Harsh)
//   CORRIDOR_KEY_OPS  -> ops   (Dinesh)   optional; if unset, no ops login exists
export function whoIs(req) {
  const admin = process.env.CORRIDOR_KEY || "";
  const ops = process.env.CORRIDOR_KEY_OPS || "";
  const got = req.headers.get("x-corridor-key") || "";

  if (!admin) return { error: "CORRIDOR_KEY is not set on the site" };
  if (got && got === admin) return { role: "admin" };
  if (ops && got === ops) return { role: "ops" };
  return { error: "wrong password" };
}

// kept so older calls still work
export function checkKey(req) {
  const who = whoIs(req);
  return who.error || null;
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
