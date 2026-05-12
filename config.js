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
    // 12s gives gpt-4o-mini a cold-start budget; cached hits return in <200ms.
    PROXY_TIMEOUT_MS: 12000,

    // When true, AI generation is used for any non-curated domain (when
    // PROXY_URL is set). When false, even uncurated domains use the
    // regex/archetype pipeline. Handy for A/B comparing.
    USE_AI_GENERATION: true,
  };
})();
