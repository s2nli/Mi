# Spotify (core build)
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

## v11 fixes
Icons regenerated: transparent (any) and solid-black (maskable) Spotify logo, so the launch splash is the clean logo on full black (`background_color`/`theme_color` `#000000`) instead of a boxed PNG. Reinstall the PWA once to refresh the cached icon/splash.
Artwork: no more `loading="lazy"` (it loaded late inside horizontal rails), fade-in, one retry on a failed cover, a service-worker artwork cache (`cl-img-v1`, 500 entries, CORS copies only) and a 10-minute in-memory cache in `jget` so Home rebuilds instantly when you come back.
Library: Recently played has a remove (✕) per song and Clear all; Add artists/albums/Import icons are SVG (the placeholder note was drawn behind the plus) and no longer hidden by the Home chip filter (`data-k` clash).
Back navigation: forward vs Back is detected from stamped history entries; Back restores scroll without replaying entrance animations; user touch/scroll cancels the restore; Profile and playlist back arrows use history.
Profile: stats card renders in the same frame as the header (no layout jump after paint).
Radio: stations whose names start with 0-5 (2B ... 4 Lobos ... 5 Rivers, no logo) are hidden in Home sections and the Radio page.
Verified with a headless Chromium smoke test using mocked providers; real devices and live APIs not tested.

## v12 fixes
Confirm popup for every ✕ / Remove all (Downloads, mini-player, Recently played, saved artists/albums). Removing one download keeps the current song playing; Remove all stops it only if it is a downloaded song.
Queue: the ＋ button on every song/card opens Play next / Add to queue / Add to playlist (manual songs go before autoplay songs).
Autoplay: when the queue ends (or shuffle with 1 song) it fetches similar songs (provider similar, then same artist/album search, then liked/downloaded) and keeps going; prefetched during the last song. Shuffle no longer repeats the current song.
Offline: Home shows Downloaded songs instead of stale history; last good Trending is cached (`cl_home`) for provider failures; Home refreshes when back online. Service worker is now network-first for app files (cache only when offline/slow), `cl-v22`, auto-reload once after an update if nothing is playing.
Icons: green gradient background with black waves (any + maskable + apple-touch). Reinstall the PWA once.
Verified: `node --check` only.

## v13 fixes (playback + artwork reliability)
Playback: a failed song is no longer skipped on the first error. Order now: quiet retry of the same link (resumes at the same second) → next bitrate → re-lookup of the song for a fresh stream link (fixes old/recent/liked/resumed songs whose saved links expired) → same song from another provider → only then skip. 15 s load watchdog and 15 s mid-song stall watchdog. A stream that ends far earlier than the song length (30 s preview / cut-off) switches to another source and continues from that point. After 3 failed songs in a row playback stops with a message instead of skipping the whole queue; when offline it waits and resumes on reconnect.
Artwork/logo: failed images are retried 3 times (and again when back online / app returns to foreground) before being hidden; the service worker serves logos/icons cache-first (`cl-v25`) and retries cover art once, remembering hosts that block CORS.
Verified: `node --check` on every script. Real playback / live providers not tested here.

## v13.1 (self-audit)
Tested in headless Chromium with mocked providers: home + all 11 views load with no JS errors; bad/expired link -> re-lookup -> same song plays; one-off error -> quiet retry; 3 dead songs in a row -> stops instead of skipping the queue; preview/short stream -> switches source; natural end -> next track; offline reload shows the app shell + logo from cache.
Fixes from the audit: image retries now add `?_r=N` (the browser otherwise remembers a failed image URL and never asks the network again); `/api/proxy` rate limit 60 -> 300 per minute and `/api/audio` 20 -> 60 (a burst of Home requests could hit 429 and look like "nothing loads"); removed stray empty file `api/st`.
Not testable here: real provider APIs and real devices.
