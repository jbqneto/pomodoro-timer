# Production deployment diagnostic

Diagnostic performed on 2026-07-30 for `https://focus.thedevlab.site`.

## Repository evidence

- Baseline commit inspected: `f808fee` (`update history feature`), the current tip supplied in this workspace before this correction round.
- No Git remote, `vercel.json`, `.vercel` project link, GitHub Actions workflow, or deploy script is present in the available checkout. Consequently, the production branch/project association cannot be established from this repository.
- Static export remains enabled in `next.config.js` (`output: "export"`). The Android CTA remains disabled in `app/page.tsx`; this work neither activates nor removes it.
- No reference to `focus.thedevlab.site` exists in tracked source. Analytics is the only explicit Vercel integration in application code.
- An HTTP request to the production domain from this environment returned `403 Forbidden` from the environment's outbound proxy. Its HTML/assets therefore could not be compared with the local export.

## Checks requiring Vercel access

In the Vercel dashboard, verify the project's Git repository and production branch, the commit SHA attached to the latest production deployment, the custom-domain assignment, and whether another Vercel project also owns or redirects the domain. Confirm that the deployment used commit `f808fee` or a later commit containing these corrections. Compare a deployed `_next/static` asset with `out/_next/static` from `npm run build`, or expose the commit SHA as deployment metadata in a separately authorized infrastructure change.

The differing Android section is consistent with an old deployment or a different project/branch, but the available evidence does not establish either as the cause.

## Playlist naming check

The existing playlist ID was not changed. Direct playlist metadata could not be retrieved from this environment, so its tracks could not be independently verified as Gregorian chant. To avoid asserting unverified content, the UI uses the neutral “Contemplative Chants” label while the requested internal persisted category is `gregorian`; the legacy `catholic` value is migrated to it. A maintainer should inspect the playlist tracks in YouTube before restoring the more specific “Gregorian Chants” display label.
