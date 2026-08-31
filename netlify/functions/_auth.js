export function checkKey(req) {
  const want = process.env.CORRIDOR_KEY || "";
  const got = req.headers.get("x-corridor-key") || "";
  if (!want) return "CORRIDOR_KEY is not set on the site";
  if (got !== want) return "wrong password";
  return null;
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
