# NexArm Documentation

This repository contains the NexArm VitePress documentation site. The
documentation source files are Markdown files under `docs/docs/`.

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
