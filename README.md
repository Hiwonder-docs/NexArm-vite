# NexArm Documentation

This repository contains the NexArm VitePress documentation site. The
documentation source files are Markdown files under `content/<version>/docs/`.
The `docs/docs/` directory is generated during development and builds.

## Local development

Install dependencies and start the local documentation server:

```bash
npm ci
npm run dev:latest
```

Other version dev commands:

```bash
npm run dev:esp32-version
npm run dev:imitation-learning-version
npm run dev:ros-version
npm run dev:jetsonNano
```

Build and stage all production versions:

```bash
npm run build:all
```

The staged production files are generated under `projects/NexArm/en/<version>/`.

## GitHub Pages deployment

The build artifacts under `projects/` are committed to the repository. Open
**Settings > Pages**, select **Deploy from a branch**, and choose **main** and
**/(root)**. Do not bind a custom domain.

The GitHub Pages direct URL is:

```text
https://GITHUB-USERNAME.github.io/REPOSITORY-NAME/projects/NexArm/en/latest/
```

The public-facing URL (via the baota Nginx reverse proxy) is:

```text
https://wiki-test.hiwonder.com/projects/NexArm/en/latest/
```

## Version selection

The Latest URL remains the landing page. It automatically opens a required
version chooser on the first visit in each browser tab session. Customers
choose ESP32 Version, Imitation Learning Version, Raspberry Pi, or Jetson Nano Version. Latest is
excluded from the popup, navigation menu, and repository version cards.

The dialog has no close button; Escape and backdrop clicks cannot dismiss it.
Only confirming a valid version saves the selection for the current session.
The homepage **Choose version** button reopens the dialog.

Edit `docs/.vitepress/site.config.mjs` to change the available versions, labels,
descriptions, and entry paths. The popup and navigation share this definition.
`selectable: false` hides a version from both controls without removing its
build command or existing URL. Rebuild with `npm run build:all` after editing.

Preview all staged versions together using `python -m http.server 4174` from
the repository root, then open
`http://localhost:4174/projects/NexArm/en/latest/docs/1_NexArm_Tutorial.html`.
