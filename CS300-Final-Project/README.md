# VizLab · CS300 Final Project

VizLab is a polished React + Vite data visualization studio. It lets users paste or upload datasets, analyze statistics, save them in localStorage, and build interactive charts with Recharts. A public API dataset is included for instant exploration.

## Features
- Paste JSON datasets or upload CSV/JSON files.
- Parse, validate, and normalize data.
- Save datasets locally, browse them, and delete when needed.
- Bar, line, pie, and area charts with responsive containers.
- Dataset statistics (min, max, average, total).
- Filtering and sorting controls.
- Public API dataset (CoinCap market snapshot).
- React Router with dynamic routes and a 404 page.

## Local development
Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
