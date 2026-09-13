# AGENTS.md

This is my personal website and blog. It uses React Router and is deployed on Netlify with serverless functions.

## Coding standards

Before writing, changing, or reviewing code, read and follow
[CODING_STANDARDS.md](CODING_STANDARDS.md).

## Development Commands

- **Development server**: `npm run dev` - Starts the dev server; see `vite.config.ts` for the port
- **Build**: `npm run build` - Builds production bundle for Netlify deployment
- **Test**: `npm test` - Runs Vitest test suite
- **Lint**: `npm run lint` - Runs Biome and Oxlint, including anti-slop rules
- **Lint fix**: `npm run lint:fix` - Runs Biome and Oxlint with auto-fixes
- **Check**: `npm run check` - Runs Biome formatting and lint checks, then Oxlint
- **Check fix**: `npm run check:fix` - Runs Biome and Oxlint with formatting and lint auto-fixes
- **Format**: `npm run format` - Formats code with Biome
- **Type check**: `npm run typecheck` - Generates React Router types and runs TypeScript checks

## Architecture Overview

This is a React Router personal blog deployed on Netlify.

### Key Architecture Patterns

**Blog Post System**: Posts are stored as Markdown files in `/posts/[slug]/index.md` with front matter metadata. The `app/post.ts` module handles:
- Reading posts from filesystem
- Parsing front matter (title, date, description)
- Generating post slugs and metadata

**Blog Images**: Images are co-located with blog posts:
- **Location**: `/posts/[slug]/image.png`
- **Markdown reference**: `![Alt text](image.png)` (relative path)
- **Build process**: `vite-plugin-static-copy` copies images to `/build/client/images/[slug]/`
- **Runtime**: ReactMarkdown transforms relative paths to `/images/[slug]/image.png`

**Route Structure**:
- Explicit route configuration in `app/routes.ts`
- Legacy article URLs use `legacy-redirect.tsx` to redirect to `/posts/[slug]`
- `posts.$slug.tsx` renders posts from `/posts/[slug]/index.md`

**Content Rendering**: Uses `react-markdown` with `react-syntax-highlighter` and `remark-gfm` for GitHub Flavored Markdown support.

### Key Files and Directories

- `app/post.ts` - Core blog post reading and parsing logic
- `posts/` - Markdown blog posts organized by slug directories
- `app/routes.ts` - Explicit route configuration
- `app/routes/posts.$slug.tsx` - Dynamic post rendering route
- `app/root.tsx` - Root layout with Google Analytics integration
- `vite.config.ts` - Vite configuration with React Router and Netlify plugins

### Deployment

- **Platform**: Netlify with Functions
- **Build configuration**: Uses `@netlify/vite-plugin-react-router` for deployment
- **Server**: The Netlify plugin generates the Functions handler during the build

### Testing

- **Framework**: Vitest with @testing-library/react
- **Config**: `vitest.config.ts` with React plugin
- **Setup**: `test/setup-test-env.ts` for test environment configuration

### Styling

- **CSS Framework**: Tailwind CSS with custom app.css
- **Typography**: @tailwindcss/typography plugin for blog content
- **Fonts**: System monospace fonts
- **CSS Import**: The root imports `app/styles/app.css`; Vite processes its Tailwind directives
