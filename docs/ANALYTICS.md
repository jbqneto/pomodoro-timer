# Umami analytics: only six product signals

Umami pageviews remain enabled separately. These are the only **custom** events intentionally emitted:

| Question | Event name | Trigger |
| --- | --- | --- |
| Which playlists are selected for manual playback? | `Play - Instrumental Jazz`, `Play - Classical`, `Play - Gregorian Chants`, `Play - Lo-fi`, `Play - Custom Music` | Click Play while that category is selected |
| Simple vs Advanced usage? | `Mode - Simple`, `Mode - Advanced` | Once upon config load on a page opening and on an actual change of mode |
| Is the side panel used? | `History Opened` | Sidebar opens |
| Is the task field used? | `Task Used` | First non-empty task edit per open page |
| Which timer preset is used? | `Timer - Classic`, `Timer - Quick`, `Timer - Custom` | Focus session **starts**, including default Classic |
| Is End Day used? | `End Day` | Confirm End Day |

All events use a small predefined property set (music/preset/mode). No personal text, task details, YouTube IDs/URLs, session IDs or timestamps are sent.

**Interpretation:** Play events represent **manual clicks**, not confirmed listening; automatic music playback is not counted. Thus these are *manual Play rankings*, not total listening rankings. The mode events count page openings and mode switches, not unique users. Timer events count actual focus starts, not simple clicks on the presets.

Previous events will remain in historical Umami reports; new deployments stop emitting pause/resume, focus/break, music selection, music confirmation, feedback, settings and miscellaneous feature events.

The tracker is production-host-only (`focus.thedevlab.site`) and buffers up to 30 early interactions until the script loads. A blocked script must never break the app.

## Validation

Run `npm run test:run`, `npm run build`, and `node scripts/verify-seo.mjs`. On production, verify these six event families in Umami and check that no other new custom events arrive. Note that the old events remain historically visible.
