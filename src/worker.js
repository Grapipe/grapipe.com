// Serves the static site from ./public, redirects www to the apex domain,
// and sends visitors whose browser doesn't prefer Korean from "/" to "/en/".
const APEX = "grapipe.com";
const LANGS = ["ko", "en"];

const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "img-src 'self' data:",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self' mailto:",
    "frame-ancestors 'none'",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

function cookieLang(request) {
  const m = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)lang=(ko|en)\b/);
  return m ? m[1] : null;
}

// Highest-weighted of ko/en in Accept-Language. No header (e.g. crawlers) → ko.
// Any other language without ko ranked above en → en.
function preferredLang(request) {
  const header = request.headers.get("Accept-Language");
  if (!header) return "ko";
  let best = { lang: null, q: -1 };
  for (const part of header.split(",")) {
    const [tag, ...params] = part.trim().toLowerCase().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1;
    const primary = tag.split("-")[0];
    if (LANGS.includes(primary) && q > best.q) best = { lang: primary, q };
  }
  return best.lang === "ko" ? "ko" : "en";
}

function redirect(location, extraHeaders = {}) {
  return new Response(null, {
    status: 302,
    headers: { Location: location, "Cache-Control": "no-store", Vary: "Accept-Language, Cookie", ...extraHeaders },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }

    // Explicit choice from the language switch: remember it, then drop the query.
    const chosen = url.searchParams.get("lang");
    if (LANGS.includes(chosen)) {
      url.searchParams.delete("lang");
      return redirect(url.pathname + url.search + url.hash, {
        "Set-Cookie": `lang=${chosen}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`,
      });
    }

    const isRoot = url.pathname === "/" || url.pathname === "/index.html";
    if (isRoot && request.method === "GET") {
      const lang = cookieLang(request) || preferredLang(request);
      if (lang === "en") return redirect("/en/" + url.search);
    }

    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);
    if (isRoot) out.headers.set("Vary", "Accept-Language, Cookie");
    if (url.pathname.startsWith("/en/")) out.headers.set("Content-Language", "en");
    else if (out.headers.get("Content-Type")?.startsWith("text/html")) out.headers.set("Content-Language", "ko");
    return out;
  },
};
