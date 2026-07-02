import type { APIRoute } from "astro";

import {
  createAdminSession,
  createSessionToken,
  getAdminConfig,
  getCookieValue,
  getMissingAuthConfig,
  getOAuthRedirectUri,
  isSecureRequest,
  sessionMaxAge,
  SESSION_COOKIE,
  STATE_COOKIE
} from "../../../utils/adminAuth";

export const prerender = false;

type GitHubTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
};

export const GET: APIRoute = async ({ cookies, request, redirect }) => {
  const missing = getMissingAuthConfig();
  if (missing.length > 0) {
    return redirect(`/admin/?error=missing-config&missing=${encodeURIComponent(missing.join(","))}`);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = getCookieValue(request, STATE_COOKIE);

  cookies.delete(STATE_COOKIE, { path: "/" });

  if (!code || !state || !savedState || state !== savedState) {
    return redirect("/admin/?error=invalid-state");
  }

  const config = getAdminConfig();
  const redirectUri = getOAuthRedirectUri(request);
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });
  const tokenJson = (await tokenResponse.json()) as GitHubTokenResponse;

  if (!tokenResponse.ok || !tokenJson.access_token) {
    return redirect(`/admin/?error=github-token&message=${encodeURIComponent(tokenJson.error_description ?? tokenJson.error ?? "token request failed")}`);
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenJson.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  const user = (await userResponse.json()) as GitHubUser;

  if (!userResponse.ok || !user.login) {
    return redirect("/admin/?error=github-user");
  }

  if (user.login.toLowerCase() !== config.allowedLogin) {
    return redirect(`/admin/?error=not-allowed&login=${encodeURIComponent(user.login)}`);
  }

  const session = createAdminSession({
    login: user.login,
    name: user.name ?? user.login,
    avatarUrl: user.avatar_url,
    accessToken: tokenJson.access_token
  });

  cookies.set(SESSION_COOKIE, createSessionToken(session), {
    httpOnly: true,
    maxAge: sessionMaxAge(),
    path: "/",
    sameSite: "lax",
    secure: isSecureRequest(request)
  });

  return redirect("/admin/");
};
