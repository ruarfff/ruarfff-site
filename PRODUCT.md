# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is Ruairí’s peers and technical readers who receive or discover his professional writing. Friends and people Ruairí intentionally shares with are the primary audience for personal writing.

## Product Purpose

The site preserves and shares Ruairí’s writing. Its default experience presents technical and professional articles. A distinct personal section holds less formal writing for friends and posterity, without assuming a broad audience.

Success means technical readers can quickly find useful professional writing, while invited personal readers can enter a clearly distinct section and enjoy stories that were previously unpublished.

## Positioning

This is one person’s publication with two honest sides: professional technical experience and personal writing. The personal section is not positioned as professional thought leadership or as content optimized for a large audience.

## Operating Context

Technical articles are commonly shared with peers or discovered by a technical audience. Personal entries are shared intentionally with friends or preserved for future reading. Personal subjects can include funny stories, dreams, travel, gadgets, and other experiences.

## Capabilities and Constraints

- The technical section remains the default entry to the site.
- Visitors need a clear way to navigate between two distinct sections: technical and personal.
- Existing technical articles and their URLs must remain available.
- Markdown posts can be marked as drafts. Drafts are available during local development but excluded from production indexes and direct production URLs.
- The site uses React Router and Markdown posts, and is deployed through Netlify.
- Personal entries are public, included in normal site navigation, and available to search engines.

## Brand Commitments

- The publication is Ruairí O’Brien’s personal site and uses his real identity.
- The voice can be technically informed without making the personal writing feel professionalized.
- Technical and personal writing must feel distinct without implying that they belong to different authors.
- Canonical social profiles are X (`https://x.com/ruarfff`), LinkedIn (`https://www.linkedin.com/in/ruairitobrien/`), and GitHub (`https://github.com/ruarfff/`).

## Evidence on Hand

- Existing technical articles are stored under `posts/` with title, date, and optional description metadata.
- Existing professional profile content, social links, and a portrait are available in `app/routes/about.tsx`, `PRODUCT.md`, and `public/images/profile-pic.jpg`.

## Product Principles

- Make the technical publication immediately useful to peers.
- Give personal writing a deliberate home without forcing it into a professional frame.
- Keep the two sides clearly distinct, but visibly part of one person’s site.
- Favor durable reading and discovery over growth tactics or attention-seeking features.
- Preserve existing writing and links while improving the publication around them.
