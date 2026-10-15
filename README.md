# grapipe.com

Grapipe 브랜드 웹사이트. 정적 HTML/CSS/JS를 Cloudflare Workers(Static Assets)로 배포합니다.

## 구조

```
src/pages/          페이지 (index.astro = 한국어 홈, en/index.astro = 영어 홈, blog/, en/blog/, sitemap.xml, 404)
src/content/blog/   블로그 글 (Markdown) — 쓰는 법은 docs/writing.md
src/components/     헤더, 푸터, 블로그 목록/글 템플릿
src/lib/site.ts     공통 설정과 문구 (메뉴 노출 기준 BLOG_NAV_MIN_POSTS 등)
public/             그대로 복사되는 파일 (CSS, JS, 로고, 파비콘, og-image, robots.txt)
worker/index.js     www → apex 301, 언어 감지(/ → /en/), 보안 헤더, 나머지는 dist/ 에서 서빙
wrangler.jsonc      Worker 설정 (이름: grapipe-site, 커스텀 도메인 grapipe.com / www.grapipe.com)
brand-assets/       원본 브랜드 에셋 (배포되지 않음)
```

Astro로 `dist/` 에 정적 HTML을 만들고, Cloudflare Worker가 그 파일을 서빙합니다.

## 언어

- 한국어 `/`, 영어 `/en/`. 홈 문구를 바꾸면 두 파일을 함께 고치세요 (JSON-LD의 FAQ 포함).
- `/` 접속 시: `lang` 쿠키가 있으면 그 언어, 없으면 `Accept-Language`에서 ko가 en보다 우선이 아니면 `/en/`으로 302.
  헤더가 없는 요청(검색 로봇)은 한국어 그대로 → 두 페이지 모두 색인됩니다.
- 헤더의 언어 버튼은 `?lang=ko|en` 으로 이동 → Worker가 쿠키를 저장하고 깨끗한 주소로 리다이렉트.

## 개발

```bash
npm install
npm run dev        # Astro 개발 서버 (draft 글 포함)
npm run build      # dist/ 생성
npm run preview    # 빌드 결과를 실제 Worker로 로컬 실행 (wrangler dev)
```

## 배포

Cloudflare Workers Builds가 GitHub 푸시마다 빌드·배포합니다.
대시보드 → Workers & Pages → `grapipe-site` → Settings → Builds 에서 이 저장소 연결:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

수동 배포: `npx wrangler login` 후 `npm run deploy`.

## 브랜드 규칙 요약

- 색: Deep Grape `#1F1631`(배경), Grape Purple `#7A4FC6`(강조·버튼), Lavender Mist `#F4F0FA`(텍스트)
- 어두운 배경에서는 `white` 로고 사용. Grape Purple은 어두운 배경 위 본문 텍스트에 쓰지 않음(대비 3.09:1)
- 서체: Outfit(영문) + Pretendard(한글)
- 자세한 내용은 `brand-assets/README.md`
