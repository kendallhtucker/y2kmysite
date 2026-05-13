// /api/rebuild
//
// Screenshot-based Y2K rebuild for uncurated domains.
//
// Pipeline (per domain):
//   1. Frontend resolves a year-2000 archive snapshot URL and POSTs it here.
//   2. We headless-render that snapshot to a PNG (puppeteer-core + @sparticuz/chromium).
//   3. We send the PNG to GPT-4o vision with a prompt telling it to rebuild the
//      page as a single self-contained Y2K HTML fragment (no scripts, inline CSS).
//   4. We cache the HTML in Vercel KV by domain forever (until manually busted).
//   5. Return { html, cached, model } to the client.
//
// Request (POST JSON):
//   {
//     domain:     "petco.com",            // required, used as cache key
//     snapshotUrl:"https://web.archive.org/web/20000301000000/http://petco.com/",
//     displayDate:"Mar 1, 2000",          // optional, for footer text
//     navLabels:  ["Dogs","Cats","Fish"], // optional, helps the model
//   }
//
// Response:
//   { html: "<div class='y2k-page'>...</div>", cached: true|false, model: "gpt-4o" }
//
// Env vars (set in Vercel):
//   OPENAI_API_KEY      (required)
//   KV_REST_API_URL     (auto from @vercel/kv add-on)
//   KV_REST_API_TOKEN   (auto from @vercel/kv add-on)
//   ALLOWED_ORIGIN      (optional, defaults to https://kendallhtucker.github.io)

import crypto from 'node:crypto';

// Vercel KV at runtime; stub when not configured (local dev).
let kv = { async get() { return null; }, async set() { return null; } };
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const mod = await import('@vercel/kv');
    if (mod && mod.kv) kv = mod.kv;
  }
} catch (_) { /* SDK not installed locally — keep stub */ }

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://kendallhtucker.github.io';
const MODEL = 'gpt-4o';                       // vision-capable, latest
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 90;  // 90 days
const SCHEMA_VERSION = 'v1';                  // bump to invalidate ALL cache
const SCREENSHOT_WIDTH = 1024;
const SCREENSHOT_HEIGHT = 1400;               // tall enough to capture hero + first scroll

const SYSTEM_PROMPT = `You are a Y2K web designer rebuilding a circa-2000 web page from a single screenshot.

You will receive ONE image showing what a real web site looked like in early 2000 (archived snapshot). Your job is to recreate that page as a self-contained, modern-browser-safe HTML fragment that preserves the LOOK and CONTENT of the original — but is real DOM, not an iframe and not an image.

OUTPUT FORMAT
- Return ONLY a single HTML fragment. No <html>, <head>, <body>, no markdown, no commentary, no code fences.
- Wrap everything in <div class="y2k-page">...</div>.
- All CSS MUST be inline on elements (style="..."). Do NOT use <style> tags or external stylesheets except for a single <style> block at the very top scoped to .y2k-page if you need @keyframes for marquee / blink. Keep that block under 300 chars.
- Do NOT include <script> tags or any JavaScript.
- Do NOT load remote images. If the original had a logo or hero image, replace it with a styled text/div banner that mimics the colors and shape. Use solid-color or gradient <div>s with text inside to approximate image regions.
- Keep total output under ~7000 characters.

FAITHFULNESS RULES
- Match the original color palette as closely as possible (background color, navbar color, link color, accent colors).
- Preserve the actual nav labels, section headings, body copy, button text — read them off the screenshot. Do NOT invent generic Y2K filler if real text is legible.
- Match the layout structure: if the original was a 2-column table layout with left sidebar nav, your output should be a 2-column table layout with left sidebar nav.
- Match the typography vibe: Times New Roman for body when the original used serif, Arial/Verdana for nav, etc. Use <font face=""> tags when appropriate — it's Y2K.
- If you can see a logo, recreate it as a styled text block (large, colored, bold, with the original wordmark text).
- If the page has a "What's New" / news box / product list, include that exact section with the real items visible in the screenshot.

Y2K AUTHENTICITY ADDITIONS (subtle, do not overdo)
- A single <marquee> at top or bottom is OK if it fits the brand.
- "Last updated" date and a fake visitor counter in the footer.
- "Best viewed in Netscape 4 / IE5 at 800x600" badge in the footer.
- Border styles like border:2px outset, border:2px ridge — period-accurate.
- Hover effects are fine via inline style :hover is not supported inline, so skip them.

ABSOLUTE BANS
- No iframes.
- No <img> tags pointing at external URLs (you may not embed the screenshot or any archived asset).
- No invented branding. If the screenshot shows "Petco", your output says "Petco" — not "PetMart" or "Pet Palace".
- No modern flat design. Tables, ridges, gradients, table-based layout — embrace it.

Return ONLY the HTML fragment.`;

function setCors(res, req) {
  const origin = (req && req.headers && req.headers.origin) || '';
  // Allow github.io deploy + localhost dev. Anything else: deny.
  if (origin === ALLOWED_ORIGIN || /^https?:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function cacheKey({ domain }) {
  const norm = String(domain || '').toLowerCase().replace(/^www\./, '').trim();
  const h = crypto.createHash('sha1').update(norm).digest('hex').slice(0, 12);
  return `rebuild:${SCHEMA_VERSION}:${norm}:${h}`;
}

async function screenshotSnapshot(snapshotUrl) {
  // Lazy-load chromium so local dev (where these aren't installed) doesn't crash on import.
  const chromium = (await import('@sparticuz/chromium')).default;
  const puppeteer = await import('puppeteer-core');

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT, deviceScaleFactor: 1 },
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  try {
    const page = await browser.newPage();
    // Wayback can be slow; give it a generous budget.
    await page.goto(snapshotUrl, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});
    // Force-hide the Wayback toolbar overlay so it doesn't end up in the model's view.
    await page.evaluate(() => {
      try {
        const tb = document.querySelector('#wm-ipp-base, #wm-ipp, #wm-ipp-print');
        if (tb) tb.remove();
      } catch (_) {}
    }).catch(() => {});
    const buf = await page.screenshot({ type: 'png', fullPage: false, clip: { x: 0, y: 0, width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT } });
    return Buffer.from(buf);
  } finally {
    await browser.close().catch(() => {});
  }
}

async function visionRebuild(pngBuffer, { domain, displayDate, navLabels }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');
  const b64 = pngBuffer.toString('base64');
  const userText = [
    `Domain: ${domain}`,
    displayDate ? `Snapshot date: ${displayDate}` : '',
    navLabels && navLabels.length ? `Nav labels visible (hint): ${navLabels.join(', ')}` : '',
    '',
    'Rebuild this page as a single Y2K HTML fragment per the rules. Return only HTML.',
  ].filter(Boolean).join('\n');

  const body = {
    model: MODEL,
    temperature: 0.4,
    max_tokens: 3500,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: userText },
          { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
        ],
      },
    ],
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const errTxt = await resp.text().catch(() => '');
    throw new Error(`openai ${resp.status} ${errTxt.slice(0, 200)}`);
  }
  const json = await resp.json();
  let html = (json && json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) || '';
  html = String(html).trim();
  // Strip accidental code fences.
  html = html.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '').trim();
  if (!html.includes('y2k-page')) {
    // Last-resort wrap so downstream isn't broken.
    html = `<div class="y2k-page">${html}</div>`;
  }
  return html;
}

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: 'method_not_allowed' })); return; }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (_) { body = {}; }
  }
  const { domain, snapshotUrl, displayDate, navLabels } = body || {};
  if (!domain || !snapshotUrl) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'missing_domain_or_snapshot' }));
    return;
  }

  const key = cacheKey({ domain });

  // 1. Cache hit?
  try {
    const cached = await kv.get(key);
    if (cached && cached.html) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ html: cached.html, cached: true, model: cached.model || MODEL }));
      return;
    }
  } catch (_) { /* KV miss/error — proceed */ }

  // 2. Screenshot the snapshot.
  let png;
  try {
    png = await screenshotSnapshot(snapshotUrl);
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'screenshot_failed', detail: String(e && e.message || e).slice(0, 300) }));
    return;
  }

  // 3. Vision rebuild.
  let html;
  try {
    html = await visionRebuild(png, { domain, displayDate, navLabels });
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'rebuild_failed', detail: String(e && e.message || e).slice(0, 300) }));
    return;
  }

  // 4. Persist to KV (best-effort).
  try {
    await kv.set(key, { html, model: MODEL, at: Date.now() }, { ex: CACHE_TTL_SECONDS });
  } catch (_) { /* swallow */ }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ html, cached: false, model: MODEL }));
}
