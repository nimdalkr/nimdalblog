import type { APIRoute } from "astro";

import { getMissingAuthConfig, getSessionFromRequest, toPublicSession } from "../../../utils/adminAuth";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const missing = getMissingAuthConfig();
  if (missing.length > 0) {
    return json({ configured: false, missing });
  }

  const session = getSessionFromRequest(request);
  if (!session) {
    return json({ configured: true, authenticated: false }, 401);
  }

  return json({
    configured: true,
    authenticated: true,
    user: toPublicSession(session)
  });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
