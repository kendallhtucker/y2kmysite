# y2kmysite — AI generation proxy

A tiny Vercel serverless function that takes a domain + scraped brand data and asks
GPT-4o-mini to render a Y2K-styled HTML fragment. The frontend at
[kendallhtucker.github.io/y2kmysite](https://kendallhtucker.github.io/y2kmysite/)
calls this proxy for any domain that isn't hand-curated, then injects the
returned HTML directly into the page.

This subdirectory is its **own deployable Vercel project**. The rest of the repo
(the static site) keeps shipping from GitHub Pages — nothing else changes.

---

## What you (Bryce) need to do

You're deploying this under **your own Vercel account**, not Kendall's.

### 1. Link the project to your Vercel account

```bash
cd y2kmysite/api-proxy
npx vercel login                    # log into your Vercel account
npx vercel link                     # create a NEW Vercel project from this dir
                                    # → pick your personal scope, accept defaults
```

`vercel link` writes `.vercel/project.json` locally — it's already gitignored, so
your account info stays out of the repo.

### 2. Set the OpenAI key as a secret

```bash
npx vercel env add OPENAI_API_KEY production
# paste the key when prompted, hit enter
npx vercel env add OPENAI_API_KEY preview      # optional, for branch previews
npx vercel env add OPENAI_API_KEY development  # optional, for `vercel dev`
```

(You can also do this in the Vercel dashboard: Project → Settings → Environment
Variables.)

### 3. Attach Vercel KV (the cache)

In the Vercel dashboard for the project:

1. **Storage** tab → **Create Database** → **KV**
2. Pick a name (e.g. `y2k-cache`), region close to `iad1`, click Create
3. Hit **Connect Project** and select this project
4. Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` — no manual env setup needed

If you'd rather not use Vercel KV, the function degrades gracefully — it just
won't cache between cold starts. (See "Skipping KV" below.)

### 4. Deploy

```bash
npx vercel --prod
```

You'll get back a URL like `https://y2kmysite-proxy.vercel.app`. Send that URL
to Kendall — she wires it into the frontend by setting `window.Y2K_PROXY_URL`
in the static site config.

### 5. (Optional) Custom domain

Vercel dashboard → Domains → add whatever subdomain you prefer. Frontend
config just needs whatever final URL you land on.

---

## Local development

```bash
cd y2kmysite/api-proxy
npm install
cp .env.example .env.local
# edit .env.local → paste your OpenAI key
npx vercel dev                      # serves on http://localhost:3000
```

Then in a separate terminal:

```bash
node test-local.js brex.com
```

The test script calls `/api/generate` with realistic scraped data for a few
test domains and prints the first 400 chars of the returned HTML.

---

## API

### `POST /api/generate`

**Request body (JSON):**
```jsonc
{
  "domain":      "brex.com",                          // required
  "title":       "Brex | The financial stack...",     // optional, from page <title>
  "description": "All your finances in one place...", // optional, hero/meta description
  "navLabels":   ["Products", "Solutions", "Pricing"],// optional, nav text from the site
  "productImages": [{ "url": "...", "alt": "..." }],  // optional, alt-text used as inspiration
  "brandColors": ["#ff6600", "#222"],                 // optional
  "category":    "finance"                            // optional hint
}
```

**Response:**
```jsonc
{
  "html":   "<div class=\"y2k-page\">...</div>",
  "cached": false,
  "model":  "gpt-4o-mini"
}
```

The HTML is sanitized server-side: `<script>` blocks stripped, event handlers
stripped, external `<img>` tags replaced with broken-image placeholders. Safe
to drop directly into the page via `innerHTML`.

**CORS:** allows `https://kendallhtucker.github.io` and any
`http://localhost:*` origin. Override with the `ALLOWED_ORIGIN` env var if
the production frontend ever moves.

---

## Cost model

- **GPT-4o-mini:** ~$0.15 / 1M input tokens, ~$0.60 / 1M output. Each render is
  roughly ~500 input + ~1500 output tokens → **~$0.001 per generation**.
- **KV cache:** Hit-rate should be very high since most users hit the same
  domains. Cache TTL is 30 days.
- **Vercel function:** ~$0 on the free tier for hobby traffic.

Realistic monthly cost if 5k unique domains get rendered once each: **~$5**.

---

## Skipping KV

If you don't want to set up KV at all, the function still works — it just
re-generates on every cache miss (every cold start, basically). You'll see
`KV read failed` warnings in the logs but no user-visible errors.

To make it fully silent, set `KV_REST_API_URL` and `KV_REST_API_TOKEN` to any
string — the SDK will fail-soft and the code already swallows that.

---

## Files

```
api-proxy/
├── api/
│   └── generate.js     ← the function (POST handler, OpenAI call, KV cache, CORS)
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
├── test-local.js       ← local smoke test
└── README.md           ← you're reading it
```

---

## Questions for Kendall

- Frontend URL to allowlist for CORS: defaults to
  `https://kendallhtucker.github.io`. If you ever move the static site, set
  `ALLOWED_ORIGIN` in Vercel env vars.
- Cache invalidation: bump `SCHEMA_VERSION` in `api/generate.js` to throw out
  all cached generations (e.g. after a prompt edit).
