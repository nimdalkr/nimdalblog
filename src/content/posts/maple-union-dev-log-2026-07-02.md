---
title: "maple uNion 개발일지"
description: "maple uNion을 유니온 중심 방치형 RPG 프로토타입으로 다듬은 과정을 정리했어요."
publishedAt: 2026-07-02
category: "product"
tags: ["maple-union", "game", "build-log", "vibecamp", "msu", "phaser"]
cover: "/media/posts/maple-union-dev-log-2026-07-02-cover.png"
coverAlt: "maple uNion hunting field with skill effects, hunt tempo controls, guide notification, and bottom HUD."
featured: true
draft: false
lang: "ko"
---

maple uNion은 MapleStoryUniverse 리소스를 활용한 유니온 중심 방치형 RPG 프로토타입이에요. 목표는 단순히 메이플풍 UI를 흉내 내는 게 아니었어요. 캐릭터를 만들고, 자동 사냥을 돌리고, 장비를 줍고, 강화하고, 여러 캐릭터를 키우며 계정 전체가 조금씩 강해지는 흐름을 만드는 쪽에 가까웠어요.

처음 확인한 코드베이스는 Vite, React, Phaser, Zustand로 구성되어 있었어요. 전투와 AFK 로직의 뼈대는 있었지만, 실제 게임처럼 보이고 만져지는 경험은 아직 부족했어요. 그래서 화면, 지형, 사냥 루프, 성장 시스템을 하나씩 연결했어요.

![maple uNion hunting field](/media/posts/maple-union-dev-log-2026-07-02-cover.png)

_사냥 필드, 스폰 템포, Guide 알림, 스킬 이펙트, 하단 HUD를 함께 확인한 QA 캡처에요._

## 먼저 게임에 들어가는 느낌을 만들었어요

가장 먼저 진입 화면을 손봤어요. 타이틀에서 캐릭터 선택으로 이어지고, 빈 슬롯과 직업 정보, 캐릭터 미리보기, 생성 버튼이 한 화면 안에서 읽히도록 정리했어요.

이 화면은 첫인상을 만드는 곳이에요. 유저가 버튼을 누르기 전에 이 게임이 어떤 루프를 갖고 있는지 어느 정도 느껴야 해요. 그래서 캐릭터 선택 화면에도 월드, 슬롯, 전투력, 유니온 로스터 같은 단서를 넣었어요.

![maple uNion character select screen](/media/posts/maple-union-dev-log-2026-07-02-character-select.png)

_캐릭터 선택 화면은 maple uNion의 첫인상을 만드는 부분이라 UI 밀도를 높였어요._

HUD도 다시 정리했어요. 하단에는 Stats, Skills, Items, Union, Map, Rank, Options 같은 주요 메뉴를 고정했어요. 상단에는 Guide, Active Buffs, Hunt Tempo처럼 지금 상태를 바로 읽을 수 있는 정보를 배치했어요. 방치형 게임이어도 플레이어가 무엇을 조정하고 있는지는 보여줘야 하니까요.

## 월드맵과 사냥 루프를 연결했어요

텍스트 목록만으로 사냥터를 고르는 화면은 게임 느낌이 약했어요. 그래서 월드맵과 Auto Quest 쪽에 미니맵, 몬스터, 드롭 아이콘, Auto Hunt 진입 버튼을 붙였어요.

이 과정에서 사냥터 데이터도 다시 정리했어요. 월드맵, Auto Quest, 실제 필드가 서로 다른 기준을 보면 화면은 그럴듯해도 플레이는 금방 어색해져요. 사냥터 이름, 몬스터, 드롭, 추천 레벨, 지형 정보를 같은 흐름으로 묶었어요.

![maple uNion all stages contact sheet](/media/posts/maple-union-dev-log-2026-07-02-stage-sheet.png)

_여러 사냥터를 같은 기준으로 캡처해서, 몬스터와 캐릭터가 지형 위에 자연스럽게 서는지 확인했어요._

## 성장은 한 화면에서 끝나지 않게 했어요

maple uNion의 핵심은 켜두면 성장하지만, 중간중간 개입할 이유가 생기는 구조예요. 그래서 AFK, Auto Battle 시간, Daily Mission, Dungeon, Event Mail, Achievement, Monster Collection, Jewel, Star Force, Potential/Cubes 같은 루프를 단계적으로 붙였어요.

기능을 많이 넣는 것보다 더 중요한 건 서로 연결되는 일이었어요. 사냥으로 장비가 떨어지고, 좋은 장비는 인벤토리와 강화 화면에서 투자 후보로 보여요. 강화와 잠재 옵션은 전투력과 사냥 효율에 반영되고, 유니온과 주얼은 다시 계정 단위 성장으로 이어져요.

![maple uNion field with active buffs](/media/posts/maple-union-dev-log-2026-07-02-field-buffs.png)

_버프, 장비 반영, 몬스터 배치, 누에소 드롭이 실제 필드에서 함께 보이도록 정리했어요._

확률형 요소도 숨기지 않았어요. 장비 드롭, 등급, 슬롯, 옵션 롤, 스타포스, 큐브, AFK 보상처럼 확률이 들어가는 부분은 Options 안에 Probability Info로 정리했어요. 작은 프로토타입이어도 유저가 시스템을 이해할 수 있어야 해요.

![maple uNion probability guide](/media/posts/maple-union-dev-log-2026-07-02-probability-guide.png)

_확률형 요소는 Options 안에서 항목별로 확인할 수 있게 만들었어요._

## 지형 QA에 시간을 많이 썼어요

가장 오래 붙잡은 부분은 UI보다 지형과 에셋이었어요. MSU 원본 Map, Tile, Obj, Back 데이터를 가져와도 자동사냥 게임에 그대로 맞지는 않았어요. 원본 맵은 넓거나 복잡하고, 자동사냥은 짧은 이동 루프와 안정적인 스폰이 중요해요.

그래서 원본 맵 렌더와 실제 플레이 지형을 맞추는 방향으로 구조를 바꿨어요. 캐릭터와 몬스터가 같은 발판 기준을 쓰게 했고, 사냥 구간은 최대 2층 구조로 제한했어요. 스폰존과 순찰 구간도 지형 데이터를 기준으로 다시 계산했어요.

월드맵 카드, HUD 미니맵, 실제 사냥 필드가 서로 다른 그림을 보여주지 않도록 통합한 것도 이때였어요. 화면은 나오는데 게임으로는 이상한 상태를 줄이는 데 꽤 많은 시간을 썼어요.

![maple uNion map render QA sheet](/media/posts/maple-union-dev-log-2026-07-02-map-render-qa.png)

_맵 렌더 QA는 화면과 실제 플레이 지형을 맞추기 위한 작업이었어요._

## 아직 더 다듬어야 해요

이번 작업으로 maple uNion의 방향은 훨씬 분명해졌어요. 캐릭터 선택, 자동 사냥, 장비 파밍, 강화, 유니온, 코디, 지형 QA까지 핵심 골격은 생겼어요.

그래도 아직 완성작이라고 말하기에는 부족해요. 자동사냥은 더 사람처럼 움직여야 하고, 장비 드롭은 더 설레야 해요. 직업별 스킬 연출도 더 선명해져야 해요. 다음에는 사냥 효율 지표, 장비 비교 UX, 직업별 전투 연출, 모바일 메뉴 흐름을 우선으로 다듬고 싶어요.

maple uNion은 결국 켜둘수록 계정 전체가 강해지는 게임이에요. 그 감각이 더 잘 보이도록 계속 손볼 예정이에요.
