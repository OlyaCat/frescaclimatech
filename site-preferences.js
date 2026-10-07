(function () {
  "use strict";

  var KEY = "fct_cookie_consent_v1";
  var GA = "G-47FC0D03XH";
  var GA_SRC = "https://www.googletagmanager.com/gtag/js?id=" + GA;
  var ADS = ["AW-17340076883", "AW-17385730363"];
  var state = { necessary: true, analytics: false, ads: false };
  var googleLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    if (googleLoaded) window.dataLayer.push(arguments);
  };

  function lang() {
    var l = (document.documentElement.lang || "es").toLowerCase();
    return l.indexOf("en") === 0 ? "en" : "es";
  }

  var copy = {
    es: {
      title: "Tu privacidad, tus preferencias",
      text: "Usamos cookies necesarias para que el sitio funcione. Con tu permiso, también podemos usar cookies de analítica y publicidad para medir el rendimiento y mejorar nuestras campañas.",
      accept: "Aceptar",
      reject: "Rechazar",
      settings: "Configurar",
      save: "Guardar preferencias",
      analytics: "Analítica",
      analyticsText: "Nos ayuda a entender cómo se utiliza la web.",
      ads: "Publicidad",
      adsText: "Nos ayuda a medir la eficacia de nuestras campañas.",
      necessary: "Necesarias",
      necessaryText: "Imprescindibles para el funcionamiento básico del sitio.",
      policy: "Política de cookies",
      reopen: "Cookies"
    },
    en: {
      title: "Your privacy, your preferences",
      text: "We use necessary cookies to make the site work. With your permission, we may also use analytics and advertising cookies to measure performance and improve our campaigns.",
      accept: "Accept",
      reject: "Reject",
      settings: "Settings",
      save: "Save preferences",
      analytics: "Analytics",
      analyticsText: "Helps us understand how the website is used.",
      ads: "Advertising",
      adsText: "Helps us measure the effectiveness of our campaigns.",
      necessary: "Necessary",
      necessaryText: "Required for the basic operation of the site.",
      policy: "Cookie Policy",
      reopen: "Cookies"
    }
  };

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && typeof v.analytics === "boolean" && typeof v.ads === "boolean") {
        state.analytics = v.analytics;
        state.ads = v.ads;
        return true;
      }
    } catch (e) {}
    return false;
  }

  function write() {
    localStorage.setItem(KEY, JSON.stringify({
      analytics: state.analytics,
      ads: state.ads,
      updated: new Date().toISOString()
    }));
  }

  function push() {
    window.dataLayer.push(arguments);
  }

  function loadGoogle() {
    if (googleLoaded || (!state.analytics && !state.ads)) return;
    googleLoaded = true;
    window.gtag = function () { window.dataLayer.push(arguments); };
    push("consent", "default", {
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: state.ads ? "granted" : "denied",
      ad_user_data: state.ads ? "granted" : "denied",
      ad_personalization: state.ads ? "granted" : "denied"
    });
    push("js", new Date());
    if (state.analytics) push("config", GA);
    if (state.ads) {
      ADS.forEach(function (id) { push("config", id); });
    }
    var s = document.createElement("script");
    s.async = true;
    s.src = state.analytics ? GA_SRC : "https://www.googletagmanager.com/gtag/js?id=" + ADS[0];
    s.onload = function () {
      if (state.ads) window.dispatchEvent(new CustomEvent("fct:ads-ready"));
      if (state.analytics) window.dispatchEvent(new CustomEvent("fct:analytics-ready"));
    };
    document.head.appendChild(s);
  }

  function clearOptionalCookies() {
    var names = document.cookie.split(";").map(function (c) { return c.split("=")[0].trim(); });
    names.forEach(function (n) {
      if (n.indexOf("_ga") === 0 || n.indexOf("_gcl") === 0 || n === "_gid" || n === "_gat") {
        document.cookie = n + "=; Max-Age=0; path=/; SameSite=Lax";
        document.cookie = n + "=; Max-Age=0; path=/; domain=." + location.hostname + "; SameSite=Lax";
      }
    });
  }

  function css() {
    if (document.getElementById("fct-cookie-style")) return;
    var s = document.createElement("style");
    s.id = "fct-cookie-style";
    s.textContent = "#fct-cookie{position:fixed;z-index:2147483646;left:20px;right:20px;bottom:20px;max-width:760px;margin:auto;background:#fffdf7;color:#171714;border:1px solid rgba(23,23,20,.16);box-shadow:0 18px 60px rgba(0,0,0,.18);padding:24px;font-family:Outfit,Arial,sans-serif}#fct-cookie h2{font-size:22px;margin:0 0 8px}#fct-cookie p{font-size:14px;line-height:1.55;margin:0 0 18px;color:#4d4a43}#fct-cookie .fct-actions{display:flex;gap:10px;flex-wrap:wrap}#fct-cookie button{font:inherit;font-weight:600;padding:11px 18px;border:1px solid #171714;background:#fffdf7;color:#171714;cursor:pointer}#fct-cookie .primary{background:#171714;color:#fffdf7}#fct-cookie a{color:inherit;text-underline-offset:3px}#fct-cookie .fct-settings{display:none;border-top:1px solid #ddd6c8;margin-top:18px;padding-top:8px}#fct-cookie .fct-row{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;padding:12px 0;border-bottom:1px solid #eee8dc}#fct-cookie .fct-row p{margin:3px 0 0}#fct-cookie input{width:20px;height:20px;accent-color:#171714}#fct-cookie-button{position:fixed;z-index:2147483645;left:14px;bottom:14px;border:1px solid rgba(23,23,20,.2);background:#fffdf7;color:#171714;border-radius:999px;padding:8px 12px;font:600 12px Outfit,Arial,sans-serif;cursor:pointer;box-shadow:0 5px 20px rgba(0,0,0,.1)}@media(max-width:600px){#fct-cookie{left:10px;right:10px;bottom:10px;padding:20px}#fct-cookie .fct-actions button{flex:1 1 30%}}";
    document.head.appendChild(s);
  }

  function render(show) {
    css();
    var l = lang(), t = copy[l];
    var old = document.getElementById("fct-cookie");
    if (old) old.remove();
    var box = document.createElement("div");
    box.id = "fct-cookie";
    box.innerHTML = '<h2>'+t.title+'</h2><p>'+t.text+' <a href="cookies.html">'+t.policy+'</a>.</p><div class="fct-actions"><button class="primary" data-a="accept">'+t.accept+'</button><button class="primary" data-a="reject">'+t.reject+'</button><button data-a="settings">'+t.settings+'</button></div><div class="fct-settings"><div class="fct-row"><div><strong>'+t.necessary+'</strong><p>'+t.necessaryText+'</p></div><input type="checkbox" checked disabled></div><div class="fct-row"><div><strong>'+t.analytics+'</strong><p>'+t.analyticsText+'</p></div><input id="fct-analytics" type="checkbox"></div><div class="fct-row"><div><strong>'+t.ads+'</strong><p>'+t.adsText+'</p></div><input id="fct-ads" type="checkbox"></div><div class="fct-actions" style="margin-top:14px"><button class="primary" data-a="save">'+t.save+'</button></div></div>';
    document.body.appendChild(box);
    box.querySelector("#fct-analytics").checked = state.analytics;
    box.querySelector("#fct-ads").checked = state.ads;
    box.addEventListener("click", function (e) {
      var target = e.target.closest ? e.target.closest("[data-a]") : e.target;
      var a = target && target.getAttribute ? target.getAttribute("data-a") : null;
      if (!a) return;
      if (a === "settings") box.querySelector(".fct-settings").style.display = "block";
      if (a === "accept") { state.analytics=true; state.ads=true; write(); box.remove(); loadGoogle(); }
      if (a === "reject") { state.analytics=false; state.ads=false; write(); clearOptionalCookies(); box.remove(); if(googleLoaded) location.reload(); }
      if (a === "save") {
        state.analytics=box.querySelector("#fct-analytics").checked;
        state.ads=box.querySelector("#fct-ads").checked;
        write(); if(!state.analytics && !state.ads) clearOptionalCookies();
        box.remove(); if(googleLoaded) location.reload(); else loadGoogle();
      }
    });
  }

  function boot() {
    var known = read();
    if (known) loadGoogle(); else render(true);
    css();
    var l=lang(), b=document.createElement("button");
    b.id="fct-cookie-button"; b.type="button"; b.textContent=copy[l].reopen;
    b.addEventListener("click", function(){ render(true); });
    document.body.appendChild(b);
    window.FCTConsent = { get: function(){ return Object.assign({}, state); }, open: function(){ render(true); } };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();