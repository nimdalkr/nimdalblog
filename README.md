# blog

Personal blog for Nimdal / Tak Chanwoo at `https://blog.nimdal.xyz`.

## Writing

Posts live in `src/content/posts/*.md`.

The site also includes a private web editor at `/admin`. It uses GitHub OAuth,
allows only `GITHUB_ALLOWED_LOGIN`, and saves posts by committing Markdown files
back to this repository through the GitHub Contents API.

Required frontmatter:

```md
---
title: "Post title"
description: "One clear search/social summary."
publishedAt: 2026-07-02
category: "note"
tags: ["nimdal", "product"]
cover: "/media/identity-octopus.jpg"
coverAlt: "Short image description."
lang: "ko"
---
```

Allowed categories:

- `research`
- `product`
- `operation`
- `automation`
- `web3`
- `note`

Use `featured: true` for one homepage lead post. Use `draft: true` to keep a post out of production.

## Private admin setup

Create a GitHub OAuth app:

- Homepage URL: `https://blog.nimdal.xyz`
- Authorization callback URL: `https://blog.nimdal.xyz/api/auth/callback/`

Set these environment variables on Vercel:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_ALLOWED_LOGIN=nimdalkr
GITHUB_REPO_OWNER=nimdalkr
GITHUB_REPO_NAME=nimdalblog
GITHUB_REPO_BRANCH=main
GITHUB_OAUTH_SCOPE=read:user public_repo
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
```

For local OAuth testing, use a separate GitHub OAuth app with callback URL
`http://localhost:4321/api/auth/callback/`.

## SEO

- Canonical host: `https://blog.nimdal.xyz`
- RSS: `/rss.xml`
- Sitemap: `/sitemap-index.xml`
- Robots: `/robots.txt`

After deployment, submit both RSS and sitemap to Google Search Console and Naver Search Advisor.
