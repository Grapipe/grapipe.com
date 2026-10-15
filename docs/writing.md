# 블로그 글 쓰기

## 새 글 만들기

1. `src/content/blog/ko/` 에 파일을 만듭니다. 파일 이름이 주소가 됩니다.
   - `src/content/blog/ko/local-llm-hardware.md` → `https://grapipe.com/blog/local-llm-hardware/`
   - 영어 글은 `src/content/blog/en/` → `https://grapipe.com/en/blog/...`
   - 이미지를 함께 쓰려면 폴더로 만듭니다: `src/content/blog/ko/local-llm-hardware/index.md` 옆에 `diagram.png` 를 두고 본문에서 `![설명](./diagram.png)` (자동으로 최적화됩니다)
2. 맨 위에 아래 정보를 적습니다.

```markdown
---
title: "사내 문서용 로컬 LLM, 어떤 PC면 충분할까"
description: "검색 결과와 링크 미리보기에 나오는 1~2문장 요약. 120자 안팎."
date: 2026-10-20
updated: 2026-11-02        # 선택. 내용을 고쳤을 때
tags: ["로컬 AI", "LLM"]   # 선택
translationKey: local-llm-hardware   # 선택. 한/영 두 버전을 같은 값으로 연결
draft: true                # 다 쓰기 전까지 true. 게시할 때 지우거나 false
---

본문은 Markdown으로 씁니다. 소제목은 ## 부터 쓰세요 (# 는 제목이 자동으로 들어갑니다).
```

3. GitHub에 올리면 Cloudflare가 자동으로 빌드·배포합니다 (Workers Builds 연결 후).
   GitHub 웹에서 바로 파일을 만들어도 됩니다: 저장소 → `src/content/blog/ko` → Add file → Create new file.

## 자동으로 처리되는 것

- 글 목록 `/blog/`, RSS `/blog/rss.xml`, 사이트맵 `/sitemap.xml`
- 검색엔진용 정보 (canonical, BlogPosting 구조화 데이터, 링크 미리보기)
- `translationKey` 가 같은 한/영 글은 서로 hreflang으로 연결되고, 언어 전환 버튼이 번역본으로 이동
- 한 언어의 게시된 글이 3편 이상이 되면 메뉴에 "글"과 홈의 "최근 글"이 나타납니다 (`src/lib/site.ts` 의 `BLOG_NAV_MIN_POSTS`)

## 미리보기

```bash
npm install
npm run dev        # http://localhost:4321  (draft 글도 보임)
```
