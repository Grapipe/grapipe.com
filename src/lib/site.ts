import { getCollection, type CollectionEntry } from "astro:content";

export const SITE = "https://grapipe.com";
export const EMAIL = "support@grapipe.com";

// The blog link appears in the menu (and recent posts on the home page)
// once a language has at least this many published posts.
export const BLOG_NAV_MIN_POSTS = 3;

export type Lang = "ko" | "en";
export type Post = CollectionEntry<"blog">;

export const langOf = (post: Post): Lang => (post.id.startsWith("en/") ? "en" : "ko");
export const slugOf = (post: Post) => post.id.split("/").slice(1).join("/");
export const blogBase = (lang: Lang) => (lang === "en" ? "/en/blog/" : "/blog/");
export const homePath = (lang: Lang) => (lang === "en" ? "/en/" : "/");
export const postPath = (post: Post) => `${blogBase(langOf(post))}${slugOf(post)}/`;

// Drafts show up in `npm run dev` only.
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection("blog", (p: Post) => langOf(p) === lang && (import.meta.env.DEV || !p.data.draft));
  return all.sort((a: Post, b: Post) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function findTranslation(post: Post): Promise<Post | undefined> {
  const key = post.data.translationKey;
  if (!key) return undefined;
  const other: Lang = langOf(post) === "ko" ? "en" : "ko";
  return (await getPosts(other)).find((p) => p.data.translationKey === key);
}

export const formatDate = (d: Date, lang: Lang) =>
  lang === "en"
    ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" })
    : d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const T = {
  ko: {
    skip: "본문으로 건너뛰기",
    home: "Grapipe 홈",
    menuOpen: "메뉴 열기",
    mainMenu: "주요 메뉴",
    nav: { services: "할 수 있는 일", process: "진행 방식", principles: "일하는 원칙", faq: "자주 묻는 질문", blog: "글" },
    contact: "문의하기",
    switchLabel: "EN",
    footerTag: "개인 개발자 브랜드",
    blogTitle: "글",
    blogIntro: "작업하면서 알게 된 것, 자주 받는 질문에 대한 답을 정리합니다.",
    blogEmpty: "아직 올라온 글이 없습니다. 첫 글을 준비하고 있습니다.",
    allPosts: "글 목록",
    updated: "수정",
    readTranslation: "Read in English",
    recentPosts: "최근 글",
    morePosts: "글 더 보기",
    ctaTitle: "비슷한 일이 필요하신가요?",
    ctaBody: "지금 상황을 메일로 알려주시면, 할 수 있는 일과 어려운 일을 먼저 구분해 답장드립니다.",
    ctaButton: "문의하기",
    draft: "초안 (게시되지 않음)",
    notFoundTitle: "이 경로는 어디로도 이어지지 않아요.",
  },
  en: {
    skip: "Skip to content",
    home: "Grapipe home",
    menuOpen: "Open menu",
    mainMenu: "Main menu",
    nav: { services: "Services", process: "Process", principles: "Principles", faq: "FAQ", blog: "Blog" },
    contact: "Contact",
    switchLabel: "한국어",
    footerTag: "Independent developer",
    blogTitle: "Blog",
    blogIntro: "Notes from the work, and answers to questions I get often.",
    blogEmpty: "No posts yet. The first one is on its way.",
    allPosts: "All posts",
    updated: "Updated",
    readTranslation: "한국어로 읽기",
    recentPosts: "Recent posts",
    morePosts: "More posts",
    ctaTitle: "Need something like this?",
    ctaBody: "Email me where things stand. I'll first sort out what I can and can't do, then reply.",
    ctaButton: "Get in touch",
    draft: "Draft (not published)",
    notFoundTitle: "This path doesn't lead anywhere.",
  },
} as const;
