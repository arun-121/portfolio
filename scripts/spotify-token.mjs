// One-time helper: signs you in to Spotify and prints a refresh token for SPOTIFY_REFRESH_TOKEN.
// Usage: SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-token.mjs
// Behind ngrok: run `ngrok http 8888`, add https://<id>.ngrok-free.app/callback to the Spotify app,
// and pass it as SPOTIFY_REDIRECT_URI. The script still listens on port 8888.
import { createServer } from "node:http";

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const redirect = process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:8888/callback";
const auth = new URL("https://accounts.spotify.com/authorize");
auth.search = new URLSearchParams({
  client_id: id,
  response_type: "code",
  redirect_uri: redirect,
  scope: "user-read-currently-playing user-read-recently-played",
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url, redirect);
  if (url.pathname !== new URL(redirect).pathname) return res.end();
  const code = url.searchParams.get("code");
  if (!code) return res.end("No code in the callback.");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    console.error("Spotify said:", data);
    res.end("Failed. See the terminal.");
  } else {
    console.log(`\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    res.end("Done. The refresh token is in your terminal; you can close this tab.");
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => console.log(`Open this in your browser:\n\n${auth}\n`));
