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

## v2 additions
Explore (search shortcuts), Radio (Radio Browser: `all.api.radio-browser.info/json/stations/{topvote/30|bycountry/India|bylanguage/hindi|bytag/jazz}`; paths from Knox tests, host name not in the archives), Local files, Downloads (Kilpy `dl` links only), Settings (provider toggles + live health check, speed, sleep timer, storage limit, export/import, clears), resume position, update notice, hardened proxy (host allowlist, https only, no redirects, 2 MB cap, rate limit) and security headers.
Not built yet: equalizer/visualizer/crossfade (Web Audio breaks non-CORS streams), artist/album pages, queue reorder, full-screen player gestures, podcasts, KuGou/BetterLyrics, translation, pause/resume downloads, tests beyond `node --check`.
Status: only `node --check` was run; everything else is unverified.

## v3 additions
Background/lock-screen controls (Media Session: play, pause, next, previous, seek ±10 s, seekto, position and playback state), Install button + richer manifest (id, scope, shortcuts), Artists and Albums pages (jiosvvnn `/search/artists|albums`; tapping runs a song search for that name), queue reorder (↑/↓), KuGou lyrics fallback (only if LRCLIB has none; 8 s duration tolerance is my choice), light/dark/system theme, M3U export of playlists.
Background playback: audio keeps playing when the screen locks or you switch apps on Android Chrome (best when installed); iOS Safari may stop it. This depends on the browser; it is not guaranteed.
Still not built: equalizer/visualizer/crossfade, podcasts, swipe full-screen player, accounts/sync, BetterLyrics, automated tests. Verified: `node --check` only.

## v4 additions (saaz-next home layout)
Header search pill + sleep-timer and radio buttons; Trending Now with language chips (Hindi/English/Punjabi/Tamil/Telugu/Bhojpuri/Marathi/Bengali, via search `<lang> latest songs`); mood chips (All Music, Romantic, Dance, Sad, Party, Classical, Rock, Pop, Hip Hop, Latest) that filter home sections; sections English Hits, Hip Hop, Punjabi Beats, Romantic, Lofi & Chill, Party Anthems, 90s Classics; Charts & Playlists (jiosvvnn `/search/playlists`, tap loads `/playlists?id=`, falls back to a name search; follower count shown only if the API returns it); New Releases 2-column album grid; heart/＋/play buttons on every card; Liked tab in the bottom nav.
Unverified: only `node --check` was run; the playlist endpoints are untested.

## v5: Spotify-browse style Search
Header + sticky white search bar, category tiles (Music, Radio, Albums, Artists, Home of I-Pop, Made For You), "Discover something new" hashtag cards (artwork fetched lazily from jiosvvnn when it responds, gradient otherwise), 3-column colour genre grid (~57 tiles, each runs a search). Grid hides while a query is typed. Podcasts / Live Events / camera tiles not included (no source for them). Verified: node --check only.

## v6: Spotify-style Library
Header (search, new playlist), chips Playlists/Albums/Artists (tap again to clear), sort Recents/A–Z, list/grid toggle, Liked Songs pinned, playlists with 2x2 cover mosaic, saved artists/albums (localStorage `cl_lib`, found via jiosvvnn `/search/artists|albums`), Add artists / Add albums / Import your music (opens Local files), playlist page (play, shuffle, rename, delete, remove tracks), Recently played kept below. Podcasts/events not included. Verified: node --check only.

## v7: Profile tab
Bottom-nav "More" replaced by "Profile": editable display name (localStorage `cl_name`), counts (liked/playlists/saved) and links to Explore, Artists, Albums, Radio, Local files, Downloads, Settings, Install. Verified: node --check only.

## v8: Spotify-style profile
Bottom nav: Liked replaced by Downloads (Liked Songs stays in Library and Profile). Profile: banner header with photo + name, "0 followers • N following" (N = saved artists), Edit (photo from gallery resized to 256px, name), settings, ⋮ menu (Share, What others can see), Playlists with Manage page (remove/add playlists on profile), optional Recently played artists. Header avatars show the profile photo and open Profile. All data is local (localStorage `cl_name`, `cl_pic`, `cl_priv`, `cl_phide`); there are no accounts, so followers is always 0 and privacy toggles only change what this device shows. Verified: node --check only.

## v9: premium layer (premium.js + premium.css)
Home: the search pill is gone (Search stays in the bottom nav and sidebar); in its place a live **network status** pill (Online / Slow / Offline, latency from a small same-origin ping every 20 s, details sheet with connection type and speed where the browser reports them), a **Theme** sheet (dark / light / system + 6 accent colours) and an **Animation** sheet (Full: animated aurora background and entrance motion, Lite: transitions only, Off; defaults to Off when the device asks for reduced motion). Settings are stored in `cl_theme`, `cl_accent`, `cl_anim`.
Profile: **XP, level and rank** (1 XP per 10 s listened, +5 per finished song, daily streak bonus, +5 mood check-in; level = floor(sqrt(XP/40))+1; ranks Bronze to Legend), live **clock**, **listening stats** (today, week, all time, songs played, streak, peak hour, top artist, 7-day chart) and a **mood picker** that searches your enabled providers for that mood (adds your top artist when it fits the mood). All stats are local (`cl_stats`, `cl_mood`); there are no accounts, so rank is a tier, not a leaderboard.
Fixes: Theme in Settings never persisted (the saved value was read with `JSON.parse` and silently fell back to dark); `sw.js` was empty, now caches the app shell for offline start; the blanket reduced-motion rule no longer overrides the Animation setting.
Verified: `npm run check` and a headless-browser smoke test with mocked provider responses. Live provider APIs and real audio playback were not tested here.

## v10
Settings page removed (nav, profile row and gear button). Theme and accent now live in the Home theme sheet and the sleep timer on Home. Provider toggles, playback speed, storage limit, export/import and reset are no longer in the UI; defaults apply (all providers on, speed 1x).
