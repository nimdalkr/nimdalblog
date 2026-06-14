import type { APIRoute } from "astro";
import { getPublicOrigin } from "../utils/publicOrigin";

export const prerender = false;

const STATE_COOKIE = "decap-cms-oauth-state";

const html = (payload: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Authorization complete</title>
  </head>
  <body>
    <script>
      const payload = ${JSON.stringify(payload)};
      if (window.opener) {
        window.opener.postMessage(payload, "*");
      }
      window.close();
    </script>
  </body>
</html>`;

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const origin = getPublicOrigin({ headers: request.headers, url: request.url });
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const storedState = cookies.get(STATE_COOKIE)?.value;

  cookies.delete(STATE_COOKIE, { path: "/callback" });

  if (error) {
    return new Response(
      html(
        `authorization:github:error:${JSON.stringify({
          message: errorDescription || error
        })}`
      ),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  if (!code || !returnedState || !storedState || returnedState !== storedState) {
    return new Response(
      html(
        `authorization:github:error:${JSON.stringify({
          message: "Invalid or expired OAuth state. Start the login flow again."
        })}`
      ),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      html(
        `authorization:github:error:${JSON.stringify({
          message:
            "Missing GITHUB_OAUTH_CLIENT_ID or GITHUB_OAUTH_CLIENT_SECRET in the deployment environment."
        })}`
      ),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL("/callback", origin).toString()
    })
  });

  const token = await tokenResponse.json();

  if (!tokenResponse.ok || token.error || !token.access_token) {
    return new Response(
      html(
        `authorization:github:error:${JSON.stringify({
          message: token.error_description || token.error || "GitHub token exchange failed."
        })}`
      ),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const allowedLogin = process.env.ADMIN_GITHUB_LOGIN || "nimdalkr";
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token.access_token}`,
      "User-Agent": "nimdalblog-admin-auth"
    }
  });

  const user = await userResponse.json();

  if (!userResponse.ok || user.login !== allowedLogin) {
    return new Response(
      html(
        `authorization:github:error:${JSON.stringify({
          message: "This blog can only be edited by the site owner."
        })}`
      ),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const successPayload = JSON.stringify({
    token: token.access_token,
    access_token: token.access_token,
    token_type: token.token_type,
    scope: token.scope,
    provider: "github"
  });

  return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Authorization complete</title>
  </head>
  <body>
    <script>
      const payload = "authorization:github:success:" + ${JSON.stringify(successPayload)};
      if (window.opener) {
        window.opener.postMessage(payload, "*");
      }
      window.close();
    </script>
  </body>
</html>`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
};
