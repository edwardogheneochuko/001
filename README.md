# 001

**001 — a voice for the silent.** An atmospheric React site: a haunted landing experience, followed by a signed-in area with a dark-themed catalogue and an anonymous space to share experiences of depression and grief.

## Stack

- React 19 + TypeScript, built with Vite 7
- Tailwind CSS 4, framer-motion
- Firebase Authentication (email/password and Google) and Cloud Firestore
- react-hook-form + zod for form validation
- Web Audio API and the Speech Synthesis API for the sound room

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

## Routes

| Path     | Page                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| `/`      | Landing page: video intro (skippable), then The Abyss, Whispers, The Chamber and The Void  |
| `/login` | Email/password and Google sign-in or sign-up                                                |
| `/001`   | Signed-in area: catalogue with search, plus the anonymous Depression sharing section        |

Unknown paths redirect to `/`.

## Project layout

```
src/
  auth/         Login page and ProtectedRoute
  components/   Shared UI (navbar, footer, landing slideshow, signed-in area)
  context/      Theme (light/dark) provider and useTheme hook
  hooks/        useAudioEngine: procedural ambient sound, effects and text-to-speech
  lib/          Firebase initialisation
  pages/        Landing screens and the signed-in page
  assets/       Images, video and static content
```

## Firebase

The web config in `src/lib/firebase.ts` is public by design. Access is controlled by:

- **Firestore security rules.** The app uses two collections:
  - `depression_posts/hero-post`: a `likes` array of user ids. Signed-in users should only be able to add or remove their own id.
  - `depression_shares`: anonymous shares (`text`, `createdAt`). Signed-in users should be able to create documents only, with a length limit on `text`, and nobody should be able to read or edit them from the client.
- **Authorized domains** in Firebase Authentication, which should list only the domains the site is served from.

## Theme

The theme is stored in `localStorage` under the `theme` key and falls back to the OS preference. An inline script in `index.html` applies it before first paint. Keep that key in sync with `THEME_STORAGE_KEY` in `src/context/theme.ts`.
