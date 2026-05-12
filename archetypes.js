/* ============================================================
   ARCHETYPE SYSTEM
   Maps any input domain to a Y2K archetype + brand-tinted palette,
   then renders a template that matches the brand's vibe.
   Loaded BEFORE script.js so all of its exports are available.
   ============================================================ */

/* ============================================================
   WAYBACK MACHINE INTEGRATION
   If a real year-2000 snapshot exists, we'd rather show that
   than a generated take. Query the availability API first.
   ============================================================ */

// Per-session cache so re-rendering the same domain doesn't refetch.
const __waybackCache = {};

// Curated list of well-known brands with VERIFIED mid-2000 Wayback snapshots.
// Each entry is [timestamp, original_url]. We hit this map FIRST so the
// network is never on the critical path for these brands. Timestamps below
// were verified live against the CDX API as returning a 200 in the target
// window. When adding entries, query:
//   curl 'https://web.archive.org/cdx/search/cdx?url=DOMAIN&from=20000301&to=20000931&filter=statuscode:200&limit=3&output=json'
// and copy a real timestamp + original from a 200 row.
const KNOWN_Y2K_DOMAINS = {
  'petco.com':        ['20000301212032', 'http://petco.com:80/'],
  'pets.com':         ['20000301122742', 'http://www.pets.com:80/'],
  'aol.com':          ['20000301160137', 'http://www.aol.com:80/'],
  'geocities.com':    ['20000918093706', 'http://www.geocities.com:80/'],
  'yahoo.com':        ['20000601142434', 'http://www.yahoo.com:80/'],
  'napster.com':      ['20000407210312', 'http://www1.napster.com:80/'],
  'google.com':       ['20000619010423', 'http://www.google.com:80/'],
  // figma.com domain was parked in 2000 but it's an unrelated landing page,
  // the actual Figma brand didn't exist. Same for chewy, notion, spotify
  // (founded 2006/2013/2011/2012). Mark these as known-no-y2k so we skip the
  // race and go straight to live enrichment.
};
const KNOWN_NO_Y2K = new Set([
  'figma.com', 'chewy.com', 'notion.com', 'notion.so', 'spotify.com',
  'instagram.com', 'tiktok.com', 'snapchat.com', 'discord.com', 'slack.com',
  'zoom.us', 'airbnb.com', 'uber.com', 'lyft.com', 'doordash.com',
  'ubereats.com', 'venmo.com', 'cashapp.com', 'robinhood.com', 'coinbase.com',
  'shein.com', 'temu.com', 'roblox.com', 'twitch.tv', 'linear.app',
  'vercel.com', 'supabase.com', 'openai.com', 'anthropic.com', 'perplexity.ai',
  'ramp.com', 'brex.com', 'mercury.com', 'stripe.com', 'shopify.com',
  'wayfair.com', 'pinterest.com', 'reddit.com', 'lululemon.com', 'peloton.com',
]);

// Pack a timestamp + original URL into our standard snapshot object.
function __wbResult(ts, orig) {
  const iframeUrl = `https://web.archive.org/web/${ts}if_/${orig}`;
  const viewUrl   = `https://web.archive.org/web/${ts}/${orig}`;
  const yyyy = ts.slice(0,4), mm = ts.slice(4,6), dd = ts.slice(6,8);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const displayDate = `${months[Math.max(0,parseInt(mm,10)-1)]} ${parseInt(dd,10)}, ${yyyy}`;
  return { available: true, iframeUrl, viewUrl, timestamp: ts, displayDate };
}

// fetch-with-timeout helper.
async function __fetchWith(url, ms) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(tid);
    return res;
  } catch (e) {
    clearTimeout(tid);
    throw e;
  }
}

async function lookupWayback(domain) {
  const key = String(domain || '').toLowerCase().replace(/^www\./, '');
  if (__waybackCache[key]) return __waybackCache[key];

  // Strategy 0: curated list of famous brands with hand-picked snapshots.
  // This means petco/yahoo/amazon/cnn etc. show up INSTANTLY with zero
  // network risk. Filter out post-Y2K timestamps (some entries record
  // "earliest snapshot exists" but it's not actually 2000 era).
  const curated = KNOWN_Y2K_DOMAINS[key];
  if (curated) {
    const [ts, orig] = curated;
    const result = __wbResult(ts.length >= 14 ? ts : (ts + '000000').slice(0,14), orig);
    __waybackCache[key] = result;
    return result;
  }

  // Explicit short-circuit: brands that didn't exist in 2000. We could let the
  // CDX call run and reject naturally, but that wastes seconds and risks
  // false positives (e.g. domain was parked then).
  if (KNOWN_NO_Y2K.has(key)) {
    __waybackCache[key] = { available: false, reason: 'known-no-y2k' };
    return __waybackCache[key];
  }

  // Strategy A: CDX via corsproxy.io. Returns ALL year-2000 snapshots so we
  // can pick the one closest to mid-2000.
  // Strategy B: Wayback Availability API direct (CORS-friendly), asking for the
  // closest snapshot to 20000615.
  // Strategy C: CDX via allorigins (raw passthrough). A second working proxy
  // gives us redundancy against single-provider rate limits.
  // We race them all: whichever responds first with a usable result wins.
  const cdxBare = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(key)}&from=19990101&to=20011231&filter=statuscode:200&limit=25&output=json`;
  const cdxViaCorsProxyIo  = `https://corsproxy.io/?${encodeURIComponent(cdxBare)}`;
  const cdxViaAllOrigins   = `https://api.allorigins.win/raw?url=${encodeURIComponent(cdxBare)}`;
  const availBare          = `https://archive.org/wayback/available?url=${encodeURIComponent(key)}&timestamp=20000615`;

  function pickBestCdx(rows) {
    if (!Array.isArray(rows) || rows.length < 2) throw new Error('cdx empty');
    const target = 20000615000000;
    let best = null, bestDist = Infinity;
    for (const r of rows.slice(1)) {
      const ts = r[1]; if (!ts || ts.length < 8) continue;
      const tsNum = parseInt(ts.padEnd(14,'0'), 10);
      const d = Math.abs(tsNum - target);
      if (d < bestDist) { bestDist = d; best = r; }
    }
    if (!best) throw new Error('cdx no 2000 row');
    return __wbResult(best[1], best[2]);
  }

  async function tryCdxViaProxy(url) {
    const res = await __fetchWith(url, 7000);
    if (!res.ok) throw new Error('cdx http ' + res.status);
    const rows = await res.json();
    return pickBestCdx(rows);
  }

  async function tryAvailability() {
    const res = await __fetchWith(availBare, 7000);
    if (!res.ok) throw new Error('avail http ' + res.status);
    const j = await res.json();
    const c = j && j.archived_snapshots && j.archived_snapshots.closest;
    if (!c || !c.available || !c.timestamp || !c.url) throw new Error('avail no snapshot');
    const ts = c.timestamp;
    const yr = parseInt(ts.slice(0,4), 10);
    if (yr < 1999 || yr > 2001) throw new Error('avail year ' + yr + ' out of range');
    const m = c.url.match(/\/web\/\d+\/(.+)$/);
    const orig = m ? m[1] : `http://${key}/`;
    return __wbResult(ts, orig);
  }

  // Race three strategies. If all reject, no snapshot available.
  try {
    const winner = await Promise.any([
      tryCdxViaProxy(cdxViaCorsProxyIo),
      tryCdxViaProxy(cdxViaAllOrigins),
      tryAvailability(),
    ]);
    __waybackCache[key] = winner;
    return winner;
  } catch (e) {
    __waybackCache[key] = { available: false, error: String(e) };
    return __waybackCache[key];
  }
}

// Render a real Wayback snapshot inside our IE5 chrome.
// Loads as iframe; if it fails within 3s, swaps in a fallback card.
function renderWaybackSnapshot(domain, wb, profile) {
  const p = (profile && profile.palette) || { primary:'#003399', secondary:'#000000', accent:'#ffffff', displayName: domain };
  const displayName = (profile && profile.displayName) || domain;
  const frameId = 'wb-frame-' + Math.random().toString(36).slice(2,8);
  const fallbackId = 'wb-fallback-' + frameId;

  return `
  <div style="background:${p.accent}; min-height:100vh; padding-bottom:90px; color:${p.secondary}; font-family:'Times New Roman',serif;">

    <!-- Marquee in brand colors -->
    <marquee scrollamount="6" style="background:${p.primary}; color:${p.accent}; font-family:'Courier New',monospace; padding:4px 0; font-size:13px; border-bottom:2px ridge ${p.secondary};">
      &#10024; WELCOME TO ${displayName.toUpperCase()} &#10024; LAST UPDATED ${wb.displayDate.toUpperCase()} &#10024; Y2K COMPLIANT &#10024; BEST VIEWED IN NETSCAPE 4 OR IE5 AT 800x600 &#10024; BOOKMARK US WITH CTRL+D &#10024;
    </marquee>

    <!-- The real snapshot, in an iframe. Loading splash sits behind the iframe
         so users see something while Wayback responds. -->
    <div style="position:relative; background:#fff; max-width:1100px; margin:14px auto 0; border:2px inset ${p.secondary}; box-shadow:0 0 0 1px ${p.primary}; min-height:520px;">
      <div id="${frameId}-splash" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:14px; padding:24px; text-align:center; font-family:'Times New Roman',serif; color:${p.secondary};">
        <div style="width:48px; height:48px; border:4px solid ${p.primary}40; border-top-color:${p.primary}; border-radius:50%; animation:wb-spin 0.9s linear infinite;"></div>
        <div style="font-size:16px;"><b>Dialing the archive...</b></div>
        <div style="font-size:12px; color:${p.secondary}99;">Fetching the ${wb.displayDate} snapshot from web.archive.org</div>
      </div>
      <style>@keyframes wb-spin { to { transform: rotate(360deg); } }</style>
      <iframe id="${frameId}"
              src="${wb.iframeUrl}"
              data-wb-fallback="${fallbackId}"
              data-wb-splash="${frameId}-splash"
              onload="this.dataset.wbLoaded='1';var s=document.getElementById(this.dataset.wbSplash);if(s)s.style.display='none';"
              style="position:relative; width:100%; height:calc(100vh - 220px); min-height:520px; border:0; background:#fff; display:block;"
              referrerpolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              loading="eager"></iframe>
      <div id="${fallbackId}" style="display:none; padding:60px 24px; text-align:center; font-family:Verdana,sans-serif;">
        <div style="font-size:48px; line-height:1; margin-bottom:16px;">&#10024;</div>
        <h2 style="margin:0 0 10px; font-family:'Times New Roman',serif; color:${p.primary}; font-size:24px;">The archive is being slow today.</h2>
        <p style="margin:0 0 18px; color:${p.secondary}; font-size:14px;">A real ${wb.displayDate} snapshot of <b>${displayName}</b> exists, but the Wayback Machine didn't load it in time.</p>
        <a href="${wb.viewUrl}" target="_blank" style="display:inline-block; padding:12px 28px; background:${p.primary}; color:${p.accent}; text-decoration:none; font-family:Verdana; font-size:14px; font-weight:bold; border:3px outset ${p.primary};">VIEW ON ARCHIVE.ORG &rarr;</a>
      </div>
    </div>

    <!-- Footer bar with Ramp tag + restart -->
    <div style="max-width:1100px; margin:14px auto 0; padding:10px 14px; border-top:1px solid ${p.secondary}40; font-family:Verdana,sans-serif; font-size:11px; color:${p.secondary}; text-align:center;">
      ${window.bestViewedBadge ? window.bestViewedBadge() : ''}
      <div style="margin-top:8px;">${window.footerTag ? window.footerTag() : ''}</div>
      <div style="margin-top:10px;">
        <button data-restart style="background:${p.primary}; border:3px outset ${p.primary}; color:${p.accent}; padding:5px 16px; font-family:Verdana; font-size:11px; font-weight:bold;">[ Y2K-ify another &raquo; ]</button>
      </div>
    </div>

    ${window.rampPopupReSpawn ? window.rampPopupReSpawn('wayback-popup') : ''}
  </div>`;
}

// Call after the snapshot HTML has been injected into the DOM. Watches the
// iframe for a 10s load timeout (or error) and swaps to the fallback card.
// Wayback can be slow, so we give it real time before giving up.
function wireWaybackFallback(root) {
  const frames = (root || document).querySelectorAll('iframe[data-wb-fallback]');
  frames.forEach((f) => {
    const fb = document.getElementById(f.dataset.wbFallback);
    const splash = f.dataset.wbSplash ? document.getElementById(f.dataset.wbSplash) : null;
    if (!fb) return;
    f.addEventListener('error', () => {
      f.style.display = 'none';
      if (splash) splash.style.display = 'none';
      fb.style.display = 'block';
    });
    setTimeout(() => {
      if (f.dataset.wbLoaded !== '1') {
        f.style.display = 'none';
        if (splash) splash.style.display = 'none';
        fb.style.display = 'block';
      }
    }, 10000);
  });
}

window.lookupWayback = lookupWayback;
window.renderWaybackSnapshot = renderWaybackSnapshot;
window.wireWaybackFallback = wireWaybackFallback;

/* ============================================================
   LIVE SITE LOOKUP
   For domains with no Y2K snapshot, we pull real assets from
   their CURRENT site, then style those into a Y2K render. So the
   user still sees their actual nav links, copy, and product imagery,
   just dressed up like it's 1999.

   We use Jina Reader (https://r.jina.ai/) which returns either
   markdown or raw HTML and supports CORS. Some sites (Petco, Chewy,
   Amazon) block bots and return nothing; those domains almost always
   have a Wayback snapshot anyway.
   ============================================================ */

const __liveCache = {};

// Best-effort "shorten a long nav label to something nav-y".
// Examples:
//   "Notion Your AI workspace" → "Notion"
//   "Notion Calendar" → "Notion Calendar" (already nav-y)
//   "Knowledge Base Centralize your knowledge" → "Knowledge Base"
//   "Sale up to 70% off" → "Sale"
//   "AI Meeting Notes Perfectly written by AI" → "AI Meeting Notes"
//   "Wet & Dry Cat Food" → "Wet & Dry Cat Food" (already nav-y)
function __shortenNavLabel(raw) {
  let s = String(raw || '').trim();
  if (!s) return null;
  // Strip trailing emoji / arrows / pricing-y noise (with or without leading whitespace).
  s = s.replace(/\s*(→|↑|↓|←|»|«|➜|➡|➞|>+)\s*$/g, '').trim();
  s = s.replace(/\s*\(\d+\)\s*$/, '').trim();
  // Drop common verbose suffixes after a separator.
  s = s.replace(/\s*[—–\-:·\|]\s*(centralize|your\s|the\s|a\s|an\s).*$/i, '').trim();

  // Core heuristic: nav labels are short capitalized noun phrases. Take the
  // initial run of words where each word is either Capitalized/numeric/symbol
  // (Title Case) OR a connective (of/and/the/for/to/in/on/&).
  // The moment we hit a lowercase "verby" word (your, automate, perfectly,
  // simple, find, centralize, get, etc) we cut. That turns
  // "Knowledge Base Centralize your knowledge" → "Knowledge Base"
  // "Notion Your AI workspace" → "Notion"
  // "AI Meeting Notes Perfectly written by AI" → "AI Meeting Notes".
  const words = s.split(/\s+/);
  const connective = /^(of|and|the|for|to|in|on|with|by|de|la|le|du|et|&)$/i;
  // Product-page tagline verbs that come AFTER a nav label. When we see one
  // we stop — even if it's capitalized. This is how we cut "Knowledge Base
  // Centralize your knowledge" → "Knowledge Base", and "Agents Automate
  // busywork" → "Agents", and "AI Meeting Notes Perfectly written by AI" →
  // "AI Meeting Notes".
  const taglineVerb = /^(centralize|automate|automating|perfectly|simple|simply|smart|smarter|find|search|create|build|builds|design|designs|designed|connect|connects|manage|manages|managing|protect|secure|safe|translate|illustrate|produce|publish|prompt|explore|collaborate|co-create|get|gets|getting|translate|streamline|deliver|delivers|delight|delights|empower|empowers|run|runs|running|grow|grows|growing|all-in-one|everywhere|anywhere|everyone|anytime|together|fast|faster|fastest|free|new|best|trusted|loved|powered|powering|now|today|introducing|meet|works?|working|drive|drives|driving|launch|launches|launching|save|saves|saving|spend|spending)\b/i;
  const capish = (w) => /^[A-Z0-9&!\-]/.test(w) || /^(iPhone|iPad|iMac|iOS|macOS|tvOS|watchOS|eCommerce)$/.test(w);
  const cap = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (cap.length >= 4) break;
    // Stop on tagline verbs even if capitalized.
    if (cap.length > 0 && taglineVerb.test(w)) break;
    // Allow a connective only if there's another capish word after it.
    if (connective.test(w)) {
      const next = words[i + 1];
      if (next && capish(next) && !taglineVerb.test(next)) { cap.push(w); continue; }
      break;
    }
    if (capish(w)) { cap.push(w); continue; }
    break;
  }
  if (cap.length >= 1) s = cap.join(' ');

  // Strip trailing connectives ("Notion AI AI" → "Notion AI"; also "Mail and" → "Mail")
  while (true) {
    const tail = s.split(/\s+/);
    if (tail.length <= 1) break;
    const last = tail[tail.length - 1];
    if (connective.test(last)) { s = tail.slice(0, -1).join(' '); continue; }
    // Collapse "Notion AI AI" → "Notion AI" (immediate duplicate)
    if (tail.length >= 2 && tail[tail.length - 1].toLowerCase() === tail[tail.length - 2].toLowerCase()) {
      s = tail.slice(0, -1).join(' ');
      continue;
    }
    break;
  }

  // Cap absolute length.
  if (s.length > 32) {
    const cut = s.slice(0, 32);
    const lastSpace = cut.lastIndexOf(' ');
    s = lastSpace > 12 ? cut.slice(0, lastSpace) : cut;
  }
  s = s.replace(/[^\S ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length < 2) return null;
  // Final sanity: reject pure brand-prefix repeats like "Figma" / "Notion"
  // when they're identical to a noisy single token (we still allow them in
  // case they're the only thing, but downstream dedup will drop duplicates).
  return s;
}

// Compose a guaranteed-non-empty enrichment object for blocked / failed
// fetches, so downstream templates still get a logo image + reasonable
// title even when bot-protection wins. The logo via Google s2 works for
// virtually any HTTPS-reachable domain.
function __blockedFallback(key) {
  const display = key.split('.')[0].replace(/(^|\s)\w/g, m => m.toUpperCase());
  // 128px favicon for hero. Google's s2 service is permissive and CORS-clean.
  const logo = `https://www.google.com/s2/favicons?domain=${key}&sz=128`;
  return {
    available: true,
    blocked: true,
    title: display,
    description: null,
    navLabels: [],
    productImages: [{ url: logo, alt: display + ' logo' }],
  };
}

async function lookupLiveSite(domain) {
  const key = String(domain || '').toLowerCase();
  if (__liveCache[key]) return __liveCache[key];

  const target = `https://${key}`;
  const url = `https://r.jina.ai/${target}`;

  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) {
      __liveCache[key] = __blockedFallback(key);
      return __liveCache[key];
    }
    const text = await res.text();
    if (text.includes('Target URL returned error') || text.includes('CAPTCHA') || text.length < 200) {
      __liveCache[key] = __blockedFallback(key);
      return __liveCache[key];
    }

    // ---- Parse the Jina Reader response ----
    // Block 1: Title (single line)
    const titleMatch = text.match(/^Title:\s*(.+?)$/m);
    const title = titleMatch ? titleMatch[1].trim().slice(0, 120) : null;

    // Block 2: Markdown body (after "Markdown Content:")
    const bodyMatch = text.split(/Markdown Content:\s*/);
    const body = bodyMatch.length > 1 ? bodyMatch.slice(1).join('Markdown Content:') : text;

    // Description: find the best hero tagline-ish line. We score candidate
    // lines and pick the highest. Score rewards length 40-200, presence of
    // brand-ish marketing words ("workspace", "platform", "design", "build",
    // "music", "shop"), and penalizes time-sensitive banners ("register
    // today", "may 13", "black friday"), cookie / consent text, and copy
    // dominated by URLs.
    let description = null;
    const lines = body.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const candidates = [];
    for (const line of lines) {
      if (/^[#>!]/.test(line)) continue;
      if (/^\[/.test(line) && /\]\(/.test(line) && line.match(/\]\(/g).length === 1) continue; // pure single link
      if (/^!\[/.test(line)) continue; // image
      const plain = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/!\[[^\]]*\]\([^)]+\)/g, '').trim();
      if (plain.length < 30 || plain.length > 280) continue;
      let score = 0;
      // Length sweet spot
      if (plain.length >= 50 && plain.length <= 160) score += 10;
      else if (plain.length >= 40 && plain.length <= 200) score += 5;
      // Marketing-y words
      if (/\b(workspace|platform|design|build|create|shop|discover|music|video|stream|store|library|community|free|powerful|simple|fast|all[- ]in[- ]one|everything|everyone|anywhere|together|productivity|productive|trusted|world|leading|complete|modern|premium|millions?|billions?|professional|business|customers?|teams?)\b/i.test(plain)) score += 6;
      // Penalize banners / dated promos
      if (/\b(register today|register now|sign up today|may \d|june \d|july \d|jan(uary)? \d|feb(ruary)? \d|mar(ch)? \d|apr(il)? \d|aug(ust)? \d|sep(t|tember)? \d|oct(ober)? \d|nov(ember)? \d|dec(ember)? \d|coming soon|new!?|black friday|cyber monday|labor day|memorial day|early access|beta|launch event|webinar|live now|join us)\b/i.test(plain)) score -= 8;
      // Penalize cookie / consent / legal text
      if (/\b(cookies?|consent|gdpr|privacy policy|terms of (use|service)|all rights reserved|we use|by clicking|essential cookies|tracking technologies)\b/i.test(plain)) score -= 12;
      // Penalize copy that's mostly UI chrome
      if (/\b(developers?:|note:|disclaimer:|press release|earnings call|read more|see more|view all|browse all|all categories)\b/i.test(plain)) score -= 6;
      // Penalize copy that's mostly numbers / pricing / pricing-table fragments
      // ("Team size Monthly savings$340 Annual savings$4,080")
      const digits = (plain.match(/[\d$%]/g) || []).length;
      if (digits > 6) score -= 8;
      if (/\$\d/.test(plain)) score -= 6;
      // Penalize jammed-together text (suggests stripped tags / pricing widgets)
      if (/[a-zA-Z]\$|[a-z][A-Z]/.test(plain) && plain.split(/\s+/).length < 10) score -= 4;
      // Penalize "capitalized word soup" — long runs of single-word
      // capitalized tokens with no sentence punctuation. Pattern hit by
      // Figma's stripped nav ("Prompt Design Draw Build Publish Promote").
      const words = plain.split(/\s+/);
      if (words.length >= 5) {
        const capRun = words.filter(w => /^[A-Z][a-z]+$/.test(w)).length;
        const hasSentencePunct = /[.!?,;:]/.test(plain);
        if (capRun / words.length > 0.6 && !hasSentencePunct) score -= 15;
      }
      // Prefer sentences that look like marketing taglines (start with capital, end with . or !)
      if (/^[A-Z][^.!?]*[.!?]?$/.test(plain) && plain.split(/[.!?]/).filter(Boolean).length <= 3) score += 3;
      // Penalize all-caps shouting (probably a button)
      if (plain === plain.toUpperCase() && plain.length > 20) score -= 4;
      candidates.push({ plain, score });
      if (candidates.length >= 40) break;
    }
    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length && candidates[0].score > 0) {
      description = candidates[0].plain;
    } else if (candidates.length) {
      // No positive-scoring candidate — fall back to the first non-banner
      // sentence-ish line. Better than nothing.
      description = candidates[0].plain;
    }

    // Nav labels: pull link texts, then aggressively shorten them.
    // We're more permissive than before (60 chars) and then trust
    // __shortenNavLabel() to produce a clean nav-y string.
    const rawNavCandidates = [];
    // PRIMARY: plain-text bullet nav (Brex, Mercury). These appear FIRST in
    // the markdown and are typically the real top nav, even when individual
    // items aren't linked. Pulling them first guarantees they survive the
    // 30-candidate cap below.
    const bulletNavRe = /^\*\s+([A-Z][A-Za-z][A-Za-z &]{1,28})\s*$/gm;
    let bnm;
    while ((bnm = bulletNavRe.exec(body)) !== null) {
      const raw = bnm[1].trim();
      if (!raw || raw.length > 30) continue;
      const lbl = __shortenNavLabel(raw);
      if (!lbl) continue;
      rawNavCandidates.push(lbl);
      if (rawNavCandidates.length >= 8) break;
    }

    // SECONDARY: linked nav. Match link text only — NOT image alt text. A
    // markdown image is `![alt](url)`. We use a negative lookbehind so we
    // never match a `[` that's preceded by `!`. Also we explicitly reject any
    // captured label that starts with `!` as a belt-and-suspenders.
    const linkRe = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
    let m;
    while ((m = linkRe.exec(body)) !== null) {
      let raw = m[1].trim();
      if (raw.startsWith('!')) continue; // safety net
      if (!raw || raw.length > 80) continue;
      if (/^https?:/i.test(raw)) continue;
      // Drop markdown image alt text leaking in:
      //   "Image 1: HP Hero", "image 17: Homepage tile background ..."
      if (/^image\s*\d+/i.test(raw)) continue;
      if (/^image\s*\d*$/i.test(raw)) continue;
      // reject obviously bad labels — single-word CTAs and chrome bits.
      // We anchor with ^...$ patterns so multi-word brand items like
      // "Dev Mode" aren't accidentally stripped.
      if (/^(register today|register$|sign ?up$|sign ?in$|log ?in$|login$|logout$|signup$|signin$|join$|try (it )?free|get started|start (free|now)|book a demo|request demo|free trial|click here|learn more|see what|read more|see all|show all|create account|skip to|menu$|search$|cart$|wishlist$|account$|my account|profile$|help$|support$|contact us|contact$|privacy|terms|cookies?$|legal$|accessibility|sitemap|careers$|press$|investors?$|jobs$|status$|blog$|home$|pricing$|download$|downloads$|buy now|shop now|browse$|english|français|español|deutsch|italiano|português|日本|中文|en$|fr$|es$|de$)/i.test(raw)) continue;
      const lbl = __shortenNavLabel(raw);
      if (!lbl) continue;
      rawNavCandidates.push(lbl);
      if (rawNavCandidates.length >= 30) break;
    }

    // Dedupe candidates while preserving order, then decide whether to strip
    // the brand-name prefix. Notion's nav comes through as "Notion Calendar",
    // "Notion Mail", "Notion AI" — stripping "Notion " yields a much crisper
    // nav: "Calendar / Mail / AI / Agents / Docs ...".
    const brandToken = String(key).split('.')[0].toLowerCase();
    const dedupedCandidates = [];
    const seenRaw = new Set();
    for (const l of rawNavCandidates) {
      const lc = l.toLowerCase();
      if (seenRaw.has(lc)) continue;
      if (lc === brandToken) continue;
      seenRaw.add(lc);
      dedupedCandidates.push(l);
      if (dedupedCandidates.length >= 16) break;
    }
    // Count how many of the top candidates start with the brand token.
    const brandPrefixCount = dedupedCandidates.filter(l =>
      l.toLowerCase().split(/\s+/)[0] === brandToken
    ).length;
    // Strip if at least 3 of the first ~12 nav-able candidates carry the brand prefix.
    const stripBrand = brandPrefixCount >= 3;

    const navLabels = [];
    const seenLabels = new Set();
    for (let lbl of dedupedCandidates) {
      if (stripBrand) {
        const parts = lbl.split(/\s+/);
        if (parts.length > 1 && parts[0].toLowerCase() === brandToken) {
          lbl = parts.slice(1).join(' ').trim();
          if (!lbl) continue;
        }
      }
      // Drop possessive / determiner-leading labels ("Your AI", "My Account")
      // when they're 2-3 words — those are usually account / personalization
      // chrome, not the brand's product nav.
      if (/^(your|my|our|the|a|an)\s/i.test(lbl) && lbl.split(/\s+/).length <= 3) continue;
      const k = lbl.toLowerCase();
      if (seenLabels.has(k)) continue;
      if (k === brandToken) continue;
      seenLabels.add(k);
      navLabels.push(lbl);
      if (navLabels.length >= 12) break;
    }

    // Product images: extract markdown image URLs. Skip tracking pixels,
    // tiny icons, base64-data URIs, and SVGs (usually logos/decoration).
    // Also reject "customer logo carousel" images — the alt-text pattern
    // `_grey` / `-grey` / `HP-<Vendor>` is used by Brex, Stripe, Mercury and
    // most B2B SaaS sites to render the "trusted by" social-proof strip. Those
    // are not the brand's products, so showing them as product tiles is
    // misleading. We collect them in a separate bucket and only use them as a
    // last resort.
    const productImages = [];
    const customerLogos = [];
    const seenImg = new Set();
    const imgRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
    while ((m = imgRe.exec(body)) !== null) {
      const u = m[2].trim();
      const altRaw = (m[1] || '').trim();
      if (!/^https?:\/\//i.test(u)) continue;
      if (/\.(svg)(\?|$)/i.test(u)) continue;
      if (/sprite|pixel|spacer|1x1|tracking|googletag|doubleclick/i.test(u)) continue;
      if (seenImg.has(u)) continue;
      seenImg.add(u);
      const looksLikeCustomerLogo =
        /(_grey|-grey|grayscale|customer[-_]?logo|partner[-_]?logo|logo[-_]?cloud|logo[-_]?wall)/i.test(u + ' ' + altRaw) ||
        /^hp[-_]/i.test(altRaw) ||
        /^image\s*\d+\s*:\s*hp[-_]/i.test(altRaw);
      const entry = { url: u, alt: altRaw.slice(0, 60) };
      if (looksLikeCustomerLogo) {
        if (customerLogos.length < 4) customerLogos.push(entry);
      } else {
        productImages.push(entry);
      }
      if (productImages.length >= 8) break;
    }
    // If we didn't get any "real" product images but we have customer logos,
    // fall back to those rather than nothing.
    if (productImages.length === 0 && customerLogos.length) {
      for (const e of customerLogos) productImages.push(e);
    }

    // ALWAYS guarantee at least one usable image — the favicon, sized up.
    // This ensures even text-heavy pages (notion, figma) render with the
    // brand mark, which makes the page feel "like the real brand".
    if (productImages.length === 0) {
      productImages.push({
        url: `https://www.google.com/s2/favicons?domain=${key}&sz=128`,
        alt: (title || key) + ' logo',
      });
    }

    __liveCache[key] = {
      available: true,
      title,
      description,
      navLabels,
      productImages,
    };
    return __liveCache[key];
  } catch (e) {
    __liveCache[key] = __blockedFallback(key);
    return __liveCache[key];
  }
}

window.lookupLiveSite = lookupLiveSite;

/* ---------- Keyword → category map ---------- */
// Order matters: earlier matches win. Categories must each have a distinct
// archetype mapping below so we route brands to visually-appropriate
// templates (music ≠ movies, pets ≠ books).
const CATEGORY_RULES = [
  { cat: 'pets',      re: /(petco|petsmart|chewy|petfood|petco|pets\.|petsmart|petfinder|barkbox|americankennel|aspca|humane)/ },
  { cat: 'music',     re: /(spotify|soundcloud|pandora|tidal|deezer|apple\.music|youtubemusic|audible|podcast|music|audio|records|sony\.music|warnermusic|universalmusic|bandcamp|lastfm|napster)/ },
  { cat: 'gaming',    re: /(game|play|xbox|nintendo|steam|riot|blizzard|activision|epicgames|gamespot|ign|twitch|valve|ubisoft|rockstar|gta|wow|fortnite|minecraft|roblox|sega|playstation|halo|callofduty)/ },
  { cat: 'media',     re: /(news|times|post|tribune|herald|gazette|journal|magazine|cnn|bbc|fox|nbc|abc|cbs|msnbc|nyt|reuters|bloomberg|wsj|guardian|vogue|wired|theverge|techcrunch|vice|buzzfeed|huffpost|mashable|gizmodo)/ },
  { cat: 'corp',      re: /(tesla|ford|gm|toyota|honda|bmw|mercedes|audi|volkswagen|porsche|ferrari|lambo|kia|hyundai|nissan|subaru|volvo|jaguar|landrover|rivian|lucid|polestar|car|auto|motors|peloton|nike|adidas|puma|underarmour|lululemon|gap|uniqlo|hm|zara|levis|gucci|prada|chanel|lvmh|cartier|rolex|tiffany|coach|katespade|guess)/ },
  { cat: 'ecommerce', re: /(shop|store|buy|cart|market|deal|amazon|ebay|etsy|walmart|target|costco|bestbuy|ikea|home\.depot|wayfair|alibaba|aliexpress|shein|temu|zappos|nordstrom|macys|sephora|ulta)/ },
  { cat: 'food',      re: /(food|eat|restaurant|pizza|burger|chicken|coffee|coke|pepsi|sprite|mcdonald|mcd|burgerking|wendys|kfc|tacobell|chipotle|subway|dominos|papajohns|starbucks|dunkin|doordash|ubereats|grubhub|seamless|caviar|postmates|deliveroo|fritolay|hersheys|kelloggs|nestle|kraft|heinz|oreo|lays|doritos|cheetos|skittles|mms|snickers|kitkat|reeses)/ },
  { cat: 'film',      re: /(movie|film|cinema|imdb|netflix|hbo|disney|hulu|paramount|warnerbros|warner|universal|sonypictures|mgm|miramax|a24|fox|peacock|max|primevideo|appletv|theater|theatre|trailer|boxoffice)/ },
  { cat: 'community', re: /(forum|reddit|discord|4chan|digg|slashdot|quora|stackoverflow|stackexchange|community|board|wiki|fandom|deviantart|tumblr|livejournal|xanga|myspace|orkut|friendster|hi5)/ },
  { cat: 'productivity', re: /(notion|asana|monday|airtable|miro|loom|linear|trello|clickup|todoist|evernote|onenote|googledocs|gdocs|gsuite|workspace|slack|teams)/ },
  { cat: 'design',    re: /(studio|agency|design|creative|figma|dribbble|behance|pentagram|wieden|droga|ogilvy|saatchi|ideo|frogdesign|huge|rga|akqa|bbh|portfolio|sketch|invision|webflow|framer)/ },
  { cat: 'finance',   re: /(bank|chase|wellsfargo|citi|hsbc|barclays|santander|td|usbank|capitalone|amex|americanexpress|visa|mastercard|paypal|venmo|cashapp|square|stripe|brex|mercury|gusto|brex|fidelity|schwab|vanguard|robinhood|coinbase|kraken|gemini|finance|invest|trading|broker|mortgage|loan|credit|ramp)/ },
  { cat: 'tech',      re: /(\.app$|\.dev$|\.ai$|\.so$|\.io$|cloud|api|saas|platform|software|tech|labs|technologies|systems|solutions|computing|data|analytics|github|gitlab|vercel|netlify|render|supabase|firebase|aws|gcp|azure|databricks|snowflake|salesforce|hubspot|twilio|sentry|datadog|cloudflare|fastly|openai|anthropic|perplexity)/ },
  { cat: 'personal',  re: /^(.+\.(me|name|blog|tumblr|substack)$|.*personal|.*portfolio)/ },
];

/* ---------- Category-aware fallback nav labels ---------- */
// When the live site gave us no nav, generate one that matches the BRAND, not
// a generic "Books / Music / Video" Amazon clone. Each category yields a
// 7-10 item set sized for portal templates.
const CATEGORY_FALLBACK_NAV = {
  'pets':         ['Dogs','Cats','Fish','Birds','Small Pets','Reptiles','Pharmacy','Services','Sale'],
  'music':        ['Browse','New Releases','Top Charts','Genres','Playlists','Podcasts','Artists','Premium'],
  'gaming':       ['Games','News','Downloads','Forums','Tournaments','Store','Support'],
  'media':        ['Top Stories','World','Business','Tech','Sports','Entertainment','Opinion','Weather'],
  'corp':         ['Models','Shop','Build','Owners','Compare','Find a Dealer','About'],
  'ecommerce':    ['Departments','Today\u0027s Deals','Bestsellers','Gifts','Sale','Customer Service'],
  'food':         ['Menu','Locations','Promotions','Catering','Rewards','Order Online','About'],
  'film':         ['Now Playing','Coming Soon','Tickets','Trailers','News','Theaters'],
  'community':    ['Home','Boards','Top','New','Submit','Wiki','Help'],
  'productivity': ['Product','Solutions','Templates','Pricing','Resources','Customers','Download'],
  'design':       ['Work','Process','About','Clients','Press','Contact'],
  'finance':      ['Personal','Business','Investing','Cards','Loans','Help','Sign In'],
  'tech':         ['Product','Features','Docs','Pricing','Customers','Blog','Sign Up'],
  'personal':     ['Home','About','Blog','Photos','Guestbook','Links','Contact'],
  'unknown':      ['Home','About','Products','News','Contact'],
};

function categorize(domain) {
  for (const r of CATEGORY_RULES) if (r.re.test(domain)) return r.cat;
  return 'unknown';
}

/* ---------- Category → archetype map ---------- */
// Some categories have two options for variety; we hash-select.
const CATEGORY_ARCHETYPES = {
  'pets':         ['corpEcommercePortal', 'corpConsumerBrand'], // pet stores = portal + cheerful brand vibes
  'music':        ['flashPromoCinematic', 'corpConsumerBrand'], // music = cinematic, not gaming
  'gaming':       ['darkGameShrine', 'brightGameEntertainment'],
  'media':        ['corpEcommercePortal', 'flashPromoCinematic'], // news = portal-ish
  'ecommerce':    ['corpEcommercePortal'],
  'food':         ['corpConsumerBrand'],
  'film':         ['flashPromoCinematic'],
  'community':    ['maximalPortal'],
  'productivity': ['flashPortfolioFuturist', 'designAgency'],
  'design':       ['designAgency', 'flashPortfolioFuturist'],
  'corp':         ['corpConsumerBrand', 'flashPromoCinematic'],
  // Fintech & B2B finance: NOT retail. Brex, Mercury, etc. are SaaS
  // dashboards, not shopping portals. Route them to corp/saas-style templates.
  'finance':      ['flashPortfolioFuturist', 'corpConsumerBrand', 'designAgency'],
  'tech':         ['flashPortfolioFuturist', 'designAgency'],
  'personal':     ['geocities'],
  'unknown':      ['geocities', 'maximalPortal', 'corpConsumerBrand', '2advanced'],
};

/* ---------- Brand color database (hex) ----------
   When the domain matches a known brand, we use real colors.
   For everything else we derive a color from the domain hash.
*/
const BRAND_COLORS = {
  // Tech
  'spotify.com':    { primary: '#1db954', secondary: '#191414', accent: '#1ed760' },
  'figma.com':      { primary: '#f24e1e', secondary: '#a259ff', accent: '#0acf83' },
  'notion.so':      { primary: '#000000', secondary: '#ffffff', accent: '#e16259' },
  'tesla.com':      { primary: '#cc0000', secondary: '#000000', accent: '#c0c0c0' },
  'github.com':     { primary: '#24292e', secondary: '#0366d6', accent: '#28a745' },
  'twitter.com':    { primary: '#1da1f2', secondary: '#14171a', accent: '#ffffff' },
  'x.com':          { primary: '#000000', secondary: '#ffffff', accent: '#1da1f2' },
  'meta.com':       { primary: '#0668e1', secondary: '#000000', accent: '#1877f2' },
  'facebook.com':   { primary: '#1877f2', secondary: '#ffffff', accent: '#42b72a' },
  'instagram.com':  { primary: '#e1306c', secondary: '#fcaf45', accent: '#833ab4' },
  'tiktok.com':     { primary: '#000000', secondary: '#fe2c55', accent: '#25f4ee' },
  'snapchat.com':   { primary: '#fffc00', secondary: '#000000', accent: '#ffffff' },
  'pinterest.com':  { primary: '#bd081c', secondary: '#ffffff', accent: '#e60023' },
  'reddit.com':     { primary: '#ff4500', secondary: '#000000', accent: '#ffffff' },
  'discord.com':    { primary: '#5865f2', secondary: '#23272a', accent: '#ffffff' },
  'slack.com':      { primary: '#4a154b', secondary: '#ecb22e', accent: '#2eb67d' },
  'zoom.us':        { primary: '#2d8cff', secondary: '#ffffff', accent: '#0e72ed' },
  'airbnb.com':     { primary: '#ff5a5f', secondary: '#484848', accent: '#ffffff' },
  'uber.com':       { primary: '#000000', secondary: '#ffffff', accent: '#06c167' },
  'lyft.com':       { primary: '#ff00bf', secondary: '#11111f', accent: '#ffffff' },
  'doordash.com':   { primary: '#ff3008', secondary: '#ffffff', accent: '#000000' },
  'ubereats.com':   { primary: '#06c167', secondary: '#000000', accent: '#ffffff' },
  'grubhub.com':    { primary: '#f63440', secondary: '#ffffff', accent: '#000000' },
  // E-commerce
  'amazon.com':     { primary: '#ff9900', secondary: '#232f3e', accent: '#146eb4' },
  'ebay.com':       { primary: '#e53238', secondary: '#0064d2', accent: '#f5af02' },
  'etsy.com':       { primary: '#f1641e', secondary: '#222222', accent: '#ffffff' },
  'walmart.com':    { primary: '#0071ce', secondary: '#ffc220', accent: '#ffffff' },
  'target.com':     { primary: '#cc0000', secondary: '#ffffff', accent: '#000000' },
  'shopify.com':    { primary: '#96bf48', secondary: '#5e8e3e', accent: '#212f3d' },
  'shein.com':      { primary: '#000000', secondary: '#ffffff', accent: '#f57224' },
  'temu.com':       { primary: '#fb7701', secondary: '#000000', accent: '#ffffff' },
  // Food
  'mcdonalds.com':  { primary: '#ffc72c', secondary: '#da291c', accent: '#27251f' },
  'burgerking.com': { primary: '#f5ebdc', secondary: '#d62300', accent: '#0066b1' },
  'starbucks.com':  { primary: '#006241', secondary: '#1e3932', accent: '#cba258' },
  'dunkindonuts.com': { primary: '#ff671f', secondary: '#da1884', accent: '#693011' },
  'cocacola.com':   { primary: '#f40009', secondary: '#000000', accent: '#ffffff' },
  'coke.com':       { primary: '#f40009', secondary: '#000000', accent: '#ffffff' },
  'pepsi.com':      { primary: '#004b93', secondary: '#ee1c25', accent: '#ffffff' },
  // Media
  'cnn.com':        { primary: '#cc0000', secondary: '#000000', accent: '#ffffff' },
  'foxnews.com':    { primary: '#003366', secondary: '#bf0a30', accent: '#ffffff' },
  'bbc.com':        { primary: '#bb1919', secondary: '#000000', accent: '#ffffff' },
  'wsj.com':        { primary: '#000000', secondary: '#0274b6', accent: '#ffffff' },
  'vogue.com':      { primary: '#000000', secondary: '#ffffff', accent: '#c5a253' },
  'wired.com':      { primary: '#000000', secondary: '#ffffff', accent: '#ff4d00' },
  'theverge.com':   { primary: '#ff8000', secondary: '#5200ff', accent: '#000000' },
  // Streaming / Film
  'netflix.com':    { primary: '#e50914', secondary: '#000000', accent: '#ffffff' },
  'hulu.com':       { primary: '#1ce783', secondary: '#040405', accent: '#ffffff' },
  'disneyplus.com': { primary: '#0e47a1', secondary: '#000000', accent: '#ffffff' },
  'disney.com':     { primary: '#0e47a1', secondary: '#ffd700', accent: '#ffffff' },
  'hbo.com':        { primary: '#000000', secondary: '#ffffff', accent: '#9333ea' },
  'max.com':        { primary: '#002be7', secondary: '#000000', accent: '#ffffff' },
  // Gaming
  'xbox.com':       { primary: '#107c10', secondary: '#000000', accent: '#ffffff' },
  'playstation.com':{ primary: '#003791', secondary: '#000000', accent: '#ffffff' },
  'nintendo.com':   { primary: '#e60012', secondary: '#000000', accent: '#ffffff' },
  'steam.com':      { primary: '#171a21', secondary: '#66c0f4', accent: '#ffffff' },
  'steampowered.com':{ primary: '#171a21', secondary: '#66c0f4', accent: '#ffffff' },
  'twitch.tv':      { primary: '#9146ff', secondary: '#000000', accent: '#ffffff' },
  'roblox.com':     { primary: '#e1241d', secondary: '#000000', accent: '#ffffff' },
  'minecraft.net':  { primary: '#62b047', secondary: '#5b3924', accent: '#ffffff' },
  'epicgames.com':  { primary: '#313131', secondary: '#ffffff', accent: '#0078f2' },
  'riot.com':       { primary: '#d13639', secondary: '#000000', accent: '#ffffff' },
  'rockstargames.com': { primary: '#fcaf17', secondary: '#000000', accent: '#ffffff' },
  // Finance
  'paypal.com':     { primary: '#003087', secondary: '#009cde', accent: '#ffc439' },
  'venmo.com':      { primary: '#3d95ce', secondary: '#ffffff', accent: '#008cff' },
  'chase.com':      { primary: '#117aca', secondary: '#000000', accent: '#ffffff' },
  'wellsfargo.com': { primary: '#d71e28', secondary: '#ffcd11', accent: '#000000' },
  'capitalone.com': { primary: '#d22e1e', secondary: '#004977', accent: '#ffffff' },
  'amex.com':       { primary: '#006fcf', secondary: '#ffffff', accent: '#000000' },
  'visa.com':       { primary: '#1a1f71', secondary: '#f7b600', accent: '#ffffff' },
  'mastercard.com': { primary: '#eb001b', secondary: '#ff5f00', accent: '#f79e1b' },
  'robinhood.com':  { primary: '#00c805', secondary: '#000000', accent: '#ffffff' },
  'coinbase.com':   { primary: '#0052ff', secondary: '#000000', accent: '#ffffff' },
  // Other
  'peloton.com':    { primary: '#000000', secondary: '#dc2727', accent: '#ffffff' },
  'lululemon.com':  { primary: '#d52b1e', secondary: '#000000', accent: '#ffffff' },
  'nike.com':       { primary: '#000000', secondary: '#ffffff', accent: '#fa5400' },
  'adidas.com':     { primary: '#000000', secondary: '#ffffff', accent: '#ef0107' },
  'rei.com':        { primary: '#a51c30', secondary: '#003b71', accent: '#ffffff' },
  'patagonia.com':  { primary: '#000000', secondary: '#ffffff', accent: '#5b3a29' },
  'petco.com':      { primary: '#e4002b', secondary: '#0033a0', accent: '#ffffff' },
  'petsmart.com':   { primary: '#005baa', secondary: '#f15a22', accent: '#ffffff' },
  'chewy.com':      { primary: '#0070d2', secondary: '#fdb913', accent: '#ffffff' },
};

/* ---------- Deterministic hash ---------- */
function hashStrA(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* ---------- Domain → derived color (when not in DB) ---------- */
// Era-appropriate palette pool: bold primaries, mid-90s saturated.
const FALLBACK_PALETTES = [
  { primary: '#cc0000', secondary: '#000000', accent: '#ffcc00' }, // red+gold (Diablo)
  { primary: '#003366', secondary: '#ffcc00', accent: '#ffffff' }, // navy+gold (corporate)
  { primary: '#008000', secondary: '#ffffff', accent: '#000000' }, // forest green
  { primary: '#800080', secondary: '#ffcc00', accent: '#ffffff' }, // purple+gold
  { primary: '#ff6600', secondary: '#000000', accent: '#ffffff' }, // orange (Newgrounds)
  { primary: '#0000aa', secondary: '#ffff00', accent: '#ffffff' }, // royal blue
  { primary: '#cc6633', secondary: '#000000', accent: '#c0a060' }, // bronze/Tomb Raider
  { primary: '#117733', secondary: '#000000', accent: '#88ff88' }, // matrix green
  { primary: '#aa1144', secondary: '#000000', accent: '#ff80aa' }, // magenta/pink
  { primary: '#226688', secondary: '#000000', accent: '#88ccee' }, // teal industrial
];

function brandProfile(domain) {
  const cat = categorize(domain);
  const archetypes = CATEGORY_ARCHETYPES[cat] || CATEGORY_ARCHETYPES['unknown'];
  const archetype = archetypes[hashStrA(domain + 'a') % archetypes.length];
  const colors = BRAND_COLORS[domain] || FALLBACK_PALETTES[hashStrA(domain + 'c') % FALLBACK_PALETTES.length];
  const sitename = domain.split('.')[0];
  const displayName = sitename.charAt(0).toUpperCase() + sitename.slice(1);

  return {
    domain,
    category: cat,
    archetype,
    primary:   colors.primary,
    secondary: colors.secondary,
    accent:    colors.accent,
    sitename,
    displayName,
  };
}

window.brandProfile = brandProfile;
window.categorize = categorize;

/* ============================================================
   NEW TEMPLATES (7 archetypes)
   Each takes `d` (the data shape used elsewhere) and a `p` (profile from
   brandProfile). They return HTML strings.

   The existing `tplGeocities` and `tpl2Advanced` cover archetypes
   `geocities` and `flashPortfolioFuturist`. We add:
     - tplDarkGameShrine
     - tplFlashPromoCinematic
     - tplMaximalPortal
     - tplCorpEcommercePortal
     - tplCorpConsumerBrand
     - tplBrightEntertainment
     - tplDesignAgency
   ============================================================ */

/* Utility: era-appropriate "marquee" of brand-tinted greetings */
function brandMarquee(p) {
  return `<marquee scrollamount="6" style="background:${p.primary}; color:${p.accent}; font-family:'Courier New',monospace; padding:4px 0; font-size:13px; border-bottom:2px ridge ${p.secondary};">
    &#10024; WELCOME TO ${p.displayName.toUpperCase()}.COM &#10024; THE OFFICIAL HOMEPAGE &#10024; UPDATED ${new Date().toLocaleDateString('en-US')} &#10024; Y2K COMPLIANT!! &#10024; OPTIMIZED FOR NETSCAPE 4 + IE5 &#10024;
  </marquee>`;
}

/* Utility: pseudo-3D bevel button */
function pillBtn(text, href, p) {
  return `<a href="${href||'#'}" style="display:inline-block; padding:6px 14px; background:linear-gradient(180deg,${p.accent} 0%, ${p.primary} 100%); color:${p.secondary}; text-decoration:none; font-family:Verdana,Arial,sans-serif; font-size:12px; font-weight:bold; border:2px outset ${p.accent}; margin:2px;">${text}</a>`;
}

/* Utility: prefer real nav labels from the live site, otherwise a
   category-appropriate set, otherwise the template's own fallback.

   Precedence:
     1. d.navLabels (from the live site)
     2. CATEGORY_FALLBACK_NAV[d.category] (brand-appropriate generic)
     3. `fallback` parameter (template's own default — LAST RESORT)

   We pad to at least `min` items by cycling through the chosen source.
   We intentionally pick the category list over the template fallback to
   avoid Battle.net widgets on Spotify and Books/Music/Video on Petco. */
function realNav(d, fallback, min) {
  let source = null;
  if (d && d.navLabels && d.navLabels.length) source = d.navLabels.slice();
  else if (d && d.category && CATEGORY_FALLBACK_NAV[d.category]) source = CATEGORY_FALLBACK_NAV[d.category].slice();
  else source = fallback.slice();

  // Pad to template's required length using the same source to keep tone consistent.
  const target = Math.max(fallback.length, min || 0);
  const out = source.slice(0, target);
  let i = 0;
  while (out.length < target) { out.push(source[i % source.length] || fallback[i % fallback.length]); i++; }
  return out;
}

/* Utility: if the live site exposed a usable image at this index, render it.
   Otherwise fall back to the inline pixel-art icon. Images are framed with
   the same panel chrome so they read as Y2K product tiles. */
function realProductImg(d, idx, p, w, h) {
  w = w || 100; h = h || 80;
  const img = d && d.productImages && d.productImages[idx];
  if (!img || !img.url) return productIcon(idx, p, w, h);
  const sec  = p.secondary || '#eee';
  const prim = p.primary || '#000';
  // Use referrerpolicy=no-referrer so hotlink-protected CDNs (Cloudinary, scdn,
  // etc.) still serve to us in the iframe-y context.
  // On image error we just hide the <img>; the tinted panel underneath stays
  // and reads as a Y2K "image broken" cell, which is actually period-correct.
  return `<div style="width:100%; height:${h}px; background:${sec}; border:1px solid ${prim}55; display:flex; align-items:center; justify-content:center; overflow:hidden;">
    <img src="${img.url}" alt="" referrerpolicy="no-referrer" loading="lazy"
         onerror="this.style.display='none';"
         style="max-width:100%; max-height:100%; object-fit:cover; display:block;">
  </div>`;
}

/* Utility: inline-SVG product/content icons (pixel-art style, Y2K stock-clip-art vibe).
   Pool of ~12 motifs. Pick deterministically by index so each tile gets a different one.
   Tinted with the variant palette via currentColor + accent fills. */
function productIcon(idx, p, w, h) {
  w = w || 100; h = h || 80;
  const prim = p.primary || '#000';
  const acc  = p.accent  || '#fff';
  const sec  = p.secondary || '#eee';
  // 12 distinct SVG motifs — boxed product, CD, book, monitor, gift, camera, headphones,
  // floppy disk, t-shirt, watch, sneaker, mug.
  const svgs = [
    // 0 — boxed product (cardboard box w/ stripe)
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='15' y='22' width='70' height='48' fill='${prim}'/><rect x='15' y='22' width='70' height='10' fill='${acc}'/><line x1='50' y1='22' x2='50' y2='70' stroke='${sec}' stroke-width='1.5'/><polygon points='15,22 50,8 85,22 50,32' fill='${prim}' stroke='${acc}' stroke-width='1'/></svg>`,
    // 1 — CD/disc
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='40' r='30' fill='${prim}'/><circle cx='50' cy='40' r='22' fill='none' stroke='${acc}' stroke-width='1'/><circle cx='50' cy='40' r='14' fill='none' stroke='${acc}' stroke-width='1'/><circle cx='50' cy='40' r='6' fill='${sec}'/><circle cx='50' cy='40' r='2' fill='${prim}'/></svg>`,
    // 2 — book with bookmark
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='22' y='12' width='50' height='60' fill='${prim}'/><rect x='22' y='12' width='50' height='6' fill='${acc}'/><line x1='32' y1='28' x2='62' y2='28' stroke='${acc}' stroke-width='1.2'/><line x1='32' y1='38' x2='62' y2='38' stroke='${acc}' stroke-width='1.2'/><line x1='32' y1='48' x2='62' y2='48' stroke='${acc}' stroke-width='1.2'/><polygon points='60,12 68,12 64,22' fill='${sec}'/></svg>`,
    // 3 — CRT monitor
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='14' y='14' width='72' height='44' rx='4' fill='${prim}'/><rect x='20' y='20' width='60' height='32' fill='${acc}'/><rect x='44' y='58' width='12' height='6' fill='${prim}'/><rect x='30' y='64' width='40' height='4' fill='${sec}'/></svg>`,
    // 4 — gift box
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='30' width='60' height='40' fill='${prim}'/><rect x='46' y='30' width='8' height='40' fill='${acc}'/><rect x='20' y='30' width='60' height='8' fill='${sec}'/><path d='M50 30 Q 30 12 40 26 Q 52 18 50 30 Q 48 18 60 26 Q 70 12 50 30' fill='${acc}'/></svg>`,
    // 5 — camera
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='18' y='22' width='64' height='40' rx='4' fill='${prim}'/><rect x='38' y='16' width='24' height='10' fill='${prim}'/><circle cx='50' cy='42' r='14' fill='${sec}'/><circle cx='50' cy='42' r='9' fill='${acc}'/><circle cx='50' cy='42' r='4' fill='${prim}'/><rect x='66' y='26' width='6' height='4' fill='${acc}'/></svg>`,
    // 6 — headphones
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><path d='M22 46 Q 22 18 50 18 Q 78 18 78 46' fill='none' stroke='${prim}' stroke-width='5'/><rect x='16' y='42' width='14' height='20' rx='3' fill='${prim}'/><rect x='70' y='42' width='14' height='20' rx='3' fill='${prim}'/><rect x='20' y='46' width='6' height='12' fill='${acc}'/><rect x='74' y='46' width='6' height='12' fill='${acc}'/></svg>`,
    // 7 — floppy disk
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='22' y='14' width='56' height='56' fill='${prim}'/><rect x='30' y='14' width='40' height='22' fill='${acc}'/><rect x='52' y='18' width='8' height='14' fill='${prim}'/><rect x='30' y='44' width='40' height='22' fill='${sec}'/><rect x='34' y='48' width='32' height='3' fill='${prim}'/><rect x='34' y='54' width='32' height='3' fill='${prim}'/></svg>`,
    // 8 — t-shirt
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><path d='M30 22 L 18 32 L 26 42 L 30 38 L 30 72 L 70 72 L 70 38 L 74 42 L 82 32 L 70 22 L 60 22 Q 50 32 40 22 Z' fill='${prim}'/><circle cx='50' cy='52' r='8' fill='${acc}'/></svg>`,
    // 9 — watch
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='42' y='4' width='16' height='14' fill='${prim}'/><rect x='42' y='62' width='16' height='14' fill='${prim}'/><circle cx='50' cy='40' r='22' fill='${prim}'/><circle cx='50' cy='40' r='16' fill='${acc}'/><line x1='50' y1='40' x2='50' y2='28' stroke='${prim}' stroke-width='2'/><line x1='50' y1='40' x2='60' y2='40' stroke='${prim}' stroke-width='2'/></svg>`,
    // 10 — sneaker
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><path d='M14 56 L 14 46 L 32 38 L 56 36 Q 78 38 84 50 L 84 60 L 14 60 Z' fill='${prim}'/><rect x='14' y='58' width='72' height='6' fill='${acc}'/><line x1='40' y1='40' x2='44' y2='52' stroke='${sec}' stroke-width='1.5'/><line x1='50' y1='38' x2='54' y2='52' stroke='${sec}' stroke-width='1.5'/><line x1='60' y1='38' x2='64' y2='52' stroke='${sec}' stroke-width='1.5'/></svg>`,
    // 11 — mug
    `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'><rect x='28' y='22' width='40' height='44' rx='3' fill='${prim}'/><rect x='32' y='26' width='32' height='6' fill='${acc}'/><path d='M68 32 Q 84 32 84 46 Q 84 60 68 60' fill='none' stroke='${prim}' stroke-width='4'/><path d='M40 14 Q 42 8 44 14 M48 14 Q 50 8 52 14 M56 14 Q 58 8 60 14' stroke='${sec}' stroke-width='1.5' fill='none'/></svg>`,
  ];
  const svg = svgs[idx % svgs.length];
  // Wrap in a tinted frame so it reads as a product card.
  return `<div style="width:100%; height:${h}px; background:${sec}; border:1px solid ${prim}55; display:flex; align-items:center; justify-content:center; overflow:hidden;">
    <div style="width:${w}px; height:${h-10}px;">${svg.replace("<svg ", `<svg width='100%' height='100%' preserveAspectRatio='xMidYMid meet' `)}</div>
  </div>`;
}

/* ---------- 1. DARK GAME SHRINE (Diablo II / CS / Tomb Raider) ---------- */
function tplDarkGameShrine(d, p) {
  const news = (d.bullets || []).slice(0, 5);
  // News4: real bullets if we have them, else brand-appropriate defaults.
  const defaultNews = d.category === 'gaming'
    ? ['NEW: Beta patch 1.04 released', 'TIPS &amp; TRICKS section updated', 'fan-art submissions OPEN', 'official forum: 4,201 users online']
    : [`Welcome to ${d.sitename}.com`, 'Site updates posted weekly', 'New features coming soon', 'Sign our guestbook!'];
  const news4 = news.length >= 4 ? news : defaultNews;
  // Real top-row nav + real sidebar nav, pulled from the live site when
  // available, otherwise category-aware defaults via realNav.
  const topNav  = realNav(d, ['Enter','News','Downloads','Forum','Support'], 5);
  const sideNav = realNav(d, ['News &amp; Updates','Walkthroughs','Cheats &amp; Codes','Screenshots','Patches','Mods','Forums','Store','Webmaster'], 9);
  return `
  <div style="background:#000 url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23${p.secondary.replace('#','')}'/><path d='M0 100 L200 100 M100 0 L100 200' stroke='%23${p.primary.replace('#','')}' stroke-width='0.5' opacity='0.15'/></svg>&quot;); min-height:100vh; padding-bottom:90px; color:${p.accent}; font-family:'Georgia','Times New Roman',serif;">

    ${brandMarquee(p)}

    <div style="max-width:880px; margin:0 auto; padding:14px;">

      <!-- Big atmospheric banner -->
      <div style="background:linear-gradient(180deg, ${p.secondary} 0%, #000 100%); border:3px ridge ${p.primary}; padding:24px 16px; text-align:center; box-shadow:0 0 40px ${p.primary}40 inset;">
        <h1 style="font-family:'Georgia',serif; font-size:64px; margin:0; color:${p.primary}; text-shadow: 0 0 12px ${p.primary}, 2px 2px 0 #000; letter-spacing:4px; font-weight:bold;">${d.sitename.toUpperCase()}</h1>
        <div style="font-family:'Courier New',monospace; color:${p.accent}; font-size:14px; margin-top:8px; letter-spacing:2px;">&laquo;&laquo; ${d.tagline} &raquo;&raquo;</div>
        <div style="margin-top:14px;">
          ${topNav.map(x => `<a href="#" style="color:${p.primary}; text-decoration:none; margin:0 8px; font-variant:small-caps; font-size:14px;">[ ${x} ]</a>`).join('')}
        </div>
      </div>

      <!-- Two columns: nav sidebar + main content -->
      <table style="width:100%; border-collapse:collapse; margin-top:12px;"><tr>

        <!-- Sidebar -->
        <td style="width:180px; vertical-align:top; padding:8px; background:#0a0a0a; border:2px ridge ${p.primary}80;">
          <div style="font-family:'Georgia',serif; color:${p.primary}; font-size:14px; font-variant:small-caps; border-bottom:1px solid ${p.primary}; padding-bottom:4px; margin-bottom:8px;">~ Navigation ~</div>
          <ul style="list-style:none; padding:0; margin:0; font-family:'Courier New',monospace; font-size:12px; line-height:1.9; color:${p.accent};">
            ${sideNav.map(x => `<li>&raquo; <a href="#" style="color:${p.accent};">${x}</a></li>`).join('')}
          </ul>
          <div style="margin-top:12px; padding:8px; border:1px ridge ${p.primary}; text-align:center;">
            <div style="color:${p.primary}; font-size:11px; font-variant:small-caps;">~ ${d.category === 'gaming' ? 'Server Status' : 'Site Status'} ~</div>
            <div style="color:${p.accent}; font-family:'Courier New',monospace; font-size:11px; margin-top:4px;">${Math.floor(hashStrA(p.domain+'online')%9000+1000).toLocaleString()} online<br>${d.sitename}: <span style="color:#0f0;">UP</span></div>
          </div>
          ${rampSkyscraper('shrine-sky')}
        </td>

        <!-- Main content -->
        <td style="vertical-align:top; padding:8px;">

          <div style="background:#0a0a0a; border:2px ridge ${p.primary}80; padding:14px;">
            <h2 style="color:${p.primary}; font-family:'Georgia',serif; font-variant:small-caps; margin:0 0 10px; border-bottom:1px solid ${p.primary}; padding-bottom:4px;">&#9876; Latest News</h2>
            <div style="font-family:'Verdana',sans-serif; font-size:12px; line-height:1.6; color:${p.accent};">
              ${news4.map((n,i)=>`<p style="margin:0 0 10px; padding-left:14px; border-left:2px solid ${p.primary};"><span style="color:${p.primary}; font-weight:bold;">[${new Date(Date.now()-i*86400000).toLocaleDateString('en-US',{month:'short',day:'numeric'})}]</span> ${n.replace(/&#9733;\s*/,'')}</p>`).join('')}
            </div>
          </div>

          <div style="margin-top:12px; background:#0a0a0a; border:2px ridge ${p.primary}80; padding:14px;">
            <h2 style="color:${p.primary}; font-family:'Georgia',serif; font-variant:small-caps; margin:0 0 10px; border-bottom:1px solid ${p.primary}; padding-bottom:4px;">&#10047; About ${d.sitename}</h2>
            <p style="font-family:'Verdana',sans-serif; font-size:12px; line-height:1.7; color:${p.accent}; margin:0;">${d.welcome}</p>
            <div style="margin-top:14px; text-align:center;">
              <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:10px 28px; background:linear-gradient(180deg, ${p.primary} 0%, ${p.secondary} 100%); border:2px outset ${p.primary}; color:${p.accent}; font-family:'Georgia',serif; font-variant:small-caps; font-size:18px; letter-spacing:2px; text-decoration:none; box-shadow:0 0 16px ${p.primary}80;">&laquo; ${d.cta} &raquo;</a>
            </div>
          </div>

          <div style="margin-top:12px; background:#0a0a0a; border:2px ridge ${p.primary}80; padding:14px;">
            <h2 style="color:${p.primary}; font-family:'Georgia',serif; font-variant:small-caps; margin:0 0 10px;">&#9886; ${d.category === 'gaming' ? 'Community' : 'By the Numbers'}</h2>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-family:'Verdana',sans-serif; font-size:12px; color:${p.accent};">
              ${d.category === 'gaming' ? `
              <div>&#9670; <b>4,201</b> registered members</div>
              <div>&#9670; <b>187,920</b> forum posts</div>
              <div>&#9670; <b>892</b> screenshots in gallery</div>
              <div>&#9670; <b>54</b> active mods</div>` : `
              <div>&#9670; <b>1999</b> launched on the web</div>
              <div>&#9670; <b>${(hashStrA(p.domain+'visit')%900+100)},000</b> monthly visitors</div>
              <div>&#9670; <b>${hashStrA(p.domain+'pages')%900+100}</b> pages of content</div>
              <div>&#9670; <b>Y2K</b> compliant since launch</div>`}
            </div>
          </div>

        </td>
      </tr></table>

      <div style="margin-top:14px; text-align:center; font-family:'Georgia',serif; font-size:11px; color:${p.primary}; font-variant:small-caps;">
        ${bestViewedBadge()}
        <div style="margin-top:10px;">${footerTag()}</div>
        <div style="margin-top:6px; color:#888;">
          (c) ${d.domain} MM-MMXXVI. <button data-restart style="background:#1a1a1a; border:1px ridge ${p.primary}; color:${p.accent}; padding:3px 10px; font-family:'Georgia',serif; font-size:11px;">~ Y2K-ify another site ~</button>
        </div>
      </div>
    </div>

    ${rampPopupReSpawn('shrine-popup')}
  </div>`;
}

/* ---------- 2. FLASH PROMO CINEMATIC (Requiem / Rockstar) ---------- */
function tplFlashPromoCinematic(d, p) {
  // Pull real nav (branded products / sections), filtered & deduped, with a
  // sensible film-y fallback for sites that don't return nav (chewy, petco).
  const scenes = realNav(d, ['Prologue','Act One','Act Two','Act Three','Epilogue','Credits'], 3).slice(0, 3);
  const heroImgCell = realProductImg(d, 0, p, 560, 280);
  return `
  <div style="background:${p.secondary}; min-height:100vh; padding-bottom:90px; color:${p.accent}; font-family:'Arial Black','Impact',sans-serif; position:relative; overflow:hidden;">

    <!-- film grain overlay -->
    <div style="position:fixed; inset:0; pointer-events:none; background:repeating-linear-gradient(0deg, transparent 0 2px, #00000010 2px 3px); z-index:1;"></div>

    ${brandMarquee(p)}

    <!-- Centered "splash" composition -->
    <div style="max-width:920px; margin:30px auto 0; padding:14px; position:relative; z-index:2;">

      <!-- Huge brand mark -->
      <div style="text-align:center; padding:40px 12px 30px;">
        <div style="display:inline-block; padding:8px 32px; background:${p.primary}; border:4px solid ${p.accent}; transform:skew(-6deg); box-shadow:8px 8px 0 ${p.accent};">
          <h1 style="font-family:'Impact','Arial Black',sans-serif; font-size:96px; line-height:0.9; margin:0; color:${p.accent}; letter-spacing:-2px; transform:skew(6deg);">${d.sitename.toUpperCase()}</h1>
        </div>
        <div style="margin-top:32px; font-family:'Times New Roman',serif; font-style:italic; color:${p.accent}; font-size:20px; max-width:560px; margin:32px auto 0; letter-spacing:2px;">
          &laquo;&nbsp;${d.tagline}&nbsp;&raquo;
        </div>
      </div>

      <!-- Real product hero image "film still" -->
      <div style="margin:0 auto 24px; max-width:640px; border:6px double ${p.accent}; box-shadow:12px 12px 0 ${p.accent}40; padding:6px; background:${p.primary};">
        ${heroImgCell}
        <div style="text-align:center; padding:8px 0 0; font-family:'Times New Roman',serif; font-style:italic; color:${p.accent}80; font-size:11px; letter-spacing:3px;">STILL FROM &ldquo;${d.sitename.toUpperCase()}&rdquo; &mdash; MMXXVI</div>
      </div>

      <!-- "Now showing" promo card -->
      <div style="margin:30px auto; max-width:640px; background:${p.primary}; border:6px double ${p.accent}; padding:28px 22px; box-shadow:12px 12px 0 ${p.accent}40;">
        <div style="font-family:'Times New Roman',serif; font-style:italic; color:${p.accent}; font-size:14px; letter-spacing:6px; text-align:center;">NOW PLAYING</div>
        <h2 style="font-family:'Impact',sans-serif; color:${p.accent}; font-size:36px; text-align:center; margin:10px 0 14px; letter-spacing:3px;">${d.sitename.toUpperCase()}: THE WEBSITE</h2>
        <p style="font-family:'Times New Roman',serif; color:${p.accent}; font-size:14px; line-height:1.7; text-align:center; margin:0 0 18px; font-style:italic;">${d.welcome}</p>
        <div style="text-align:center;">
          <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:14px 40px; background:${p.accent}; color:${p.primary}; border:3px solid ${p.accent}; font-family:'Impact',sans-serif; font-size:24px; letter-spacing:4px; text-decoration:none; transition:all 0.2s;">&raquo; ${d.cta} &laquo;</a>
        </div>
      </div>

      <!-- Three-up "scenes" (real nav labels when available) -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin:20px 0;">
        ${scenes.map((b,i) => `
          <div style="background:${p.primary}80; border-left:4px solid ${p.accent}; padding:14px;">
            <div style="font-family:'Times New Roman',serif; font-style:italic; color:${p.accent}80; font-size:11px; letter-spacing:3px;">SCENE ${String(i+1).padStart(2,'0')}</div>
            <div style="font-family:'Impact',sans-serif; color:${p.accent}; font-size:18px; margin-top:6px; letter-spacing:1px;">${String(b).replace(/&#9733;\s*/,'')}</div>
          </div>
        `).join('')}
      </div>

      <div style="text-align:center; margin:40px 0 20px;">
        <div style="font-family:'Times New Roman',serif; font-style:italic; color:${p.accent}80; font-size:11px; letter-spacing:4px;">A FILM BY THE INTERNET &middot; MMXXVI &middot; RATED Y2K</div>
      </div>

      <div style="text-align:center; font-family:Verdana,sans-serif; font-size:11px; color:${p.accent}60;">
        ${bestViewedBadge()}
        <div style="margin-top:10px;">${footerTag()}</div>
        <div style="margin-top:6px;">
          (c) ${d.domain} MMXXVI. <button data-restart style="background:${p.primary}; border:2px solid ${p.accent}; color:${p.accent}; padding:3px 10px; font-family:'Impact',sans-serif; font-size:11px;">[ Y2K-IFY ANOTHER ]</button>
        </div>
      </div>

    </div>

    ${rampPopupReSpawn('promo-popup')}
  </div>`;
}

/* ---------- 3. MAXIMAL COMMUNITY PORTAL (Newgrounds-style) ---------- */
function tplMaximalPortal(d, p) {
  const items = (d.bullets || []).slice(0,6);
  while (items.length < 6) items.push('&#9733; Forum post #' + (items.length+1));
  // Top nav (9 slots) + left-rail categories (10 slots) come from the live
  // site if available, otherwise we use Newgrounds-flavored defaults.
  const topNav = realNav(d, ['Home','News','Submissions','Forums','Top 50','Shop','Audio Portal','BBS','User Login'], 9);
  const cats   = realNav(d, ['Action','Adventure','Comedy','Drama','Experimental','Music','Spam','Stick','Story','Weird'], 10);
  return `
  <div style="background:${p.secondary}; min-height:100vh; padding-bottom:90px; color:${p.accent}; font-family:Tahoma,Verdana,sans-serif; font-size:11px;">

    ${brandMarquee(p)}

    <!-- Top brand banner -->
    <div style="background:linear-gradient(180deg, ${p.primary}, ${p.primary}80); border-bottom:3px ridge ${p.accent}; padding:10px 14px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
      <div style="font-family:'Impact','Arial Black',sans-serif; font-size:38px; color:${p.accent}; text-shadow:3px 3px 0 #000; letter-spacing:2px;">${d.sitename.toUpperCase()}</div>
      <div style="flex:1; min-width:160px; font-family:'Courier New',monospace; color:${p.accent}; font-size:12px;">&raquo; ${d.tagline}</div>
      <div style="background:#fff; border:2px inset #c0c0c0; padding:2px 6px;">
        <input type="text" placeholder="search ${d.sitename}..." style="border:0; outline:0; width:140px; font-family:Tahoma; font-size:11px;">
      </div>
    </div>

    <!-- Top nav strip -->
    <div style="background:${p.primary}cc; border-bottom:2px solid ${p.accent}; padding:6px 14px; display:flex; gap:14px; flex-wrap:wrap; font-family:Tahoma,sans-serif;">
      ${topNav.map(x =>
        `<a href="#" style="color:${p.accent}; text-decoration:none; font-weight:bold; font-size:11px;">${x}</a>`
      ).join('')}
    </div>

    <div style="max-width:1024px; margin:0 auto; padding:8px;">

      <table style="width:100%; border-collapse:collapse;"><tr>

        <!-- Left rail: categories -->
        <td style="width:170px; vertical-align:top; padding:4px;">
          <div style="background:${p.primary}40; border:1px solid ${p.accent}; padding:6px;">
            <div style="background:${p.primary}; color:${p.accent}; padding:3px 6px; font-weight:bold;">~ CATEGORIES ~</div>
            <ul style="list-style:none; padding:6px 0; margin:0; line-height:1.7; color:${p.accent};">
              ${cats.map(x =>
                `<li>&raquo; <a href="#" style="color:${p.accent};">${x}</a> <span style="color:${p.accent}80;">(${Math.floor(Math.random()*4000+200)})</span></li>`
              ).join('')}
            </ul>
          </div>

          <div style="margin-top:8px;">${rampSkyscraper('maxportal-sky')}</div>

          <div style="margin-top:8px; background:${p.primary}40; border:1px solid ${p.accent}; padding:6px;">
            <div style="background:${p.primary}; color:${p.accent}; padding:3px 6px; font-weight:bold;">USERS ONLINE</div>
            <div style="padding:6px; color:${p.accent};">
              <div style="font-family:'Courier New',monospace; font-size:18px; color:${p.accent}; text-align:center;">12,847</div>
              <div style="font-size:10px; text-align:center; color:${p.accent}80;">peak: 18,420</div>
            </div>
          </div>
        </td>

        <!-- Center feed -->
        <td style="vertical-align:top; padding:4px;">

          <div style="background:${p.primary}; color:${p.accent}; padding:6px 10px; font-weight:bold; border:1px solid ${p.accent};">
            &#9733; FEATURED ON ${d.sitename.toUpperCase()} TODAY &#9733;
          </div>
          <div style="background:#000; border:1px solid ${p.accent}; padding:14px; color:${p.accent};">
            <p style="margin:0 0 8px; font-size:12px; line-height:1.6;">${d.welcome}</p>
            <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:6px 16px; background:${p.accent}; color:${p.primary}; font-family:Impact,sans-serif; font-size:14px; text-decoration:none; border:2px outset ${p.accent};">&raquo;&raquo; ${d.cta} &laquo;&laquo;</a>
          </div>

          <div style="margin-top:10px; background:${p.primary}40; border:1px solid ${p.accent}; padding:6px;">
            <div style="background:${p.primary}; color:${p.accent}; padding:3px 6px; font-weight:bold;">~ LATEST SUBMISSIONS ~</div>
            <table style="width:100%; border-collapse:collapse; margin-top:4px; color:${p.accent};">
              ${items.map((b,i) => `
                <tr style="border-bottom:1px dotted ${p.accent}40;">
                  <td style="padding:4px 6px; width:30px; color:${p.accent}80;">#${i+1}</td>
                  <td style="padding:4px 6px;"><a href="#" style="color:${p.accent}; font-weight:bold;">${b.replace(/&#9733;\s*/,'')}</a></td>
                  <td style="padding:4px 6px; text-align:right; color:${p.accent}80; font-size:10px;">
                    by user${Math.floor(Math.random()*999)} &middot; ${Math.floor(Math.random()*9+1)}.${Math.floor(Math.random()*9)}/5
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>

          ${rampBanner468('maxportal-mid')}

          <div style="margin-top:10px; background:${p.primary}40; border:1px solid ${p.accent}; padding:6px;">
            <div style="background:${p.primary}; color:${p.accent}; padding:3px 6px; font-weight:bold;">~ TOP 5 THIS WEEK ~</div>
            <ol style="margin:6px 0 6px 26px; padding:0; line-height:1.7; color:${p.accent};">
              ${items.slice(0,5).map(b => `<li><a href="#" style="color:${p.accent};">${b.replace(/&#9733;\s*/,'')}</a></li>`).join('')}
            </ol>
          </div>

        </td>

        <!-- Right rail: news -->
        <td style="width:160px; vertical-align:top; padding:4px;">
          <div style="background:${p.primary}40; border:1px solid ${p.accent}; padding:6px;">
            <div style="background:${p.primary}; color:${p.accent}; padding:3px 6px; font-weight:bold;">NEWS</div>
            <div style="padding:6px; color:${p.accent}; font-size:11px; line-height:1.6;">
              <p style="margin:0 0 8px;"><b style="color:${p.accent};">Site update:</b> new dropdowns rolling out this week!!</p>
              <p style="margin:0 0 8px;"><b style="color:${p.accent};">Server:</b> back online after planned downtime</p>
              <p style="margin:0;"><b style="color:${p.accent};">Contest:</b> win a copy of Quake III!!</p>
            </div>
          </div>
        </td>
      </tr></table>

      <div style="margin-top:14px; text-align:center; font-size:10px; color:${p.accent}80;">
        ${bestViewedBadge()}
        <div style="margin-top:8px;">${footerTag()}</div>
        <div style="margin-top:6px;">
          (c) ${d.domain} MMXXVI. <button data-restart style="background:${p.primary}; border:2px outset ${p.accent}; color:${p.accent}; padding:2px 8px; font-family:Tahoma; font-size:10px;">[Y2K-ify another]</button>
        </div>
      </div>
    </div>

    ${rampPopupReSpawn('maxportal-popup')}
  </div>`;
}

/* ---------- 4. CORPORATE E-COMMERCE PORTAL (Amazon-style) ---------- */
function tplCorpEcommercePortal(d, p) {
  const items = (d.bullets || []).slice(0,6);
  while (items.length < 6) items.push('Featured product');
  // Real top-tab nav + real left-rail browse nav, when the live site gave us
  // enough labels. The first tab is always "Welcome" so the homepage feels
  // like an Amazon-style portal.
  const tabs = ['Welcome'].concat(realNav(d, ['Books','Music','Video','Electronics','Toys','Home &amp; Garden','Apparel','Tools','Auctions','zShops'], 10));
  const browse = realNav(d, ['Bestsellers','New Releases','Coming Soon','Editor&#39;s Picks','Used &amp; Refurb','International','Gift Center'], 7);
  // Generate fake product cards from the bullets
  return `
  <div style="background:#ffffff; min-height:100vh; padding-bottom:90px; color:#000; font-family:'Times New Roman',Times,serif; font-size:13px;">

    ${brandMarquee(p)}

    <!-- Top header: logo + search + account links -->
    <div style="background:linear-gradient(180deg, ${p.primary} 0%, ${p.primary}cc 100%); border-bottom:3px solid ${p.secondary}; padding:8px 12px;">
      <table style="width:100%; max-width:1000px; margin:0 auto; border-collapse:collapse;"><tr>
        <td style="vertical-align:middle;">
          <div style="font-family:'Arial Black',Arial,sans-serif; font-size:32px; color:${p.accent}; font-style:italic;">${d.sitename}<span style="color:${p.secondary};">.com</span></div>
          <div style="font-family:Arial,sans-serif; font-size:10px; color:${p.accent}cc; margin-top:-2px; letter-spacing:1px;">${d.tagline}</div>
        </td>
        <td style="vertical-align:middle; text-align:right;">
          <table style="border-collapse:collapse;"><tr>
            <td style="background:#fff; padding:3px 6px; border:2px inset #c0c0c0;">
              <input type="text" placeholder="search ${d.sitename}..." style="border:0; outline:0; width:240px; font-family:Arial; font-size:12px;">
            </td>
            <td><a href="#" style="display:inline-block; background:linear-gradient(180deg,${p.accent},${p.accent}cc); padding:5px 14px; border:2px outset ${p.accent}; color:#000; font-family:Arial Black,sans-serif; font-size:12px; text-decoration:none; margin-left:4px;">GO!</a></td>
          </tr></table>
        </td>
      </tr></table>

      <!-- secondary nav -->
      <div style="max-width:1000px; margin:6px auto 0; font-family:Arial,sans-serif; font-size:11px; color:${p.accent};">
        <a href="#" style="color:${p.accent}; text-decoration:none;">Hello, sign in</a> &middot;
        <a href="#" style="color:${p.accent}; text-decoration:none;">Your Account</a> &middot;
        <a href="#" style="color:${p.accent}; text-decoration:none;">Your Lists</a> &middot;
        <a href="#" style="color:${p.accent}; text-decoration:none;">Help</a> &middot;
        <a href="#" style="color:${p.accent}; text-decoration:none;"><b>Shopping Cart (0)</b></a>
      </div>
    </div>

    <!-- Tabs -->
    <div style="background:${p.secondary}; padding:0 12px; border-bottom:2px solid #000;">
      <div style="max-width:1000px; margin:0 auto; display:flex; gap:0; flex-wrap:wrap; font-family:Arial,sans-serif; font-size:12px;">
        ${tabs.map((t,i) =>
          `<a href="#" style="display:block; padding:6px 14px; background:${i===0?p.accent:p.primary}; color:${i===0?'#000':p.accent}; text-decoration:none; border-right:1px solid ${p.secondary}; font-weight:${i===0?'bold':'normal'};">${t}</a>`
        ).join('')}
      </div>
    </div>

    <div style="max-width:1000px; margin:0 auto; padding:10px;">

      <!-- Hello bar / pitch -->
      <div style="background:#ffe; border:1px solid #cc9; padding:10px 14px; margin-bottom:10px;">
        <div style="font-family:Arial,sans-serif; font-size:14px; color:${p.primary};"><b>Welcome to ${d.sitename}.com!</b> ${d.welcome}</div>
      </div>

      <table style="width:100%; border-collapse:collapse;"><tr>

        <!-- Left sidebar: category filters -->
        <td style="width:180px; vertical-align:top; padding:4px;">
          <div style="border:1px solid #999; background:#f5f5f5;">
            <div style="background:${p.primary}; color:${p.accent}; padding:4px 8px; font-family:Arial Black,sans-serif; font-size:12px;">BROWSE</div>
            <ul style="list-style:none; padding:8px 10px; margin:0; line-height:1.8; color:${p.primary};">
              ${browse.map(x => `<li>&raquo; <a href="#" style="color:${p.primary};">${x}</a></li>`).join('')}
            </ul>
          </div>

          <div style="margin-top:10px; border:1px solid #999; background:#f5f5f5; padding:8px;">
            <div style="font-family:Arial Black,sans-serif; font-size:12px; color:${p.primary};">YOUR LISTS</div>
            <div style="font-size:11px; color:#666; margin-top:4px;">Sign in to see your Wishlist, Wedding Registry &amp; Baby Registry.</div>
          </div>

        </td>

        <!-- Main: product grid -->
        <td style="vertical-align:top; padding:4px;">

          <div style="border:1px solid #999;">
            <div style="background:${p.primary}; color:${p.accent}; padding:5px 10px; font-family:Arial Black,sans-serif; font-size:13px;">
              FEATURED &middot; HOT THIS WEEK
            </div>
            <table style="width:100%; border-collapse:collapse;">
              ${[0,1].map(row => `<tr>${[0,1,2].map(col => {
                const i = row*3+col;
                const item = items[i] || items[i%items.length];
                const price = (9.99 + Math.floor(Math.random()*40)).toFixed(2);
                const wasPrice = (parseFloat(price) + Math.floor(Math.random()*15+5)).toFixed(2);
                const iconIdx = (hashStrA(p.domain + 'tile' + i) || 0) % 12;
                return `<td style="width:33%; padding:10px; border:1px solid #ddd; vertical-align:top; background:#fff;">
                  ${realProductImg(d, i, p, 90, 80) || productIcon(iconIdx, p, 90, 80)}
                  <div style="font-family:Times New Roman,serif; font-size:12px; margin-top:6px; color:${p.primary}; font-weight:bold; min-height:32px;"><a href="#" style="color:${p.primary};">${item.replace(/&#9733;\s*/,'')}</a></div>
                  <div style="font-size:10px; color:#999; margin-top:2px;">${'&#11088;'.repeat(Math.floor(Math.random()*3+3))} <span style="color:#666;">(${Math.floor(Math.random()*900+50)})</span></div>
                  <div style="margin-top:4px;">
                    <span style="color:#900; font-weight:bold; font-size:14px;">$${price}</span>
                    <span style="text-decoration:line-through; color:#999; font-size:11px; margin-left:4px;">$${wasPrice}</span>
                  </div>
                  <div style="font-size:10px; color:#080; margin-top:2px;"><b>SAVE!!</b></div>
                </td>`;
              }).join('')}</tr>`).join('')}
            </table>
          </div>

          ${rampBanner468('ecom-mid')}

          <div style="margin-top:10px; border:1px solid #999; background:#f5f5f5;">
            <div style="background:${p.primary}; color:${p.accent}; padding:5px 10px; font-family:Arial Black,sans-serif; font-size:13px;">
              ${d.cta}
            </div>
            <div style="padding:12px; text-align:center;">
              <a href="${d.rampLink}" target="_blank" style="display:inline-block; background:linear-gradient(180deg, ${p.accent}, ${p.accent}cc); border:2px outset ${p.accent}; padding:8px 24px; font-family:Arial Black; font-size:16px; color:#000; text-decoration:none;">&raquo; ${d.cta} &laquo;</a>
              <div style="font-size:11px; color:#666; margin-top:6px; font-family:Arial,sans-serif;">Free shipping on orders over $25!</div>
            </div>
          </div>

        </td>
      </tr></table>

      <div style="margin-top:14px; text-align:center; font-family:Arial,sans-serif; font-size:11px; color:#666; border-top:1px solid #ccc; padding-top:10px;">
        ${bestViewedBadge()}
        <div style="margin-top:8px;">${footerTag()}</div>
        <div style="margin-top:6px;">
          (c) ${d.domain} MMXXVI. <button data-restart style="background:#e0e0e0; border:2px outset #e0e0e0; padding:3px 10px; font-family:Arial; font-size:10px;">Y2K-ify another site &raquo;</button>
        </div>
      </div>
    </div>

    ${rampPopupReSpawn('ecom-popup')}
  </div>`;
}

/* ---------- 5. CORPORATE CONSUMER BRAND (McDonald's / Frito-Lay) ---------- */
function tplCorpConsumerBrand(d, p) {
  const brandNav = realNav(d, ['HOME','OUR PRODUCTS','PROMOTIONS','RESTAURANTS','FUN ZONE','CAREERS','ABOUT US'], 7);
  return `
  <div style="background:${p.accent}; min-height:100vh; padding-bottom:90px; color:#000; font-family:'Arial Black','Arial Rounded MT Bold',Arial,sans-serif;">

    ${brandMarquee(p)}

    <!-- Big brand header band -->
    <div style="background:${p.primary}; padding:24px 14px; text-align:center; border-bottom:6px solid ${p.secondary};">
      <h1 style="margin:0; font-family:'Arial Black',sans-serif; font-size:64px; color:${p.accent}; letter-spacing:-2px; text-shadow:4px 4px 0 ${p.secondary};">${d.sitename.toUpperCase()}</h1>
      <div style="font-family:Georgia,serif; font-style:italic; color:${p.accent}; font-size:18px; margin-top:6px;">&laquo; ${d.tagline} &raquo;</div>
    </div>

    <!-- Nav strip in brand color -->
    <div style="background:${p.secondary}; padding:8px; text-align:center; border-bottom:3px solid ${p.primary};">
      ${brandNav.map(x =>
        `<a href="#" style="display:inline-block; padding:4px 12px; color:${p.accent}; font-family:Arial Black,sans-serif; font-size:13px; text-decoration:none; margin:2px;">${String(x).toUpperCase()}</a>`
      ).join(' | ')}
    </div>

    <div style="max-width:880px; margin:0 auto; padding:14px;">

      <!-- Big promo hero card -->
      <div style="background:#fff; border:6px solid ${p.primary}; padding:24px; margin-bottom:14px; text-align:center; box-shadow:8px 8px 0 ${p.secondary};">
        ${(d.productImages && d.productImages[0]) ? `<div style="max-width:420px; margin:0 auto 14px;"><img src="${d.productImages[0].url}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none';" alt="" style="width:100%; max-height:240px; object-fit:cover; border:3px ridge ${p.primary};"></div>` : ''}
        <div style="display:inline-block; background:${p.primary}; color:${p.accent}; padding:6px 14px; transform:rotate(-3deg); font-family:Arial Black; font-size:20px; margin-bottom:14px;">&#9733; NEW!! &#9733;</div>
        <h2 style="margin:0 0 12px; font-family:Arial Black,sans-serif; color:${p.primary}; font-size:36px; letter-spacing:-1px;">${d.cta}</h2>
        <p style="font-family:Georgia,serif; font-size:16px; color:#000; line-height:1.6; max-width:560px; margin:0 auto 16px;">${d.welcome}</p>
        <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:14px 36px; background:linear-gradient(180deg, ${p.primary}, ${p.secondary}); color:${p.accent}; font-family:Arial Black; font-size:20px; text-decoration:none; border:4px outset ${p.primary}; letter-spacing:2px;">CLICK HERE NOW! &raquo;</a>
      </div>

      <!-- Three-up promo cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px;">
        ${(d.bullets || []).slice(0,3).map((b,i) => {
          const colors = [p.primary, p.secondary, p.primary];
          const bg = colors[i % colors.length];
          return `
          <div style="background:${bg}; padding:20px 14px; text-align:center; border:4px ridge ${p.accent}; color:${p.accent};">
            <div style="width:60px; height:60px; margin:0 auto 8px; background:${p.accent}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:Arial Black; color:${bg}; font-size:28px;">${i+1}</div>
            <div style="font-family:Arial Black,sans-serif; font-size:16px; color:${p.accent}; letter-spacing:1px;">${b.replace(/&#9733;\s*/,'').toUpperCase()}</div>
            <a href="#" style="display:inline-block; margin-top:10px; font-family:Georgia,serif; color:${p.accent}; font-size:12px; text-decoration:underline;">learn more &raquo;</a>
          </div>`;
        }).join('')}
      </div>

      <!-- "Find a location" / signup band -->
      <div style="margin-top:14px; background:${p.primary}; padding:18px; text-align:center; border:4px ridge ${p.accent};">
        <div style="font-family:Arial Black,sans-serif; font-size:22px; color:${p.accent}; margin-bottom:8px;">JOIN THE ${d.sitename.toUpperCase()} CLUB!</div>
        <div style="font-family:Georgia,serif; font-style:italic; color:${p.accent}; font-size:13px; margin-bottom:10px;">Get exclusive offers, coupons, and a FREE small ${d.sitename} when you sign up!!</div>
        <input type="email" placeholder="your@email.com" style="padding:6px 10px; border:2px inset #c0c0c0; font-family:Arial; font-size:13px; width:240px;">
        <a href="#" style="display:inline-block; margin-left:4px; padding:6px 18px; background:${p.accent}; color:${p.primary}; font-family:Arial Black; font-size:14px; text-decoration:none; border:2px outset ${p.accent};">JOIN!!</a>
      </div>

      <div style="margin-top:14px; text-align:center; font-family:Arial,sans-serif; font-size:11px; color:#000;">
        <div>&copy; ${d.domain} MMXXVI &middot; All rights reserved &middot; <a href="#" style="color:${p.primary};">Terms</a> &middot; <a href="#" style="color:${p.primary};">Privacy</a> &middot; <a href="#" style="color:${p.primary};">Contact</a></div>
        <div style="margin-top:8px;">${bestViewedBadge()}</div>
        <div style="margin-top:8px;">${footerTag()}</div>
        <div style="margin-top:8px;">
          <button data-restart style="background:${p.primary}; border:3px outset ${p.primary}; color:${p.accent}; padding:4px 14px; font-family:Arial Black; font-size:11px;">Y2K-IFY ANOTHER SITE &raquo;</button>
        </div>
      </div>
    </div>

    ${rampPopupReSpawn('consumer-popup')}
  </div>`;
}

/* ---------- 6. BRIGHT GAME ENTERTAINMENT (Sims-style) ---------- */
function tplBrightEntertainment(d, p) {
  const navItems = realNav(d, ['HOME','PLAY','DOWNLOADS','COMMUNITY','FAN ART','HELP','SHOP'], 7);
  return `
  <div style="background:${p.accent} url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><circle cx='10' cy='10' r='4' fill='%23${p.primary.replace('#','')}40'/><circle cx='40' cy='30' r='3' fill='%23${p.secondary.replace('#','')}40'/><circle cx='20' cy='50' r='5' fill='%23${p.primary.replace('#','')}40'/></svg>&quot;); min-height:100vh; padding-bottom:90px; color:#000; font-family:'Comic Sans MS','Trebuchet MS',sans-serif;">

    ${brandMarquee(p)}

    <!-- Cartoonish header -->
    <div style="background:linear-gradient(180deg, ${p.primary}, ${p.secondary}); padding:18px 14px; border-bottom:6px ridge ${p.accent};">
      <table style="width:100%; max-width:960px; margin:0 auto; border-collapse:collapse;"><tr>
        <td>
          <h1 style="margin:0; font-family:'Comic Sans MS',sans-serif; font-size:48px; color:${p.accent}; text-shadow:3px 3px 0 #000; font-weight:bold;">${d.sitename}!</h1>
          <div style="font-family:'Trebuchet MS',sans-serif; color:${p.accent}; font-size:14px;">${d.tagline}</div>
        </td>
        <td style="text-align:right;">
          <a href="#" style="display:inline-block; background:${p.accent}; color:${p.primary}; padding:6px 14px; border-radius:18px; border:3px solid ${p.primary}; font-family:Trebuchet MS; font-weight:bold; text-decoration:none; margin:2px;">Sign Up FREE!</a>
          <a href="#" style="display:inline-block; background:#fff; color:${p.secondary}; padding:6px 14px; border-radius:18px; border:3px solid ${p.secondary}; font-family:Trebuchet MS; font-weight:bold; text-decoration:none; margin:2px;">Login</a>
        </td>
      </tr></table>
    </div>

    <!-- Nav buttons -->
    <div style="background:#fff; border-bottom:3px ridge ${p.primary}; padding:8px 0; text-align:center;">
      ${navItems.map((x,i) => {
        const c = [p.primary, p.secondary, p.primary, p.secondary][i%4];
        return `<a href="#" style="display:inline-block; padding:5px 14px; background:${c}; color:${p.accent}; border-radius:14px; border:2px solid ${p.accent}; font-family:Trebuchet MS; font-weight:bold; font-size:12px; text-decoration:none; margin:2px;">${String(x).toUpperCase()}</a>`;
      }).join('')}
    </div>

    <div style="max-width:960px; margin:0 auto; padding:14px;">

      <!-- Hero card -->
      <div style="background:#fff; border:4px ridge ${p.primary}; padding:22px; text-align:center; border-radius:14px;">
        ${(d.productImages && d.productImages[0]) ? `<div style="max-width:520px; margin:0 auto 14px;"><img src="${d.productImages[0].url}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none';" alt="" style="width:100%; max-height:240px; object-fit:cover; border-radius:10px; border:3px ridge ${p.primary};"></div>` : ''}
        <h2 style="margin:0 0 8px; font-family:'Comic Sans MS',sans-serif; font-size:32px; color:${p.primary};">Welcome to ${d.sitename}!</h2>
        <p style="font-family:'Trebuchet MS',sans-serif; font-size:15px; line-height:1.7; color:#000; max-width:560px; margin:0 auto 14px;">${d.welcome}</p>
        <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:12px 28px; background:linear-gradient(180deg, ${p.primary}, ${p.secondary}); color:${p.accent}; border:4px outset ${p.accent}; border-radius:24px; font-family:'Comic Sans MS'; font-size:20px; font-weight:bold; text-decoration:none;">${d.cta} &raquo;</a>
      </div>

      <!-- Three-up: characters / features / community -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; margin-top:14px;">
        ${(d.bullets || []).slice(0,3).map((b,i) => {
          const c = i===0 ? p.primary : i===1 ? p.secondary : p.primary;
          const liveImg = d.productImages && d.productImages[i+1]; // skip [0], it's the hero
          const medallion = liveImg
            ? `<div style="width:80px; height:80px; margin:0 auto 8px; border-radius:50%; border:3px solid ${p.accent}; overflow:hidden; background:${c};"><img src="${liveImg.url}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none';" alt="" style="width:100%; height:100%; object-fit:cover; display:block;"></div>`
            : `<div style="width:80px; height:80px; margin:0 auto 8px; background:${c}; border-radius:50%; border:3px solid ${p.accent}; display:flex; align-items:center; justify-content:center; font-size:36px; color:${p.accent}; font-family:Comic Sans MS;">${['&#9733;','&#9829;','&#9786;'][i]}</div>`;
          return `
          <div style="background:#fff; border:4px ridge ${c}; padding:14px; border-radius:14px; text-align:center;">
            ${medallion}
            <div style="font-family:'Comic Sans MS',sans-serif; font-size:16px; font-weight:bold; color:${c};">${b.replace(/&#9733;\s*/,'')}</div>
            <a href="#" style="display:inline-block; margin-top:6px; font-family:Trebuchet MS; color:${c}; font-size:12px;">tell me more &raquo;</a>
          </div>`;
        }).join('')}
      </div>

      <!-- Community stats -->
      <div style="margin-top:14px; background:#fff; border:4px ridge ${p.primary}; border-radius:14px; padding:14px;">
        <h3 style="margin:0 0 8px; font-family:'Comic Sans MS'; color:${p.primary}; font-size:20px; text-align:center;">&#9733; ${d.sitename} Community &#9733;</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:10px; font-family:Trebuchet MS; font-size:13px; color:#000; text-align:center;">
          <div><b style="color:${p.primary}; font-size:20px;">8,420</b><br>players online</div>
          <div><b style="color:${p.secondary}; font-size:20px;">1.2M</b><br>downloads</div>
          <div><b style="color:${p.primary}; font-size:20px;">42k</b><br>fan creations</div>
          <div><b style="color:${p.secondary}; font-size:20px;">99%</b><br>kid-safe</div>
        </div>
      </div>

      ${rampHitCounter()}

      <div style="margin-top:14px; text-align:center; font-family:Trebuchet MS; font-size:11px; color:${p.secondary};">
        ${bestViewedBadge()}
        <div style="margin-top:8px;">${footerTag()}</div>
        <div style="margin-top:8px;">
          (c) ${d.domain} MMXXVI &middot; <button data-restart style="background:${p.primary}; border:3px outset ${p.primary}; color:${p.accent}; padding:3px 12px; border-radius:10px; font-family:Trebuchet MS; font-weight:bold; font-size:11px;">Y2K-ify another! &raquo;</button>
        </div>
      </div>
    </div>

    ${rampPopupReSpawn('bright-popup')}
  </div>`;
}

/* ---------- 7. DESIGN AGENCY EXPERIMENTAL (GMUNK / Chapter3 / Against the Grain) ---------- */
function tplDesignAgency(d, p) {
  const agencyNav = realNav(d, ['work','about','clients','press','contact'], 5);
  return `
  <div style="background:${p.accent === '#ffffff' ? '#f5f5f5' : p.accent}; min-height:100vh; padding-bottom:90px; color:${p.secondary}; font-family:'Helvetica','Arial',sans-serif;">

    ${brandMarquee(p)}

    <!-- Top brand strip: tiny brand mark + tagline + section -->
    <div style="background:${p.secondary}; padding:8px 14px; border-bottom:1px solid ${p.primary};">
      <table style="width:100%; max-width:1100px; margin:0 auto;"><tr>
        <td style="font-family:Helvetica,sans-serif; font-size:11px; color:${p.accent}; letter-spacing:4px; text-transform:uppercase;">[${d.sitename}/2026]</td>
        <td style="text-align:right; font-family:Helvetica,sans-serif; font-size:11px; color:${p.accent}; letter-spacing:2px; text-transform:uppercase;">${agencyNav.map(x => String(x).toLowerCase()).join(' &nbsp; ')}</td>
      </tr></table>
    </div>

    <div style="max-width:1100px; margin:0 auto; padding:60px 14px 14px;">

      <!-- Giant editorial wordmark, off-center -->
      <div style="position:relative; height:200px; margin-bottom:30px;">
        <div style="position:absolute; left:0; top:0; font-family:'Helvetica',sans-serif; font-weight:900; font-size:120px; line-height:0.85; letter-spacing:-6px; color:${p.primary};">${d.sitename.toLowerCase()}<span style="color:${p.secondary};">.</span></div>
        <div style="position:absolute; right:14px; bottom:0; max-width:340px; font-family:'Helvetica',sans-serif; font-size:13px; line-height:1.6; color:${p.secondary}; text-align:right;">${d.tagline}</div>
        <!-- exploding angular shapes -->
        <div style="position:absolute; right:140px; top:14px; width:80px; height:80px; background:${p.primary}; transform:rotate(18deg); opacity:0.85;"></div>
        <div style="position:absolute; right:90px; top:62px; width:30px; height:30px; background:${p.secondary}; transform:rotate(45deg);"></div>
      </div>

      <!-- Three-column grid of "case studies" -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; margin-top:30px;">
        ${(d.bullets || []).slice(0,3).map((b,i) => {
          const colors = [p.primary, p.secondary, p.primary];
          const c = colors[i];
          const liveImg = d.productImages && d.productImages[i];
          const heroBlock = liveImg
            ? `<div style="background:${c}; height:160px; position:relative; overflow:hidden;"><img src="${liveImg.url}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none';" alt="" style="width:100%; height:100%; object-fit:cover; display:block; mix-blend-mode:multiply; opacity:0.85;"><div style="position:absolute; left:12px; bottom:8px; font-family:Helvetica,sans-serif; font-size:48px; font-weight:900; color:${p.accent}; line-height:0.9; mix-blend-mode:difference;">${String(i+1).padStart(2,'0')}</div></div>`
            : `<div style="background:${c}; height:160px; display:flex; align-items:flex-end; padding:12px;"><div style="font-family:Helvetica,sans-serif; font-size:48px; font-weight:900; color:${p.accent}; line-height:0.9;">${String(i+1).padStart(2,'0')}</div></div>`;
          return `
          <div style="background:#fff; border:1px solid ${p.secondary}40;">
            ${heroBlock}
            <div style="padding:14px;">
              <div style="font-family:Helvetica,sans-serif; font-size:10px; letter-spacing:3px; color:${p.primary}; text-transform:uppercase; margin-bottom:6px;">Case Study &middot; ${1998+i}</div>
              <div style="font-family:Helvetica,sans-serif; font-size:18px; font-weight:bold; color:${p.secondary};">${b.replace(/&#9733;\s*/,'')}</div>
              <a href="#" style="display:inline-block; margin-top:10px; font-family:Helvetica,sans-serif; font-size:11px; color:${p.primary}; text-decoration:none; border-bottom:1px solid ${p.primary}; letter-spacing:1px; text-transform:uppercase;">view &rarr;</a>
            </div>
          </div>`;
        }).join('')}
      </div>

      <!-- Manifesto block -->
      <div style="margin-top:50px; padding:40px 14px; border-top:3px solid ${p.primary}; border-bottom:3px solid ${p.primary};">
        <div style="font-family:Helvetica,sans-serif; font-size:11px; letter-spacing:4px; color:${p.primary}; text-transform:uppercase; margin-bottom:14px;">// Manifesto / 01</div>
        <p style="font-family:Georgia,serif; font-style:italic; font-size:22px; line-height:1.4; color:${p.secondary}; max-width:720px; margin:0;">${d.welcome}</p>
        <div style="margin-top:18px; text-align:right;">
          <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:14px 32px; background:${p.primary}; color:${p.accent}; font-family:Helvetica,sans-serif; font-size:12px; letter-spacing:3px; text-decoration:none; text-transform:uppercase; font-weight:bold;">${d.cta} &rarr;</a>
        </div>
      </div>

      <!-- Client logos placeholder -->
      <div style="margin-top:40px;">
        <div style="font-family:Helvetica,sans-serif; font-size:11px; letter-spacing:4px; color:${p.primary}; text-transform:uppercase; margin-bottom:14px;">// Selected Clients</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:14px; font-family:Helvetica,sans-serif; font-size:13px; color:${p.secondary};">
          ${['Acme Corp','Volkswagen','Sony','Nike','MTV','Apple','IBM','Pepsi'].map(x =>
            `<div style="border:1px solid ${p.secondary}40; padding:18px 8px; text-align:center; letter-spacing:1px;">${x}</div>`
          ).join('')}
        </div>
      </div>

      <div style="margin-top:40px; padding-top:14px; border-top:1px solid ${p.secondary}40; font-family:Helvetica,sans-serif; font-size:10px; letter-spacing:2px; color:${p.secondary}80; text-transform:uppercase; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
        <div>(c) ${d.domain} MMXXVI &middot; All rights reserved.</div>
        <div>${bestViewedBadge()}</div>
        <div><button data-restart style="background:transparent; border:1px solid ${p.secondary}; color:${p.secondary}; padding:3px 12px; font-family:Helvetica; font-size:10px; letter-spacing:2px; text-transform:uppercase;">[ Y2K-ify another ]</button></div>
      </div>
      <div style="margin-top:8px; text-align:center;">${footerTag()}</div>
    </div>

    ${rampPopupReSpawn('agency-popup')}
  </div>`;
}

window.realNav = realNav;
window.realProductImg = realProductImg;
window.tplDarkGameShrine = tplDarkGameShrine;
window.tplFlashPromoCinematic = tplFlashPromoCinematic;
window.tplMaximalPortal = tplMaximalPortal;
window.tplCorpEcommercePortal = tplCorpEcommercePortal;
window.tplCorpConsumerBrand = tplCorpConsumerBrand;
window.tplBrightEntertainment = tplBrightEntertainment;
window.tplDesignAgency = tplDesignAgency;

/* ============================================================
   VARIANT TRAITS LAYER
   Picks 8 independent axes per domain. Combined with the
   archetype selection, this yields >2,000,000 distinct outputs.
   ============================================================ */

/* 14 era-accurate font pairings: [heading, body] */
const FONT_PAIRS = [
  ['"Times New Roman", Times, serif',   '"Arial", Helvetica, sans-serif'],
  ['"Courier New", Courier, monospace', '"Verdana", Geneva, sans-serif'],
  ['"Georgia", serif',                  '"Tahoma", Geneva, sans-serif'],
  ['"Comic Sans MS", cursive',          '"Impact", Charcoal, sans-serif'],
  ['"Trebuchet MS", sans-serif',        '"Lucida Sans Unicode", "Lucida Grande", sans-serif'],
  ['"Impact", Charcoal, sans-serif',    '"Courier New", Courier, monospace'],
  ['"Brush Script MT", cursive',        '"Tahoma", Geneva, sans-serif'],
  ['"MS Sans Serif", "Microsoft Sans Serif", Geneva, sans-serif', '"Times New Roman", Times, serif'],
  ['"Verdana", Geneva, sans-serif',     '"Times New Roman", Times, serif'],
  ['"Lucida Console", Monaco, monospace', '"Georgia", serif'],
  ['"Book Antiqua", Palatino, serif',   '"Arial", sans-serif'],
  ['"Copperplate Gothic Light", "Copperplate", serif', '"Verdana", sans-serif'],
  ['"Arial Black", "Arial Bold", Gadget, sans-serif', '"Courier New", monospace'],
  ['"Papyrus", fantasy',                '"Arial", sans-serif'],
];

/* 10 background patterns (CSS strings, ready to drop into background) */
function bgPatternCss(idx, p) {
  const prim = p.primary;
  const sec  = p.secondary;
  const acc  = p.accent;
  switch (idx) {
    case 0: // flat brand secondary
      return `background:${sec};`;
    case 1: // scanlines
      return `background:${sec} repeating-linear-gradient(0deg, ${prim}22 0 1px, transparent 1px 3px);`;
    case 2: // stars on dark
      return `background:#000 url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%23000'/><circle cx='13' cy='17' r='1.2' fill='%23ffffff'/><circle cx='42' cy='8' r='0.8' fill='%23ffffff'/><circle cx='66' cy='34' r='1.4' fill='%23ffffff'/><circle cx='22' cy='51' r='0.9' fill='%23ffffff'/><circle cx='71' cy='62' r='1.1' fill='%23ffffff'/></svg>") repeat;`;
    case 3: // blue → secondary gradient
      return `background:linear-gradient(180deg, ${prim} 0%, ${sec} 100%);`;
    case 4: // checkerboard tile
      return `background:${sec}; background-image:linear-gradient(45deg, ${prim}40 25%, transparent 25%, transparent 75%, ${prim}40 75%), linear-gradient(45deg, ${prim}40 25%, transparent 25%, transparent 75%, ${prim}40 75%); background-size:24px 24px; background-position:0 0, 12px 12px;`;
    case 5: // plaid
      return `background:${sec}; background-image:repeating-linear-gradient(90deg, ${prim}33 0 2px, transparent 2px 18px), repeating-linear-gradient(0deg, ${acc}33 0 2px, transparent 2px 18px);`;
    case 6: // web-safe noise (tiny squares)
      return `background:${sec} url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='2' height='2' fill='%23${prim.replace('#','')}' fill-opacity='0.18'/></svg>") repeat;`;
    case 7: // neon grid
      return `background:#0a0a16; background-image:linear-gradient(${prim}55 1px, transparent 1px), linear-gradient(90deg, ${prim}55 1px, transparent 1px); background-size:32px 32px;`;
    case 8: // parchment (papyrus-y)
      return `background:#f5ebd0; background-image:radial-gradient(circle at 30% 20%, #e8d49a55, transparent 60%), radial-gradient(circle at 70% 80%, #c8a85d33, transparent 50%);`;
    case 9: // diagonal "under construction" stripes
      return `background:repeating-linear-gradient(45deg, ${prim} 0 18px, #000 18px 36px);`;
  }
  return `background:${sec};`;
}

const BG_PATTERN_COUNT = 10;
const BG_PATTERN_NAMES = ['flat','scanlines','starfield','gradient','checker','plaid','noise','neongrid','parchment','construction'];

/* 6 palette modes — each transforms the base brand palette */
function palettePerVariant(idx, base) {
  // base = { primary, secondary, accent }
  const out = { ...base };
  switch (idx) {
    case 0: return out; // as-is
    case 1: // neon-accent — replace accent with hot magenta/cyan
      out.accent = (parseInt(base.primary.slice(1), 16) % 2) ? '#00ffff' : '#ff00ff';
      return out;
    case 2: // chrome — desaturate secondary toward silver
      out.secondary = '#c0c0c0';
      return out;
    case 3: // dark inversion — swap primary/secondary
      return { primary: base.secondary || '#000', secondary: base.primary, accent: base.accent };
    case 4: // pastel-shift — washed
      out.primary = mixWithWhite(base.primary, 0.45);
      out.secondary = mixWithWhite(base.secondary || '#fff', 0.6);
      return out;
    case 5: // hi-contrast yellow-black warning
      out.primary = '#ffd200';
      out.secondary = '#000000';
      out.accent = base.primary;
      return out;
  }
  return out;
}

function mixWithWhite(hex, amt) {
  // amt: 0 = original, 1 = white
  try {
    const h = hex.replace('#','');
    const full = h.length === 3 ? h.split('').map(c=>c+c).join('') : h;
    const r = parseInt(full.slice(0,2),16);
    const g = parseInt(full.slice(2,4),16);
    const b = parseInt(full.slice(4,6),16);
    const mix = (c) => Math.round(c + (255 - c) * amt);
    const to2 = (v) => v.toString(16).padStart(2,'0');
    return '#' + to2(mix(r)) + to2(mix(g)) + to2(mix(b));
  } catch (e) { return hex; }
}

/* 8 decor sets — what ornaments to scatter */
const DECOR_SETS = [
  { blink:true,  marquee:true,  hitcounter:true,  webring:true,  dancingBaby:false, awards:false, sparkles:true,  underConstruction:false },
  { blink:false, marquee:true,  hitcounter:true,  webring:false, dancingBaby:true,  awards:false, sparkles:false, underConstruction:false },
  { blink:true,  marquee:false, hitcounter:false, webring:true,  dancingBaby:false, awards:true,  sparkles:false, underConstruction:false },
  { blink:false, marquee:true,  hitcounter:true,  webring:true,  dancingBaby:false, awards:true,  sparkles:false, underConstruction:false },
  { blink:true,  marquee:true,  hitcounter:false, webring:false, dancingBaby:false, awards:false, sparkles:true,  underConstruction:true  },
  { blink:false, marquee:false, hitcounter:true,  webring:false, dancingBaby:true,  awards:true,  sparkles:true,  underConstruction:false },
  { blink:true,  marquee:false, hitcounter:true,  webring:true,  dancingBaby:false, awards:false, sparkles:false, underConstruction:true  },
  { blink:false, marquee:true,  hitcounter:false, webring:true,  dancingBaby:true,  awards:false, sparkles:false, underConstruction:false },
];

/* 5 copy voices */
const COPY_VOICES = ['corporate','hyperbolic','fanzine','l33t','formal'];

/* 4 heading cases */
const HEADING_CASES = ['upper','title','lower','mixed'];

/* 3 density levels */
const DENSITY = ['minimal','balanced','crammed'];

/* The main trait picker — 8 independent axes, each via a different hash salt */
function variantTraits(p, domain) {
  const d = String(domain || p.domain || '');
  const pick = (salt, n) => hashStrA(d + ':' + salt) % n;
  const fontIdx    = pick('font',    FONT_PAIRS.length);
  const bgIdx      = pick('bg',      BG_PATTERN_COUNT);
  const paletteIdx = pick('palette', 6);
  const navIdx     = pick('nav',     6);
  const decorIdx   = pick('decor',   DECOR_SETS.length);
  const voiceIdx   = pick('voice',   COPY_VOICES.length);
  const caseIdx    = pick('case',    HEADING_CASES.length);
  const densityIdx = pick('density', DENSITY.length);

  // Apply palette mode to the base brand colors:
  const tinted = palettePerVariant(paletteIdx, p);

  return {
    fontHead: FONT_PAIRS[fontIdx][0],
    fontBody: FONT_PAIRS[fontIdx][1],
    fontIdx,
    bgIdx,
    bgPatternName: BG_PATTERN_NAMES[bgIdx],
    paletteIdx,
    navIdx,
    decor: DECOR_SETS[decorIdx],
    decorIdx,
    voice: COPY_VOICES[voiceIdx],
    voiceIdx,
    headingCase: HEADING_CASES[caseIdx],
    caseIdx,
    density: DENSITY[densityIdx],
    densityIdx,
    // also expose the tinted palette so templates can use it directly
    primary:   tinted.primary,
    secondary: tinted.secondary,
    accent:    tinted.accent,
  };
}

/* Heading case transform */
function applyHeadingCase(text, t) {
  if (!text) return text;
  switch (t.headingCase) {
    case 'upper': return String(text).toUpperCase();
    case 'lower': return String(text).toLowerCase();
    case 'mixed': return String(text).split('').map((c,i)=> i%2 ? c.toUpperCase() : c.toLowerCase()).join('');
    default:      return String(text);
  }
}

/* Copy voice transform — wraps a string of bullets/copy in voice.
   Heuristic: short product/nav-like strings (under ~24 chars or no
   sentence-ending punctuation) are treated as "labels" and skip the
   sentence-y wrappers, so we don't get "Please be advised: Featured product"
   on every product card.  */
function applyVoice(text, t) {
  if (!text) return text;
  const s = String(text);
  const isLabel = s.length < 24 && !/[.!?]/.test(s);
  switch (t.voice) {
    case 'corporate':  return s;
    case 'hyperbolic': return s.toUpperCase().replace(/\.$/, '!!!').replace(/$/, ' !!!');
    case 'fanzine':    return isLabel ? s : '~* ' + s + ' *~';
    case 'l33t':       return s.replace(/e/gi,'3').replace(/a/gi,'4').replace(/o/gi,'0').replace(/i/gi,'1').replace(/t/gi,'7').replace(/s/gi,'5');
    case 'formal':     return isLabel ? s : 'Please be advised: ' + s;
    default:           return s;
  }
}

/* Build a decor strip HTML based on trait set */
function decorStrip(t, p) {
  const d = t.decor;
  const bits = [];
  if (d.blink) bits.push(`<span style="color:${t.accent}; font-weight:bold; animation:y2kBlink 1s steps(2) infinite;">[ NEW! ]</span>`);
  if (d.sparkles) bits.push(`<span style="color:${t.accent};">&#10024;&#10024;&#10024;</span>`);
  if (d.hitcounter) bits.push(`<span style="background:#000; color:#0f0; font-family:'Courier New',monospace; padding:2px 6px; border:1px solid ${t.accent};">visitors: 0008${(hashStrA(p.domain+'hc')%900)+100}</span>`);
  if (d.webring) bits.push(`<span style="font-family:'Courier New',monospace; font-size:11px; color:${t.accent};">[&laquo; prev | webring | next &raquo;]</span>`);
  if (d.awards) bits.push(`<span style="background:linear-gradient(180deg,#ffe680,#cc9900); border:2px ridge #cc9900; padding:2px 8px; font-size:10px; font-weight:bold; color:#000;">&#9733; HOT SITE AWARD &#9733;</span>`);
  if (d.dancingBaby) bits.push(`<span title="dancing baby" style="display:inline-block; width:16px; height:16px; background:${t.accent}; border-radius:50%;">&#128118;</span>`);
  if (d.underConstruction) bits.push(`<span style="background:repeating-linear-gradient(45deg,#ffcc00 0 8px,#000 8px 16px); color:#fff; padding:2px 8px; font-weight:bold; font-size:11px;">UNDER CONSTRUCTION</span>`);
  return `<div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; padding:6px 10px; background:#fff; border-top:1px solid #888; border-bottom:1px solid #888; font-family:Verdana,sans-serif; font-size:11px;">${bits.join(' &middot; ')}</div>
  <style>@keyframes y2kBlink { 50% { visibility:hidden; } }</style>`;
}

/* Optional marquee strip when decor.marquee is on */
function decorMarquee(t, p, sitename) {
  if (!t.decor.marquee) return '';
  return `<marquee scrollamount="6" style="background:${t.primary}; color:${t.accent}; font-family:${t.fontBody}; padding:4px 0; font-size:13px; border-bottom:2px ridge ${t.secondary};">
    &#10024; WELCOME TO ${String(sitename).toUpperCase()}.COM &#10024; THE OFFICIAL HOMEPAGE &#10024; UPDATED ${new Date().toLocaleDateString('en-US')} &#10024; Y2K COMPLIANT &#10024; OPTIMIZED FOR NETSCAPE 4 + IE5 &#10024;
  </marquee>`;
}

/* The outer wrapper — wraps any rendered template HTML in the variant skin */
function applyVariantWrapper(innerHtml, p, t) {
  const bg = bgPatternCss(t.bgIdx, { primary: t.primary, secondary: t.secondary, accent: t.accent });
  return `<div data-variant="${p.archetype}-${t.fontIdx}-${t.bgIdx}-${t.paletteIdx}-${t.decorIdx}-${t.voiceIdx}-${t.caseIdx}-${t.densityIdx}" style="${bg} min-height:100vh; font-family:${t.fontBody}; --y2k-prim:${t.primary}; --y2k-sec:${t.secondary}; --y2k-acc:${t.accent}; --y2k-head:${t.fontHead}; --y2k-body:${t.fontBody};">
    ${decorMarquee(t, p, p.sitename)}
    ${innerHtml}
    ${decorStrip(t, p)}
  </div>`;
}

/* Convenience: full pipeline — pick traits, render via the right archetype function, wrap */
function renderVariant(d, p) {
  const t = variantTraits(p, p.domain);
  // resolve the archetype to a template function on window
  const fnByArchetype = {
    'darkGameShrine':         window.tplDarkGameShrine,
    'flashPromoCinematic':    window.tplFlashPromoCinematic,
    'maximalPortal':          window.tplMaximalPortal,
    'corpEcommercePortal':    window.tplCorpEcommercePortal,
    'corpConsumerBrand':      window.tplCorpConsumerBrand,
    'brightGameEntertainment':window.tplBrightEntertainment,
    'designAgency':           window.tplDesignAgency,
    'geocities':              window.tplGeocities,
    'flashPortfolioFuturist': window.tpl2Advanced,
    '2advanced':              window.tpl2Advanced,
  };
  const fn = fnByArchetype[p.archetype] || window.tplGeocities;
  // give the template the *tinted* palette so its inner colors track the palette mode
  const pVar = { ...p, primary: t.primary, secondary: t.secondary, accent: t.accent };

  // Transform d via the chosen voice + heading case BEFORE rendering, so the
  // template's own headings/copy reflect the variant personality.
  // NOTE: `welcome` may contain HTML (e.g. <span id="...">), so transform only
  // the inner text content of the first text node. For safety we only
  // voice-transform fields known to be plain text: tagline, bullets, cta.
  const safeVoice = (s) => {
    if (s == null) return s;
    const str = String(s);
    if (/<[a-z!][^>]*>/i.test(str)) return str; // contains HTML — leave alone
    return applyVoice(str, t);
  };
  // When the data came from a real live-site lookup (d.__live), don't voice-
  // mangle the tagline or bullets — those are the real brand strings and the
  // entire goal is for them to read as the real site.
  const isLive = !!d.__live;
  const dVar = {
    ...d,
    sitename: d.sitename,
    tagline:  isLive ? d.tagline : safeVoice(d.tagline),
    welcome:  d.welcome, // never voice-transform; templates inject as HTML
    cta:      applyHeadingCase(d.cta || 'Enter site', t),
    bullets:  isLive ? (d.bullets || []) : (d.bullets || []).map(b => safeVoice(b)),
    // navLabels were already produced by the live pipeline; preserve as-is.
    navLabels: d.navLabels,
    productImages: d.productImages,
    // Pass the brand category through so realNav() can pick a
    // brand-appropriate fallback (no Books/Music/Video on Petco).
    category: p.category,
  };

  let inner;
  try { inner = fn(dVar, pVar); } catch (e) { inner = `<div style="padding:30px; font-family:monospace; color:red;">Template error: ${e.message}</div>`; }

  // Apply copy voice + heading case to the rendered inner HTML's tagline/headings via post-processing.
  // We avoid the complexity by mutating d in-place before render: but render already happened, so we
  // selectively transform inner content. Skip if voice is 'corporate' (no change).
  // To keep things safe we only transform text inside specific marker classes if templates expose them.

  return applyVariantWrapper(inner, p, t);
}

// Expose
window.variantTraits = variantTraits;
window.applyVariantWrapper = applyVariantWrapper;
window.renderVariant = renderVariant;
window.applyHeadingCase = applyHeadingCase;
window.applyVoice = applyVoice;
