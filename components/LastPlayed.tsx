import { SpotifyLogo } from "@phosphor-icons/react/dist/ssr";
import { getLastPlayed } from "@/lib/spotify";

/** Header item, top right: the song on Spotify, styled like the place and the clock. Renders nothing without Spotify. */
export default async function LastPlayed() {
  const track = await getLastPlayed();
  if (!track) return null;
  const label = track.playing ? "Now playing on Spotify" : "Last played on Spotify";

  return (
    <a
      className="navSong"
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: ${track.title} by ${track.artist}`}
      data-playing={track.playing || undefined}
    >
      <SpotifyLogo size={14} weight="fill" aria-hidden />
      <span className="navSongText">{track.title}</span>
      {/* hover card: the cover and the full song; it grows from the item's corner */}
      <span className="navSongCard" aria-hidden>
        {track.art && <img src={track.art} alt="" width={48} height={48} />}
        <span className="navSongCardText">
          <span className="navSongCardSource">{label}</span>
          <span className="navSongCardTitle">{track.title}</span>
          <span className="navSongCardArtist">{track.artist}</span>
        </span>
      </span>
    </a>
  );
}
