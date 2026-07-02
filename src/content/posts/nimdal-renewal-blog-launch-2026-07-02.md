---
title: "nimdal.xyz 리뉴얼과 블로그 런칭 기록"
description: "nimdal.xyz 리뉴얼과 blog.nimdal.xyz 구축 과정을 정리한 짧은 작업 로그예요."
publishedAt: 2026-07-02
category: "operation"
tags: ["nimdal","portfolio","blog","build-log","astro","vercel"]
cover: "/media/posts/nimdal-renewal-2026-07-02-portfolio.png"
coverAlt: "Renewed nimdal.xyz homepage showing Tak Chanwoo and Nimdal pixel octopus identity."
featured: false
draft: false
lang: "ko"
---

이번 글은 글쓰기 기능 테스트를 겸한 작업 로그예요. 2026년 7월 2일에는 `nimdal.xyz`를 개인 포트폴리오 중심으로 다시 정리했고, `blog.nimdal.xyz`를 별도 개인 블로그로 구축했어요.

핵심 방향은 단순한 소개 페이지가 아니라, Nimdal / Tak Chanwoo라는 사람의 정체성과 작업 방식을 보여주는 개인 허브를 만드는 것이었어요. 포트폴리오 사이트는 실사 프로필과 픽셀 문어 NFT 아이덴티티를 함께 사용했고, 블로그는 그보다 조용한 읽기 경험에 집중했어요.

![Renewed nimdal.xyz homepage](/media/posts/nimdal-renewal-2026-07-02-portfolio.png)

## 바뀐 점

- `nimdal.xyz`는 개인 정체성, 프로젝트, 포트폴리오, 프로필을 한 화면에서 탐색할 수 있는 구조로 정리했어요.
- 기존의 장식적인 콘셉트보다 실제 인물, NFT 아이덴티티, Web3 리서치/자동화/제품 빌드라는 방향을 더 앞에 두었어요.
- `blog.nimdal.xyz`는 Astro 기반의 정적 블로그로 구축했고, GitHub OAuth로 나만 글을 작성/수정/삭제할 수 있게 만들었어요.
- Vercel production 환경변수와 GitHub OAuth callback을 정리해서 실제 배포 환경에서도 관리자 로그인이 가능하도록 연결했어요.

![New blog homepage](/media/posts/nimdal-renewal-2026-07-02-blog.png)

## 왜 분리했는지

포트폴리오 사이트는 결과물을 보여주는 공간이고, 블로그는 그 결과물이 만들어지는 과정과 판단을 기록하는 공간이에요. 그래서 두 사이트를 분리했어요. `nimdal.xyz`는 첫인상과 탐색 경험을 담당하고, `blog.nimdal.xyz`는 리서치 노트, 제품 빌드 로그, 캠페인 운영 기록, 자동화 실험을 축적하는 아카이브가 될 거예요.

이번 테스트 포스트까지 발행하면서 블로그의 기본 루프도 검증했어요. 캡처 이미지를 추가하고, 관리자 화면에서 글을 작성하고, GitHub에 저장하고, Vercel을 통해 배포하는 흐름이에요.

다음 단계는 글쓰기 UX를 더 다듬는 거예요. 이미지 업로드, 미리보기, 초안 관리, 그리고 포트폴리오 사이트에서 관련 글을 연결하는 흐름까지 붙이면 개인 사이트와 블로그가 하나의 작은 publishing system처럼 움직이게 될 거예요.
