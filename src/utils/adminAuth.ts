import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

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
  return {
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    allowedLogin: (process.env.GITHUB_ALLOWED_LOGIN ?? "nimdalkr").toLowerCase(),
    repoOwner: process.env.GITHUB_REPO_OWNER ?? "nimdalkr",
    repoName: process.env.GITHUB_REPO_NAME ?? "nimdalblog",
    repoBranch: process.env.GITHUB_REPO_BRANCH ?? "main",
    sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "",
    oauthScope: process.env.GITHUB_OAUTH_SCOPE ?? "read:user public_repo"
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
  const url = new URL(request.url);
  return url.protocol === "https:";
}

export function sessionMaxAge() {
  return SESSION_TTL_SECONDS;
}

function getEncryptionKey(secret: string) {
  return createHash("sha256").update(secret).digest();
}
