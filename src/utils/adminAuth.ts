import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const SESSION_COOKIE = "nimdal_admin_session";
export const STATE_COOKIE = "nimdal_admin_state";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AdminSession = {
  login: string;
  name: string;
  avatarUrl: string;
  accessToken: string;
  exp: number;
};

export type PublicAdminSession = Omit<AdminSession, "accessToken" | "exp">;

export function getAdminConfig() {
  const localEnv = loadLocalEnv();

  return {
    clientId: getEnvValue("GITHUB_CLIENT_ID", localEnv),
    clientSecret: getEnvValue("GITHUB_CLIENT_SECRET", localEnv),
    allowedLogin: (getEnvValue("GITHUB_ALLOWED_LOGIN", localEnv) || "nimdalkr").toLowerCase(),
    repoOwner: getEnvValue("GITHUB_REPO_OWNER", localEnv) || "nimdalkr",
    repoName: getEnvValue("GITHUB_REPO_NAME", localEnv) || "nimdalblog",
    repoBranch: getEnvValue("GITHUB_REPO_BRANCH", localEnv) || "main",
    sessionSecret: getEnvValue("ADMIN_SESSION_SECRET", localEnv),
    oauthScope: getEnvValue("GITHUB_OAUTH_SCOPE", localEnv) || "read:user public_repo",
    siteUrl: normalizeSiteUrl(getEnvValue("SITE_URL", localEnv))
  };
}

export function getMissingAuthConfig() {
  const config = getAdminConfig();
  const missing: string[] = [];

  if (!config.clientId) missing.push("GITHUB_CLIENT_ID");
  if (!config.clientSecret) missing.push("GITHUB_CLIENT_SECRET");
  if (!config.sessionSecret) missing.push("ADMIN_SESSION_SECRET");

  return missing;
}

export function createOAuthState() {
  return randomBytes(24).toString("base64url");
}

export function createSessionToken(session: AdminSession) {
  const { sessionSecret } = getAdminConfig();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(sessionSecret), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, ciphertext, tag].map((part) => part.toString("base64url")).join(".");
}

export function createAdminSession(input: Omit<AdminSession, "exp">): AdminSession {
  return {
    ...input,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
}

export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  const { sessionSecret } = getAdminConfig();
  if (!token || !sessionSecret) return null;

  const [iv, ciphertext, tag] = token.split(".");
  if (!iv || !ciphertext || !tag) return null;

  try {
    const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(sessionSecret), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(ciphertext, "base64url")),
      decipher.final()
    ]).toString("utf8");
    const session = JSON.parse(decrypted) as AdminSession;
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;

    return session;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request) {
  return verifySessionToken(getCookieValue(request, SESSION_COOKIE));
}

export function toPublicSession(session: AdminSession): PublicAdminSession {
  return {
    login: session.login,
    name: session.name,
    avatarUrl: session.avatarUrl
  };
}

export function getCookieValue(request: Request, name: string) {
  const cookies = request.headers.get("cookie") ?? "";
  const match = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function isSecureRequest(request: Request) {
  const forwardedProto = getFirstHeaderValue(request.headers.get("x-forwarded-proto"));
  if (forwardedProto) return forwardedProto === "https";

  const url = new URL(request.url);
  return url.protocol === "https:";
}

export function getOAuthRedirectUri(request: Request) {
  return new URL("/api/auth/callback/", `${getRequestOrigin(request)}/`).toString();
}

export function sessionMaxAge() {
  return SESSION_TTL_SECONDS;
}

function getRequestOrigin(request: Request) {
  const { siteUrl } = getAdminConfig();
  if (siteUrl) return siteUrl;

  const forwardedHost = getFirstHeaderValue(request.headers.get("x-forwarded-host"));
  const host = forwardedHost || getFirstHeaderValue(request.headers.get("host"));
  if (host) {
    const proto = getFirstHeaderValue(request.headers.get("x-forwarded-proto")) || (isSecureRequest(request) ? "https" : "http");
    return `${proto}://${host}`;
  }

  return new URL(request.url).origin;
}

function getEncryptionKey(secret: string) {
  return createHash("sha256").update(secret).digest();
}

function getEnvValue(key: string, localEnv: Record<string, string>) {
  return process.env[key] ?? localEnv[key] ?? "";
}

function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function getFirstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim().toLowerCase() || "";
}

function loadLocalEnv() {
  const env: Record<string, string> = {};
  const files = [".env.local", ".env"];

  for (const file of files) {
    const path = join(process.cwd(), file);
    if (!existsSync(path)) continue;

    const content = readFileSync(path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const index = trimmed.indexOf("=");
      if (index === -1) continue;

      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");

      if (key && !(key in env)) env[key] = value;
    }
  }

  return env;
}
