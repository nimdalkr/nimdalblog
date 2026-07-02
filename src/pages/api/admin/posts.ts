import type { APIRoute } from "astro";

import { getAdminConfig, getSessionFromRequest } from "../../../utils/adminAuth";
import { markdownToPost, normalizePostPayload, postToMarkdown, sanitizeSlug } from "../../../utils/postMarkdown";

export const prerender = false;

type GitHubContentFile = {
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir";
  content?: string;
};

export const GET: APIRoute = async ({ request }) => {
  const session = getSessionFromRequest(request);
  if (!session) return json({ error: "unauthorized" }, 401);

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (slug) {
    const file = await getFile(session.accessToken, postPath(sanitizeSlug(slug)));
    if (!file.ok) return file.response;

    return json({
      post: markdownToPost(decodeContent(file.data.content ?? ""), sanitizeSlug(slug), file.data.sha)
    });
  }

  const directory = await githubFetch(session.accessToken, "src/content/posts");
  if (!directory.response.ok) {
    return json({ error: "github-error", message: directory.data.message ?? "Could not load posts." }, directory.response.status);
  }

  const files = Array.isArray(directory.data)
    ? (directory.data as GitHubContentFile[]).filter((item) => item.type === "file" && item.name.endsWith(".md"))
    : [];

  const posts = await Promise.all(
    files.map(async (file) => {
      const item = await getFile(session.accessToken, file.path);
      if (!item.ok) {
        return {
          slug: file.name.replace(/\.md$/, ""),
          title: file.name,
          description: "",
          publishedAt: "",
          category: "note",
          draft: true,
          featured: false,
          sha: file.sha
        };
      }

      const post = markdownToPost(decodeContent(item.data.content ?? ""), file.name.replace(/\.md$/, ""), item.data.sha);

      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
        category: post.category,
        draft: post.draft,
        featured: post.featured,
        sha: post.sha
      };
    })
  );

  return json({
    posts: posts.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
  });
};

export const POST: APIRoute = async ({ request }) => {
  const session = getSessionFromRequest(request);
  if (!session) return json({ error: "unauthorized" }, 401);

  let post;
  try {
    post = normalizePostPayload(await request.json());
  } catch (error) {
    return json({ error: "invalid-post", message: error instanceof Error ? error.message : "Invalid post data." }, 400);
  }

  const path = postPath(post.slug);
  const existing = await getFile(session.accessToken, path);
  const markdown = postToMarkdown(post);
  const content = Buffer.from(markdown, "utf8").toString("base64");
  const config = getAdminConfig();
  const body: Record<string, string> = {
    branch: config.repoBranch,
    content,
    message: `${existing.ok ? "Update" : "Add"} blog post: ${post.title}`
  };

  if (existing.ok) body.sha = existing.data.sha;

  const saved = await githubFetch(session.accessToken, path, {
    method: "PUT",
    body: JSON.stringify(body)
  });

  if (!saved.response.ok) {
    return json({ error: "github-error", message: saved.data.message ?? "Could not save post." }, saved.response.status);
  }

  return json({
    ok: true,
    post,
    commit: saved.data.commit?.html_url ?? null
  });
};

export const DELETE: APIRoute = async ({ request }) => {
  const session = getSessionFromRequest(request);
  if (!session) return json({ error: "unauthorized" }, 401);

  const url = new URL(request.url);
  const slug = sanitizeSlug(url.searchParams.get("slug") ?? "");
  if (!slug) return json({ error: "missing-slug" }, 400);

  const path = postPath(slug);
  const existing = await getFile(session.accessToken, path);
  if (!existing.ok) return existing.response;

  const config = getAdminConfig();
  const deleted = await githubFetch(session.accessToken, path, {
    method: "DELETE",
    body: JSON.stringify({
      branch: config.repoBranch,
      message: `Delete blog post: ${slug}`,
      sha: existing.data.sha
    })
  });

  if (!deleted.response.ok) {
    return json({ error: "github-error", message: deleted.data.message ?? "Could not delete post." }, deleted.response.status);
  }

  return json({ ok: true });
};

async function getFile(token: string, path: string) {
  const result = await githubFetch(token, path);

  if (!result.response.ok || Array.isArray(result.data) || result.data.type !== "file") {
    return {
      ok: false as const,
      response: json({ error: "not-found" }, result.response.status === 404 ? 404 : result.response.status)
    };
  }

  return {
    ok: true as const,
    data: result.data as GitHubContentFile
  };
}

async function githubFetch(token: string, path: string, init: RequestInit = {}) {
  const config = getAdminConfig();
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${encodedPath}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  return { response, data };
}

function postPath(slug: string) {
  return `src/content/posts/${slug}.md`;
}

function decodeContent(content: string) {
  return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf8");
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
