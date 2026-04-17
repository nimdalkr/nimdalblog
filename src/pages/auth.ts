import type { APIRoute } from "astro";

export const prerender = false;

const STATE_COOKIE = "decap-cms-oauth-state";

const escapeForHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? "github";
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const scope = process.env.GITHUB_OAUTH_SCOPE || "public_repo";
  const callbackUrl = new URL("/callback", url.origin);
  const state = crypto.randomUUID();

  cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    path: "/callback",
    sameSite: "lax",
    secure: callbackUrl.protocol === "https:",
    maxAge: 60 * 10
  });

  const authorizeUrl = clientId
    ? new URL("https://github.com/login/oauth/authorize")
    : null;

  if (authorizeUrl) {
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", callbackUrl.toString());
    authorizeUrl.searchParams.set("scope", scope);
    authorizeUrl.searchParams.set("state", state);
  }

  const errorPayload = !clientId
    ? JSON.stringify({
        message:
          "Missing GITHUB_OAUTH_CLIENT_ID. Add it to your Vercel project environment variables."
      })
    : null;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Authorizing ${escapeForHtml(provider)}</title>
  </head>
  <body>
    <script>
      const provider = ${JSON.stringify(provider)};
      const authorizeUrl = ${JSON.stringify(authorizeUrl?.toString() ?? null)};
      const errorPayload = ${errorPayload ?? "null"};

      function post(type, payload) {
        if (!window.opener) return;
        window.opener.postMessage(
          "authorization:" + provider + ":" + type + ":" + JSON.stringify(payload),
          "*"
        );
      }

      function begin() {
        if (authorizeUrl) {
          window.location.assign(authorizeUrl);
          return;
        }

        post("error", errorPayload);
        window.close();
      }

      window.addEventListener("message", (event) => {
        if (event.source !== window.opener) return;
        if (event.data !== "authorizing:" + provider) return;
        begin();
      });

      if (window.opener) {
        window.opener.postMessage("authorizing:" + provider, "*");
      } else {
        begin();
      }
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
};
