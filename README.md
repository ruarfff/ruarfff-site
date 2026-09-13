# Ruairi's Personal Website

Code for my personal site because I thought this was a good idea at some point.

Built with [Remix](https://remix.run/docs).

## First time locally

```sh
git clone git@github.com:ruarfff/ruarfff-site.git

cd ruarfff-site

npm i
npm run build
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

Open up [http://localhost:3000](http://localhost:3000).

## Deployment

Deployed to [Netlify](https://www.netlify.com/).

- [Netlify Functions](https://www.netlify.com/products/functions/)

### Netlify Setup

1. Install the [Netlify CLI](https://www.netlify.com/products/dev/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

### Development with Netlify CLI

The Netlify CLI builds a production version of the Remix App Server and splits it into Netlify Functions that run locally. This includes any custom Netlify functions you've developed. The Netlify CLI runs all of this in its development mode.

```sh
netlify dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

Note: When running the Netlify CLI, file changes will rebuild assets, but you will not see the changes to the page you are on unless you do a browser refresh of the page. Due to how the Netlify CLI builds the Remix App Server, it does not support hot module reloading.

### Deploying to Netlify

There are two ways to deploy your app to Netlify, you can either link your app to your git repo and have it auto-deploy changes to Netlify, or you can deploy your app manually. If you've followed the setup instructions already, all you need to do is run this:

```sh
# preview deployment
netlify deploy --build

# production deployment
netlify deploy --build --prod
```

## Publishing to Dev.to

You can publish tech blog posts to Dev.to, automatically setting canonical URLs and converting relative image paths to absolute production URLs. Personal posts are excluded from the menu and cannot be published or updated by slug. Only posts with `section: tech` or no section are eligible.

To run the script and select a post from an interactive menu:

```sh
npm run publish-to-devto
```

Or target a specific post slug directly:

```sh
npm run publish-to-devto <slug>
```

### Setup

The script requires a Dev.to API Key. On the first run, the script will prompt you for your key and offer to save it to a `.env` file in the project root. Alternatively, you can create a `.env` file yourself:

```env
DEVTO_API_KEY=your_dev_to_api_key_here
```


## Writing sections

Posts live in `posts/<slug>/index.md`. Existing posts appear in the tech blog.
To add a post to Personal, set `section: personal` in its front matter:

```yaml
---
title: A title for your post
date: 2026-09-13
description: A short description.
section: personal
draft: true
---
```

Drafts appear only during local development. Remove `draft: true` when ready
to publish. Both sections use the existing `/posts/<slug>` article URLs and
co-located images. The Personal index is at `/personal`.

## Article contents

The site renders a collapsible table of contents only when the Markdown
contains a `Contents` or `Table of contents` heading followed by a list.
It replaces that list in place with links to the post's headings (`##` through
`######`), with subheadings nested under their parent section.

Posts without an explicit contents list do not get one. All posts still get
heading IDs for direct links and support empty legacy HTML heading anchors.
The source Markdown stays unchanged for Dev.to publishing.

## Code examples

Fenced and indented code blocks render with syntax highlighting, a language
label, and Copy and Wrap lines controls. Lines wrap by default; readers can
turn wrapping off for aligned output. Copy preserves the original code text
and line breaks. These controls affect only the site renderer, so Markdown
and Dev.to publishing stay unchanged.

The Theme menu in the header contains separate Site theme and Code theme
light/dark toggles. Code theme applies to all code panels. Both preferences
are saved separately in the browser for future sessions. Code blocks have
no individual theme settings.
