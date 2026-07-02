---
title: "maple uNion 개발일지"
description: "Codex 세션에서 maple uNion을 방치형 RPG 프로토타입으로 끌어올린 과정을 정리했어요."
publishedAt: 2026-07-02
category: "product"
tags: ["maple-union", "game", "build-log", "vibecamp", "msu", "phaser"]
cover: "/media/posts/maple-union-dev-log-2026-07-02-cover.png"
coverAlt: "maple uNion hunting field with skill effects, hunt tempo controls, guide notification, and bottom HUD."
featured: true
draft: false
lang: "ko"
---

이 글은 Codex 세션 `019ed4fb-f7b5-7732-ae88-5303a198192d`에서 이어서 작업했던 maple uNion 개발 기록이에요. 처음 목표는 단순했어요. MapleStoryUniverse 리소스를 최대한 제대로 쓰고, 메이플스토리M 같은 모바일 UI/UX 감각을 참고해서, 킬링타임용으로 계속 켜두고 싶은 방치형 게임을 만드는 것이었어요.

처음에는 GitLab `develop` 브랜치를 안전하게 worktree로 빼고, 현재 코드가 어떤 상태인지 확인했어요. 코드베이스는 Vite + React + Phaser 기반이었고, 상태 관리는 Zustand로 되어 있었어요. 이미 전투와 AFK 로직의 씨앗은 있었지만, 게임처럼 보이고 만져지는 경험은 많이 부족했어요.

![maple uNion hunting field](/media/posts/maple-union-dev-log-2026-07-02-cover.png)

_사냥 필드, 스폰 템포, Guide 알림, 스킬 이펙트, 하단 HUD를 한 화면에서 확인한 QA 캡처에요._

## 먼저 게임처럼 들어가게 만들었어요

첫 번째로 손본 건 진입 경험이었어요. 타이틀에서 캐릭터 선택으로 이어지는 흐름을 만들고, 빈 슬롯, 직업 정보, 캐릭터 미리보기, 생성 버튼이 실제 게임 화면처럼 보이도록 정리했어요. 이 단계에서 중요한 건 “예쁜 화면”이 아니라, 게임에 들어가기 전에 이미 어떤 루프를 기대해야 하는지 보이게 만드는 것이었어요.

![maple uNion character select screen](/media/posts/maple-union-dev-log-2026-07-02-character-select.png)

_캐릭터 선택 화면은 maple uNion의 첫 인상을 만드는 부분이라 UI 밀도를 높였어요._

이후 HUD도 다시 잡았어요. D-pad, Auto, 스킬, 아이템, 유니온, 맵, 랭크, 옵션 같은 기본 조작이 하단에 고정되고, 상단에는 Guide, Active Buffs, Hunt Tempo 같은 현재 상태가 보이게 했어요. 방치형 게임이어도 사용자가 “내가 지금 무엇을 관리하고 있는지” 알아야 하니까요.

## Auto Quest와 월드맵을 붙였어요

다음은 월드맵과 Auto Quest였어요. 텍스트로만 사냥터를 고르는 화면은 게임 느낌이 약해서, 실제 미니맵 썸네일, 몬스터 칩, 드롭 아이콘, Auto Hunt 진입 버튼을 붙였어요. Auto Quest는 현재 사냥터와 다음 사냥터를 보여주고, 조건이 맞으면 바로 이동할 수 있게 만들었어요.

이때 스테이지 데이터도 정리했어요. 월드맵, Auto Quest, 실제 사냥 필드가 서로 다른 기준을 보면 화면은 예뻐도 게임은 금방 어색해져요. 그래서 사냥터 이름, 몬스터, 드롭, 추천 레벨, 지형 데이터를 같은 흐름으로 연결했어요.

![maple uNion all stages contact sheet](/media/posts/maple-union-dev-log-2026-07-02-stage-sheet.png)

_여러 사냥터를 같은 기준으로 캡처해서, 몬스터와 캐릭터가 실제 지형 위에 자연스럽게 서는지 확인했어요._

## 방치형 루프를 촘촘하게 만들었어요

maple uNion은 켜두면 알아서 성장하지만, 사용자가 개입할 이유도 있어야 했어요. 그래서 AFK, Auto Battle 시간, Daily Mission, Dungeon, Event Mail, Achievement, Monster Collection, Jewel, Star Force, Potential/Cubes 같은 성장 루프를 단계적으로 붙였어요.

핵심은 기능을 많이 넣는 게 아니라 서로 연결되게 만드는 것이었어요. 사냥으로 장비가 떨어지고, 좋은 장비는 인벤토리와 강화 화면에서 투자 후보로 보이고, 강화와 잠재 옵션은 전투력과 사냥 효율에 반영되고, 유니온과 주얼은 다시 계정 단위 성장으로 이어지게 했어요.

![maple uNion field with active buffs](/media/posts/maple-union-dev-log-2026-07-02-field-buffs.png)

_버프, 장비 반영, 몬스터 배치, 누에소 드롭이 실제 필드에서 함께 보이도록 정리했어요._

확률형 요소도 그냥 숨겨두지 않았어요. 장비 드롭, 등급, 슬롯, 옵션 롤, 스타포스, 큐브, AFK 보상처럼 확률이 들어가는 부분은 Options 안에 Probability Info로 정리했어요. 프로토타입 단계에서도 이런 설명이 있어야 시스템이 덜 불투명해져요.

![maple uNion probability guide](/media/posts/maple-union-dev-log-2026-07-02-probability-guide.png)

_확률형 요소는 Options 안에서 항목별로 열람할 수 있게 만들었어요._

## 지형과 에셋 QA에 시간을 많이 썼어요

가장 오래 잡고 있던 부분은 사실 UI가 아니라 지형과 에셋이었어요. MSU 원본 Map, Tile, Obj, Back 데이터를 가져와도 그대로 쓰면 자동사냥 게임에는 맞지 않는 경우가 많았어요. 원본 맵은 넓거나 복잡하고, 자동사냥은 짧은 루프와 안정적인 스폰이 중요했어요.

그래서 원본 맵 렌더와 실제 플레이 지형을 맞추는 쪽으로 구조를 바꿨어요. 캐릭터와 몬스터가 같은 발판 기준을 쓰게 하고, 최대 2층 구조로 사냥 구간을 제한하고, 스폰존과 순찰 구간도 지형 데이터 기준으로 재계산했어요. 화면에서 보이는 미니맵, 월드맵 카드, 실제 사냥 필드가 서로 다른 그림을 보여주지 않게 통합했어요.

![maple uNion map render QA sheet](/media/posts/maple-union-dev-log-2026-07-02-map-render-qa.png)

_맵 렌더 QA는 “화면은 나오는데 게임으로는 이상한 상태”를 줄이기 위한 작업이었어요._

## 이번 세션에서 남은 느낌

이번 작업은 완성작이라기보다는, maple uNion이 어떤 게임이 되어야 하는지 방향을 잡은 큰 프로토타입 패스였어요. 캐릭터 선택, 사냥, 자동전투, 성장, 강화, 장비 파밍, 유니온, 코디, 지형 QA까지 핵심 골격은 생겼어요.

그래도 아직 더 해야 할 게 많아요. 자동사냥이 더 사람처럼 움직여야 하고, 장비 드랍은 더 설레야 하고, 직업별 스킬 연출도 더 선명해져야 해요. 하지만 이번 세션을 지나면서 적어도 “숫자만 도는 방치형”이 아니라, 실제 필드에서 캐릭터가 움직이고, 아이템을 줍고, 장비를 강화하고, 여러 캐릭터를 키우는 방향은 분명해졌어요.

다음 개발에서는 사냥 효율 지표, 장비 비교 UX, 직업별 전투 연출, 그리고 모바일 화면에서 메뉴가 더 자연스럽게 접히는 부분을 우선으로 보고 싶어요. maple uNion은 결국 유니온 중심의 방치형 RPG니까, 켜둘수록 계정 전체가 조금씩 강해지는 감각을 더 잘 보여주는 쪽으로 다듬어갈 예정이에요.
