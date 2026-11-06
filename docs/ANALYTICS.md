# Anonymous product analytics — Umami

The website loads the self-hosted Umami tracker in production and records pageviews automatically. Custom events use the same website ID and the existing typed `ProductAnalytics` port, routed to `UmamiProductAnalytics`. No additional environment variable is required. The tracking adapter only sends from `focus.thedevlab.site`; `next/script` notifies the adapter when ready so early events can be delivered. The former Vercel custom-events feature flag is no longer used. The Vercel pageview integration is otherwise unchanged.

## Event catalogue

| Event | Trigger | Properties |
| --- | --- | --- |
| `app_opened` | Config loaded once on page mount | `interface_mode`, `music_category`, `config_state` (new/saved config, not a unique user) |
| `interface_mode_changed` | Simple ↔ Advanced actually changed | `from`, `to` |
| `music_category_selected` | Music selector changed | `music_category`, `interface_mode` |
| `music_playback_started` | YouTube player reports PLAYING, after a non-playing state | `music_category`, `interface_mode` |
| `Play - Instrumental Jazz` / `Play - Classical` / `Play - Gregorian Chants` / `Play - Lo-fi` / `Play - Custom Music` | Click Play with the corresponding music selected (intent only) | `control=play`, `music_category`, `interface_mode` |
| `music_control_used` | Click Pause/Previous/Next | `control`, `music_category`, `interface_mode` |
| `preset_selected` | Preset changed (Classic, Quick, Custom) | `preset_category`, `interface_mode` |
| `focus_started`, `focus_completed`, `focus_abandoned` | Actual focus cycle transition | `preset_category`, `duration_bucket`, `music_category`, `interface_mode` |
| `break_started`, `break_completed`, `break_abandoned` | Actual break cycle transition | same cycle properties |
| `timer_paused`, `timer_resumed` | Active phase paused or resumed | `phase`, `interface_mode` |
| `setting_changed` | Toggle auto-play, alarm, break tips, feedback prompts | `setting`, `enabled`, `interface_mode` |
| `feature_used` | Feature used, e.g. settings/history/task/day completion/custom music | `feature`, `interface_mode` |
| `returning_focus_completed` | First focus completion on a later local day | `gap_bucket`, `interface_mode` |
| `usefulness_feedback_submitted` | User responds to usefulness question | `response`, `interface_mode` |

Enumerations: music categories are `silence`, `gregorian`, `classical`, `lofi`, `afterhours`, `custom`; modes `simple`, `advanced`; presets `classic`, `quick`, `custom`; duration buckets `up_to_15`, `16_to_30`, `31_to_50`, `over_50`; return gap buckets `next_day`, `2_to_7_days`, `8_plus_days`.

Feature values: `settings_opened`, `history_opened`, `history_cleared`, `task_saved`, `task_edited`, `end_day`, `daily_note_saved`, `custom_music_added`.

**Interpretation:** the named `Play - ...` events represent clicks on Play, not confirmed listening; autoplay is not counted as a manual Play click. The separate `music_playback_started` event represents the YouTube player's confirmed PLAYING state, including autoplay. Do not sum both event types as separate listeners. Selecting a music category does not mean audio was heard. `music_playback_started` reflects the YouTube player's PLAYING state, not unique listeners or listening duration. `focus_started` and `focus_completed` allow a cohort funnel but event-count ratios are not user conversion rates. `app_opened` identifies current stored mode at entry; it does not identify a person. Focus event `music_category` is the category *selected* for that focus, even if the YouTube player was blocked or muted.

## Privacy and operational constraints

Never record task/daily-note text, local history, YouTube video or playlist identifiers/URLs, session IDs, full timestamps, exact custom durations, client-generated identifiers, email, IP addresses, or arbitrary free text. Only the typed, low-cardinality event properties above may be sent. Do not track every slider movement, timer tick, or pageview manually. Umami's own pageviews are automatic.

No event requests are emitted for localhost or preview domains; if the tracker is blocked, the site must keep working. A bounded in-memory buffer (30 events) handles interactions before the tracking script is ready; it is not persisted across page exits.

## Validate

1. Run `npm run test:run` and `npm run build`.
2. Deploy the production site.
3. In browser DevTools > Network, check the Umami script and POST event requests from `focus.thedevlab.site`. Adblockers can block them.
4. Open Umami > Events > Properties and verify mode, category and feature values.
5. Select a playlist without playing it: expect `music_category_selected` only. Click Play with Instrumental Jazz selected: expect `Play - Instrumental Jazz` with `control=play`, `music_category=afterhours` and the current `interface_mode`. If YouTube starts, also expect `music_playback_started`.
6. Verify no task text, custom YouTube URLs, or personal notes appear in event data; check production and preview hosts separately.
