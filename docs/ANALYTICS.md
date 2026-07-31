# Anonymous product analytics

Custom events are disabled by default. Set `NEXT_PUBLIC_PRODUCT_ANALYTICS_ENABLED=true` in production to select the failure-safe Vercel adapter; every other configuration uses the Noop adapter. This flag does not affect the application. Vercel's normal page-view component remains mounted independently. Custom-event availability depends on the deployed Vercel project's configuration and plan.

| Event | Trigger | Allowed properties |
| --- | --- | --- |
| `focus_started` | A focus starts from idle (not resume or break) | `preset_category`, `duration_bucket`, `music_category`, `interface_mode` |
| `focus_completed` | A focus naturally reaches zero | same focus properties |
| `focus_abandoned` | An active or paused focus is stopped | same focus properties |
| `interface_mode_changed` | The user actually changes modes | `from`, `to` |
| `returning_focus_completed` | First completion on a later local date | `gap_bucket`, `interface_mode` |
| `usefulness_feedback_submitted` | A feedback answer is selected | `response`, `interface_mode` |

Preset categories are `classic`, `quick`, and `custom`; duration buckets are `up_to_15`, `16_to_30`, `31_to_50`, and `over_50`; music categories are `silence`, `gregorian`, `classical`, `lofi`, and `custom`. Return gaps are `next_day`, `2_to_7_days`, or `8_plus_days`; feedback responses are `yes`, `partly`, or `no`.

Events must never contain task or note text, history, session IDs, timestamps or dates, exact custom durations, identifiers, email or IP addresses, user-data URLs, raw localStorage, or free text.
