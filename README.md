# Focus Beat

Focus Beat is a local-first focus and break timer with background music and English and Portuguese content.

Demo: [https://pomodoro-timer-eight-swart.vercel.app/](https://pomodoro-timer-eight-swart.vercel.app/)

## Current project status

The current web application provides fixed 25/5 and 15-minute presets, configurable focus and break durations, start/pause/resume/stop controls, alarm and music volume settings, local task text, and daily session history. It offers Gregorian/contemplative, classical, and lo-fi YouTube playlists; users can also use the timer without music.

Configuration, language choice, custom timer settings, task state, YouTube consent, and activity history are kept in the browser. The application has no account or cloud persistence. It is bilingual (English and Portuguese), responsive, tested with Vitest and React Testing Library, and built as a static Next.js export.

## Technology stack

- Next.js and TypeScript
- React contexts
- Tailwind CSS and Radix UI components
- YouTube IFrame API
- Vitest and React Testing Library

## Setup and local use

```bash
git clone https://github.com/jbqneto/pomodoro-timer.git
cd pomodoro-timer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and test

```bash
npm run test:run
npm run build
```

`next.config.js` configures a static export. The generated site is written to `out/`; `npm run start` is intended for a Next.js server and is not the preview mechanism for the exported site.

## Architecture

Focus Beat is a modular monolith. Its architecture will evolve incrementally: stable timer rules should move out of React over time, while contexts continue to coordinate application and UI state. The intent is practical decoupling, not a prescribed set of layers or speculative infrastructure.

- [Architecture guide](docs/ARCHITECTURE.md)
- [ADR 0001: Adopt an Incremental Modular Architecture](docs/adr/0001-modular-architecture.md)

## Development principles

- Keep the current free application local-first.
- Prefer composition over inheritance.
- Prefer pure functions for stable, deterministic rules.
- Add abstractions only at justified, replaceable boundaries.
- Use short-lived branches and focused pull requests.
- Avoid complexity without a concrete present need.

## Documentation

- [Architecture guide](docs/ARCHITECTURE.md)
- [Architecture decision records](docs/adr/0001-modular-architecture.md)

Additional operational documents should be linked here when they are added. There is currently no `docs/production-diagnostic.md` in this checkout.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

José Neto (jbqneto)  
Website: <http://dev.jbqneto.com>
