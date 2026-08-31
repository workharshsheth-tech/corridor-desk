import { getStore } from "@netlify/blobs";

// Diagnostic ping. Reports what the function can see, without leaking any values.
export default async (req) => {
  const want = process.env.CORRIDOR_KEY || "";
  const got = req.headers.get("x-corridor-key") || "";

  // names only, never values
  const seen = Object.keys(process.env)
    .filter(k => !/^(AWS|LAMBDA|_|NETLIFY_IMAGES|NODE|PATH|LANG|TZ|PWD|SHLVL|HOME)/.test(k))
    .sort();

  const info = {
    keyIsSet: !!want,
    keyLength: want.length,
    headerSent: !!got,
    headerLength: got.length,
    matches: !!want && got === want,
    envNames: seen
  };

  if (!want) return json({ ok: false, error: "CORRIDOR_KEY is not set on the site", info });
  if (got !== want) return json({ ok: false, error: "wrong password", info });

  try {
    const store = getStore("corridor");
    const { blobs } = await store.list();
    return json({ ok: true, records: blobs.length, at: new Date().toISOString(), info });
  } catch (e) {
    return json({ ok: false, error: String(e), info });
  }
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
