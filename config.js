/* y2kmysite — runtime config
 *
 * This file is loaded BEFORE script.js / archetypes.js. Edit values here
 * (no build step) when the deploy URL or feature flags change.
 */
(function () {
  window.Y2K_CONFIG = {
    // Vercel deploy URL of the AI generation proxy (api-proxy/).
    // Bryce sets this after `vercel --prod`. Leave empty string to disable
    // AI generation entirely and use the regex pipeline only.
    PROXY_URL: '',

    // How long to wait for the AI proxy before falling back to regex render.
    // 25s budget: fresh gpt-4o-mini takes 14-18s, cached hits return <200ms.
    PROXY_TIMEOUT_MS: 25000,

    // When true, AI generation is used for any non-curated domain (when
    // PROXY_URL is set). When false, even uncurated domains use the
    // regex/archetype pipeline. Handy for A/B comparing.
    USE_AI_GENERATION: true,

    // When true (default), uncurated domains that have a real year-2000
    // snapshot get rebuilt as authentic HTML via the /api/rebuild endpoint
    // (screenshot → GPT-4o vision → inline HTML, cached forever per-domain).
    // When false, those domains fall through to the variant/archetype pipeline.
    // Replaces the old iframe path entirely — no more iframe in production.
    USE_AI_REBUILD: true,

    // Per-request budget for /api/rebuild. Vercel hobby caps at 60s.
    REBUILD_TIMEOUT_MS: 55000,
  };
})();
