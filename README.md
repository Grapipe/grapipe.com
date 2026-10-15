# grapipe.com

Grapipe 브랜드 웹사이트. 정적 HTML/CSS/JS를 Cloudflare Workers(Static Assets)로 배포합니다.

## 구조

```
public/            배포되는 정적 파일 (index.html, 404.html, assets/, 파비콘, og-image.jpg ...)
src/worker.js      www → apex 301 리다이렉트 + 보안 헤더, 나머지는 public/ 에서 서빙
wrangler.jsonc     Worker 설정 (이름: grapipe-site, 커스텀 도메인 grapipe.com / www.grapipe.com)
brand-assets/      원본 브랜드 에셋 (배포되지 않음)
```

빌드 단계는 없습니다. `public/` 안의 파일을 직접 수정하면 됩니다.

## 로컬 미리보기

```bash
npx wrangler dev          # Worker 포함 (http://localhost:8787)
# 또는
python3 -m http.server 8787 -d public
```

## 배포

```bash
npx wrangler login        # 최초 1회
npx wrangler deploy
```

GitHub 푸시마다 자동 배포하려면 Cloudflare 대시보드 → Workers & Pages → `grapipe-site` → Settings → Builds 에서
이 저장소를 연결하세요 (Build command 비움, Deploy command `npx wrangler deploy`).

## 브랜드 규칙 요약

- 색: Deep Grape `#1F1631`(배경), Grape Purple `#7A4FC6`(강조·버튼), Lavender Mist `#F4F0FA`(텍스트)
- 어두운 배경에서는 `white` 로고 사용. Grape Purple은 어두운 배경 위 본문 텍스트에 쓰지 않음(대비 3.09:1)
- 서체: Outfit(영문) + Pretendard(한글)
- 자세한 내용은 `brand-assets/README.md`
