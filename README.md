# SkillMap — Visual Learning Roadmap

SkillMap is a frontend-only learning roadmap app built with React and Vite. Career roadmap data ships with the app; profile, theme, progress, activity, and custom roadmaps are stored in the browser's LocalStorage.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, and check the project with `npm run lint`.

## Project structure

```text
src/
  assets/       Static assets
  components/   App shell, roadmap canvas, reusable progress UI
  context/      Shared app state and persistence
  data/         Static career roadmaps and topic resources
  hooks/        Shared React hooks
  pages/        Landing, dashboard, roadmap, career, analytics, custom paths, settings
  utils/        LocalStorage helpers
  App.jsx       Route configuration
  index.css     Responsive application and theme styles
  main.jsx      React entry point
```

## Included features

- Six searchable career paths with prerequisite-aware interactive React Flow roadmaps.
- Topic resources, practice prompts, completion tracking, dashboard summaries, analytics, and achievements.
- Custom roadmaps with editable topics and prerequisite connections.
- Light/dark themes, profile settings, progress reset, and JSON data backup/restore.
- Responsive layouts for desktop, tablet, and mobile.

All app data remains client-side. There is no backend or server-side database.
