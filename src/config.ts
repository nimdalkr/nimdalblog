export const site = {
  title: "nimdalog",
  description:
    "Build logs, research notes, and operating manuals from Nimdal / Tak Chanwoo.",
  url: "https://blog.nimdal.xyz",
  mainUrl: "https://nimdal.xyz",
  author: "Tak Chanwoo / Nimdal",
  email: "0xnimdal@gmail.com",
  image: "/media/identity-octopus.jpg"
} as const;

export const series = [
  {
    id: "build-log",
    label: "Build Log",
    description: "Things built, shipped, broken, and rebuilt."
  },
  {
    id: "research-note",
    label: "Research Note",
    description: "Web3, product, market, and system research."
  },
  {
    id: "ops-manual",
    label: "Ops Manual",
    description: "Automation and marketing operations playbooks."
  },
  {
    id: "game-system",
    label: "Game System",
    description: "Game/product mechanics and playful utility design."
  }
] as const;

export const projectLinks = {
  "maple-union": {
    label: "maple uNion",
    href: "https://nimdal.xyz/?project=maple-union&room=proof"
  },
  nimdalxyz: {
    label: "nimdal.xyz",
    href: "https://nimdal.xyz/"
  }
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
