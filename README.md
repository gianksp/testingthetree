# Testing the Tree

**[testingthetree.com](https://testingthetree.com)** — Interactive simulations, visualizations, and mini games that test how we reason about biological ancestry, evolution, and the origin of life.

Each tool is a thought experiment made playable. The goal isn't to give answers — it's to make the assumptions visible.

---

## The Apps

### 🦠 One, Few, or Many?
**Path:** `/one-few-many`

An interactive logical argument. Was LUCA — the Last Universal Common Ancestor — a single cell or a population? Follow the branching logic and discover why the answer forces a surprising choice: either LUCA reappears (pushed back one step), or the number of independent origins may be very large indeed.

> Inspired by the work of a biologist exploring the constraints on inferring ancestral cell counts from modern molecular evidence.

**Stack:** React + Vite + Tailwind CSS v4

---

### 🎲 Origin of Life Gamble
**Path:** `/ool-gambler`

A probability simulation. How rare are functional biological sequences? Run trials and test whether chance alone can produce the building blocks of life within realistic timeframes.

**Objective:** Beat the odds — or understand why you can't.

---

### 🧩 Origami Ancestry Test
**Path:** `/origami-experiment`

A visual experiment showing why similarity does not automatically imply shared ancestry. Two shapes can look identical while having completely independent origins.

**Objective:** Separate similarity from ancestry.

---

### 🌳 Phylogenetic Tree Visualizer
**Path:** `/phylotree-visualizer`

An interactive tool for exploring phylogenetic trees built from sequence data. Inspect the assumptions baked into the tree-building process.

**Objective:** Read the tree critically.

---

### 👾 Xenobiology Classification Lab
**Path:** `/phylo-game`

A mini game. Sort alien specimens into hidden evolutionary groups using trait clues. The catch: the true clades aren't what they look like on the surface.

**Objective:** Discover the true clades.

---

## For Developers

### Repo structure

```
testingthetree/
├── index.html              # Landing page (plain HTML + Tailwind CDN)
├── one-few-many/           # React + Vite app
├── ool-gambler/            # React + Vite app
├── origami-experiment/     # React + Vite app
├── phylo-game/             # React + Vite app
├── phylotree-visualizer/   # React + Vite app
└── .gitignore
```

Each app is a self-contained Vite project deployed to a subdirectory of the domain.

### Running an app locally

```bash
cd one-few-many        # or any other app folder
npm install
npm run dev
```

### Building for production

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents of `dist/` to the corresponding S3 subfolder (e.g. `s3://your-bucket/one-few-many/`).

### Deployment

- **Hosting:** AWS S3 static site + Cloudflare CDN
- **Per-app base path:** Each Vite app sets `base: '/app-name/'` in `vite.config.js` for production, `/` for local dev
- **Access gating:** Cloudflare Access (one-time PIN or email whitelist) for pre-release testing

### Adding a new app

1. Scaffold with `npm create vite@latest app-name -- --template react`
2. Set `base` in `vite.config.js` using the `NODE_ENV` pattern:
   ```js
   base: process.env.NODE_ENV === 'production' ? '/app-name/' : '/'
   ```
3. Build and upload `dist/` to S3 under `/app-name/`
4. Add a card to `index.html`
5. Update the tools count in the hero stats

### Asset paths

Use relative paths (no leading `/`) for assets in `public/` so they resolve correctly under the subdirectory base:

```jsx
src="darwin.mp4"    // ✓
src="/darwin.mp4"   // ✗ breaks in production subdirectory
```

---

## About

These tools are built as interactive thought experiments accompanying a book on the logic of evolutionary inference. The simulations are not meant to be authoritative — they are meant to make you notice the assumptions you're already making.

Built by [@gianksp](https://github.com/gianksp).
