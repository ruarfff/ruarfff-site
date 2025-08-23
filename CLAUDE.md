# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts React Router v7 dev server (localhost:5173)
- **Build**: `npm run build` - Builds production bundle for Netlify deployment
- **Test**: `npm test` - Runs Vitest test suite
- **Lint**: `npm run lint` - Runs ESLint with caching
- **Type check**: `npm run typecheck` - Generates React Router types and runs TypeScript checks
- **Format**: `npm run format` - Formats code with Prettier

## Architecture Overview

This is a React Router v7 personal blog deployed on Netlify (migrated from Remix).

### Key Architecture Patterns

**Blog Post System**: Posts are stored as Markdown files in `/posts/[slug]/index.md` with front matter metadata. The `app/post.ts` module handles:
- Reading posts from filesystem
- Parsing front matter (title, date, description)
- Generating post slugs and metadata

**Route Structure**: 
- Explicit route configuration in `app/routes.ts` 
- Individual post routes like `angular-and-redux.tsx` map to `/posts/[slug]/index.md` files
- Posts are also accessible via `posts.$slug.tsx` dynamic route

**Content Rendering**: Uses `react-markdown` with `react-syntax-highlighter` and `remark-gfm` for GitHub Flavored Markdown support.

### Key Files and Directories

- `app/post.ts` - Core blog post reading and parsing logic
- `posts/` - Markdown blog posts organized by slug directories
- `app/routes.ts` - Explicit route configuration for React Router v7
- `app/routes/posts.$slug.tsx` - Dynamic post rendering route
- `app/root.tsx` - Root layout with Google Analytics integration
- `vite.config.ts` - Vite configuration with React Router and Netlify plugins
- `server.js` - Netlify Functions handler using @react-router/node

### Deployment

- **Platform**: Netlify with Functions
- **Build configuration**: Uses `@netlify/vite-plugin-react-router` for deployment
- **Server**: Netlify Functions handler in `server.js`

### Testing

- **Framework**: Vitest with @testing-library/react
- **Config**: `vitest.config.ts` with React plugin
- **Setup**: `test/setup-test-env.ts` for test environment configuration

### Styling

- **CSS Framework**: Tailwind CSS with custom app.css
- **Typography**: @tailwindcss/typography plugin for blog content  
- **Fonts**: Poppins font family from Google Fonts
- **CSS Import**: CSS files imported with `?url` query for React Router v7

## Migration Notes

Recently migrated from Remix to React Router v7:
- All `@remix-run/*` imports replaced with `react-router`
- `V2_MetaFunction` → `MetaFunction`
- `json()` wrapper removed from loaders (direct returns)
- Entry files updated to use `ServerRouter` and `HydratedRouter`
- TypeScript module resolution set to `bundler`

## Environment Requirements

- **Node.js**: >= 22 (specified in engines)
- **Package manager**: npm (uses package-lock.json)