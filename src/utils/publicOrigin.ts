import { SITE } from "../config";

type HeaderSource = {
  headers: Headers;
  url?: string;
};

export const getPublicOrigin = ({ headers, url }: HeaderSource) => {
  const forwardedProto = headers.get("x-forwarded-proto");
  const forwardedHost = headers.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = headers.get("host");
  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  if (url) {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "localhost") {
      return parsedUrl.origin;
    }
  }

  return SITE.siteUrl;
};
