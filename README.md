# Personal Blog Starter

`blog.nimdal.xyz` 같은 분위기의 개인 기술 블로그를 빠르게 시작할 수 있도록 만든 Astro 기반 스타터입니다.

## 시작하기

```bash
npm install
npm run dev
```

개발 서버는 `http://localhost:4321` 에서 열립니다.

## CMS 에디터

배포 후 `/admin` 경로에서 Decap CMS 에디터를 사용할 수 있습니다.

- 프로덕션 에디터: `https://blog.nimdal.xyz/admin`
- 업로드 파일 저장 위치: `public/uploads`
- 글 원본 저장 위치: `src/content/posts`

### Vercel 환경 변수

Vercel 프로젝트에 아래 환경 변수를 추가해야 GitHub 로그인과 저장이 동작합니다.

```bash
GITHUB_OAUTH_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_github_oauth_app_client_secret
GITHUB_OAUTH_SCOPE=public_repo
```

공개 저장소가 아니라면 `GITHUB_OAUTH_SCOPE=repo`를 사용해야 합니다.

### GitHub OAuth App 설정

GitHub `Settings > Developer settings > OAuth Apps > New OAuth App`에서 아래처럼 등록합니다.

- Homepage URL: `https://blog.nimdal.xyz`
- Authorization callback URL: `https://blog.nimdal.xyz/callback`

GitHub 문서상 OAuth App은 하나의 callback URL만 가질 수 있으므로, CMS 로그인은 프로덕션 도메인을 기준으로 설정하는 편이 안전합니다.

## 수정 포인트

- 사이트 기본 정보: `src/config.ts`
- 홈/소개 페이지: `src/pages/index.astro`, `src/pages/about.astro`
- 블로그 글: `src/content/posts/*.md`
- 전체 스타일: `src/styles/global.css`
