export const SITE = {
  title: "nimdal.xyz",
  author: "Your Name",
  description:
    "개인적인 개발 기록, 실험 로그, 그리고 오래 남겨둘 가치가 있는 메모를 정리하는 블로그.",
  siteUrl: "https://example.com",
  email: "hello@example.com",
  tagline: "Build slowly. Write clearly. Ship deliberately.",
  intro:
    "인프라, 제품 개발, 자동화, 그리고 배운 내용을 오래 남는 문장으로 정리합니다.",
  location: "Seoul, South Korea",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/posts", label: "Posts" },
    { href: "/about", label: "About" }
  ],
  featuredTopics: ["Astro", "Automation", "DevOps", "Writing", "Product"]
} as const;
