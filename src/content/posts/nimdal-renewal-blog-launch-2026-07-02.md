---
title: "nimdal.xyz와 nimdalog를 정리한 날"
description: "개인 포트폴리오와 블로그를 분리해 정리한 과정을 짧게 남겼어요."
publishedAt: 2026-07-02
category: "operation"
tags: ["nimdal","portfolio","blog","build-log","astro","vercel"]
cover: "/media/posts/nimdal-renewal-2026-07-02-portfolio.png"
coverAlt: "Renewed nimdal.xyz homepage showing Tak Chanwoo and Nimdal pixel octopus identity."
featured: false
draft: false
lang: "ko"
---

2026년 7월 2일에는 `nimdal.xyz`와 `blog.nimdal.xyz`를 함께 정리했어요. `nimdal.xyz`는 나를 소개하는 포트폴리오 허브로 두고, 블로그는 `nimdalog`라는 이름의 기록 공간으로 분리했어요.

이전에는 프로젝트와 소개, 작업 기록이 한곳에 섞여 있었어요. 그러다 보니 첫 화면에서 보여줘야 할 정체성과, 글로 천천히 남겨야 할 과정이 서로 부딪혔어요. 그래서 역할을 나눴어요. 포트폴리오는 빠르게 보여주고, 블로그는 오래 읽히게 만들기로 했어요.

![Renewed nimdal.xyz homepage](/media/posts/nimdal-renewal-2026-07-02-portfolio.png)

## 포트폴리오는 더 명확하게

`nimdal.xyz`는 Tak Chanwoo / Nimdal이라는 사람을 먼저 보여주는 쪽으로 정리했어요. 실사 프로필과 픽셀 문어 NFT를 함께 쓰고, 개인 프로젝트와 커리어 포트폴리오로 이어지는 구조를 만들었어요.

방향은 단순한 소개 페이지가 아니었어요. Web3 리서치, 자동화, 게임형 제품, 마케팅 운영처럼 내가 실제로 다루는 주제를 한 화면에서 탐색할 수 있어야 했어요. 그래서 사이트 자체도 정적인 이력서보다 인터랙티브한 개인 허브에 가깝게 잡았어요.

## 블로그는 조용하게

블로그는 Astro 기반으로 만들었어요. 읽기 흐름을 방해하는 장식은 줄이고, 글과 이미지가 안정적으로 보이도록 잡았어요. 글은 GitHub에 저장되고, Vercel 배포를 통해 `blog.nimdal.xyz`에 반영돼요.

관리 화면도 따로 붙였어요. GitHub OAuth로 로그인한 뒤 글을 작성하고 수정할 수 있게 만들었고, 나만 글을 올릴 수 있도록 권한을 제한했어요.

![New blog homepage](/media/posts/nimdal-renewal-2026-07-02-blog.png)

## 왜 나눴는지

포트폴리오는 결과를 보여주는 곳이에요. 반면 블로그는 그 결과가 만들어진 과정, 판단, 시행착오를 남기는 곳이에요.

`nimdal.xyz`에서는 첫인상과 탐색 경험이 중요해요. `nimdalog`에서는 리서치 노트, 제품 빌드 로그, 캠페인 운영 기록, 자동화 실험을 차곡차곡 쌓는 편이 더 맞아요. 둘을 분리하니 각자의 역할이 훨씬 또렷해졌어요.

이번 작업으로 기본 publishing 흐름도 확인했어요. 이미지를 넣고, 글을 작성하고, 저장한 뒤 배포까지 이어지는 과정이 잘 돌아갔어요. 앞으로는 글쓰기 화면을 더 편하게 만들고, 포트폴리오 사이트와 블로그 글이 자연스럽게 연결되도록 다듬을 생각이에요.
