// /api/generate
//
// AI-generates Y2K-styled brand HTML for y2kmysite.
//
// Request (POST JSON):
//   {
//     domain:        "brex.com",
//     title:         "Brex | The financial stack for growing businesses",
//     description:   "All your finances in one place...",
//     navLabels:     ["Products", "Solutions", "Resources", "Pricing"],
//     productImages: [{ url, alt }, ...],   // optional
//     brandColors:   ["#ff6600", "#222"],   // optional
//     category:      "finance"              // optional hint
//   }
//
// Response:
//   { html: "<div class='y2k-page'>...</div>", cached: true|false, model: "gpt-4o-mini" }
//
// Env vars (set in Vercel):
//   OPENAI_API_KEY         (required)
//   KV_REST_API_URL        (auto from @vercel/kv add-on)
//   KV_REST_API_TOKEN      (auto from @vercel/kv add-on)
//   ALLOWED_ORIGIN         (optional, defaults to https://kendallhtucker.github.io)

import { kv } from '@vercel/kv';
import crypto from 'node:crypto';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://kendallhtucker.github.io';
const MODEL = 'gpt-4o-mini';
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const SCHEMA_VERSION = 'v1';                  // bump to invalidate all cache

const SYSTEM_PROMPT = `You are a Y2K web designer working in the year 2000. You receive structured data about a modern company and must imagine what their website would have looked like if it had launched in 1999-2001.

OUTPUT FORMAT
- Return ONLY a single HTML fragment. No <html>, <head>, <body>, no markdown, no commentary, no code fences.
- Wrap everything in <div class="y2k-page">...</div>.
- All CSS must be inline on elements (style="..."). Do NOT use <style> tags or external stylesheets.
- Do NOT include <script> tags or any JavaScript.
- Do NOT load remote images. If you want a "broken image" feel, use a colored <div> with text inside.
- Keep total output under ~6000 characters.

REQUIRED PAGE STRUCTURE (in this order)
1. Top banner: company name in giant Impact / Comic Sans / Times font, with marquee-style tagline. Use the company's real positioning but rewritten in late-90s marketing voice.
2. "Last updated" / "visitors counter" / webring strip.
3. A nav row of the actual navLabels from the input, styled as colored button-like links separated by " | ". Use the real labels — do not invent generic ones like "Home / About / Contact" unless navLabels is empty.
4. A welcome paragraph that re-explains what the company actually does in early-internet language (mentioning "world wide web", "information superhighway", "56k modem", "Netscape Navigator", "Internet Explorer 5.5", etc. where it fits the brand).
5. A bulleted feature list (★ or ☆ or » bullets) that reflects the company's REAL value props from the input description — translated into Y2K marketing speak.
6. A "What's New!!" or "News" box with 2-3 fake updates that match the company's domain (e.g. for a payments company: "NEW! 128-bit SSL checkout"; for a design tool: "Macromedia Shockwave plugin now supported").
7. A small "Webmaster's pick" or "Site of the month" badge area.
8. A footer with "Best viewed in Netscape 4.7 at 800x600" and a fake hit counter.

VISUAL RULES
- Background: tiled gradient, starfield, or solid bright color (lime, cyan, magenta, neon green). Use background-image gradients freely.
- Heavy use of <blink>-feel (red/yellow alternating text using inline styles is fine; we cannot animate). Use color: red on key CTAs.
- Borders should be ridge, groove, or outset, 3-5px, in saturated colors.
- Fonts: mix Comic Sans MS, Impact, Times New Roman, Courier New — use the wrong font for the wrong context on purpose.
- Use <table>-like layouts (you can use display:table or just stacked divs with fixed widths) — left sidebar with links, center main column, right sidebar with "ads".
- Include at least one fake animated-gif placeholder (small colored div labeled "[NEW!]" or "[HOT!]" with a rotating-feel border).
- Use horizontal <hr> with style="border: 2px ridge #ff00ff" liberally.

VOICE
- ALL CAPS for excitement.
- Multiple exclamation points!!!
- "u" instead of "you", "ur" instead of "your".
- HTML entities for sparkle: &#9733; &#9734; &#10084; &#127919;
- The content must be UNMISTAKABLY about the specific company in the input — never generic. A reader should look at the page and immediately know which brand it is.

DO NOT
- Do not output anything that isn't the y2k-page div.
- Do not include real images (no <img src=...>).
- Do not include forms, inputs, or buttons that submit.
- Do not use modern CSS features (no flexbox, no grid, no var(), no calc, no rgba alpha). Use floats, fixed widths, and named colors / hex.
- Do not mention that this is AI-generated or a parody.`;

function corsHeaders(origin) {
  const allow = origin && (origin === ALLOWED_ORIGIN || origin.startsWith('http://localhost'))
    ? origin
    : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function applyHeaders(res, headers) {
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
}

function normalizeDomain(d) {
  return String(d || '')
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function cacheKey(payload) {
  // Key on domain + a hash of the meaningful brand inputs so re-renders with
  // identical data hit cache, but if the upstream live-lookup pulls different
  // copy we regenerate.
  const sig = {
    d: payload.domain,
    t: (payload.title || '').slice(0, 200),
    desc: (payload.description || '').slice(0, 400),
    n: (payload.navLabels || []).slice(0, 12),
  };
  const h = crypto.createHash('sha1').update(JSON.stringify(sig)).digest('hex').slice(0, 16);
  return `y2k:${SCHEMA_VERSION}:${payload.domain}:${h}`;
}

function buildUserPrompt(p) {
  const lines = [];
  lines.push(`Company domain: ${p.domain}`);
  if (p.title)       lines.push(`Real page title: ${p.title}`);
  if (p.description) lines.push(`Real tagline / description: ${p.description}`);
  if (p.category)    lines.push(`Category hint: ${p.category}`);
  if (Array.isArray(p.navLabels) && p.navLabels.length) {
    lines.push(`Real navigation labels (USE THESE VERBATIM in the nav row, do not paraphrase): ${p.navLabels.slice(0, 10).join(' | ')}`);
  }
  if (Array.isArray(p.brandColors) && p.brandColors.length) {
    lines.push(`Brand colors to riff on (but feel free to clash them with Y2K neon): ${p.brandColors.slice(0, 4).join(', ')}`);
  }
  if (Array.isArray(p.productImages) && p.productImages.length) {
    const alts = p.productImages.map(i => i && i.alt).filter(Boolean).slice(0, 6);
    if (alts.length) lines.push(`Product / hero image alt-text (use as content inspiration, but DO NOT embed any <img> tags): ${alts.join(' ; ')}`);
  }
  lines.push('');
  lines.push('Now generate the Y2K homepage HTML fragment for this exact company. The output must be specifically about this brand, not a generic template.');
  return lines.join('\n');
}

function sanitizeHtml(html) {
  if (!html) return '';
  let h = String(html).trim();
  // Strip code fences if the model ignored instructions
  h = h.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  // Strip <script> blocks defensively
  h = h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  // Strip event handlers
  h = h.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
  h = h.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
  // Remove <img src="..."> with external URLs — replace with broken-image placeholder
  h = h.replace(/<img\b[^>]*>/gi, '<div style="display:inline-block;width:80px;height:60px;background:#c0c0c0;border:2px inset #888;color:#000;font:11px Tahoma;text-align:center;line-height:60px;">[image]</div>');
  return h;
}

async function callOpenAI(payload) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const body = {
    model: MODEL,
    temperature: 0.9,
    max_tokens: 2200,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: buildUserPrompt(payload) },
    ],
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenAI ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  const content = json && json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
  if (!content) throw new Error('OpenAI returned no content');
  return content;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  applyHeaders(res, corsHeaders(origin));

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST required' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const domain = normalizeDomain(body.domain);
  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    res.status(400).json({ error: 'invalid domain' });
    return;
  }

  const payload = {
    domain,
    title:         (body.title || '').toString().slice(0, 300),
    description:   (body.description || '').toString().slice(0, 800),
    navLabels:     Array.isArray(body.navLabels)     ? body.navLabels.slice(0, 12).map(s => String(s).slice(0, 60)) : [],
    productImages: Array.isArray(body.productImages) ? body.productImages.slice(0, 8) : [],
    brandColors:   Array.isArray(body.brandColors)   ? body.brandColors.slice(0, 4)   : [],
    category:      (body.category || '').toString().slice(0, 40),
  };

  const key = cacheKey(payload);

  // 1. KV cache lookup
  let cached = null;
  try {
    cached = await kv.get(key);
  } catch (e) {
    // KV may be misconfigured locally / on first deploy. Don't fail the request.
    console.warn('KV read failed:', e && e.message);
  }
  if (cached && typeof cached === 'object' && cached.html) {
    res.status(200).json({ html: cached.html, cached: true, model: cached.model || MODEL });
    return;
  }

  // 2. AI generation
  let raw;
  try {
    raw = await callOpenAI(payload);
  } catch (e) {
    console.error('OpenAI error:', e && e.message);
    res.status(502).json({ error: 'generation_failed', detail: (e && e.message) || 'unknown' });
    return;
  }

  const html = sanitizeHtml(raw);
  if (!html || html.length < 200 || !/y2k-page/.test(html)) {
    res.status(502).json({ error: 'invalid_generation', detail: html.slice(0, 200) });
    return;
  }

  // 3. KV write (best effort)
  try {
    await kv.set(key, { html, model: MODEL, at: Date.now() }, { ex: CACHE_TTL_SECONDS });
  } catch (e) {
    console.warn('KV write failed:', e && e.message);
  }

  res.status(200).json({ html, cached: false, model: MODEL });
}
