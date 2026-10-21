# CODΞLYNX (core build)
Static PWA + one Vercel function. No build step, no dependencies. Deploy: `vercel --prod` (or any static host + `api/proxy.js`).
Run the syntax checks with `npm run check`. Env vars: none required (`.env.example` lists optional Supabase names, unused).

## Providers (endpoints taken from the audited archives)
| Provider | Source archive | Endpoints used | Status |
|---|---|---|---|
| Kilpy `kilpy-api.vercel.app` | root JSON | `/search?q&limit`, `/stream?url&bitrate`, `/download?url&bitrate` (`/song`, `/media/image` documented, not used) | Endpoints documented by the API root (fetched). Search response fields NOT verified; mapper is tolerant. |
| JioSaavn-style `jiosvvnn.vercel.app/api` | ayumusicweb | `/search/songs?query&page&limit` (trending = query "Latest Top Trending Hits") | From bundle code; not live-tested |
| Audius `api.audius.co/v1` | ayumusicweb | `/tracks/search?query&limit`, `/tracks/{id}/stream` | From bundle code; not live-tested |
| LRCLIB `lrclib.net/api` | ayumusicweb, AirBeats | `/search?q=` (synced + plain lyrics) | From bundle code; not live-tested |
| ModVault `modvault-music.vercel.app/api` | modvault-music | `/search/songs?q&page`, `/trending`, `/similar/:id` | From bundle code; response fields partly inferred; not live-tested |
| Hulk `hulkmusic.vercel.app/api/saavn` | hulkmusic | `?__call=search.getResults&q&p&n`, `/saavn/stream?url=` | From bundle code; preview-quality audio; not live-tested |
| Saaz `saaz-next.vercel.app/api` | saaz-next | `/search/songs?q&page&limit` (`{success,data}`) | From bundle code; not live-tested |

Fallback: results from all providers are merged and de-duplicated; if a stream fails, the player tries the next bitrate, then the same song from another provider, then skips.

## Not integrated in this build
- Remaining endpoints of ModVault/Saaz/jiosvvnn (albums, artists, playlists, `song/:id`, `lyrics`, `download`).
- KuGou (`mobileservice.kugou.com`, `lyrics.kugou.com`) and BetterLyrics (`lyrics-api.boidu.dev/getLyrics?s&a`, TTML) lyrics, found in AirBeats.
- Direct `www.jiosaavn.com/api.php` (Knox), Radio Browser (Knox).
- Saaz Supabase RPCs `saaz_track` / `saaz_live` (analytics/presence for Saaz's own project; its anon key is not copied here).
- Sterniters: payload is AES-GCM encrypted; no readable API. Knox YouTube/YT Music sidecars and AirBeats InnerTube need a server/Android runtime.
- Album/artist pages, equalizer, crossfade, offline file storage, playlist reordering, import/export.

## Testing
Only executed: `node --check` on the app script, `sw.js` and `api/proxy.js` (passed). Everything else (live APIs, playback, IndexedDB, PWA install, layouts) is UNVERIFIED: the build sandbox had no network or browser.
Downloads rely on the provider's URL; browsers may open cross-origin files instead of saving them.
Licenses: no code was copied from the archives (Knox is MIT, AirBeats GPL); only endpoint knowledge was reused.
