import { SITE, getPosts, postPath, findTranslation, isoDate } from "../lib/site";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function entry(loc, lastmod, alternates) {
  const links = alternates
    ? Object.entries(alternates)
        .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${esc(SITE + href)}"/>`)
        .join("\n")
    : "";
  return `  <url>\n    <loc>${esc(SITE + loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}${links ? "\n" + links : ""}\n  </url>`;
}

export async function GET() {
  const ko = (await getPosts("ko")).filter((p) => !p.data.draft);
  const en = (await getPosts("en")).filter((p) => !p.data.draft);
  const latest = (list) => (list.length ? isoDate(list[0].data.updated ?? list[0].data.date) : undefined);
  const home = { ko: "/", en: "/en/", "x-default": "/" };

  const urls = [entry("/", undefined, home), entry("/en/", undefined, home)];
  const blogAlt = ko.length && en.length ? { ko: "/blog/", en: "/en/blog/" } : undefined;
  if (ko.length) urls.push(entry("/blog/", latest(ko), blogAlt));
  if (en.length) urls.push(entry("/en/blog/", latest(en), blogAlt));

  for (const post of [...ko, ...en]) {
    const tr = await findTranslation(post);
    const alt = tr && !tr.data.draft
      ? Object.fromEntries([post, tr].map((p) => [p.id.startsWith("en/") ? "en" : "ko", postPath(p)]))
      : undefined;
    urls.push(entry(postPath(post), isoDate(post.data.updated ?? post.data.date), alt));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
