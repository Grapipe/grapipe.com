import rss from "@astrojs/rss";
import { getPosts, postPath, T } from "../../../lib/site";

export async function GET(context) {
  const posts = (await getPosts("en")).filter((p) => !p.data.draft);
  return rss({
    title: "en" === "en" ? "Grapipe Blog" : "Grapipe 글",
    description: T["en"].blogIntro,
    site: context.site,
    customData: "<language>en</language>",
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: postPath(p),
      categories: p.data.tags,
    })),
  });
}
