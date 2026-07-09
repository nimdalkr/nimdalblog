---
title: "maple uNion 개발일지"
description: "maple uNion을 작은 방치형 RPG 프로토타입으로 정리하면서, 게임 루프와 UI 흐름을 어떻게 잡았는지 기록했어요."
publishedAt: 2026-07-02
category: "product"
tags: ["maple-union", "game", "build-log", "vibecamp", "msu", "phaser"]
cover: "/media/posts/maple-union-dev-log-2026-07-02-cover.webp"
coverAlt: "maple uNion hunting field with skill effects, hunt tempo controls, guide notification, and bottom HUD."
featured: true
draft: false
lang: "ko"
series: "build-log"
relatedProject: "maple-union"
proofLevel: "screenshots"
heroLabel: "Build Log / Game Utility"
summaryBullets: ["게임 시스템 문제를 작은 유틸리티 제품처럼 정리했어요.", "사냥, 장비, 강화, 유니온 루프를 하나의 흐름으로 연결했어요.", "다음 단계는 전투 연출, 모바일 메뉴, 플레이 가능한 데모를 더 다듬는 일이에요."]
---

maple uNion은 MapleStoryUniverse 리소스를 활용해서 만든 작은 방치형 RPG 프로토타입이에요. 목표는 단순히 메이플풍 화면을 흉내 내는 게 아니었어요. 캐릭터를 고르고, 자동 사냥에 들어가고, 장비를 얻고, 강화하고, 여러 캐릭터를 키우면서 계정 전체가 조금씩 강해지는 흐름을 한 화면 안에서 설득력 있게 보여주는 것이 목표였어요.

처음 코드베이스는 Vite, React, Phaser, Zustand 조합으로 구성했어요. AFK 로직은 있었지만 실제 게임처럼 보이고 만져지는 느낌은 아직 부족했어요. 그래서 화면, 지도, 사냥 루프, 성장 시스템을 하나의 제품 흐름처럼 다시 묶었어요.

![maple uNion hunting field](/media/posts/maple-union-dev-log-2026-07-02-cover.webp)

_사냥 필드, 스킬 이펙트, Guide 알림, 전투 템포, 하단 HUD를 함께 확인한 QA 캡처에요._

## 먼저 게임에 들어가는 장면을 만들었어요

가장 먼저 손본 건 진입 화면이에요. 단순한 캐릭터 목록이 아니라, 플레이어가 “이제 게임을 시작한다”는 느낌을 받을 수 있어야 했어요. 그래서 캐릭터 선택 화면에 배경, 직업 정보, 미리보기, 생성 버튼을 정리해서 넣었어요.

이 화면은 첫인상을 만드는 곳이에요. 사용자가 버튼을 누르기 전에 이 게임이 어떤 루프를 갖고 있는지 어느 정도 예상할 수 있어야 해요. 그래서 캐릭터 선택 화면에도 카드, 능력치, 전투 루프의 단서를 남겼어요.

![maple uNion character select screen](/media/posts/maple-union-dev-log-2026-07-02-character-select.webp)

_캐릭터 선택 화면은 maple uNion의 첫인상을 만드는 구간이라 UI 밀도를 조금 높였어요._

HUD도 다시 정리했어요. 하단에는 Stats, Skills, Items, Union, Map, Rank, Options처럼 자주 쓰는 메뉴를 고정했어요. 상단에는 Guide, Active Buffs, Hunt Tempo처럼 지금 상태를 바로 읽을 수 있는 정보를 배치했어요. 방치형 게임일수록 플레이어가 무엇을 조정하고 있는지 계속 보여줘야 하니까요.

## 월드맵과 사냥 루프를 연결했어요

텍스트 목록만으로 사냥터를 고르게 하면 게임 느낌이 약해져요. 그래서 월드맵과 Auto Quest 쪽에 미니맵, 몬스터 섬네일, 지역 아이콘, Auto Hunt 진입 버튼을 붙였어요.

이 과정에서 사냥터 데이터도 다시 정리했어요. 월드맵, Auto Quest, 실제 필드가 서로 다른 기준을 가지면 화면은 금방 어색해져요. 그래서 사냥터 이름, 몬스터 정보, 추천 레벨, 지역 정보를 같은 흐름으로 묶었어요.

![maple uNion all stages contact sheet](/media/posts/maple-union-dev-log-2026-07-02-stage-sheet.webp)

_여러 사냥터를 같은 기준으로 캡처해서, 몬스터와 캐릭터가 지형 위에 자연스럽게 서는지 확인했어요._

## 성장은 한 화면에서 끝나지 않게 했어요

maple uNion의 핵심은 켜두면 성장하지만, 중간중간 개입할 이유가 생기는 구조에요. 그래서 AFK, Auto Battle, Daily Mission, Dungeon, Event Mail, Achievement, Monster Collection, Jewel, Star Force, Potential/Cubes 같은 루프를 단계적으로 붙였어요.

기능이 많다는 것보다 중요한 건 서로 연결되는 레이어에요. 사냥으로 장비가 떨어지고, 좋은 장비는 인벤토리와 강화 화면에서 다시 보이고, 강화는 전투력과 사냥 효율에 영향을 줘야 해요. 유니온과 보상도 계정 단위 성장으로 이어지도록 잡았어요.

![maple uNion field with active buffs](/media/posts/maple-union-dev-log-2026-07-02-field-buffs.webp)

_버프, 장비 반영, 몬스터 배치, 필드 섬네일이 실제 플레이 화면에서 함께 보이도록 정리했어요._

확률 요소도 숨기지 않으려고 했어요. 장비 등급, 옵션, 스타포스, 보상처럼 확률이 들어가는 부분은 Options 안에 Probability Info로 정리했어요. 작은 프로토타입이어도 사용자가 시스템을 이해할 수 있어야 한다고 봤어요.

![maple uNion probability guide](/media/posts/maple-union-dev-log-2026-07-02-probability-guide.webp)

_확률 정보는 Options 안에서 항목별로 확인할 수 있게 만들었어요._

## 지도 QA에 시간이 많이 들어갔어요

가장 오래 붙잡은 부분은 UI보다 지형과 에셋이에요. MSU 원본 Map, Tile, Obj, Back 데이터를 가져와도 자동 사냥 게임에 그대로 맞지는 않았어요. 원본 맵은 넓고 복잡하고, 자동 사냥은 안정적인 스폰 지점과 이동 루프가 중요했어요.

그래서 원본 맵 렌더를 실제 플레이 지형에 맞추는 방향으로 구조를 바꿨어요. 캐릭터와 몬스터가 같은 발판 기준 위에 서게 하고, 사냥 구간은 최대한 읽기 쉬운 구조로 제한했어요. 월드맵 카드, HUD 미니맵, 실제 사냥 필드가 서로 다른 그림처럼 보이지 않도록 맞추는 데 시간이 꽤 들었어요.

![maple uNion map render QA sheet](/media/posts/maple-union-dev-log-2026-07-02-map-render-qa.webp)

_맵 렌더 QA는 화면과 실제 플레이 지형을 맞추기 위한 작업이었어요._

## 아직 더 다듬어야 해요

이번 작업으로 maple uNion의 방향은 훨씬 분명해졌어요. 캐릭터 선택, 자동 사냥, 장비 획득, 강화, 유니온 코디, 지도 QA까지 핵심 골격은 생겼어요.

다만 아직 완성작이라고 말하기엔 부족해요. 자동 사냥은 더 살아 움직여야 하고, 장비 섬네일은 더 또렷해야 해요. 직업별 스킬 연출도 더 선명해져야 하고, 모바일 메뉴 흐름도 다시 손봐야 해요.

그래도 이 프로젝트는 Nimdal 포트폴리오에서 중요한 증거가 됐어요. 단순히 화면을 꾸민 게 아니라, 작은 게임 시스템을 어떻게 읽히게 만들고, 어디까지 제품처럼 정리할 수 있는지 보여주는 기록이기 때문이에요.
