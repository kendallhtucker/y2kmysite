/* ============================================================
   ARCHETYPE SYSTEM
   Maps any input domain to a Y2K archetype + brand-tinted palette,
   then renders a template that matches the brand's vibe.
   Loaded BEFORE script.js so all of its exports are available.
   ============================================================ */

/* ---------- Keyword → category map ---------- */
// Order matters: earlier matches win.
const CATEGORY_RULES = [
  { cat: 'gaming',    re: /(game|play|xbox|nintendo|steam|riot|blizzard|activision|epicgames|gamespot|ign|twitch|valve|ubisoft|rockstar|gta|wow|fortnite|minecraft|roblox|sega|playstation|halo|callofduty)/ },
  { cat: 'media',     re: /(news|times|post|tribune|herald|gazette|journal|magazine|cnn|bbc|fox|nbc|abc|cbs|msnbc|nyt|reuters|bloomberg|wsj|guardian|vogue|wired|theverge|techcrunch|vice|buzzfeed|huffpost|mashable|gizmodo)/ },
  { cat: 'film',      re: /(spotify|soundcloud|pandora|tidal|deezer|apple\.music|youtubemusic|audible|podcast|music|audio|records|sony\.music|warnermusic|universalmusic)/ }, // music = entertainment/cinematic vibe
  { cat: 'corp',      re: /(tesla|ford|gm|toyota|honda|bmw|mercedes|audi|volkswagen|porsche|ferrari|lambo|kia|hyundai|nissan|subaru|volvo|jaguar|landrover|rivian|lucid|polestar|car|auto|motors|peloton|nike|adidas|puma|underarmour|lululemon|gap|uniqlo|hm|zara|levis|gucci|prada|chanel|lvmh|cartier|rolex|tiffany|coach|katespade|guess)/ },
  { cat: 'ecommerce', re: /(shop|store|buy|cart|market|deal|amazon|ebay|etsy|walmart|target|costco|bestbuy|ikea|home\.depot|wayfair|alibaba|aliexpress|shein|temu|zappos|nordstrom|macys|sephora|ulta)/ },
  { cat: 'food',      re: /(food|eat|restaurant|pizza|burger|chicken|coffee|coke|pepsi|sprite|mcdonald|mcd|burgerking|wendys|kfc|tacobell|chipotle|subway|dominos|papajohns|starbucks|dunkin|doordash|ubereats|grubhub|seamless|caviar|postmates|deliveroo|fritolay|hersheys|kelloggs|nestle|kraft|heinz|oreo|lays|doritos|cheetos|skittles|mms|snickers|kitkat|reeses)/ },
  { cat: 'film',      re: /(movie|film|cinema|imdb|netflix|hbo|disney|hulu|paramount|warnerbros|warner|universal|sonypictures|mgm|miramax|a24|fox|peacock|max|primevideo|appletv|theater|theatre|trailer|boxoffice)/ },
  { cat: 'community', re: /(forum|reddit|discord|4chan|digg|slashdot|quora|stackoverflow|stackexchange|community|board|wiki|fandom|deviantart|tumblr|livejournal|xanga|myspace|orkut|friendster|hi5)/ },
  { cat: 'design',    re: /(studio|agency|design|creative|figma|dribbble|behance|pentagram|wieden|droga|ogilvy|saatchi|ideo|frogdesign|huge|rga|akqa|bbh|portfolio)/ },
  { cat: 'finance',   re: /(bank|chase|wellsfargo|citi|hsbc|barclays|santander|td|usbank|capitalone|amex|americanexpress|visa|mastercard|paypal|venmo|cashapp|square|stripe|brex|mercury|gusto|brex|fidelity|schwab|vanguard|robinhood|coinbase|kraken|gemini|finance|invest|trading|broker|mortgage|loan|credit)/ },
  { cat: 'tech',      re: /(\.app$|\.dev$|\.ai$|\.so$|\.io$|cloud|api|saas|platform|software|tech|labs|technologies|systems|solutions|computing|data|analytics|notion|figma|linear|asana|monday|airtable|miro|loom|zoom|slack|github|gitlab|vercel|netlify|render|supabase|firebase|aws|gcp|azure|databricks|snowflake|salesforce|hubspot|stripe|twilio|sentry|datadog|cloudflare|fastly|fly\.io)/ },
  { cat: 'personal',  re: /^(.+\.(me|name|blog|tumblr|substack)$|.*personal|.*portfolio)/ },
];

function categorize(domain) {
  for (const r of CATEGORY_RULES) if (r.re.test(domain)) return r.cat;
  return 'unknown';
}

/* ---------- Category → archetype map ---------- */
// Some categories have two options for variety; we hash-select.
const CATEGORY_ARCHETYPES = {
  'gaming':    ['darkGameShrine', 'brightGameEntertainment'],
  'media':     ['corpEcommercePortal', 'flashPromoCinematic'], // news = portal-ish
  'ecommerce': ['corpEcommercePortal'],
  'food':      ['corpConsumerBrand'],
  'film':      ['flashPromoCinematic', 'darkGameShrine'],
  'community': ['maximalPortal'],
  'design':    ['designAgency', 'flashPortfolioFuturist'],
  'corp':      ['corpConsumerBrand', 'flashPromoCinematic'], // cars / fashion = cinematic brand site
  'finance':   ['corpEcommercePortal'], // serious 3-column portal
  'tech':      ['flashPortfolioFuturist', 'designAgency'],
  'personal':  ['geocities'],
  'unknown':   ['geocities', 'maximalPortal', 'corpConsumerBrand', '2advanced', 'darkGameShrine'],
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

/* ---------- 1. DARK GAME SHRINE (Diablo II / CS / Tomb Raider) ---------- */
function tplDarkGameShrine(d, p) {
  const news = (d.bullets || []).slice(0, 5);
  const news4 = news.length >= 4 ? news : ['NEW: Beta patch 1.04 released', 'TIPS &amp; TRICKS section updated', 'fan-art submissions OPEN', 'official forum: 12,047 users online'];
  return `
  <div style="background:#000 url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23${p.secondary.replace('#','')}'/><path d='M0 100 L200 100 M100 0 L100 200' stroke='%23${p.primary.replace('#','')}' stroke-width='0.5' opacity='0.15'/></svg>&quot;); min-height:100vh; padding-bottom:90px; color:${p.accent}; font-family:'Georgia','Times New Roman',serif;">

    ${brandMarquee(p)}

    <div style="max-width:880px; margin:0 auto; padding:14px;">

      <!-- Big atmospheric banner -->
      <div style="background:linear-gradient(180deg, ${p.secondary} 0%, #000 100%); border:3px ridge ${p.primary}; padding:24px 16px; text-align:center; box-shadow:0 0 40px ${p.primary}40 inset;">
        <h1 style="font-family:'Georgia',serif; font-size:64px; margin:0; color:${p.primary}; text-shadow: 0 0 12px ${p.primary}, 2px 2px 0 #000; letter-spacing:4px; font-weight:bold;">${d.sitename.toUpperCase()}</h1>
        <div style="font-family:'Courier New',monospace; color:${p.accent}; font-size:14px; margin-top:8px; letter-spacing:2px;">&laquo;&laquo; ${d.tagline} &raquo;&raquo;</div>
        <div style="margin-top:14px;">
          <a href="#" style="color:${p.primary}; text-decoration:none; margin:0 8px; font-variant:small-caps; font-size:14px;">[ Enter ]</a>
          <a href="#" style="color:${p.primary}; text-decoration:none; margin:0 8px; font-variant:small-caps; font-size:14px;">[ News ]</a>
          <a href="#" style="color:${p.primary}; text-decoration:none; margin:0 8px; font-variant:small-caps; font-size:14px;">[ Downloads ]</a>
          <a href="#" style="color:${p.primary}; text-decoration:none; margin:0 8px; font-variant:small-caps; font-size:14px;">[ Forum ]</a>
          <a href="#" style="color:${p.primary}; text-decoration:none; margin:0 8px; font-variant:small-caps; font-size:14px;">[ Support ]</a>
        </div>
      </div>

      ${rampBanner468('shrine-top')}

      <!-- Two columns: nav sidebar + main content -->
      <table style="width:100%; border-collapse:collapse; margin-top:12px;"><tr>

        <!-- Sidebar -->
        <td style="width:180px; vertical-align:top; padding:8px; background:#0a0a0a; border:2px ridge ${p.primary}80;">
          <div style="font-family:'Georgia',serif; color:${p.primary}; font-size:14px; font-variant:small-caps; border-bottom:1px solid ${p.primary}; padding-bottom:4px; margin-bottom:8px;">~ Navigation ~</div>
          <ul style="list-style:none; padding:0; margin:0; font-family:'Courier New',monospace; font-size:12px; line-height:1.9; color:${p.accent};">
            <li>&raquo; <a href="#" style="color:${p.accent};">News &amp; Updates</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Walkthroughs</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Cheats &amp; Codes</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Screenshots</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Patches</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Mods</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Forums (4,201)</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Store</a></li>
            <li>&raquo; <a href="#" style="color:${p.accent};">Webmaster</a></li>
          </ul>
          <div style="margin-top:12px; padding:8px; border:1px ridge ${p.primary}; text-align:center;">
            <div style="color:${p.primary}; font-size:11px; font-variant:small-caps;">~ Server Status ~</div>
            <div style="color:${p.accent}; font-family:'Courier New',monospace; font-size:11px; margin-top:4px;">12,847 online<br>Battle.net: <span style="color:#0f0;">UP</span></div>
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

          ${rampBannerExpense('shrine-mid')}

          <div style="margin-top:12px; background:#0a0a0a; border:2px ridge ${p.primary}80; padding:14px;">
            <h2 style="color:${p.primary}; font-family:'Georgia',serif; font-variant:small-caps; margin:0 0 10px;">&#9886; Community</h2>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-family:'Verdana',sans-serif; font-size:12px; color:${p.accent};">
              <div>&#9670; <b>4,201</b> registered members</div>
              <div>&#9670; <b>187,920</b> forum posts</div>
              <div>&#9670; <b>892</b> screenshots in gallery</div>
              <div>&#9670; <b>54</b> active mods</div>
            </div>
          </div>

          ${rampHitCounter()}
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
          &mdash;&nbsp;${d.tagline}&nbsp;&mdash;
        </div>
      </div>

      ${rampBanner468('promo-top')}

      <!-- "Now showing" promo card -->
      <div style="margin:30px auto; max-width:640px; background:${p.primary}; border:6px double ${p.accent}; padding:28px 22px; box-shadow:12px 12px 0 ${p.accent}40;">
        <div style="font-family:'Times New Roman',serif; font-style:italic; color:${p.accent}; font-size:14px; letter-spacing:6px; text-align:center;">NOW PLAYING</div>
        <h2 style="font-family:'Impact',sans-serif; color:${p.accent}; font-size:36px; text-align:center; margin:10px 0 14px; letter-spacing:3px;">${d.sitename.toUpperCase()}: THE WEBSITE</h2>
        <p style="font-family:'Times New Roman',serif; color:${p.accent}; font-size:14px; line-height:1.7; text-align:center; margin:0 0 18px; font-style:italic;">${d.welcome}</p>
        <div style="text-align:center;">
          <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:14px 40px; background:${p.accent}; color:${p.primary}; border:3px solid ${p.accent}; font-family:'Impact',sans-serif; font-size:24px; letter-spacing:4px; text-decoration:none; transition:all 0.2s;">&raquo; ${d.cta} &laquo;</a>
        </div>
      </div>

      <!-- Three-up "scenes" -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin:20px 0;">
        ${(d.bullets || []).slice(0,3).map((b,i) => `
          <div style="background:${p.primary}80; border-left:4px solid ${p.accent}; padding:14px;">
            <div style="font-family:'Times New Roman',serif; font-style:italic; color:${p.accent}80; font-size:11px; letter-spacing:3px;">SCENE ${String(i+1).padStart(2,'0')}</div>
            <div style="font-family:'Impact',sans-serif; color:${p.accent}; font-size:18px; margin-top:6px; letter-spacing:1px;">${b.replace(/&#9733;\s*/,'')}</div>
          </div>
        `).join('')}
      </div>

      ${rampBannerExpense('promo-mid')}

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

      ${rampHitCounter()}
    </div>

    ${rampPopupReSpawn('promo-popup')}
  </div>`;
}

/* ---------- 3. MAXIMAL COMMUNITY PORTAL (Newgrounds-style) ---------- */
function tplMaximalPortal(d, p) {
  const items = (d.bullets || []).slice(0,6);
  while (items.length < 6) items.push('&#9733; Forum post #' + (items.length+1));
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
      ${['Home','News','Submissions','Forums','Top 50','Shop','Audio Portal','BBS','User Login'].map(x =>
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
              ${['Action','Adventure','Comedy','Drama','Experimental','Music','Spam','Stick','Story','Weird'].map(x =>
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

          ${rampHitCounter()}
        </td>

        <!-- Right rail: news + ads -->
        <td style="width:160px; vertical-align:top; padding:4px;">
          <div style="background:${p.primary}40; border:1px solid ${p.accent}; padding:6px;">
            <div style="background:${p.primary}; color:${p.accent}; padding:3px 6px; font-weight:bold;">NEWS</div>
            <div style="padding:6px; color:${p.accent}; font-size:11px; line-height:1.6;">
              <p style="margin:0 0 8px;"><b style="color:${p.accent};">Site update:</b> new dropdowns rolling out this week!!</p>
              <p style="margin:0 0 8px;"><b style="color:${p.accent};">Server:</b> back online after planned downtime</p>
              <p style="margin:0;"><b style="color:${p.accent};">Contest:</b> win a copy of Quake III!!</p>
            </div>
          </div>

          <div style="margin-top:8px;">${aolCdFloater('maxportal-aol')}</div>
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
        ${['Welcome','Books','Music','Video','Electronics','Toys','Home &amp; Garden','Apparel','Tools','Auctions','zShops'].map((t,i) =>
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
              <li>&raquo; <a href="#" style="color:${p.primary};">Bestsellers</a></li>
              <li>&raquo; <a href="#" style="color:${p.primary};">New Releases</a></li>
              <li>&raquo; <a href="#" style="color:${p.primary};">Coming Soon</a></li>
              <li>&raquo; <a href="#" style="color:${p.primary};">Editor's Picks</a></li>
              <li>&raquo; <a href="#" style="color:${p.primary};">Used &amp; Refurb</a></li>
              <li>&raquo; <a href="#" style="color:${p.primary};">International</a></li>
              <li>&raquo; <a href="#" style="color:${p.primary};">Gift Center</a></li>
            </ul>
          </div>

          <div style="margin-top:10px; border:1px solid #999; background:#f5f5f5; padding:8px;">
            <div style="font-family:Arial Black,sans-serif; font-size:12px; color:${p.primary};">YOUR LISTS</div>
            <div style="font-size:11px; color:#666; margin-top:4px;">Sign in to see your Wishlist, Wedding Registry &amp; Baby Registry.</div>
          </div>

          ${rampSkyscraper('ecom-sky')}
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
                return `<td style="width:33%; padding:10px; border:1px solid #ddd; vertical-align:top; background:#fff;">
                  <div style="width:100%; height:80px; background:linear-gradient(135deg, ${p.primary}40, ${p.accent}40); border:1px solid #ccc; display:flex; align-items:center; justify-content:center; font-family:Arial Black; color:${p.primary}; font-size:24px;">
                    [${item.replace(/&#9733;\s*/,'').substring(0,2).toUpperCase()}]
                  </div>
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

          ${rampHitCounter()}
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
      ${['HOME','OUR PRODUCTS','PROMOTIONS','RESTAURANTS','FUN ZONE','CAREERS','ABOUT US'].map(x =>
        `<a href="#" style="display:inline-block; padding:4px 12px; color:${p.accent}; font-family:Arial Black,sans-serif; font-size:13px; text-decoration:none; margin:2px;">${x}</a>`
      ).join(' | ')}
    </div>

    <div style="max-width:880px; margin:0 auto; padding:14px;">

      <!-- Big promo hero card -->
      <div style="background:#fff; border:6px solid ${p.primary}; padding:24px; margin-bottom:14px; text-align:center; box-shadow:8px 8px 0 ${p.secondary};">
        <div style="display:inline-block; background:${p.primary}; color:${p.accent}; padding:6px 14px; transform:rotate(-3deg); font-family:Arial Black; font-size:20px; margin-bottom:14px;">&#9733; NEW!! &#9733;</div>
        <h2 style="margin:0 0 12px; font-family:Arial Black,sans-serif; color:${p.primary}; font-size:36px; letter-spacing:-1px;">${d.cta}</h2>
        <p style="font-family:Georgia,serif; font-size:16px; color:#000; line-height:1.6; max-width:560px; margin:0 auto 16px;">${d.welcome}</p>
        <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:14px 36px; background:linear-gradient(180deg, ${p.primary}, ${p.secondary}); color:${p.accent}; font-family:Arial Black; font-size:20px; text-decoration:none; border:4px outset ${p.primary}; letter-spacing:2px;">CLICK HERE NOW! &raquo;</a>
      </div>

      ${rampBanner468('consumer-top')}

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

      ${rampBannerExpense('consumer-mid')}

      <div style="margin-top:14px; text-align:center; font-family:Arial,sans-serif; font-size:11px; color:#000;">
        <div>&copy; ${d.domain} MMXXVI &middot; All rights reserved &middot; <a href="#" style="color:${p.primary};">Terms</a> &middot; <a href="#" style="color:${p.primary};">Privacy</a> &middot; <a href="#" style="color:${p.primary};">Contact</a></div>
        <div style="margin-top:8px;">${bestViewedBadge()}</div>
        <div style="margin-top:8px;">${footerTag()}</div>
        <div style="margin-top:8px;">
          <button data-restart style="background:${p.primary}; border:3px outset ${p.primary}; color:${p.accent}; padding:4px 14px; font-family:Arial Black; font-size:11px;">Y2K-IFY ANOTHER SITE &raquo;</button>
        </div>
        ${rampHitCounter()}
      </div>
    </div>

    ${rampPopupReSpawn('consumer-popup')}
  </div>`;
}

/* ---------- 6. BRIGHT GAME ENTERTAINMENT (Sims-style) ---------- */
function tplBrightEntertainment(d, p) {
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
      ${['HOME','PLAY','DOWNLOADS','COMMUNITY','FAN ART','HELP','SHOP'].map((x,i) => {
        const c = [p.primary, p.secondary, p.primary, p.secondary][i%4];
        return `<a href="#" style="display:inline-block; padding:5px 14px; background:${c}; color:${p.accent}; border-radius:14px; border:2px solid ${p.accent}; font-family:Trebuchet MS; font-weight:bold; font-size:12px; text-decoration:none; margin:2px;">${x}</a>`;
      }).join('')}
    </div>

    <div style="max-width:960px; margin:0 auto; padding:14px;">

      <!-- Hero card -->
      <div style="background:#fff; border:4px ridge ${p.primary}; padding:22px; text-align:center; border-radius:14px;">
        <h2 style="margin:0 0 8px; font-family:'Comic Sans MS',sans-serif; font-size:32px; color:${p.primary};">Welcome to ${d.sitename}!</h2>
        <p style="font-family:'Trebuchet MS',sans-serif; font-size:15px; line-height:1.7; color:#000; max-width:560px; margin:0 auto 14px;">${d.welcome}</p>
        <a href="${d.rampLink}" target="_blank" style="display:inline-block; padding:12px 28px; background:linear-gradient(180deg, ${p.primary}, ${p.secondary}); color:${p.accent}; border:4px outset ${p.accent}; border-radius:24px; font-family:'Comic Sans MS'; font-size:20px; font-weight:bold; text-decoration:none;">${d.cta} &raquo;</a>
      </div>

      ${rampBanner468('bright-top')}

      <!-- Three-up: characters / features / community -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; margin-top:14px;">
        ${(d.bullets || []).slice(0,3).map((b,i) => {
          const c = i===0 ? p.primary : i===1 ? p.secondary : p.primary;
          return `
          <div style="background:#fff; border:4px ridge ${c}; padding:14px; border-radius:14px; text-align:center;">
            <div style="width:80px; height:80px; margin:0 auto 8px; background:${c}; border-radius:50%; border:3px solid ${p.accent}; display:flex; align-items:center; justify-content:center; font-size:36px; color:${p.accent}; font-family:Comic Sans MS;">${['&#9733;','&#9829;','&#9786;'][i]}</div>
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

      ${rampBannerExpense('bright-mid')}

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
  return `
  <div style="background:${p.accent === '#ffffff' ? '#f5f5f5' : p.accent}; min-height:100vh; padding-bottom:90px; color:${p.secondary}; font-family:'Helvetica','Arial',sans-serif;">

    ${brandMarquee(p)}

    <!-- Top brand strip: tiny brand mark + tagline + section -->
    <div style="background:${p.secondary}; padding:8px 14px; border-bottom:1px solid ${p.primary};">
      <table style="width:100%; max-width:1100px; margin:0 auto;"><tr>
        <td style="font-family:Helvetica,sans-serif; font-size:11px; color:${p.accent}; letter-spacing:4px; text-transform:uppercase;">[${d.sitename}/2026]</td>
        <td style="text-align:right; font-family:Helvetica,sans-serif; font-size:11px; color:${p.accent}; letter-spacing:2px; text-transform:uppercase;">work &nbsp; about &nbsp; clients &nbsp; press &nbsp; contact</td>
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

      ${rampBanner468('agency-top')}

      <!-- Three-column grid of "case studies" -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; margin-top:30px;">
        ${(d.bullets || []).slice(0,3).map((b,i) => {
          const colors = [p.primary, p.secondary, p.primary];
          const c = colors[i];
          return `
          <div style="background:#fff; border:1px solid ${p.secondary}40;">
            <div style="background:${c}; height:160px; display:flex; align-items:flex-end; padding:12px;">
              <div style="font-family:Helvetica,sans-serif; font-size:48px; font-weight:900; color:${c === p.secondary ? p.accent : p.accent}; line-height:0.9;">${String(i+1).padStart(2,'0')}</div>
            </div>
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

      ${rampBannerExpense('agency-mid')}

      <!-- Client logos placeholder -->
      <div style="margin-top:40px;">
        <div style="font-family:Helvetica,sans-serif; font-size:11px; letter-spacing:4px; color:${p.primary}; text-transform:uppercase; margin-bottom:14px;">// Selected Clients</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:14px; font-family:Helvetica,sans-serif; font-size:13px; color:${p.secondary};">
          ${['Acme Corp','Volkswagen','Sony','Nike','MTV','Apple','IBM','Pepsi'].map(x =>
            `<div style="border:1px solid ${p.secondary}40; padding:18px 8px; text-align:center; letter-spacing:1px;">${x}</div>`
          ).join('')}
        </div>
      </div>

      ${rampHitCounter()}

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

/* Copy voice transform — wraps a string of bullets/copy in voice */
function applyVoice(text, t) {
  if (!text) return text;
  const s = String(text);
  switch (t.voice) {
    case 'corporate':  return s;
    case 'hyperbolic': return s.toUpperCase().replace(/\.$/, '!!!').replace(/$/, ' !!!');
    case 'fanzine':    return '~* ' + s + ' *~';
    case 'l33t':       return s.replace(/e/gi,'3').replace(/a/gi,'4').replace(/o/gi,'0').replace(/i/gi,'1').replace(/t/gi,'7').replace(/s/gi,'5');
    case 'formal':     return 'Please be advised: ' + s;
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
  const dVar = {
    ...d,
    sitename: d.sitename,
    tagline:  safeVoice(d.tagline),
    welcome:  d.welcome, // never voice-transform; templates inject as HTML
    cta:      applyHeadingCase(d.cta || 'Enter site', t),
    bullets:  (d.bullets || []).map(b => safeVoice(b)),
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
