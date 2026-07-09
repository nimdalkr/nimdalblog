---
title: "nimdal.xyz와 nimdalog를 정리한 날"
description: "개인 포트폴리오와 블로그를 분리하고, 보여주는 공간과 기록하는 공간의 역할을 다시 정리했어요."
publishedAt: 2026-07-02
category: "operation"
tags: ["nimdal","portfolio","blog","build-log","astro","vercel"]
cover: "/media/posts/nimdal-renewal-2026-07-02-portfolio.webp"
coverAlt: "Renewed nimdal.xyz homepage showing Tak Chanwoo and Nimdal pixel octopus identity."
featured: false
draft: false
lang: "ko"
series: "ops-manual"
relatedProject: "nimdalxyz"
proofLevel: "live-link"
heroLabel: "Site Ops / Editorial System"
summaryBullets: ["포트폴리오와 블로그의 역할을 분리했어요.", "nimdal.xyz는 결과를 보여주고, nimdalog는 과정과 판단을 남기는 구조로 잡았어요.", "앞으로 포트폴리오와 글이 서로 증거처럼 연결되도록 다듬을 예정이에요."]
---

2026년 7월 2일에는 `nimdal.xyz`와 `blog.nimdal.xyz`를 다시 정리했어요. `nimdal.xyz`는 나를 소개하고 프로젝트를 보여주는 포트폴리오 허브로 두고, 블로그는 `nimdalog`라는 이름의 기록 공간으로 분리했어요.

이전에는 프로젝트 소개와 작업 기록이 한곳에 섞여 있었어요. 그러다 보니 첫 화면에서 보여줘야 할 정체성과, 글로 천천히 남겨야 할 과정이 서로 부딪혔어요. 그래서 역할을 나눴어요. 포트폴리오는 빠르게 보여주고, 블로그는 오래 읽히게 만드는 방향이에요.

![Renewed nimdal.xyz homepage](/media/posts/nimdal-renewal-2026-07-02-portfolio.webp)

## 포트폴리오는 더 명확하게

`nimdal.xyz`는 Tak Chanwoo / Nimdal이라는 사람을 먼저 보여주는 쪽으로 정리했어요. 실제 프로필 사진과 픽셀 문어 NFT를 함께 두고, 개인 프로젝트와 커리어 포트폴리오로 이어지는 구조를 만들었어요.

방향은 단순한 자기소개 페이지가 아니에요. Web3 리서치, 자동화, 게임형 제품, 마케팅 운영처럼 제가 실제로 다루는 주제를 하나의 인터랙티브한 개인 허브로 묶는 것이 목표였어요.

특히 프로젝트 영역은 단순 카드 목록보다 “어떤 문제를 봤고, 무엇을 만들었고, 어떤 증거가 있는지”가 보여야 한다고 봤어요. 그래서 이후에는 프로젝트별 케이스룸, proof media, 관련 블로그 글이 서로 연결되도록 구조를 바꿔가고 있어요.

## 블로그는 조용하게

블로그는 Astro 기반으로 만들었어요. 읽기 흐름을 방해하는 장식은 줄이고, 글과 이미지가 안정적으로 보이도록 했어요. 글은 GitHub에 저장되고, Vercel 배포를 통해 `blog.nimdal.xyz`에 반영돼요.

관리 화면도 붙였어요. GitHub OAuth로 로그인한 뒤 글을 작성하고 수정할 수 있게 만들었고, 나만 글을 올릴 수 있도록 권한을 제한했어요.

![New blog homepage](/media/posts/nimdal-renewal-2026-07-02-blog.webp)

## 왜 분리했는지

포트폴리오는 결과를 보여주는 곳이에요. 반면 블로그는 그 결과가 만들어진 과정, 판단, 시행착오를 남기는 곳이에요.

`nimdal.xyz`에서는 첫인상과 탐색 경험이 중요해요. `nimdalog`에서는 리서치 노트, 제품 빌드 로그, 캠페인 운영 기록, 자동화 실험을 차곡차곡 쌓는 편이 더 맞아요. 역할을 나누니 각자의 목적이 훨씬 명확해졌어요.

이제 목표는 두 사이트를 따로 두는 데서 끝나지 않아요. 포트폴리오의 프로젝트룸에서 관련 글로 이어지고, 글에서는 다시 프로젝트룸으로 돌아갈 수 있어야 해요. 그렇게 해야 포트폴리오는 보여주는 공간이 되고, nimdalog는 그 주장을 뒷받침하는 증거가 될 수 있어요.

이번 작업은 그 기본 골격을 만든 날이에요. 앞으로는 각 프로젝트에 실제 캡처, 작업 로그, 공개 링크, 한계와 다음 계획을 더 붙여서 “멋져 보이는 사이트”보다 “믿을 수 있는 포트폴리오”에 가깝게 다듬어갈 생각이에요.
