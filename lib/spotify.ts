export type Track = {
  title: string;
  artist: string;
  url: string;
  /** Album cover, the smallest size Spotify has that is at least 64px. */
  art: string | null;
  /** True while it is playing right now; otherwise it is the last track played. */
  playing: boolean;
};

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
  album?: { images?: { url: string; width: number | null }[] };
};

const coverOf = (t: SpotifyTrack) => {
  const images = t.album?.images ?? [];
  return ([...images].reverse().find((i) => (i.width ?? 0) >= 64) ?? images[0])?.url ?? null;
};

const toTrack = (t: SpotifyTrack, playing: boolean): Track => ({
  title: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  url: t.external_urls.spotify,
  art: coverOf(t),
  playing,
});

async function accessToken(): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return null;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
  });
  if (!res.ok) return null;
  return ((await res.json()) as { access_token?: string }).access_token ?? null;
}

/** What's playing now, else the last track played. Null when Spotify isn't set up or doesn't answer. */
export async function getLastPlayed(): Promise<Track | null> {
  try {
    const token = await accessToken();
    if (!token) return null;
    const headers = { Authorization: `Bearer ${token}` };

    const now = await fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers });
    if (now.status === 200) {
      const data = (await now.json()) as { is_playing?: boolean; item?: SpotifyTrack & { type?: string } };
      if (data.is_playing && data.item?.type === "track") return toTrack(data.item, true);
    }

    const recent = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", { headers });
    if (!recent.ok) return null;
    const { items } = (await recent.json()) as { items?: { track: SpotifyTrack }[] };
    return items?.[0] ? toTrack(items[0].track, false) : null;
  } catch {
    return null;
  }
}
