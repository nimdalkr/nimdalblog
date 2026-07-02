export const site = {
  title: "nimdalog",
  description:
    "Personal notes by Nimdal / Tak Chanwoo on Web3 research, product systems, campaign operations, automation, and creative building.",
  url: "https://blog.nimdal.xyz",
  mainUrl: "https://nimdal.xyz",
  author: "Tak Chanwoo / Nimdal",
  email: "0xnimdal@gmail.com",
  image: "/media/identity-octopus.jpg"
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
