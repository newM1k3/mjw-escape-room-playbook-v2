<div align="center">

![MJW Design](https://mjwdesign.ca/wp-content/uploads/2024/01/mjw-design-logo.png)

**Built with [MJW Design](https://mjwdesign.ca) — AI-Powered Development**

---

</div>

# MJW Escape Room Playbook v2

A premium AI-powered escape room playbook generator. It takes structured business context about an escape room venue and produces a polished, tailored playbook through a secure Netlify Function backed by Anthropic Claude. The app includes optional **PocketBase** and **Supabase** persistence integrations, rich Markdown rendering, and a clean form-driven workflow deployable entirely on Netlify.

## Screenshots

| Business Context Form | Generated Playbook Output |
| :---- | :---- |
| ![MJW Escape Room Playbook v2 — business context form interface (placeholder)](placeholder-form.png) | ![MJW Escape Room Playbook v2 — generated playbook output view (placeholder)](placeholder-output.png) |

## What It Does

Rather than manually drafting operational playbooks from scratch, this tool lets escape room owners and operators describe their venue — rooms, themes, target audience, difficulty, staff workflow — and receive a structured, publication-ready playbook in seconds.

| Feature | Description |
| :---- | :---- |
| **Business Context Form** | Captures venue name, room details, themes, audience, difficulty, and operational notes. |
| **AI Playbook Generation** | Submits context to a secure Netlify Function that calls Anthropic Claude server-side. |
| **Markdown Playbook Output** | Renders the generated playbook with full typography via `react-markdown` and `@tailwindcss/typography`. |
| **Optional Cloud Persistence** | PocketBase and Supabase integrations available for saving and retrieving generated playbooks. |
| **Netlify Functions Backend** | API key is never exposed to the browser — all AI calls go through `netlify/functions/generate-playbook.ts`. |

## How to Use

Open the app and fill in the Business Context Form with details about your escape room venue. Provide room names, themes, player capacity, difficulty level, staff instructions, and any special operational notes. Submit the form to trigger playbook generation. The app calls the secure backend function, which forwards the context to Anthropic Claude and streams back a fully structured playbook. The result is displayed with rich Markdown formatting in the Playbook Output panel, ready to copy, save, or share.

## Stack

| Layer | Technology |
| :---- | :---- |
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 + @tailwindcss/typography |
| Icons | Lucide React |
| Markdown rendering | react-markdown |
| AI backend | Netlify Functions + Anthropic Claude (@anthropic-ai/sdk) |
| Optional persistence | PocketBase + Supabase |
| Hosting | Netlify |

## Local Development

```
npm install
```

```
npm run dev
```

The app UI works with **no environment variables configured**. Without `ANTHROPIC_API_KEY`, playbook generation will not succeed — the Netlify Function requires the key to call Claude. For local development with Netlify Functions, use the Netlify CLI (`netlify dev`) so environment variables are injected correctly.

## Quality Checks

```
npm run typecheck
```

```
npm run lint
```

```
npm run build
```

## Available Scripts

```
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint check
npm run typecheck  # TypeScript type check (no emit)
```

## Environment Variables

All environment variables are optional for the frontend. Playbook generation requires `ANTHROPIC_API_KEY` to be set in the Netlify Function environment. The app remains deployable with no variables configured, but AI generation will be unavailable.

| Variable | Required? | Scope | Enables | Description |
| :---- | :---- | :---- | :---- | :---- |
| `ANTHROPIC_API_KEY` | Required for AI generation | Netlify Function/server only | Playbook generation via Anthropic Claude | Server-side API key for Claude. Set in Netlify site settings. Never expose as a `VITE_` variable. |
| `VITE_POCKETBASE_URL` | Optional | Frontend/public | PocketBase persistence for saved playbooks | Public PocketBase/PocketHost URL for saving and retrieving generated playbooks. |
| `VITE_SUPABASE_URL` | Optional | Frontend/public | Supabase persistence | Supabase project URL for optional database integration. |
| `VITE_SUPABASE_ANON_KEY` | Optional | Frontend/public | Supabase client authentication | Supabase anon/public key. Safe to expose as a `VITE_` variable. |

## AI Playbook Generation — Backend Setup

The playbook generation feature is implemented through `netlify/functions/generate-playbook.ts`. The browser submits structured venue context to `/.netlify/functions/generate-playbook`; it never calls Anthropic directly and never includes the API key in frontend code.

Set `ANTHROPIC_API_KEY` in your Netlify site settings under **Site configuration → Environment variables**. After adding the variable, redeploy the site. If the key is absent, the function will return an error and the app will surface a setup message rather than failing silently.

## Netlify Deployment

The `netlify.toml` at the project root configures the Vite build, publish directory, and functions directory. To deploy on Netlify, connect this GitHub repository and use the following production settings.

| Setting | Value |
| :---- | :---- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node bundler | `esbuild` (configured in `netlify.toml`) |
| Node/package install | Netlify default Node environment with `npm install` |

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

Deploy first with no environment variables to confirm the static app loads correctly, then add `ANTHROPIC_API_KEY` to enable playbook generation. Add PocketBase or Supabase variables if cloud persistence is needed.

## Optional Persistence — PocketBase and Supabase

The app ships with client wrappers for both PocketBase (`src/lib/pocketbase.ts`) and Supabase (`@supabase/supabase-js`). Both are optional. Without either service configured, the app generates playbooks on demand without saving them server-side; users can copy or export the output manually.

When `VITE_POCKETBASE_URL` is configured, the PocketBase client is available for saving generated playbooks to a collection. When Supabase variables are configured, the Supabase client provides an alternative relational persistence layer. Both can coexist.

## Project Structure

```
src/
  components/
    BusinessContextForm.tsx   # Venue context input form
    PlaybookOutput.tsx        # Markdown-rendered playbook result panel
  lib/
    pocketbase.ts             # Optional PocketBase client wrapper
  App.tsx                     # Root layout and form/output orchestration
  main.tsx                    # Entry point
  index.css                   # Global styles

netlify/
  functions/
    generate-playbook.ts      # Secure server-side Anthropic Claude integration

public/                       # Static assets

index.html                    # Vite HTML entry
vite.config.ts                # Vite configuration
tailwind.config.js            # Tailwind CSS configuration
```

## Changelog

### v2.0.0 — Initial v2 Release

- Rebuilt on Vite 5 + React 18 + TypeScript with Tailwind CSS typography support.
- Added secure Netlify Function backend for Anthropic Claude playbook generation.
- Added `BusinessContextForm` and `PlaybookOutput` component architecture.
- Integrated optional PocketBase and Supabase persistence client wrappers.
- Added Netlify deployment configuration with esbuild function bundling.
- No API keys exposed to the frontend; all AI calls routed through server-side functions.

---

Part of the **MJW Personal App Platform**.