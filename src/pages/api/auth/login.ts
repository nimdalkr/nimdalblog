import type { APIRoute } from "astro";

import { createOAuthState, getAdminConfig, getMissingAuthConfig, getOAuthRedirectUri, isSecureRequest, STATE_COOKIE } from "../../../utils/adminAuth";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, request, redirect }) => {
  const missing = getMissingAuthConfig();
  if (missing.length > 0) {
    return redirect(`/admin/?error=missing-config&missing=${encodeURIComponent(missing.join(","))}`);
  }

  const config = getAdminConfig();
  const state = createOAuthState();
  const redirectUri = getOAuthRedirectUri(request);
  const authUrl = new URL("https://github.com/login/oauth/authorize");

  authUrl.searchParams.set("client_id", config.clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", config.oauthScope);
  authUrl.searchParams.set("state", state);

  cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure: isSecureRequest(request)
  });

  return redirect(authUrl.toString());
};
