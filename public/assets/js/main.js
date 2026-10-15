(function () {
  "use strict";

  var EMAIL = "support@grapipe.com";
  var LANG = document.documentElement.lang === "en" ? "en" : "ko";
  var T = {
    ko: {
      menuOpen: "메뉴 열기", menuClose: "메뉴 닫기",
      copied: "복사했습니다", copy: "주소 복사", emailPrompt: "이메일 주소",
      subject: "[Grapipe 문의] ", type: "문의 유형: ", name: "이름/회사: ", reply: "회신 연락처: "
    },
    en: {
      menuOpen: "Open menu", menuClose: "Close menu",
      copied: "Copied", copy: "Copy address", emailPrompt: "Email address",
      subject: "[Grapipe inquiry] ", type: "Type: ", name: "Name/Company: ", reply: "Reply to: "
    }
  }[LANG];

  // Remember an explicit language choice so "/" stops auto-detecting.
  document.querySelectorAll("[data-set-lang]").forEach(function (a) {
    a.addEventListener("click", function () {
      document.cookie = "lang=" + a.getAttribute("data-set-lang") + "; Path=/; Max-Age=31536000; SameSite=Lax; Secure";
    });
  });

  // Header border on scroll
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? T.menuClose : T.menuOpen;
    nav.classList.toggle("open", open);
  }
  toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mark = document.querySelector(".flow-mark");
  if (reduce && mark && mark.pauseAnimations) mark.pauseAnimations();

  // The pipe: fill each section's rail up to a line just below mid-screen,
  // and light a section's node once the flow has reached it.
  var rails = Array.prototype.slice.call(document.querySelectorAll(".rail"));
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".node-mark"));
  var ticking = false;
  function updatePipe() {
    ticking = false;
    var anchor = window.innerHeight * 0.58;
    rails.forEach(function (rail) {
      var r = rail.getBoundingClientRect();
      var f = r.height ? (anchor - r.top) / r.height : 0;
      rail.style.setProperty("--fill", Math.max(0, Math.min(1, f)).toFixed(4));
    });
    nodes.forEach(function (node) {
      var r = node.getBoundingClientRect();
      node.classList.toggle("lit", r.top + r.height / 2 <= anchor);
    });
  }
  function requestPipe() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updatePipe); }
  }
  updatePipe();
  window.addEventListener("scroll", requestPipe, { passive: true });
  window.addEventListener("resize", requestPipe);

  // Copy email
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = btn.querySelector(".copy-label");
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.classList.add("done");
        label.textContent = T.copied;
        setTimeout(function () { btn.classList.remove("done"); label.textContent = T.copy; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt(T.emailPrompt, text); });
      } else {
        window.prompt(T.emailPrompt, text);
      }
    });
  });

  // Contact form -> composes a mail in the visitor's mail app
  var form = document.getElementById("contact-form");
  if (form) {
    var body = form.elements.body;
    var err = document.getElementById("f-body-error");
    body.addEventListener("input", function () {
      if (body.value.trim()) { body.classList.remove("invalid"); err.hidden = true; }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var type = form.elements.type.value;
      var name = form.elements.name.value.trim();
      var reply = form.elements.reply.value.trim();
      var text = body.value.trim();
      if (!text) {
        body.classList.add("invalid");
        err.hidden = false;
        body.focus();
        return;
      }
      var subject = T.subject + type + (name ? " — " + name : "");
      var lines = [
        T.type + type,
        T.name + (name || "-"),
        T.reply + (reply || "-"),
        "",
        text
      ];
      window.location.href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
