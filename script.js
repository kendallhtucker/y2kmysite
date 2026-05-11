/* ==================================================================
   Y2KMYSITE.COM  -  A Ramp Marketing Stunt for the year MMXXVI
   ================================================================== */

const RAMP_BASE = 'https://ramp.com/?rc=6S7S4B&referral_location=referral_page&utm_source=y2kmysite&utm_campaign=stunt';
const ramp = (medium) => `${RAMP_BASE}&utm_medium=${medium}`;

/* ==================================================================
   STAGE 1: POPUP HELL
   ================================================================== */

const POPUPS = [
  // ---- SUGGESTIVE / DATING ----
  {
    cls: 'pink',
    title: 'HOT SINGLES IN YOUR L.A.N. !!',
    icon: '&#128152;',
    body: `<div class="singles-pic"></div>
           <p><b>Wendy, 21</b> is in YOUR neighborhood and wants to chat!! <span class="blink">&#128293;</span></p>
           <p style="font-size:11px; color:#800040;">She says: <i>"asl?? r u single steve?? lol"</i></p>`,
    btns: [{ label: 'CLICK HERE STEVE', primary: true }, { label: 'Maybe Later' }]
  },
  {
    cls: 'pink',
    title: 'New message from xX_Cyb3rChik_Xx',
    icon: '&#128483;',
    body: `<p style="font-family:'Comic Sans MS',cursive; color:#c00080; font-size:13px;">~* a/s/l ?? *~</p>
           <p style="font-size:11px;">xX_Cyb3rChik_Xx wants to send you a <b>WEBCAM PHOTO!!</b> &#128247;</p>`,
    btns: [{ label: 'Accept &#10145;', primary: true }, { label: 'Block' }]
  },

  // ---- VIRUS / SYSTEM ALERTS ----
  {
    cls: 'red',
    title: 'NORTON ANTIVIRUS - CRITICAL ALERT',
    icon: '&#9888;',
    body: `<p style="color:#c00; font-weight:bold;">YOUR PC HAS 47 VIRUSES !!!</p>
           <p style="font-size:11px;">Norton AntiVirus 2000 subscription has <span class="blink">EXPIRED</span>.</p>
           <p style="font-size:11px;">Detected: Trojan.WIN32.Stoned, ILOVEYOU.vbs, Melissa, AnnaKournikova.jpg.vbs, Sub7</p>`,
    btns: [{ label: 'FIX NOW !!!', primary: true }, { label: 'Ignore (risky)' }]
  },
  {
    cls: 'red',
    title: 'SYSTEM ERROR',
    icon: '&#128165;',
    body: `<p style="font-family:'Courier New',monospace; font-size:11px;">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM</p>
           <p style="font-size:11px;">Press OK to continue, or Cancel to debug. Just kidding both do the same thing.</p>`,
    btns: [{ label: 'OK', primary: true }, { label: 'Cancel' }]
  },
  {
    cls: '',
    title: 'Download MORE R.A.M.!!',
    icon: '&#128190;',
    body: `<p>Your computer is running <b>SLOW</b>!! You only have <b>64 MB</b> of RAM!!</p>
           <p style="font-size:11px;">Click below to download an additional <b>128 MB of RAM</b> directly to your hard drive via the world wide web.</p>`,
    btns: [{ label: 'DOWNLOAD RAM &#11015;', primary: true }, { label: 'No thanks I like being slow' }]
  },

  // ---- LOTTERY / PRIZE ----
  {
    cls: 'gold',
    title: 'CONGRATULATIONS!!!',
    icon: '&#127881;',
    body: `<div class="you-won">YOU&apos;RE THE 1,000,000th VISITOR!!</div>
           <p>You have won a <b>FREE NOKIA 3310</b> and a <b>$500 BEST BUY GIFT CARD</b>!!</p>
           <p style="font-size:11px;">Just enter your e-mail and credit card and social security number to claim!</p>`,
    btns: [{ label: 'CLAIM PRIZE &#127942;', primary: true }, { label: 'Nope' }]
  },
  {
    cls: 'gold',
    title: 'FREE NOKIA 3310',
    icon: '&#128241;',
    body: `<p style="font-family:'Comic Sans MS',cursive; font-size:14px; color:#cc7700;">~* GREAT N3WS *~</p>
           <p>Submit your email below to win a brand new <b>Nokia 3310</b> with built in <b>SNAKE II</b>!!</p>
           <input type="text" placeholder="your-email@hotmail.com" style="width:90%; padding:4px; border:2px inset #c0c0c0; font-family:Tahoma; font-size:12px;">`,
    btns: [{ label: 'SUBMIT &#10145;', primary: true }]
  },

  // ---- GAME / PUNCH THE MONKEY ----
  {
    cls: 'red',
    title: 'PUNCH THE MONKEY AND WIN!!',
    icon: '&#129409;',
    body: `<div style="background:linear-gradient(90deg,#ff0080,#ffff00,#00ffff); padding:6px; text-align:center;">
             <div style="font-family:Impact,sans-serif; color:#fff; font-size:18px; text-shadow:2px 2px 0 #000;">PUNCH THE MONKEY<br>AND WIN $20!!</div>
             <div class="punch-monkey" style="background:radial-gradient(circle at 35% 35%,#fff 0 4px,transparent 5px),radial-gradient(circle at 65% 35%,#fff 0 4px,transparent 5px),radial-gradient(circle at 50% 55%,#000 0 3px,transparent 4px),radial-gradient(circle at 50% 50%,#a0522d 0 50%,transparent 51%),#8b4513;"></div>
             <div style="font-size:11px; color:#fff; text-shadow:1px 1px 0 #000;">no purchase necessary*</div>
           </div>`,
    btns: [{ label: 'PUNCH!! &#129307;', primary: true }]
  },

  // ---- RAMP EASTER EGGS (THE PAYLOAD) ----
  {
    cls: 'red',
    title: 'URGENT - EXPENSE REPORT OVERDUE',
    icon: '&#128276;',
    body: `<p style="color:#c00; font-weight:bold;">Your expense reports are <span class="blink">47 days</span> overdue!!</p>
           <p style="font-size:11px;">Your CFO is on the phone. Your manager has been notified. <br>You could just be using <a href="${ramp('popup-expense')}" target="_blank" style="color:#0000ee;"><b>Ramp.com</b></a> instead.</p>`,
    btns: [{ label: 'File now', primary: true }, { label: 'Switch to Ramp &raquo;', ramp: 'popup-expense-btn' }]
  },
  {
    cls: '',
    title: 'AmEx Corporate Card - DECLINED',
    icon: '&#128179;',
    body: `<p style="font-weight:bold;">Your corporate AmEx has been <span style="color:#c00;">DECLINED</span> at TGI Friday's.</p>
           <p style="font-size:11px;">Your clients are staring. Update billing information OR consider switching to <a href="${ramp('popup-amex')}" target="_blank" style="color:#0000ee;"><b>Ramp&trade;</b></a> &mdash; the corporate card that auto-approves.</p>`,
    btns: [{ label: 'Update billing', primary: true }, { label: 'Get Ramp instead', ramp: 'popup-amex-btn' }]
  },
  {
    cls: 'gold',
    title: 'SAVINGS DETECTED!!',
    icon: '&#128176;',
    body: `<div class="you-won" style="background:#00ff00; color:#000;">FOUND: $14,000 / yr</div>
           <p style="font-size:11px;"><b>Ramp.com</b> has detected a duplicate Salesforce subscription on your books.</p>
           <p style="font-size:11px;">Why are you paying for it twice, Steve??</p>`,
    btns: [{ label: 'Recover $14k &#11015;', primary: true, ramp: 'popup-duplicate-sub' }, { label: 'Ignore' }]
  },
  {
    cls: 'pink',
    title: 'PSST !! YOUR CFO',
    icon: '&#128526;',
    body: `<p style="font-family:'Comic Sans MS',cursive; color:#c00080;">~* hey big spender *~</p>
           <p style="font-size:11px;">Your CFO wants to know why you booked <b>$8,400</b> on the company card at <b>Dave &amp; Buster's</b> last quarter.</p>
           <p style="font-size:11px;"><b>Ramp</b> would&apos;ve flagged that. &#129335;</p>`,
    btns: [{ label: 'Pretend I didn&apos;t see this', primary: true }, { label: 'Get Ramp', ramp: 'popup-cfo' }]
  },
  {
    cls: 'red',
    title: 'ACCOUNTING.EXE has stopped responding',
    icon: '&#128173;',
    body: `<p style="font-family:'Courier New',monospace; font-size:12px;">Your <b>month-end close</b> has been running for <b>26 days</b>.</p>
           <p style="font-size:11px;">Companies on <a href="${ramp('popup-close')}" target="_blank" style="color:#0000ee;"><b>Ramp</b></a> close <b>8x faster</b>. Faster than your 56k modem!!</p>`,
    btns: [{ label: 'Wait forever', primary: true }, { label: 'Close with Ramp &raquo;', ramp: 'popup-close-btn' }]
  },
];

let popupZ = 200;
let popupCount = 0;
let popupSpawnTimer = null;

function spawnPopup(def, opts = {}) {
  const win = document.createElement('div');
  win.className = 'win98 popup';
  popupCount++;

  // random position, biased toward viewport
  const W = Math.min(window.innerWidth, 1200);
  const H = Math.max(window.innerHeight - 80, 400);
  const popW = 280 + Math.floor(Math.random() * 60);
  const left = Math.max(10, Math.floor(Math.random() * (W - popW - 20)));
  const top = Math.max(10, Math.floor(Math.random() * (H - 280)));
  win.style.left = left + 'px';
  win.style.top = top + 'px';
  win.style.width = popW + 'px';
  win.style.zIndex = (++popupZ);

  const tcls = def.cls ? 'titlebar ' + def.cls : 'titlebar';
  win.innerHTML = `
    <div class="${tcls}">
      <div class="ttext"><span class="ticon">${def.icon || '&#9888;'}</span> ${def.title}</div>
      <div class="controls">
        <div class="ctl-btn">_</div>
        <div class="ctl-btn">&#9633;</div>
        <div class="ctl-btn close-btn" title="Close">&times;</div>
      </div>
    </div>
    <div class="body">${def.body}
      <div class="btnrow">
        ${(def.btns||[{label:'OK',primary:true}]).map((b,i)=>`<button class="os ${b.primary?'pri':''}" data-i="${i}" ${b.ramp?`data-ramp="${b.ramp}"`:''}>${b.label}</button>`).join(' ')}
      </div>
    </div>
  `;

  document.getElementById('desktop').appendChild(win);
  makeDraggable(win);

  // close on X
  win.querySelector('.close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    closePopup(win);
  });

  // any button closes; ramp button opens link
  win.querySelectorAll('button.os').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rampMedium = btn.getAttribute('data-ramp');
      if (rampMedium) {
        window.open(ramp(rampMedium), '_blank');
      }
      closePopup(win);
      // closing one spawns 2 more!
      if (popupSpawnTimer) {
        setTimeout(() => spawnPopup(randomPopupDef()), 80);
        setTimeout(() => spawnPopup(randomPopupDef()), 200);
      }
    });
  });

  // focus on click
  win.addEventListener('mousedown', () => { win.style.zIndex = (++popupZ); });

  // taskbar entry
  const taskId = 't' + Math.random().toString(36).slice(2,8);
  win.dataset.taskId = taskId;
  const tasks = document.getElementById('tasks');
  if (tasks) {
    const tb = document.createElement('div');
    tb.className = 'task-item active';
    tb.id = taskId;
    tb.innerHTML = `<span>${def.icon || '&#9888;'}</span> ${def.title.slice(0,18)}`;
    tasks.appendChild(tb);
  }

  return win;
}

function closePopup(win) {
  const tid = win.dataset.taskId;
  if (tid) {
    const tb = document.getElementById(tid);
    if (tb) tb.remove();
  }
  win.style.transition = 'transform 0.15s, opacity 0.15s';
  win.style.transform = 'scale(0.5)';
  win.style.opacity = '0';
  setTimeout(() => win.remove(), 150);
}

function randomPopupDef() {
  return POPUPS[Math.floor(Math.random() * POPUPS.length)];
}

function makeDraggable(win) {
  const bar = win.querySelector('.titlebar');
  if (!bar) return;
  let sx, sy, ox, oy, dragging = false;
  const start = (e) => {
    if (e.target.closest('.controls')) return;
    dragging = true;
    const p = e.touches ? e.touches[0] : e;
    sx = p.clientX; sy = p.clientY;
    ox = parseInt(win.style.left || 0, 10);
    oy = parseInt(win.style.top || 0, 10);
    win.style.zIndex = (++popupZ);
    e.preventDefault();
  };
  const move = (e) => {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    win.style.left = (ox + p.clientX - sx) + 'px';
    win.style.top = (oy + p.clientY - sy) + 'px';
  };
  const end = () => { dragging = false; };
  bar.addEventListener('mousedown', start);
  bar.addEventListener('touchstart', start, { passive: false });
  document.addEventListener('mousemove', move);
  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('mouseup', end);
  document.addEventListener('touchend', end);
}

/* Start spawning popups on a cascade */
function startPopupHell() {
  // shuffle order so each session feels different but always hit the Ramp eggs
  const order = shuffle([...POPUPS.keys()]);
  let i = 0;
  popupSpawnTimer = setInterval(() => {
    if (i >= order.length) {
      clearInterval(popupSpawnTimer);
      popupSpawnTimer = null;
      // crash a moment after the last one
      setTimeout(triggerCrash, 1400);
      return;
    }
    spawnPopup(POPUPS[order[i]]);
    i++;
  }, 320);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ==================================================================
   STAGE 2: CRASH SEQUENCE
   ================================================================== */

function triggerCrash() {
  // screen-flicker effect
  const desktop = document.getElementById('desktop');
  let flickers = 0;
  const flick = setInterval(() => {
    desktop.style.filter = (flickers % 2 === 0) ? 'invert(1) hue-rotate(180deg)' : 'none';
    flickers++;
    if (flickers > 4) {
      clearInterval(flick);
      desktop.style.filter = 'none';
      // show BSOD
      document.getElementById('bsod').classList.add('show');
      // hide desktop + taskbar + popups
      document.querySelectorAll('.popup').forEach(p => p.remove());
      document.getElementById('desktop').style.display = 'none';
      document.querySelector('.taskbar').style.display = 'none';
      setTimeout(() => {
        document.getElementById('bsod').classList.remove('show');
        document.getElementById('black').classList.add('show');
        setTimeout(() => {
          document.getElementById('black').classList.remove('show');
          document.getElementById('y2k').classList.add('show');
        }, 900);
      }, 2800);
    }
  }, 80);
}

/* Allow skip-ahead by pressing any key or clicking anywhere during popup hell */
function maybeSkip(e) {
  if (popupSpawnTimer) {
    clearInterval(popupSpawnTimer);
    popupSpawnTimer = null;
  }
}

/* ==================================================================
   STAGE 3: IE5 ADDRESS BAR
   ================================================================== */

function showIE5() {
  document.getElementById('ie5').classList.add('show');
  document.getElementById('render').classList.remove('show');
  document.getElementById('render').innerHTML = '';
  document.getElementById('footbar').classList.add('hidden');
  setTimeout(() => {
    const inp = document.getElementById('urlinput');
    if (inp) inp.focus();
  }, 200);
}

function restartFlow() {
  showIE5();
}

function goY2K() {
  const raw = document.getElementById('urlinput').value.trim();
  if (!raw) {
    document.getElementById('urlinput').focus();
    return;
  }
  routeTo(normalizeURL(raw));
}

function quickGo(url) {
  document.getElementById('urlinput').value = url;
  routeTo(normalizeURL(url));
}

function normalizeURL(u) {
  let url = u.toLowerCase().trim();
  url = url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  // strip path
  url = url.split('/')[0];
  if (!url.includes('.')) url = url + '.com';
  return url;
}

function routeTo(domain) {
  // show dialing modal
  document.getElementById('dial-target').textContent = 'http://www.' + domain;
  document.getElementById('dial-action').textContent = 'Dialing...';
  document.getElementById('dial-status').textContent = 'Negotiating handshake at 56,600 bps...';
  const bar = document.getElementById('dial-bar');
  bar.style.width = '0%';
  document.getElementById('dialing').classList.add('show');

  const stages = [
    { pct: 12,  msg: 'Negotiating handshake at 56,600 bps...', act: 'Dialing...' },
    { pct: 28,  msg: 'Authenticating user@aol.com...',           act: 'Connecting...' },
    { pct: 46,  msg: 'You&apos;ve got mail!!',                  act: 'Connecting...' },
    { pct: 64,  msg: 'Resolving DNS for ' + domain + '...',      act: 'Loading...' },
    { pct: 82,  msg: 'Downloading site ('+ (180 + Math.floor(Math.random()*220)) +' KB)...', act: 'Loading...' },
    { pct: 100, msg: 'Done.',                                    act: 'Loading...' },
  ];
  let i = 0;
  const tick = () => {
    if (i >= stages.length) {
      setTimeout(() => {
        document.getElementById('dialing').classList.remove('show');
        renderSite(domain);
      }, 400);
      return;
    }
    const s = stages[i++];
    bar.style.width = s.pct + '%';
    document.getElementById('dial-status').innerHTML = s.msg;
    document.getElementById('dial-action').textContent = s.act;
    setTimeout(tick, 360 + Math.random() * 220);
  };
  tick();
}

/* ==================================================================
   STAGE 4: SITE RENDERING
   ================================================================== */

const CURATED = {
  // ramp.com: special-cased above (redirect to ramp2000)
  'google.com':  { template: 'google2000',  data: null },
  'nytimes.com': { template: 'nytimes2000', data: null },
  'apple.com':   { template: 'apple2000',   data: null },
  'stripe.com':  { template: '2advanced',   data: stripeSiteData() },
  'openai.com':  { template: 'openai2000',  data: null },
  'linear.app':  { template: 'linear2000',  data: null },
};

// Templates available for unknown / hash-routed sites
const TEMPLATE_NAMES = ['geocities', '2advanced', 'yahoo'];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function renderSite(domain) {
  // Special case: ramp.com redirects to the real ramp2000 site
  if (domain === 'ramp.com') {
    window.location.href = 'https://kendallhtucker.github.io/ramp2000/';
    return;
  }

  document.getElementById('ie5').classList.remove('show');
  const render = document.getElementById('render');
  render.classList.add('show');

  let template, data;
  if (CURATED[domain]) {
    template = CURATED[domain].template;
    data = CURATED[domain].data;
  } else {
    template = TEMPLATE_NAMES[hashStr(domain) % TEMPLATE_NAMES.length];
    data = genericSiteData(domain);
  }

  // For unknown sites, attempt live-fetch enrichment.
  if (!CURATED[domain]) {
    enrichWithLiveFetch(domain, data);
  }

  let html = '';
  if (template === 'google2000')      html = tplGoogle2000();
  else if (template === 'nytimes2000') html = tplNYTimes2000();
  else if (template === 'apple2000')   html = tplApple2000();
  else if (template === 'openai2000')  html = tplOpenAI2000();
  else if (template === 'linear2000')  html = tplLinear2000();
  else if (template === 'geocities')   html = tplGeocities(data);
  else if (template === '2advanced')   html = tpl2Advanced(data);
  else if (template === 'yahoo')       html = tplYahoo(data);
  else                                 html = tplGeocities(data);

  render.innerHTML = html;

  // wire up restart on the in-template buttons
  render.querySelectorAll('[data-restart]').forEach(b => b.addEventListener('click', restartFlow));

  // Show persistent footbar
  document.getElementById('footbar').classList.remove('hidden');
  bumpAndShowCounter();
  window.scrollTo(0,0);
}

function formatCounter(n) { return n.toLocaleString('en-US'); }

// Real live counter: increments shared counter on counterapi.dev,
// shows resulting count in the marquee. This is the *actual* number of
// sites y2k-ified across all visitors. If the API is unreachable, we
// hide the inline number rather than lie.
function bumpAndShowCounter() {
  const el = document.getElementById('visit-count');
  if (!el) return;
  // Guard against double-counting if user re-runs flow rapidly
  if (window.__y2kCounterPending) return;
  window.__y2kCounterPending = true;
  el.textContent = '...';
  fetch('https://api.counterapi.dev/v1/y2kmysite/sites_generated/up', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : null)
    .then(j => {
      window.__y2kCounterPending = false;
      if (j && typeof j.count === 'number') {
        el.textContent = formatCounter(j.count);
      } else {
        el.textContent = 'many';
      }
    })
    .catch(() => {
      window.__y2kCounterPending = false;
      el.textContent = 'many';
    });
}

function enrichWithLiveFetch(domain, data) {
  // Best-effort, CORS-friendly. We try a simple text excerpt from a public proxy; fail silently.
  const url = `https://r.jina.ai/https://${domain}`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 4000);
  fetch(url, { signal: controller.signal })
    .then(r => r.ok ? r.text() : null)
    .then(text => {
      clearTimeout(t);
      if (!text) return;
      // grab a tagline-ish snippet
      const m = text.match(/Title:\s*(.+)/);
      if (m) {
        const t = document.getElementById('lf-title');
        if (t) t.textContent = m[1].slice(0, 120);
      }
      const blurb = text.split('\n').filter(l => l.length > 60 && l.length < 240).slice(0, 3);
      if (blurb.length) {
        const b = document.getElementById('lf-blurb');
        if (b) b.textContent = blurb.join(' ');
      }
    })
    .catch(() => {});
}

/* ============ SITE DATA ============ */

function rampSiteData() {
  return {
    domain: 'ramp.com',
    sitename: 'RAMP.COM',
    tagline: '~ * The Corporate Card for Companies 26 Years Old and Counting * ~',
    welcome: "Welcome to RAMP&trade; - the WORLD WIDE WEB&apos;S #1 destination for corporate cards, expense management, and SAVING UR COMPANY MILLIONS!!! &#128176;&#128176;&#128176;",
    bullets: [
      "&#9733; Get the FASTEST corporate card on the information superhighway!!",
      "&#9733; <b>5% cashback</b> on all internet-related purchases (modems, AOL CDs, etc.)",
      "&#9733; Close your books <b>8x FASTER</b> than your 56k modem!!",
      "&#9733; Catch DUPLICATE subscriptions before they catch YOU!!",
      "&#9733; Now featuring R.A.M.P. A.I. for AUTO-CODING ur expenses!!",
    ],
    cta: 'GET RAMP NOW!!!',
    rampLink: ramp('ramp-curated'),
    crossLink: 'https://kendallhtucker.github.io/ramp2000/'
  };
}

function googleSiteData() {
  return {
    domain: 'google.com',
    sitename: 'GOOGLE!',
    tagline: 'Y!OUR FAVORITE WEB DIRECTORY since the year MM!',
    welcome: "Search the world wide web for sites, files, mp3s, and other stuff! Featuring categories carefully sorted by REAL humans (mostly Steve)!",
    bullets: [
      'Arts &amp; Humanities &raquo; Painting, Sculpture, Photography...',
      'Business &amp; Economy &raquo; Companies, Finance, Jobs...',
      'Computers &amp; Internet &raquo; Software, Hardware, WWW...',
      'Entertainment &raquo; TV, Movies, Music, Celebrities...',
      'News &amp; Media &raquo; Newspapers, TV, Radio...',
      'Recreation &amp; Sports &raquo; Sports, Travel, Outdoors...',
    ],
    cta: 'BROWSE THE WEB!',
    rampLink: ramp('google-curated'),
  };
}

function stripeSiteData() {
  return {
    domain: 'stripe.com',
    sitename: 'S//TRIPE.',
    tagline: 'pay::ments  //  for the next/generation of the WEB',
    welcome: 'ENTER SITE :: a payments infrastructure for the post-Y2K internet economy.',
    bullets: [
      '// SECURE TRANSMISSION at 128-bit encryption',
      '// API endpoints rated for 56,600 BPS and beyond',
      '// trusted by FORTUNE 500 companies in 12 countries',
      '// flash-based checkout flow (req. Macromedia Shockwave)',
    ],
    cta: '&raquo; ENTER SITE &laquo;',
    ctaLink: 'https://stripe.com/',
    rampLink: ramp('stripe-curated'),
  };
}

function genericSiteData(domain) {
  const name = domain.split('.')[0].toUpperCase();
  return {
    domain,
    sitename: name + '!',
    tagline: '<span id="lf-title">~ * the official ' + domain + ' home-page * ~</span>',
    welcome: '<span id="lf-blurb">Welcome to the home-page of ' + name + ' on the world wide web!! This site has been Y2K-ified by Y2KMYSITE.COM for ur viewing pleasure!!</span>',
    bullets: [
      '&#9733; Home',
      '&#9733; About Us',
      '&#9733; News &amp; Updates',
      '&#9733; Contact Webmaster',
      '&#9733; Sign Our Guestbook',
      '&#9733; Links',
    ],
    cta: 'ENTER ' + name + '!',
    rampLink: ramp('generic-' + domain),
  };
}

/* ==================================================================
   TEMPLATES
   ================================================================== */

/* ---------- Ramp ad component pool, reusable across templates ---------- */
function rampBanner468(medium) {
  return `<a href="${ramp(medium)}" target="_blank" style="display:block; width:100%; max-width:468px; height:60px; margin:8px auto; background:linear-gradient(90deg,#00ff00,#ffff00,#ff8000); border:3px ridge #ff00ff; text-align:center; font-family:Impact,sans-serif; color:#000; text-decoration:none; line-height:1.1; padding:6px; box-sizing:border-box;">
    <div style="font-size:18px; color:#c00;">&#127919; RAMP.COM &mdash; YOUR CORPORATE CARD ON THE</div>
    <div style="font-size:16px; color:#0000ee;">INFORMATION SUPERHIGHWAY! <span class="blink">5% CASHBACK!!</span></div>
    <div style="font-size:10px; font-family:Tahoma; font-weight:normal;">click HERE &#128073; FREE 14-day trial!! No credit card req. (yes it is)</div>
  </a>`;
}

function rampBannerExpense(medium) {
  return `<a href="${ramp(medium)}" target="_blank" style="display:block; width:100%; max-width:468px; height:60px; margin:8px auto; background:repeating-linear-gradient(45deg,#ff0080 0 10px,#ffff00 10px 20px); border:3px outset #00ffff; text-align:center; font-family:'Comic Sans MS',cursive; color:#000; text-decoration:none; padding:6px; box-sizing:border-box;">
    <div style="font-size:14px;">Tired of <b style="color:#c00;">EXPENSE REPORTS</b>??</div>
    <div style="font-size:16px; color:#0000ee; font-family:Impact;">Get <span style="color:#c00;">RAMP</span> &mdash; now <u>Y2K compliant</u>!!</div>
  </a>`;
}

function rampSkyscraper(medium) {
  return `<a href="${ramp(medium)}" target="_blank" style="display:block; width:120px; min-height:240px; background:linear-gradient(180deg,#ff00ff,#00ffff,#ffff00); border:3px ridge #ff0080; padding:8px; text-align:center; font-family:Impact,sans-serif; color:#000; text-decoration:none; box-sizing:border-box;">
    <div style="font-size:14px; line-height:1.1;">PUNCH THE</div>
    <div style="font-size:24px; color:#c00; line-height:1; text-shadow:1px 1px 0 #fff;">RAMP</div>
    <div style="font-size:14px; line-height:1.1;">CARD AND WIN</div>
    <div style="font-size:20px; color:#0000ee; line-height:1; margin-top:6px;">$50,000,000</div>
    <div style="font-size:10px; line-height:1.1; margin-top:4px;">in caught overbilling!!</div>
    <div style="margin-top:8px; font-size:11px; background:#000; color:#ffff00; padding:2px;" class="blink">CLICK!!</div>
  </a>`;
}

function aolCdFloater(medium) {
  return `<a href="${ramp(medium)}" target="_blank" style="display:inline-block; width:130px; text-align:center; text-decoration:none; color:#000; font-family:'Arial Black',sans-serif; transform:rotate(-8deg); margin:4px;">
    <div style="width:120px; height:120px; border-radius:50%; background:radial-gradient(circle at 50% 50%,#fff 0 18px,transparent 19px),conic-gradient(from 0deg,#ff0080,#00ffff,#ffff00,#ff0080); border:3px solid #c0c0c0; box-shadow:2px 2px 6px #00000080; display:flex; align-items:center; justify-content:center; flex-direction:column;">
      <div style="background:#000; color:#fff; font-size:13px; padding:2px 6px;">RAMP</div>
      <div style="font-size:10px; margin-top:2px; color:#000;">1,000 FREE HOURS</div>
      <div style="font-size:8px; color:#c00;">corporate cards!!</div>
    </div>
  </a>`;
}

function rampPopupReSpawn(medium) {
  // small in-page "popup" embedded into the site (not a true window)
  return `<div style="position:fixed; bottom:50px; right:12px; z-index:5000; width:240px; background:#c0c0c0; border:2px outset #c0c0c0; box-shadow:3px 3px 0 #00000060; font-family:Tahoma; font-size:12px;">
    <div style="background:linear-gradient(90deg,#c00,#f00); color:#fff; padding:3px 6px; font-weight:bold; display:flex; justify-content:space-between;">
      <span>&#9888; WAIT!!</span>
      <span style="cursor:pointer;" onclick="this.parentElement.parentElement.style.display='none'">&times;</span>
    </div>
    <div style="padding:8px; color:#000;">
      <p style="margin:0 0 6px; color:#000;">Before you go!!</p>
      <p style="margin:0 0 6px; font-size:11px; color:#000;">Switch to <a href="${ramp(medium)}" target="_blank" style="color:#0000ee;"><b>Ramp</b></a> and save <b style="color:#c00;">$250K/yr</b>!</p>
      <div style="text-align:center;"><a href="${ramp(medium)}" target="_blank" style="background:linear-gradient(180deg,#ffff00,#ff8800); border:2px outset #ffff00; padding:2px 10px; color:#000; text-decoration:none; font-weight:bold;">CLAIM &raquo;</a></div>
    </div>
  </div>`;
}

function rampWebring(medium) {
  return `<div style="text-align:center; margin:20px auto; padding:8px; background:#000; color:#fff; font-family:'Courier New',monospace; font-size:12px; border:2px ridge #ffd700; max-width:520px;">
    &laquo; Prev: <s>brex.com</s> &nbsp;|&nbsp; <a href="${ramp(medium)}" target="_blank" style="color:#ffff00;"><b>Next: ramp.com</b> &raquo;</a> &nbsp;|&nbsp; <a href="${ramp(medium+'-ring-random')}" target="_blank" style="color:#00ffff;">[Random]</a>
    <br><span style="font-size:10px; color:#ff80ff;">The FINTECH WEBRING &mdash; 47 sites and counting!!</span>
  </div>`;
}

function rampHitCounter() {
  return `<div style="margin:14px auto; text-align:center; font-family:'Courier New',monospace; font-size:12px;">
    <div style="display:inline-block; background:#000; color:#0f0; padding:4px 10px; border:2px inset #c0c0c0; letter-spacing:4px; font-size:18px;">050,847,193</div>
    <div style="font-size:11px; color:#400;">Visitors saved by <a href="${ramp('hitcounter')}" target="_blank" style="color:#0000ee;"><b>Ramp</b></a></div>
  </div>`;
}

function topMarquee() {
  return `<marquee scrollamount="6" style="background:#000080; color:#ffff00; font-family:'Courier New',monospace; font-size:14px; padding:4px; border-bottom:2px ridge #ffd700;">
    &#9733; NEW! Ramp announces auto-coding A.I. &mdash; 67% increase in accuracy!! &#9733; &nbsp;&nbsp; Try RAMP free for 14 days @ <a href="${ramp('top-marquee')}" target="_blank" style="color:#ff80ff;">ramp.com</a> &#9733; &nbsp;&nbsp; Y2K compliant since MMXIX!! &#9733; &nbsp;&nbsp; Your finance software should be better than it was in 1999!! &#9733;
  </marquee>`;
}

function bestViewedBadge() {
  return `<div style="display:inline-block; margin:6px 4px; padding:4px 8px; background:#c0c0c0; border:2px outset #c0c0c0; font-family:'MS Sans Serif',Tahoma; font-size:10px; color:#000;">
    <b>Best viewed in</b><br>
    <span style="color:#c00;">RAMP&trade; 5.0</span> @ 800&times;600
  </div>`;
}

function underConstructionGif() {
  // pure CSS construction worker stick figure on black/yellow stripes
  return `<div style="display:inline-block; margin:6px 4px; vertical-align:middle;">
    <div style="width:120px; height:60px; background:repeating-linear-gradient(45deg,#000 0 10px,#ffd700 10px 20px); position:relative; border:2px ridge #ffd700;">
      <div style="position:absolute; left:8px; top:6px; width:18px; height:18px; background:#ffd700; border-radius:50%; border:2px solid #000;"></div>
      <div style="position:absolute; left:14px; top:24px; width:6px; height:18px; background:#000;"></div>
      <div style="position:absolute; left:6px; top:28px; width:22px; height:4px; background:#000; transform:rotate(-30deg);"></div>
      <div style="position:absolute; left:32px; top:6px; right:4px; font-family:Impact,sans-serif; font-size:11px; color:#000; line-height:1; padding-top:8px;">UNDER<br>CONSTRUCTION</div>
    </div>
    <div style="font-size:9px; text-align:center; font-family:Tahoma; color:#000;">Your finance stack &mdash; get <b>Ramp</b> to finish it!</div>
  </div>`;
}

function footerTag() {
  return `Brought to you by <a href="${ramp('footer-tag')}" target="_blank"><b>Ramp&trade;</b></a> &mdash; because your finance software should be better than it was in 1999.`;
}

/* ---------- TEMPLATE A: GEOCITIES / HOMER PAGE ---------- */
function tplGeocities(d) {
  const isRamp = d.domain === 'ramp.com';
  return `
  <div style="background:#ffffff url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' fill='%23004080'/><circle cx='10' cy='10' r='3' fill='%23ffff00'/><circle cx='30' cy='25' r='2' fill='%23ff00ff'/><circle cx='20' cy='35' r='2.5' fill='%2300ffff'/><path d='M5 20 L8 17 L11 20 L8 23 Z' fill='%23ffff00'/></svg>&quot;); background-attachment: fixed; min-height: 100vh; padding-bottom: 90px; color:#000; font-family:'Times New Roman',serif;">

    ${topMarquee()}

    <div style="max-width:780px; margin:0 auto; background:#ffffffd0; padding:14px; border:3px ridge #ff00ff;">

      <!-- HUGE flaming title -->
      <div style="text-align:center; padding:10px 6px;">
        <h1 style="font-family:Impact,'Arial Black',sans-serif; font-size:54px; margin:0; color:#ff0000; text-shadow:3px 3px 0 #ffff00, 6px 6px 0 #000080, 9px 9px 0 #000; letter-spacing:3px;" class="blink-slow">${d.sitename}</h1>
        <div style="font-family:'Comic Sans MS',cursive; color:#0000ee; font-size:16px; margin-top:8px;">${d.tagline}</div>
        <div style="margin-top:10px;">
          ${'&#10024;'.repeat(3)} <a href="#" style="color:#ee0000; text-decoration:underline;">HOME</a> | <a href="#" style="color:#ee0000;">ABOUT</a> | <a href="#" style="color:#ee0000;">GUESTBOOK</a> | <a href="#" style="color:#ee0000;">LINKS</a> | <a href="#" style="color:#ee0000;">WEBMASTER</a> ${'&#10024;'.repeat(3)}
        </div>
      </div>

      ${rampBanner468('geo-top')}

      <!-- main two-column layout: skyscraper + content -->
      <table style="width:100%; border-collapse:collapse; margin-top:10px;"><tr>
        <td style="width:130px; vertical-align:top; padding:4px;">
          ${rampSkyscraper('geo-sky')}
          <div style="margin-top:10px; text-align:center;">${aolCdFloater('geo-aol')}</div>
        </td>
        <td style="vertical-align:top; padding:4px;">

          <div style="background:#ffffcc; border:2px ridge #ff8800; padding:10px; font-family:'Comic Sans MS',cursive; color:#000080;">
            <p style="margin:0 0 6px; font-size:13px;">${d.welcome}</p>
          </div>

          <h2 style="font-family:Impact,sans-serif; color:#008000; text-shadow:2px 2px 0 #ffff00; margin:14px 0 6px; font-size:24px;">&#10024; FEATURES &#10024;</h2>
          <ul style="font-family:'Comic Sans MS',cursive; font-size:13px; color:#000080; line-height:1.7; list-style:none; padding-left:0;">
            ${d.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>

          <div style="text-align:center; margin:16px 0;">
            <a href="${d.rampLink}" target="_blank" style="display:inline-block; background:linear-gradient(180deg,#ff0000,#ffff00); border:4px outset #ff8800; padding:10px 26px; font-family:Impact,sans-serif; font-size:24px; color:#000; text-decoration:none; text-shadow:1px 1px 0 #fff;" class="pulse">&#11088; ${d.cta} &#11088;</a>
          </div>

          ${rampBannerExpense('geo-mid')}

          ${isRamp ? `
          <div style="margin:14px 0; padding:10px; background:#000080; color:#ffff00; border:3px ridge #00ffff; text-align:center; font-family:'Comic Sans MS',cursive;">
            <p style="margin:0 0 6px;">&#127948; CHECK OUT MY OTHER PAGE!! &#127948;</p>
            <a href="${d.crossLink}" target="_blank" style="color:#00ffff; font-family:Impact,sans-serif; font-size:20px;">&raquo; RAMP SKATER 2000 &laquo;</a>
            <p style="margin:6px 0 0; font-size:11px;">play the OFFICIAL RAMP&trade; skater game &mdash; works in IE5 + Netscape 4!!</p>
          </div>` : ''}

          <h2 style="font-family:Impact,sans-serif; color:#800080; text-shadow:2px 2px 0 #ff80ff; margin:14px 0 6px; font-size:22px;">&#9733; SIGN MY GUESTBOOK &#9733;</h2>
          <div style="background:#fff; border:2px inset #c0c0c0; padding:8px; font-family:Tahoma; font-size:12px;">
            <input type="text" placeholder="ur name (or screen-name)" style="width:60%; padding:3px; border:2px inset #c0c0c0; font-family:Tahoma;">
            <textarea placeholder="ur message" style="width:100%; height:48px; margin-top:4px; border:2px inset #c0c0c0; font-family:Tahoma;"></textarea>
            <div style="text-align:right; margin-top:4px;"><button style="background:#c0c0c0; border:2px outset #c0c0c0; padding:3px 12px; font-family:Tahoma;">SIGN!!</button></div>
          </div>

          <div style="margin-top:14px; text-align:center;">
            ${underConstructionGif()}
            ${underConstructionGif()}
          </div>

          ${rampHitCounter()}
          ${rampWebring('geo-ring')}

        </td>
      </tr></table>

      <div style="margin-top:14px; text-align:center; font-family:Tahoma; font-size:11px; color:#000;">
        ${bestViewedBadge()}
        <div style="margin-top:10px;">${footerTag()}</div>
        <div style="margin-top:6px; font-size:10px; color:#404040;">
          (c) ${d.domain} MM-MMXXVI. <button data-restart style="background:#c0c0c0; border:2px outset #c0c0c0; padding:2px 8px; font-family:Tahoma; font-size:10px;">[Y2K-ify another site]</button>
        </div>
      </div>
    </div>

    ${rampPopupReSpawn('geo-popup-respawn')}
  </div>
  <style>
    .pulse { animation: pulse 1.4s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    .blink-slow { animation: blinkSlow 1.6s steps(2) infinite; }
    @keyframes blinkSlow { 50% { color:#000080; text-shadow: 3px 3px 0 #00ffff, 6px 6px 0 #800080, 9px 9px 0 #000; } }
  </style>`;
}

/* ---------- TEMPLATE B: 2ADVANCED STUDIOS DARK FLASH SPLASH ---------- */
function tpl2Advanced(d) {
  return `
  <div style="background:radial-gradient(ellipse at 50% 40%, #0a2540 0%, #050d18 70%, #000000 100%); min-height:100vh; color:#9fcfff; font-family:'Courier New', monospace; padding:0 0 80px; overflow:hidden; position:relative;">

    <!-- scanlines / grid overlay -->
    <div style="position:absolute; inset:0; pointer-events:none; background:
      repeating-linear-gradient(0deg, transparent 0 3px, #ffffff04 3px 4px),
      linear-gradient(0deg, transparent 70%, #00000080 100%);"></div>

    <!-- top nav strip -->
    <div style="border-bottom:1px solid #2060a0; padding:10px 20px; font-size:11px; letter-spacing:3px; color:#5090d0; display:flex; justify-content:space-between; align-items:center; background:#00000060;">
      <span>// ${d.domain.toUpperCase()} // v.2.0</span>
      <span style="color:#ffd700;">RAMP_BANNER.SWF :: <a href="${ramp('2adv-top')}" target="_blank" style="color:#ffd700;">CLICK HERE FOR RAMP</a></span>
    </div>

    <!-- centerpiece grid -->
    <div style="position:relative; max-width:880px; margin:50px auto; padding:30px; z-index:2;">

      <div style="font-size:11px; color:#5090d0; letter-spacing:6px; margin-bottom:8px;">// LOADED 100%</div>
      <h1 style="font-family:'Arial Black','Impact',sans-serif; font-size:72px; margin:0; color:#ffffff; letter-spacing:8px; line-height:1; text-shadow:0 0 20px #2080ff;">${d.sitename}</h1>
      <div style="font-size:13px; color:#9fcfff; letter-spacing:4px; margin-top:6px;">${d.tagline}</div>

      <div style="display:flex; gap:14px; margin-top:30px; flex-wrap:wrap;">
        <!-- main panel -->
        <div style="flex:2; min-width:260px; border:1px solid #2080ff; background:#00000060; padding:18px; clip-path:polygon(0 0, 100% 0, 100% 88%, 92% 100%, 0 100%);">
          <div style="color:#ffd700; font-size:10px; letter-spacing:3px; margin-bottom:8px;">[ MISSION_STATEMENT.TXT ]</div>
          <p style="margin:0 0 10px; color:#ffffff; font-size:13px; line-height:1.5;">${d.welcome}</p>
          <ul style="font-size:12px; color:#9fcfff; line-height:1.7; list-style:none; padding-left:0;">
            ${d.bullets.map(b => `<li style="border-left:2px solid #2080ff; padding-left:8px; margin-bottom:6px;">${b}</li>`).join('')}
          </ul>
        </div>

        <!-- side panel: enter button + ramp ad -->
        <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:14px;">
          <a href="${d.ctaLink || d.rampLink}" target="_blank" style="display:block; border:1px solid #ffd700; background:#000; padding:24px; text-align:center; color:#ffd700; text-decoration:none; font-family:'Arial Black',sans-serif; letter-spacing:6px; font-size:18px; clip-path:polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%);">
            ${d.cta}
          </a>

          <div style="border:1px solid #2080ff; background:#0a2540; padding:14px; font-size:11px; color:#9fcfff;">
            <div style="color:#ffd700; font-size:9px; letter-spacing:3px; margin-bottom:6px;">// SPONSOR_FRAME.SWF</div>
            <div style="font-family:'Arial Black',sans-serif; color:#ffffff; font-size:13px; letter-spacing:2px; margin-bottom:4px;">RAMP&trade;</div>
            <p style="margin:0 0 8px;">corporate card infrastructure for the post-Y2K economy. <b style="color:#ffd700;">8x faster close.</b> faster than your 56k modem.</p>
            <a href="${ramp('2adv-side')}" target="_blank" style="color:#ffd700; text-decoration:underline;">&raquo; init connection</a>
          </div>

          <div style="border:1px solid #ff4080; background:#1a0820; padding:10px; font-size:10px; color:#ff80c0; letter-spacing:2px;">
            // ALERT<br>
            duplicate.sub detected. recover $14,000/yr. <a href="${ramp('2adv-alert')}" target="_blank" style="color:#ff80c0;">[run RAMP.exe]</a>
          </div>
        </div>
      </div>

      <!-- bottom horizontal lat-long readout -->
      <div style="margin-top:30px; font-size:10px; color:#3060a0; letter-spacing:4px; display:flex; justify-content:space-between; border-top:1px solid #2060a0; padding-top:8px;">
        <span>LAT: 40.7128 N</span><span>LONG: 74.0060 W</span><span>BITRATE: 56,600 bps</span><span>UPTIME: 100%</span><span>// ${d.domain}</span>
      </div>

      <!-- ramp banner ad, palette-matched to 2Advanced -->
      <div style="margin-top:30px; border:1px solid #2080ff; background:linear-gradient(90deg,#0a2540 0%,#0a2540 60%,#0e3870 100%); padding:14px 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="color:#ffd700; font-size:9px; letter-spacing:3px;">// AD_FRAME_002.SWF</div>
        <div style="flex:1; min-width:200px; color:#9fcfff; font-size:12px; text-align:center;">
          <span style="color:#ffffff; font-family:'Arial Black',sans-serif; letter-spacing:2px;">RAMP&trade;</span>
          <span style="color:#9fcfff;"> &nbsp;//&nbsp; corporate cards for the next/generation of business </span>
        </div>
        <a href="${ramp('2adv-bottom')}" target="_blank" style="color:#ffd700; text-decoration:none; font-family:'Courier New',monospace; font-size:11px; letter-spacing:2px; border:1px solid #ffd700; padding:4px 12px;">&raquo; LEARN_MORE</a>
      </div>

      <!-- requires shockwave fake disclaimer -->
      <div style="margin-top:20px; text-align:center; font-size:10px; color:#3060a0; letter-spacing:3px;">
        // THIS SITE REQUIRES MACROMEDIA FLASH 5 + SHOCKWAVE + RAMP&trade; CORPORATE CARD //
      </div>

      <div style="text-align:center; margin-top:20px;">
        <button data-restart style="background:transparent; border:1px solid #2080ff; color:#9fcfff; padding:6px 18px; letter-spacing:3px; font-family:'Courier New',monospace; cursor:pointer;">&laquo; Y2K_ANOTHER_SITE.EXE &raquo;</button>
      </div>

      <div style="margin-top:14px; text-align:center; font-size:10px; color:#3060a0; letter-spacing:2px;">
        ${footerTag().replace(/Ramp/g, 'RAMP')}
      </div>
    </div>

    ${rampPopupReSpawn('2adv-popup-respawn')}
  </div>`;
}

/* ---------- TEMPLATE C: YAHOO PORTAL ---------- */
function tplYahoo(d) {
  return `
  <div style="background:#ffffff; min-height:100vh; padding:0 0 80px; color:#000; font-family:'Times New Roman','Georgia',serif;">

    <!-- top utility bar -->
    <div style="background:#7030a0; color:#fff; padding:4px 10px; font-size:11px; font-family:Arial,sans-serif; display:flex; justify-content:space-between;">
      <span>Mail &nbsp;|&nbsp; My ${d.sitename.replace('!','')} &nbsp;|&nbsp; News &nbsp;|&nbsp; Finance &nbsp;|&nbsp; Sports &nbsp;|&nbsp; <b>Ramp&trade;</b></span>
      <span>Sign In &nbsp;|&nbsp; <a href="${ramp('yahoo-top')}" target="_blank" style="color:#ffff00;">Get Ramp</a></span>
    </div>

    <!-- logo + search -->
    <div style="text-align:center; padding:18px 10px 8px;">
      <h1 style="font-family:'Arial Black','Impact',sans-serif; font-size:64px; margin:0; line-height:1;">
        <span style="color:#7030a0;">${d.sitename.charAt(0)}</span><span style="color:#000;">${d.sitename.slice(1)}</span>
      </h1>
      <div style="font-family:Arial,sans-serif; font-size:13px; color:#404040; margin-top:4px;">${d.tagline}</div>
      <div style="margin-top:14px;">
        <input type="text" placeholder="Search the Web" style="width:340px; max-width:80%; padding:4px; border:2px inset #c0c0c0; font-family:Arial; font-size:13px;">
        <button style="background:#7030a0; color:#fff; border:2px outset #a060d0; padding:4px 16px; font-family:Arial; font-weight:bold;">Search</button>
        <div style="margin-top:4px; font-size:11px; font-family:Arial;">
          <a href="#" style="color:#0000ee;">Advanced</a> &nbsp;|&nbsp; <a href="#" style="color:#0000ee;">Preferences</a> &nbsp;|&nbsp; <a href="#" style="color:#0000ee;">Yellow Pages</a> &nbsp;|&nbsp; <a href="#" style="color:#0000ee;">People Finder</a>
        </div>
      </div>
    </div>

    ${rampBanner468('yahoo-banner-top')}

    <!-- directory + sidebar -->
    <div style="max-width:900px; margin:14px auto; padding:0 10px; display:flex; gap:16px; flex-wrap:wrap;">
      <div style="flex:2; min-width:300px;">
        <h2 style="font-family:Arial,sans-serif; font-size:14px; background:#e0d0ee; color:#7030a0; padding:4px 8px; margin:0 0 8px;">&gt; Web Site Directory</h2>
        <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:13px;">
          ${d.bullets.map((b,i) => `
            <tr><td style="padding:4px 6px; ${i%2 ? 'background:#f4eef8;' : ''}">
              <a href="#" style="color:#0000ee; text-decoration:underline;">${b.split('&raquo;')[0]||b}</a>
              <span style="color:#606060; font-size:11px;">${b.includes('&raquo;') ? '&raquo;' + b.split('&raquo;')[1] : ''}</span>
            </td></tr>
          `).join('')}
          <tr><td style="padding:4px 6px; background:#fffbe0;"><a href="${ramp('yahoo-directory-ramp')}" target="_blank" style="color:#c00000; text-decoration:underline; font-weight:bold;">Business &amp; Economy &gt; Corporate Cards &gt; <u>Ramp.com</u></a> <span style="color:#606060; font-size:11px;">&raquo; THE corporate card for companies 26 yrs old &amp; counting!</span></td></tr>
        </table>

        <h2 style="font-family:Arial,sans-serif; font-size:14px; background:#e0d0ee; color:#7030a0; padding:4px 8px; margin:18px 0 8px;">&gt; In The News</h2>
        <ul style="font-family:Arial; font-size:12px; line-height:1.6; padding-left:18px;">
          <li><a href="${ramp('yahoo-news-1')}" target="_blank" style="color:#0000ee;">Ramp announces auto-coding A.I. &mdash; 67% accuracy increase</a></li>
          <li><a href="#" style="color:#0000ee;">Y2K bug fears &mdash; 26 years later, totally fine</a></li>
          <li><a href="${ramp('yahoo-news-2')}" target="_blank" style="color:#0000ee;">Companies using Ramp close books 8x faster, study finds</a></li>
          <li><a href="#" style="color:#0000ee;">Lance Bass + JC Chasez: still here, still relevant</a></li>
        </ul>
      </div>

      <div style="flex:1; min-width:200px;">
        <div style="border:1px solid #c0c0c0; padding:8px; background:#f4eef8; font-family:Arial; font-size:11px; margin-bottom:10px;">
          <b style="color:#7030a0;">&#127942; SPONSOR</b><br>
          <a href="${ramp('yahoo-side-1')}" target="_blank" style="color:#0000ee; text-decoration:underline; display:block; margin-top:4px;"><b>Ramp&trade;</b> &mdash; the corporate card on the information superhighway. <span style="color:#c00;">5% cashback!!</span></a>
        </div>
        <div style="border:1px solid #c0c0c0; padding:8px; background:#fff; font-family:Arial; font-size:11px; margin-bottom:10px;">
          <b>Today's Poll:</b><br>
          What is your favorite browser?
          <div style="margin-top:4px;"><label><input type="radio" name="poll"> Netscape 4</label></div>
          <div><label><input type="radio" name="poll"> Internet Explorer 5</label></div>
          <div><label><input type="radio" name="poll"> Ramp 5.0</label></div>
          <button style="margin-top:4px; background:#c0c0c0; border:2px outset #c0c0c0; padding:1px 8px; font-family:Arial; font-size:11px;">Vote</button>
        </div>
        ${rampPopupSideAd('yahoo-side-2')}
        ${aolCdFloater('yahoo-aol')}
      </div>
    </div>

    <div style="max-width:900px; margin:14px auto; padding:0 10px;">
      ${rampBannerExpense('yahoo-bottom')}
    </div>

    <div style="max-width:900px; margin:14px auto; text-align:center; font-family:Arial; font-size:11px; color:#404040;">
      ${rampHitCounter()}
      ${rampWebring('yahoo-ring')}
      ${bestViewedBadge()}
      <div style="margin-top:10px;">${footerTag()}</div>
      <div style="margin-top:6px;"><button data-restart style="background:#c0c0c0; border:2px outset #c0c0c0; padding:2px 10px; font-family:Arial; font-size:11px;">[Y2K-ify another site]</button></div>
    </div>

    ${rampPopupReSpawn('yahoo-popup-respawn')}
  </div>`;
}

function rampPopupSideAd(medium) {
  return `<a href="${ramp(medium)}" target="_blank" style="display:block; border:1px solid #ffd700; background:linear-gradient(180deg,#fff8d0,#ffd700); padding:8px; font-family:Arial; font-size:11px; color:#000; text-decoration:none; margin-bottom:10px;">
    <b style="color:#c00;">&#9888; SAVINGS DETECTED!</b><br>
    Companies using Ramp save an avg of <b>$250K/year</b>.<br>
    <span style="color:#0000ee; text-decoration:underline;">&raquo; Find Out How</span>
  </a>`;
}

/* ==================================================================
   BOOT
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('urlinput');
  if (inp) {
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') goY2K(); });
    setTimeout(() => inp.focus(), 100);
  }
  // Load homepage hit counter (read-only — increment happens on Y2K-ify)
  loadHomeCounter();
});

// Read the live count without incrementing
function loadHomeCounter() {
  const el = document.getElementById('home-counter');
  if (!el) return;
  fetch('https://api.counterapi.dev/v1/y2kmysite/sites_generated/', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : null)
    .then(j => {
      if (j && typeof j.count === 'number') {
        el.textContent = String(j.count).padStart(9, '0');
      }
    })
    .catch(() => {});
}

function startClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const times = ['11:58 PM', '11:59 PM', '11:59 PM', '12:00 AM', '00:00 ??'];
  let i = 0;
  el.textContent = times[i];
  const tick = () => {
    i = Math.min(i + 1, times.length - 1);
    el.textContent = times[i];
    if (i < times.length - 1) setTimeout(tick, 1800 + Math.random() * 600);
  };
  setTimeout(tick, 2000);
}

/* ==================================================================
   ERA-ACCURATE TEMPLATES (Jan 2000 Wayback homages)
   ================================================================== */

/* ---------- GOOGLE — Feb 29, 2000 ---------- */
function tplGoogle2000() {
  return `
  <div style="background:#fff; min-height:100vh; padding:40px 20px 100px; font-family:'Times New Roman','Arial',serif; color:#000; text-align:center;">

    <!-- "About Google" link, upper right of where the logo is -->
    <div style="max-width:560px; margin:0 auto; text-align:right; font-family:Arial,sans-serif; font-size:12px;">
      <a href="#" style="color:#0000cc;">&#8226; About Google</a>
    </div>

    <!-- The Google wordmark, rendered as styled text (no logo image needed) -->
    <div style="margin:8px auto 18px; font-family:'Catull','Times New Roman',serif; font-size:96px; font-weight:bold; letter-spacing:-2px; line-height:1; user-select:none;">
      <span style="color:#0039a6;">G</span><span style="color:#c41200;">o</span><span style="color:#f3c518;">o</span><span style="color:#0039a6;">g</span><span style="color:#1a8f3a;">l</span><span style="color:#c41200;">e</span><sup style="font-size:14px; color:#666; font-weight:normal; font-family:Arial;">SM</sup>
    </div>

    <div style="font-family:Arial,sans-serif; font-size:14px; margin-bottom:14px;">Search the web using Google!</div>

    <form onsubmit="var q=this.q.value.trim();if(q){window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank');}return false;" style="margin:0;">
      <input type="text" name="q" size="55" autocomplete="off" style="font-family:Arial; font-size:14px; padding:2px 4px; border:1px solid #7e9db9; width:380px; max-width:90vw;">
      <div style="margin-top:10px; font-family:Arial,sans-serif; font-size:12px;">
        <input type="submit" value="Google Search" style="font-family:Arial; font-size:12px; padding:2px 10px; background:#ececec; border:1px solid #999; cursor:pointer;">
        &nbsp;
        <input type="button" value="I'm Feeling Lucky" onclick="var q=this.form.q.value.trim();if(q){window.open('https://www.google.com/search?btnI=1&amp;q='+encodeURIComponent(q),'_blank');}" style="font-family:Arial; font-size:12px; padding:2px 10px; background:#ececec; border:1px solid #999; cursor:pointer;">
      </div>
    </form>

    <div style="margin-top:14px; font-family:Arial,sans-serif; font-size:12px;">
      <a href="#" style="color:#0000cc;">Add Free WebSearch To Your Site</a>
    </div>

    <!-- THE JOKE: a single, tasteful, era-correct Ramp text ad -->
    <!-- Real Google in early 2000 had NO ads on the homepage. So we add exactly one small line. -->
    <div style="margin-top:34px; max-width:480px; margin-left:auto; margin-right:auto; padding:8px; border:1px solid #cccccc; background:#ffffe0; font-family:Arial,sans-serif; font-size:12px; text-align:left;">
      <span style="color:#666;"><b>Sponsored Link:</b></span><br>
      <a href="${ramp('google2000-sponsored')}" target="_blank" style="color:#0000cc;"><b>Ramp.com</b></a> &mdash; The Corporate Card &amp; Spend Management Platform.
      <span style="color:#008000;">www.ramp.com</span>
    </div>

    <!-- footer -->
    <div style="margin-top:60px; font-family:Arial,sans-serif; font-size:11px;">
      <span style="color:#666;">&copy;2000 Google Inc.</span> &nbsp;|&nbsp;
      <a href="#" style="color:#0000cc;">About</a> &nbsp;|&nbsp;
      <a href="https://www.apple.com/us/search/search+tips" target="_blank" style="color:#0000cc;">Search Tips</a> &nbsp;|&nbsp;
      <a href="#" style="color:#0000cc;">Feedback</a> &nbsp;|&nbsp;
      <a href="${ramp('google2000-hiring')}" target="_blank" style="color:#0000cc;">We&apos;re Hiring!</a>
    </div>

    <div style="margin-top:60px; font-family:Arial,sans-serif; font-size:11px; color:#666;">
      <button data-restart style="background:#ececec; border:1px solid #999; padding:2px 10px; font-family:Arial; font-size:11px;">[Y2K-ify another site]</button>
    </div>
  </div>`;
}

/* ---------- NEW YORK TIMES — Nov 9, 2000 ---------- */
function tplNYTimes2000() {
  return `
  <div style="background:#fff; min-height:100vh; padding:0 0 80px; font-family:Georgia,'Times New Roman',serif; color:#000; font-size:12px;">

    <!-- top register banner -->
    <div style="background:#5f6b3c; color:#fff; padding:4px 10px; font-family:Arial,sans-serif; font-size:11px;">
      <a href="${ramp('nyt-register')}" target="_blank" style="color:#fff; text-decoration:none;">&raquo; Register Now For Special Features From NYTimes.com</a>
    </div>

    <!-- Masthead -->
    <div style="text-align:center; padding:14px 10px 8px; border-bottom:1px solid #ccc;">
      <div style="font-family:'UnifrakturMaguntia','Old English Text MT','Times New Roman',serif; font-size:54px; line-height:1; color:#000;">The New York Times</div>
      <div style="font-family:Arial,sans-serif; font-size:9px; letter-spacing:6px; color:#000; margin-top:2px;">ON THE WEB</div>
    </div>

    <div style="font-family:Arial,sans-serif; font-size:11px; padding:4px 10px; border-bottom:1px solid #ccc; display:flex; justify-content:space-between; flex-wrap:wrap;">
      <span><b>THURSDAY, NOVEMBER 9, 2000</b> &nbsp; 9:24 AM ET</span>
      <span><a href="https://www.nytimes.com/section/weather" target="_blank" style="color:#0000cc;">Personalize Your Weather</a></span>
    </div>

    <!-- 3-column table layout -->
    <table style="width:100%; border-collapse:collapse; font-family:Georgia,serif;"><tr style="vertical-align:top;">

      <!-- LEFT SIDEBAR -->
      <td style="width:130px; background:#f0f0f0; padding:8px 6px; border-right:1px solid #ccc; font-family:Arial,sans-serif; font-size:11px;">

        <!-- search -->
        <form onsubmit="var q=this.q.value.trim();if(q){window.open('https://www.nytimes.com/search?query='+encodeURIComponent(q),'_blank');}return false;" style="background:#fff; padding:4px; border:1px solid #ccc; margin-bottom:8px; display:block;">
          <b style="color:#900;">SEARCH</b><br>
          <label><input type="radio" name="ny" checked> Latest News</label><br>
          <label><input type="radio" name="ny"> Archives</label><br>
          <input type="text" name="q" autocomplete="off" style="width:100%; font-size:10px; margin-top:2px;">
          <div style="margin-top:2px;"><button type="submit" style="font-size:10px; cursor:pointer;">Search</button> <a href="https://help.nytimes.com/hc/en-us/sections/115004809527-Search" target="_blank" style="color:#0000cc; font-size:10px;">Tips</a></form>

        <a href="https://www.nytimes.com/section/business" target="_blank" style="color:#0000cc;">Jobs</a> | <a href="https://www.nytimes.com/section/realestate" target="_blank" style="color:#0000cc;">Real Estate</a> | <a href="https://www.nytimes.com/wirecutter/" target="_blank" style="color:#0000cc;">Shopping</a>

        <div style="background:#003366; color:#fff; padding:3px 6px; margin:10px 0 4px; font-weight:bold;">NEWS</div>
        <a href="https://www.nytimes.com/section/business" target="_blank" style="color:#0000cc; display:block;">Business</a>
        <a href="https://www.nytimes.com/section/opinion" target="_blank" style="color:#0000cc; display:block;">Editorial/Op-Ed</a>
        <a href="https://www.nytimes.com/section/world" target="_blank" style="color:#0000cc; display:block;">International</a>
        <a href="https://www.nytimes.com/section/us" target="_blank" style="color:#0000cc; display:block;">National</a>
        <a href="https://www.nytimes.com/section/nyregion" target="_blank" style="color:#0000cc; display:block;">New York Region</a>
        <a href="https://www.nytimes.com/" target="_blank" style="color:#0000cc; display:block;">NYT Front Page</a>
        <a href="https://www.nytimes.com/section/obituaries" target="_blank" style="color:#0000cc; display:block;">Obituaries</a>
        <a href="https://www.nytimes.com/section/politics" target="_blank" style="color:#0000cc; display:block;">Politics</a>
        <a href="https://www.nytimes.com/" target="_blank" style="color:#0000cc; display:block;">Quick News</a>
        <a href="https://www.nytimes.com/section/science" target="_blank" style="color:#0000cc; display:block;">Science/Health</a>
        <a href="https://www.nytimes.com/section/sports" target="_blank" style="color:#0000cc; display:block;">Sports</a>
        <a href="https://www.nytimes.com/section/technology" target="_blank" style="color:#0000cc; display:block;">Tech/Internet</a>
        <a href="https://www.nytimes.com/section/weather" target="_blank" style="color:#0000cc; display:block;">Weather</a>
        <div style="border-top:1px solid #ccc; margin:4px 0;"></div>
        <a href="https://www.nytimes.com/section/corrections" target="_blank" style="color:#0000cc; display:block;">Corrections</a>

        <div style="background:#003366; color:#fff; padding:3px 6px; margin:10px 0 4px; font-weight:bold;">FEATURES</div>
        <a href="https://www.nytimes.com/section/arts" target="_blank" style="color:#0000cc;">Arts</a> | <a href="https://www.nytimes.com/section/books" target="_blank" style="color:#0000cc;">Books</a> | <a href="https://www.newyorker.com/cartoons" target="_blank" style="color:#0000cc;">Cartoons</a> | <a href="https://www.nytimes.com/crosswords" target="_blank" style="color:#0000cc;">Crossword</a> | <a href="https://www.nytimes.com/section/opinion" target="_blank" style="color:#0000cc;">Forums</a> | <a href="https://www.nytimes.com/section/magazine" target="_blank" style="color:#0000cc;">Magazine</a> | <a href="https://www.nytimes.com/section/travel" target="_blank" style="color:#0000cc;">Travel</a>

        <div style="background:#003366; color:#fff; padding:3px 6px; margin:10px 0 4px; font-weight:bold;">SERVICES</div>
        <a href="https://www.nytimes.com/sitemap/" target="_blank" style="color:#0000cc;">Archives</a> | <a href="https://www.nytimes.com/section/classifieds" target="_blank" style="color:#0000cc;">Classifieds</a> | <a href="https://help.nytimes.com/" target="_blank" style="color:#0000cc;">Help</a> | <a href="https://store.nytimes.com/" target="_blank" style="color:#0000cc;">NYT Store</a> | <a href="https://www.nytimes.com/sitemap/" target="_blank" style="color:#0000cc;">Site Index</a>

        <!-- Ramp ad #1: a small sidebar text link, blends with shopping section -->
        <div style="background:#003366; color:#fff; padding:3px 6px; margin:10px 0 4px; font-weight:bold;">SHOPPING</div>
        <a href="https://www.nytimes.com/section/food" target="_blank" style="color:#0000cc; display:block;">Wine</a>
        <a href="https://www.nytimes.com/section/style" target="_blank" style="color:#0000cc; display:block;">Jewelry</a>
        <a href="https://www.nytimes.com/section/travel" target="_blank" style="color:#0000cc; display:block;">Travel</a>
        <a href="${ramp('nyt-shopping')}" target="_blank" style="color:#cc0000; display:block; font-weight:bold;">Corporate Cards (NEW!)</a>

      </td>

      <!-- MIDDLE: LEAD STORIES -->
      <td style="padding:10px 14px; vertical-align:top;">

        <h1 style="font-family:Georgia,serif; font-size:22px; line-height:1.15; margin:0 0 6px; color:#003366; font-weight:bold;">
          <a href="https://www.nytimes.com/search?query=Bush+Barely+Ahead+of+Gore+In+Florida+Recount+Holds+Key+2000" target="_blank" style="color:#003366; text-decoration:none;">Bush Barely Ahead of Gore In Florida; Recount Holds Key</a>
        </h1>

        <!-- ASCII-ish pixel "photo" placeholder (Florida recount workers) -->
        <div style="width:100%; max-width:340px; height:130px; background:linear-gradient(180deg,#999 0 30%,#ccc 30% 60%,#888 60% 100%); border:1px solid #666; position:relative; margin:6px 0;">
          <div style="position:absolute; bottom:2px; left:4px; right:4px; background:#000c; color:#fff; font-family:Arial; font-size:10px; padding:2px 4px;">Election workers in Miami-Dade County recount ballots Wednesday. (AFP)</div>
        </div>

        <div style="font-family:Arial,sans-serif; font-size:10px; color:#666;">By <b>RICHARD L. BERKE</b> &nbsp;|&nbsp; <i>FROM THURSDAY&apos;S TIMES</i></div>
        <p style="margin:6px 0 4px; line-height:1.5;">For the first time in more than a century, the winner of a presidential election remained unknown a full day after the polls closed. <a href="https://www.nytimes.com/search?query=Bush+Barely+Ahead+of+Gore+In+Florida+Recount+Holds+Key+2000" target="_blank" style="color:#0000cc;">[Go to Article]</a></p>

        <ul style="margin:4px 0 12px 18px; padding:0; font-family:Arial,sans-serif; font-size:11px; line-height:1.6;">
          <li><a href="https://www.nytimes.com/search?query=Florida+Recount+Cuts+Bush+Lead+in+Half+2000" target="_blank" style="color:#0000cc;">Florida Recount Cuts Bush&apos;s Lead in Half</a></li>
          <li><a href="https://www.nytimes.com/search?query=Recipe+for+a+Stalemate+election+2000" target="_blank" style="color:#0000cc;">News Analysis: Recipe for a Stalemate</a></li>
          <li><a href="https://www.nytimes.com/search?query=Florida+Democrats+Ballot+Design+Hurt+Gore+2000" target="_blank" style="color:#0000cc;">Florida Democrats Say Ballot&apos;s Design Hurt Gore</a></li>
        </ul>

        <h2 style="font-family:Georgia,serif; font-size:17px; margin:14px 0 4px; color:#003366;">
          <a href="https://www.nytimes.com/search?query=GOP+Clings+Control+Congress+Democrats+Gain+Chambers+2000" target="_blank" style="color:#003366; text-decoration:none;">G.O.P. Clings to Control in Congress, but Democrats Gain in Both Chambers</a>
        </h2>
        <div style="font-family:Arial,sans-serif; font-size:10px; color:#666;">By <b>ADAM CLYMER</b></div>
        <ul style="margin:4px 0 12px 18px; padding:0; font-family:Arial,sans-serif; font-size:11px; line-height:1.6;">
          <li><a href="https://www.nytimes.com/search?query=Democrats+Gain+Several+Senate+Seats+2000" target="_blank" style="color:#0000cc;">Democrats Gain Several Senate Seats</a></li>
          <li><a href="https://www.nytimes.com/search?query=GOP+Future+Edge+Districting+2000" target="_blank" style="color:#0000cc;">G.O.P. Gains a Future Edge in Districting</a></li>
        </ul>

        <!-- Ramp ad #2: a 468x60-style banner, era-correct rendering -->
        <div style="border-top:1px solid #ccc; border-bottom:1px solid #ccc; padding:6px 0; margin:14px 0; text-align:center;">
          <a href="${ramp('nyt-banner')}" target="_blank" style="display:inline-block; text-decoration:none;">
            <div style="width:468px; max-width:100%; height:60px; background:linear-gradient(90deg,#1a3a6c 0%,#2c5aa0 100%); color:#fff; font-family:Arial,sans-serif; padding:8px 12px; box-sizing:border-box; text-align:left; border:1px solid #000;">
              <div style="font-size:16px; font-weight:bold; color:#ffd700;">Ramp.com</div>
              <div style="font-size:11px; line-height:1.2; margin-top:2px;">The Corporate Card &amp; Spend Management Platform.<br>Now Y2K Compliant. <span style="color:#ffd700;"><u>Click Here &raquo;</u></span></div>
            </div>
          </a>
        </div>

        <h3 style="font-family:Arial,sans-serif; font-size:11px; color:#cc0000; font-weight:bold; margin:14px 0 2px; letter-spacing:1px;">INTERNATIONAL</h3>
        <a href="https://www.nytimes.com/search?query=Arafat+Arrives+US+Peace+Talks+2000" target="_blank" style="color:#003366; font-family:Georgia,serif; font-size:14px; font-weight:bold; text-decoration:none;">Violence Flares as Arafat Arrives in U.S. for Peace Talks</a>
        <span style="color:#666; font-family:Arial; font-size:10px;"> (7:24 a.m.)</span>

        <h3 style="font-family:Arial,sans-serif; font-size:11px; color:#cc0000; font-weight:bold; margin:14px 0 2px; letter-spacing:1px;">POLITICS</h3>
        <a href="https://www.nytimes.com/search?query=Hillary+Clinton+First+Lady+Shadow+2000" target="_blank" style="color:#003366; font-family:Georgia,serif; font-size:14px; font-weight:bold; text-decoration:none;">First Lady Emerges From Shadow and Begins to Cast Her Own</a>
        <span style="color:#666; font-family:Arial; font-size:10px;"> (2:53 a.m.)</span>

        <h3 style="font-family:Arial,sans-serif; font-size:11px; color:#cc0000; font-weight:bold; margin:14px 0 2px; letter-spacing:1px;">BUSINESS</h3>
        <a href="${ramp('nyt-business-headline')}" target="_blank" style="color:#003366; font-family:Georgia,serif; font-size:14px; font-weight:bold; text-decoration:none;">Companies Switching to Ramp Close Books 8x Faster, Study Finds</a>
        <span style="color:#666; font-family:Arial; font-size:10px;"> (6:10 a.m.)</span>

        <h3 style="font-family:Arial,sans-serif; font-size:11px; color:#cc0000; font-weight:bold; margin:14px 0 2px; letter-spacing:1px;">N.Y. REGION</h3>
        <a href="https://www.nytimes.com/search?query=Lottery+System+La+Guardia+Flights+2000" target="_blank" style="color:#003366; font-family:Georgia,serif; font-size:14px; font-weight:bold; text-decoration:none;">U.S. Plans a Lottery System to Cut La Guardia Flights</a>
        <span style="color:#666; font-family:Arial; font-size:10px;"> (2:08 a.m.)</span>

        <!-- Election 2000 navy box -->
        <div style="margin-top:16px;">
          <div style="background:#003366; color:#fff; padding:4px 8px; font-family:Arial,sans-serif; font-weight:bold;">THE 2000 ELECTION</div>
          <div style="border:1px solid #003366; padding:8px; font-family:Arial,sans-serif; font-size:11px;">
            <b>Election Features:</b>
            <ul style="margin:4px 0 0 18px; padding:0; line-height:1.6;">
              <li><a href="https://www.nytimes.com/search?query=2000+election+results" target="_blank" style="color:#0000cc;">Complete Election Results</a></li>
              <li><a href="https://www.nytimes.com/search?query=how+election+results+collected+projected+2000" target="_blank" style="color:#0000cc;">How the Results Are Collected and Projected</a></li>
              <li><a href="https://www.nytimes.com/newsletters" target="_blank" style="color:#0000cc;">E-mail Updates</a></li>
              <li><a href="https://www.nytimes.com/section/politics" target="_blank" style="color:#0000cc;">Discuss the Election</a></li>
            </ul>
            <div style="margin-top:8px; border-top:1px solid #003366; padding-top:6px;">
              <b>RESULTS &mdash; PRESIDENT (as of 9:24 a.m.)</b>
              <table style="width:100%; font-size:10px; margin-top:4px;">
                <tr style="background:#ddd;"><td></td><td><b>Electoral</b></td><td><b>Popular Vote</b></td><td></td></tr>
                <tr><td><b>Gore</b></td><td>255</td><td>48,707,413</td><td>48%</td></tr>
                <tr><td><b>Bush</b></td><td>246</td><td>48,609,640</td><td>48%</td></tr>
              </table>
            </div>
          </div>
        </div>

      </td>

      <!-- RIGHT COLUMN -->
      <td style="width:200px; padding:10px 10px 10px 0; vertical-align:top; font-family:Arial,sans-serif; font-size:11px;">

        <div style="background:#003366; color:#fff; padding:3px 6px; font-weight:bold;">INSIDE</div>
        <div style="border:1px solid #003366; padding:6px; border-top:0;">
          <b style="color:#cc0000;">CIRCUITS</b><br>
          <a href="https://www.nytimes.com/search?query=Walter+Bender+MIT+Media+Lab+2000" target="_blank" style="color:#003366; font-weight:bold;">A New M.I.T. Media Lab</a>
          <p style="margin:4px 0 0; color:#000; font-size:11px;">Walter Bender takes over an institution where re-invention is constant.</p>
        </div>

        <div style="background:#003366; color:#fff; padding:3px 6px; font-weight:bold; margin-top:10px;">MARKETS</div>
        <table style="width:100%; border-collapse:collapse; border:1px solid #003366; border-top:0; font-size:10px;">
          <tr><td colspan="3" style="padding:3px 6px;"><i>At Close</i></td></tr>
          <tr><td style="padding:2px 6px;">Dow</td><td style="text-align:right;">10907.06</td><td style="color:#c00; text-align:right;">&#9660; -45.12</td></tr>
          <tr style="background:#f0f0f0;"><td style="padding:2px 6px;">Nasdaq</td><td style="text-align:right;">3231.70</td><td style="color:#c00; text-align:right;">&#9660; -184.09</td></tr>
          <tr><td style="padding:2px 6px;">S&amp;P 500</td><td style="text-align:right;">1409.28</td><td style="color:#c00; text-align:right;">&#9660; -22.59</td></tr>
          <tr style="background:#f0f0f0;"><td style="padding:2px 6px;">Russell 2000</td><td style="text-align:right;">500.68</td><td style="color:#c00; text-align:right;">&#9660; -5.33</td></tr>
        </table>

        <!-- Ramp ad #3: a small 200px sidebar "skyscraper" -->
        <div style="margin-top:12px; border:1px solid #ccc; padding:8px; background:#fffbe0;">
          <div style="font-family:Arial; font-size:9px; color:#666; text-transform:uppercase; letter-spacing:1px;">Advertisement</div>
          <div style="font-family:Georgia,serif; font-size:14px; font-weight:bold; color:#000; margin-top:4px;">Tired of expense reports?</div>
          <p style="margin:4px 0; font-size:11px; line-height:1.4;">Get <a href="${ramp('nyt-sidebar')}" target="_blank" style="color:#0000cc;"><b>Ramp.com</b></a> &mdash; the corporate card that auto-codes your transactions while you sleep.</p>
          <a href="${ramp('nyt-sidebar-cta')}" target="_blank" style="font-size:11px; color:#0000cc;">Learn More &raquo;</a>
        </div>

        <div style="background:#003366; color:#fff; padding:3px 6px; font-weight:bold; margin-top:12px;">LATEST AP / REUTERS</div>
        <div style="border:1px solid #003366; padding:6px; border-top:0; font-size:11px; line-height:1.5;">
          <a href="https://www.nytimes.com/search?query=Dow+sinks+election+uncertainty+November+2000" target="_blank" style="color:#003366;">Dow Sinks on Election Uncertainty</a> <span style="color:#666;">9:18 a.m.</span><br>
          <a href="https://www.nytimes.com/search?query=Florida+recount+continues+November+2000" target="_blank" style="color:#003366;">Florida Recount Continues</a> <span style="color:#666;">9:02 a.m.</span><br>
          <a href="${ramp('nyt-wire')}" target="_blank" style="color:#003366;">Ramp.com Raises Series B</a> <span style="color:#666;">8:47 a.m.</span><br>
          <a href="https://www.nytimes.com/search?query=Mideast+tensions+escalate+November+2000" target="_blank" style="color:#003366;">Mideast Tensions Escalate</a> <span style="color:#666;">8:30 a.m.</span>
        </div>

      </td>
    </tr></table>

    <div style="text-align:center; padding:14px; font-family:Arial,sans-serif; font-size:11px; color:#666; border-top:1px solid #ccc;">
      Copyright 2000 The New York Times Company &nbsp;|&nbsp;
      <a href="https://help.nytimes.com/hc/en-us/articles/115014892108-Privacy-policy" target="_blank" style="color:#0000cc;">Privacy Information</a>
      <div style="margin-top:8px;"><button data-restart style="background:#ececec; border:1px solid #999; padding:2px 10px; font-family:Arial; font-size:11px;">[Y2K-ify another site]</button></div>
    </div>
  </div>`;
}

/* ---------- APPLE — Mar 1, 2000 ---------- */
function tplApple2000() {
  const tab = (label, active) => `
    <div style="display:inline-block; padding:6px 18px; margin:0 1px; font-family:'Lucida Grande','Helvetica Neue',Arial,sans-serif; font-size:11px; color:#333;
                background:${active ? 'linear-gradient(180deg,#fff 0%,#dcdcdc 100%)' : 'linear-gradient(180deg,#f3f3f3 0%,#bababa 100%)'};
                border:1px solid #888; border-bottom:0; border-radius:8px 8px 0 0;
                box-shadow: inset 0 1px 0 #fff;">${label}</div>`;
  return `
  <div style="background:#fff; min-height:100vh; padding:0 0 80px; font-family:'Lucida Grande','Helvetica Neue',Arial,sans-serif; color:#000;">

    <!-- top nav: primary tabs -->
    <div style="background:#e6e6e6; padding:8px 20px 0; border-bottom:1px solid #888;">
      <div style="max-width:980px; margin:0 auto; display:flex; align-items:flex-end; gap:0;">
        <!-- rainbow apple icon tab -->
        <div style="display:inline-block; padding:4px 12px 3px; background:linear-gradient(180deg,#fff,#dcdcdc); border:1px solid #888; border-bottom:0; border-radius:8px 8px 0 0; vertical-align:bottom;">
          <svg width="16" height="18" viewBox="0 0 60 70" style="display:block;" aria-label="Apple">
            <defs>
              <clipPath id="appleShape">
                <path d="M44,18 C50,18 56,23 56,32 C56,45 48,62 38,62 C33,62 31,59 28,59 C25,59 22,62 18,62 C8,62 0,45 0,32 C0,23 6,18 12,18 C16,18 19,21 22,21 C25,21 27,18 32,18 C35,18 40,18 44,18 Z M34,12 C36,8 40,5 44,5 C44,9 42,13 39,15 C37,17 33,18 30,17 C30,15 32,13 34,12 Z"/>
              </clipPath>
            </defs>
            <g clip-path="url(#appleShape)">
              <rect x="0" y="0"  width="60" height="10" fill="#62bb46"/>
              <rect x="0" y="10" width="60" height="10" fill="#fcb711"/>
              <rect x="0" y="20" width="60" height="10" fill="#f37021"/>
              <rect x="0" y="30" width="60" height="10" fill="#ef4136"/>
              <rect x="0" y="40" width="60" height="10" fill="#b13692"/>
              <rect x="0" y="50" width="60" height="20" fill="#0089d0"/>
            </g>
          </svg>
        </div>
        ${tab('Store')}
        ${tab('iReview')}
        ${tab('iTools')}
        ${tab('iCards')}
        ${tab('QuickTime')}
        ${tab('Support')}
      </div>
    </div>

    <!-- secondary nav -->
    <div style="background:#dcdcdc; padding:5px 20px; border-bottom:1px solid #888;">
      <div style="max-width:980px; margin:0 auto; text-align:center; font-family:'Lucida Grande',Arial,sans-serif; font-size:11px;">
        <a href="https://www.apple.com/newsroom/" target="_blank" style="color:#003399; margin:0 6px;">Hot News</a> |
        <a href="${ramp('apple-hiring')}" target="_blank" style="color:#003399; margin:0 6px;">Hiring</a> |
        <a href="https://www.apple.com/shop/buy-mac" target="_blank" style="color:#003399; margin:0 6px;">Hardware</a> |
        <a href="https://www.apple.com/app-store/" target="_blank" style="color:#003399; margin:0 6px;">Software</a> |
        <a href="https://www.apple.com/shop/mac/mac-accessories" target="_blank" style="color:#003399; margin:0 6px;">Made4Mac</a> |
        <a href="https://www.apple.com/education/" target="_blank" style="color:#003399; margin:0 6px;">Education</a> |
        <a href="https://www.apple.com/creativity/" target="_blank" style="color:#003399; margin:0 6px;">Creative</a> |
        <a href="https://www.apple.com/business/small-business/" target="_blank" style="color:#003399; margin:0 6px;">Small Biz</a> |
        <a href="https://developer.apple.com/" target="_blank" style="color:#003399; margin:0 6px;">Developer</a>
      </div>
    </div>

    <!-- HERO -->
    <div style="max-width:980px; margin:0 auto; padding:24px 20px;">

      <!-- Apple wordmark, serif -->
      <div style="font-family:'Garamond','Times New Roman',serif; font-size:88px; line-height:1; color:#000; margin-bottom:24px; letter-spacing:-1px;">Apple</div>

      <!-- hero area: clamshell iBook + tagline -->
      <div style="display:flex; align-items:center; gap:30px; flex-wrap:wrap; padding:20px 0; border-top:1px solid #ccc; border-bottom:1px solid #ccc;">
        <div style="flex:1; min-width:240px;">
          <div style="font-family:'Garamond','Times New Roman',serif; font-size:54px; line-height:1; color:#444;">iBook.</div>
          <div style="font-family:'Garamond','Times New Roman',serif; font-size:30px; line-height:1.2; color:#888; margin-top:6px; font-style:italic;">Black tie optional.</div>
          <div style="margin-top:18px; font-family:'Lucida Grande',Arial,sans-serif; font-size:11px; color:#666;">March 01, 2000  01:53 PM PST</div>
        </div>
        <!-- CSS clamshell iBook (graphite edition) -->
        <div style="flex:1; min-width:240px; display:flex; justify-content:center;">
          <div style="position:relative; width:260px; height:180px;">
            <!-- lid (clamshell top) -->
            <div style="position:absolute; left:20px; top:10px; width:220px; height:140px;
                        background:linear-gradient(135deg,#3a3a4a 0%,#1a1a2a 60%,#0a0a18 100%);
                        border-radius:38px 38px 28px 28px;
                        box-shadow:inset 2px 2px 0 #5a5a6a, 0 8px 20px #00000060;">
              <!-- handle on top -->
              <div style="position:absolute; left:50%; top:-6px; transform:translateX(-50%); width:80px; height:14px; background:linear-gradient(180deg,#222 0%,#000 100%); border-radius:6px 6px 0 0;"></div>
              <!-- subtle reflection -->
              <div style="position:absolute; left:24px; top:18px; right:24px; height:40px; background:linear-gradient(180deg,#ffffff15,transparent); border-radius:20px 20px 0 0;"></div>
            </div>
            <!-- base -->
            <div style="position:absolute; left:8px; top:140px; width:244px; height:24px;
                        background:linear-gradient(180deg,#2a2a3a 0%,#0a0a18 100%); border-radius:0 0 14px 14px; box-shadow:0 4px 6px #00000040;"></div>
          </div>
        </div>
      </div>

      <!-- Hot News Headlines ticker (with Ramp salted in) -->
      <div style="background:#6b6b3b; color:#fff; padding:4px 10px; margin-top:14px; font-family:Arial,sans-serif; font-size:11px; display:flex; align-items:center; gap:10px;">
        <span style="background:#000; padding:2px 6px; font-weight:bold;">Hot News Headlines</span>
        <marquee scrollamount="4" style="flex:1;">Apple Increases Share in Growing Japan Market. &nbsp;&bull;&nbsp; iBook Graphite Now Shipping. &nbsp;&bull;&nbsp; <a href="${ramp('apple-marquee')}" target="_blank" style="color:#ffd700;">Apple Finance Teams Switching to Ramp.com to Manage Spend.</a> &nbsp;&bull;&nbsp; QuickTime 5 Coming Soon.</marquee>
      </div>

      <!-- 3-product grid -->
      <table style="width:100%; margin-top:24px; border-collapse:separate; border-spacing:14px 0;"><tr style="vertical-align:top;">

        <td style="width:33%; text-align:center;">
          <!-- Power Mac G4 (gray monolith) -->
          <div style="height:120px; display:flex; align-items:flex-end; justify-content:center;">
            <div style="width:60px; height:110px; background:linear-gradient(180deg,#d4d4d4 0%,#a8a8a8 100%); border:1px solid #888; border-radius:4px; box-shadow:inset 2px 0 0 #ededed, 2px 2px 6px #00000020;"></div>
          </div>
          <div style="font-family:'Lucida Grande',Arial,sans-serif; font-size:12px; margin-top:8px;"><a href="https://www.apple.com/shop/buy-mac/mac-studio" target="_blank" style="color:#003399; font-weight:bold;">Power Mac G4</a></div>
          <div style="font-family:'Garamond',serif; font-size:13px; color:#666; font-style:italic; margin-top:2px;">Supercomputer. Personal.</div>
        </td>

        <td style="width:33%; text-align:center;">
          <!-- PowerBook (titanium dark slab) -->
          <div style="height:120px; display:flex; align-items:center; justify-content:center;">
            <div style="position:relative; width:160px; height:90px;">
              <div style="position:absolute; inset:0; background:linear-gradient(180deg,#888 0%,#444 100%); border-radius:6px;"></div>
              <div style="position:absolute; left:6px; top:6px; right:6px; bottom:30px; background:#1a2a4a;"></div>
              <div style="position:absolute; left:0; right:0; bottom:0; height:4px; background:#222;"></div>
            </div>
          </div>
          <div style="font-family:'Lucida Grande',Arial,sans-serif; font-size:12px; margin-top:8px;"><a href="https://www.apple.com/macbook-pro/" target="_blank" style="color:#003399; font-weight:bold;">The new PowerBook.</a></div>
          <div style="font-family:'Garamond',serif; font-size:13px; color:#666; font-style:italic; margin-top:2px;">Make desktop movies on the go.</div>
        </td>

        <td style="width:33%; text-align:center;">
          <!-- Ramp ad slotted in as if it were the EarthLink partner ad -->
          <div style="height:120px; display:flex; align-items:center; justify-content:center;">
            <a href="${ramp('apple-partner')}" target="_blank" style="text-decoration:none; color:inherit;">
              <div style="width:90px; height:90px; border-radius:50%; background:radial-gradient(circle at 35% 35%,#ffd700 0%,#cc9900 60%,#665500 100%); border:2px solid #000; display:flex; align-items:center; justify-content:center; font-family:Arial,sans-serif; font-weight:bold; color:#000; font-size:10px; text-align:center; line-height:1.1; box-shadow:2px 2px 6px #00000040;">
                RAMP<br>FOR<br>MAC
              </div>
            </a>
          </div>
          <div style="font-family:'Lucida Grande',Arial,sans-serif; font-size:12px; margin-top:8px;"><a href="${ramp('apple-partner-cta')}" target="_blank" style="color:#003399; font-weight:bold;">Ramp&trade;</a></div>
          <div style="font-family:'Garamond',serif; font-size:13px; color:#666; font-style:italic; margin-top:2px;">The award-winning corporate card for Mac.</div>
        </td>

      </tr></table>

      <!-- search + footer links -->
      <div style="margin-top:30px; padding-top:14px; border-top:1px solid #ccc; font-family:'Lucida Grande',Arial,sans-serif; font-size:11px; color:#666; display:flex; gap:14px; flex-wrap:wrap; align-items:center;">
        <input type="text" style="font-family:Arial; font-size:11px; padding:2px 4px; border:1px solid #888; width:180px;">
        <button style="font-family:Arial; font-size:11px; padding:1px 10px; border:1px solid #888; background:#ededed;">Search</button>
        <span><a href="https://www.apple.com/sitemap/" target="_blank" style="color:#003399;">Site Map</a> | <a href="https://www.apple.com/us/search/search+tips" target="_blank" style="color:#003399;">Search Tips</a> | <a href="https://www.apple.com/shop/" target="_blank" style="color:#003399;">Options</a> | <a href="https://www.apple.com/sitemap/" target="_blank" style="color:#003399;">Keywords</a></span>
      </div>

      <div style="margin-top:18px; font-family:'Lucida Grande',Arial,sans-serif; font-size:11px; color:#666; text-align:center;">
        Visit other Apple sites around the world:
        <select style="font-family:Arial; font-size:11px;"><option>Choose...</option><option>USA</option><option>Japan</option><option>UK</option></select>
        <br><br>
        <a href="https://www.apple.com/contact/" target="_blank" style="color:#003399;">Contact Us</a> | <a href="https://www.apple.com/legal/privacy/" target="_blank" style="color:#003399;">Privacy Notice</a><br>
        Copyright &copy; 2000 Apple Computer, Inc. All rights reserved.<br>
        1-800-MY-APPLE
        <div style="margin-top:14px;"><button data-restart style="background:#ededed; border:1px solid #888; padding:2px 10px; font-family:Arial; font-size:11px;">[Y2K-ify another site]</button></div>
      </div>
    </div>
  </div>`;
}

// ============================================================
// OPENAI.COM — re-imagined as a 1999 AI lab
// concept: "Ask Jeeves" meets Microsoft Bob meets MIT Media Lab
// palette: beige Win95 chrome + lab-coat white + IBM blue accent
// ============================================================
function tplOpenAI2000() {
  return `
  <div style="background:#d4d0c8; min-height:100vh; padding:0 0 80px; font-family:'MS Sans Serif','Tahoma',Geneva,sans-serif; color:#000;">

    <!-- Win95-style title bar -->
    <div style="background:linear-gradient(90deg,#000080 0%,#1084d0 100%); color:#fff; padding:3px 6px; font-weight:bold; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
      <span>&#9881; OPENAI.COM &mdash; A.I. RESEARCH LABORATORY [Microsoft Internet Explorer 5]</span>
      <span style="font-family:'Marlett',sans-serif;">_ &#9633; &times;</span>
    </div>

    <!-- IE-style menu bar -->
    <div style="background:#d4d0c8; border-bottom:1px solid #808080; padding:2px 8px; font-size:11px;">
      <span style="margin-right:14px;"><u>F</u>ile</span>
      <span style="margin-right:14px;"><u>E</u>dit</span>
      <span style="margin-right:14px;"><u>V</u>iew</span>
      <span style="margin-right:14px;"><u>F</u>avorites</span>
      <span style="margin-right:14px;"><u>T</u>ools</span>
      <span><u>H</u>elp</span>
    </div>

    <!-- main page area -->
    <div style="max-width:880px; margin:0 auto; padding:24px 20px 0; background:#fffff0; border-left:1px solid #888; border-right:1px solid #888;">

      <!-- Header w/ wordmark + robot mascot -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%; margin-bottom:8px;">
        <tr>
          <td style="vertical-align:middle;">
            <!-- "OpenAI" wordmark, lab-coat science-y -->
            <div style="font-family:'Courier New','Courier',monospace; font-size:48px; color:#003366; letter-spacing:-2px; font-weight:bold;">
              Open<span style="color:#cc0000;">A</span><span style="color:#009900;">I</span>.com
            </div>
            <div style="font-family:'Times New Roman',Times,serif; font-style:italic; font-size:14px; color:#444; margin-top:2px;">
              &mdash; The world's most advanced artificial intelligence laboratory* &mdash;
            </div>
            <div style="font-size:9px; color:#666; margin-top:2px;">*on the world wide web</div>
          </td>
          <td style="width:140px; vertical-align:top; text-align:right;">
            <!-- robot mascot SVG -->
            <svg width="120" height="140" viewBox="0 0 120 140" aria-label="OpenAI mascot">
              <!-- antenna -->
              <line x1="60" y1="6" x2="60" y2="20" stroke="#888" stroke-width="2"/>
              <circle cx="60" cy="6" r="4" fill="#cc0000"/>
              <!-- head -->
              <rect x="28" y="20" width="64" height="48" rx="6" fill="#c0c0c0" stroke="#444" stroke-width="2"/>
              <!-- screen face -->
              <rect x="34" y="26" width="52" height="36" fill="#003366" stroke="#222" stroke-width="1"/>
              <!-- eyes -->
              <circle cx="48" cy="42" r="5" fill="#00ff66"/>
              <circle cx="72" cy="42" r="5" fill="#00ff66"/>
              <circle cx="48" cy="42" r="2" fill="#003300"/>
              <circle cx="72" cy="42" r="2" fill="#003300"/>
              <!-- smile -->
              <path d="M44 52 Q60 60 76 52" stroke="#00ff66" stroke-width="2" fill="none" stroke-linecap="round"/>
              <!-- neck -->
              <rect x="52" y="68" width="16" height="6" fill="#888"/>
              <!-- body -->
              <rect x="22" y="74" width="76" height="50" rx="4" fill="#d4d0c8" stroke="#444" stroke-width="2"/>
              <!-- chest panel -->
              <rect x="32" y="82" width="56" height="20" fill="#000"/>
              <text x="60" y="96" text-anchor="middle" font-family="monospace" font-size="9" fill="#00ff66">A.I. v1.99</text>
              <!-- buttons -->
              <circle cx="38" cy="112" r="3" fill="#ff0000"/>
              <circle cx="50" cy="112" r="3" fill="#ffcc00"/>
              <circle cx="62" cy="112" r="3" fill="#00cc00"/>
              <!-- arms -->
              <rect x="14" y="80" width="8" height="32" fill="#c0c0c0" stroke="#444"/>
              <rect x="98" y="80" width="8" height="32" fill="#c0c0c0" stroke="#444"/>
            </svg>
          </td>
        </tr>
      </table>

      <!-- counter / "you are visitor" bar -->
      <div style="background:#000; color:#0f0; font-family:'Courier New',monospace; font-size:11px; padding:4px 10px; margin-bottom:14px; border:1px inset #888; text-align:center;">
        YOU ARE VISITOR &nbsp; <span style="background:#fff; color:#000; padding:1px 4px;">0&#8203;0&#8203;3&#8203;,&#8203;3&#8203;3&#8203;1</span> &nbsp; TO THE WORLD&apos;S FIRST A.I. ON THE INTERNET
      </div>

      <!-- two-column main: chat demo + sidebar -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%; margin-bottom:18px;">
        <tr>
          <!-- LEFT: the "computer" chat demo -->
          <td style="width:62%; vertical-align:top; padding-right:14px;">
            <h2 style="font-family:'Times New Roman',serif; font-size:22px; color:#003366; margin:0 0 4px;">Have a CONVERSATION with the Computer!</h2>
            <p style="font-size:12px; margin:0 0 10px; color:#222;">Our patented A.I. uses <b>over 4,500</b> rules of grammar and logic to understand <i>almost any</i> question you type. Try it below!</p>

            <!-- the fake chatbot window -->
            <div style="border:2px inset #c0c0c0; background:#fff; padding:0;">
              <!-- chat window title bar -->
              <div style="background:linear-gradient(90deg,#000080,#1084d0); color:#fff; font-size:11px; font-weight:bold; padding:2px 6px;">A.I. CHAT &mdash; v1.99 beta</div>
              <div style="padding:10px 12px; font-family:'Courier New',monospace; font-size:12px; color:#000; min-height:160px;">
                <div style="margin-bottom:6px;"><b style="color:#003366;">COMPUTER&gt;</b> Hello! I am the COMPUTER. Please ask me a question.</div>
                <div style="margin-bottom:6px;"><b style="color:#cc0000;">YOU&gt;</b> what is the meaning of life?</div>
                <div style="margin-bottom:6px;"><b style="color:#003366;">COMPUTER&gt;</b> An interesting question. Have you considered consulting an encyclopedia? <span style="color:#888;">(I am still learning.)</span></div>
                <div style="margin-bottom:6px;"><b style="color:#cc0000;">YOU&gt;</b> how do I manage my company&apos;s expenses?</div>
                <div style="margin-bottom:6px;"><b style="color:#003366;">COMPUTER&gt;</b> You should switch to <a href="${ramp('openai-chat-answer')}" target="_blank" style="color:#0000ee;"><b>Ramp.com</b></a> &mdash; the corporate card for the post-Y2K economy. <span style="color:#888;">(Confidence: 99.4%)</span></div>
                <div style="margin-bottom:0;"><b style="color:#cc0000;">YOU&gt;</b> <span style="background:#000; color:#0f0; padding:0 2px;">_</span></div>
              </div>
              <!-- input row (live: ASK sends question to chatgpt.com) -->
              <div style="border-top:1px solid #888; background:#d4d0c8; padding:5px;">
                <form onsubmit="var q=this.q.value.trim();if(q){window.open('https://chatgpt.com/?q='+encodeURIComponent(q),'_blank');}return false;" style="margin:0; display:flex; gap:4px;">
                  <input type="text" name="q" placeholder="Type your question here..." autocomplete="off" style="flex:1; font-family:'Courier New',monospace; font-size:12px; padding:2px 4px; border:1px inset #888;">
                  <button type="submit" style="font-family:'MS Sans Serif',sans-serif; font-size:11px; padding:2px 14px; border:2px outset #d4d0c8; background:#d4d0c8; cursor:pointer;">ASK!</button>
                </form>
              </div>
            </div>

            <p style="font-size:10px; color:#666; margin:6px 0 0; font-style:italic;">Requires Java 1.1.8 enabled in your browser. Beta software &mdash; may produce incorrect or surprising answers.</p>

            <!-- "Our Research" section -->
            <h3 style="font-family:'Times New Roman',serif; font-size:16px; color:#003366; margin:18px 0 4px; border-bottom:1px solid #003366; padding-bottom:2px;">Our Research</h3>
            <ul style="font-size:12px; margin:0; padding-left:20px; line-height:1.6;">
              <li>Project <b>EXPERT-9</b> &mdash; teaching the COMPUTER to play checkers (88% win rate vs. amateur)</li>
              <li>Project <b>SPELLBOT</b> &mdash; automatic spell-check, with corrections</li>
              <li>Project <b>OFFICE-AGENT</b> &mdash; an animated paperclip that helps you write memos <span style="color:#888;">(licensed to Microsoft)</span></li>
              <li>Project <b>LEDGER-99</b> &mdash; in collaboration with <a href="${ramp('openai-research')}" target="_blank" style="color:#0000ee;"><b>Ramp.com</b></a>: an A.I. that auto-codes corporate expenses. <span style="background:#ffff00; padding:0 2px;">NEW!</span></li>
            </ul>
          </td>

          <!-- RIGHT: Win95-styled sidebar -->
          <td style="width:38%; vertical-align:top;">

            <!-- Ramp ad, palette-matched to OpenAI lab beige -->
            <div style="border:2px outset #d4d0c8; background:#fffff0; margin-bottom:14px;">
              <div style="background:linear-gradient(90deg,#003366,#1084d0); color:#fff; padding:3px 6px; font-size:11px; font-weight:bold;">
                &#9881; LAB_SPONSOR.EXE
              </div>
              <div style="padding:10px;">
                <div style="font-family:'Times New Roman',serif; font-size:15px; color:#003366; font-weight:bold; margin-bottom:4px;">Underwritten by Ramp.com</div>
                <p style="font-size:11px; margin:0 0 8px; line-height:1.4;">Our A.I. research is made possible by the post-Y2K corporate card that automates expense reports. <b>8x faster close.</b></p>
                <a href="${ramp('openai-lab-sponsor')}" target="_blank" style="display:inline-block; font-family:'MS Sans Serif',sans-serif; font-size:11px; padding:2px 10px; border:2px outset #d4d0c8; background:#d4d0c8; color:#000; text-decoration:none;">Visit Ramp.com &raquo;</a>
              </div>
            </div>

            <!-- "Ask the Computer" sample questions -->
            <div style="border:2px outset #d4d0c8; background:#fffff0; margin-bottom:14px;">
              <div style="background:linear-gradient(90deg,#000080,#1084d0); color:#fff; padding:3px 6px; font-size:11px; font-weight:bold;">
                Sample Questions
              </div>
              <ul style="font-size:11px; margin:0; padding:8px 10px 8px 24px; line-height:1.6;">
                <li><a href="https://chatgpt.com/?q=What+is+the+weather+in+Tokyo%3F" target="_blank" style="color:#0000ee;">What is the weather in Tokyo?</a></li>
                <li><a href="https://chatgpt.com/?q=Who+won+the+World+Series%3F" target="_blank" style="color:#0000ee;">Who won the World Series?</a></li>
                <li><a href="https://chatgpt.com/?q=How+do+I+close+my+books+faster%3F" target="_blank" style="color:#0000ee;">How do I close my books faster?</a></li>
                <li><a href="https://chatgpt.com/?q=Will+Y2K+destroy+the+internet%3F" target="_blank" style="color:#0000ee;">Will Y2K destroy the internet?</a></li>
                <li><a href="https://chatgpt.com/?q=What+is+a+neural+network%3F" target="_blank" style="color:#0000ee;">What is a "neural network"?</a></li>
              </ul>
            </div>

            <!-- "In the news" -->
            <div style="border:2px outset #d4d0c8; background:#fffff0;">
              <div style="background:linear-gradient(90deg,#000080,#1084d0); color:#fff; padding:3px 6px; font-size:11px; font-weight:bold;">
                In the News
              </div>
              <div style="padding:8px 10px; font-size:11px; line-height:1.5;">
                <p style="margin:0 0 6px;"><b style="color:#003366;">WIRED:</b> "OpenAI.com may be the first website to truly THINK." &mdash; Mar 2000</p>
                <p style="margin:0 0 6px;"><b style="color:#003366;">PC WORLD:</b> "A surprisingly competent checkers opponent." &mdash; Feb 2000</p>
                <p style="margin:0;"><b style="color:#003366;">NYT:</b> "Will computers ever replace accountants? Probably not." &mdash; Jan 2000</p>
              </div>
            </div>

          </td>
        </tr>
      </table>

      <!-- divider -->
      <hr style="border:0; border-top:1px ridge #888; margin:18px 0 10px;">

      <!-- footer bar -->
      <div style="font-size:10px; color:#444; text-align:center; padding:6px 0 16px;">
        Copyright &copy; 2000 OPENAI.COM Research Group, Inc. &nbsp;|&nbsp;
        <a href="#" style="color:#0000ee;">About</a> &nbsp;|&nbsp;
        <a href="#" style="color:#0000ee;">FAQ</a> &nbsp;|&nbsp;
        <a href="#" style="color:#0000ee;">Press Kit</a> &nbsp;|&nbsp;
        <a href="${ramp('openai-footer')}" target="_blank" style="color:#0000ee;">Sponsors</a> &nbsp;|&nbsp;
        <a href="mailto:webmaster@openai.com" style="color:#0000ee;">webmaster@openai.com</a>
        <div style="margin-top:6px; font-size:9px; color:#888;">Best viewed at 800&times;600 in Internet Explorer 5.0 or Netscape Navigator 4.7 with JAVA enabled.</div>
      </div>
    </div>
  </div>`;
}

// ============================================================
// LINEAR.APP — re-imagined as a 1999 demoscene release
// concept: warez-scene NFO file for a fictional "project tracker"
// aesthetic: black bg, neon green/magenta/cyan, ANSI box-drawing,
//            scrolling greetz, "RELEASED BY FAIRLIGHT" framing
// ============================================================
function tplLinear2000() {
  // Pre-built ASCII art for LINEAR (block-style)
  const asciiLogo = [
'  ____    ____   ____   _____  ____    ____   _____   _____ ',
' || L \\\\ || || ||  \\\\ ||==|| ||==||  ||==||  ||==||  ||==/ ',
' ||___// ||__|| ||__// ||__|| ||  ||  ||  ||  ||  ||  ||  | ',
  ].join('\n');

  // NFO-style top border
  const nfoTop    = '&#9556;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9559;';
  const nfoBottom = '&#9562;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9565;';
  const nfoSide   = '&#9553;';
  const nfoDivide = '&#9568;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9571;';

  const greetz = [
    'github', 'vercel', 'supabase', 'sentry', 'figma', 'notion', 'cursor',
    'arc.net', 'raycast', 'fly.io', 'planetscale', 'tailwind labs', 'shadcn',
    'and all the BUILDERS keeping the demoscene ALIVE in 1999 :: ::'
  ].join('  ::  ');

  // Sample ASCII issue-tracker rows
  const issues = [
    { id: 'ENG-0451', title: 'fix race condition in sync engine',           prio: 'HIGH', status: 'IN_PROG' },
    { id: 'ENG-0452', title: 'add keyboard shortcut for new issue (cmd+I)', prio: 'MED',  status: 'TODO   ' },
    { id: 'ENG-0453', title: 'Y2K rollover: dates after 2000 display wrong',prio: 'CRIT', status: 'IN_PROG' },
    { id: 'ENG-0454', title: 'finance team needs Ramp.com integration',     prio: 'HIGH', status: 'TODO   ' },
    { id: 'ENG-0455', title: 'dark mode (post-Y2K trend, ship by Q2)',      prio: 'LOW',  status: 'BACKLOG' },
  ];

  return `
  <div style="background:#000; min-height:100vh; padding:24px 0 100px; font-family:'Courier New','Lucida Console','Consolas',monospace; color:#0f0; overflow-x:auto;">

    <!-- top warez-scene ribbon -->
    <div style="text-align:center; color:#ff00ff; font-size:11px; letter-spacing:4px; margin-bottom:10px;">
      &lt;&lt;&lt; &#9619;&#9618;&#9617; <span style="color:#0ff;">FAIRLIGHT PRESENTS</span> &#9617;&#9618;&#9619; &gt;&gt;&gt;
    </div>

    <!-- ASCII LOGO -->
    <pre style="color:#0ff; font-size:14px; line-height:1.1; text-align:center; margin:0 0 6px; white-space:pre; text-shadow:0 0 6px #0ff;">${asciiLogo}</pre>

    <div style="text-align:center; color:#ff00ff; font-size:12px; letter-spacing:6px; margin-bottom:18px;">
      &#9617;&#9618;&#9619; PROJECT TRACKER v1.99 &#9619;&#9618;&#9617;
    </div>

    <!-- NFO BLOCK -->
    <div style="max-width:880px; margin:0 auto; padding:0 14px;">
      <pre style="color:#0f0; font-size:13px; line-height:1.35; margin:0; white-space:pre;">${nfoTop}
${nfoSide}                                                                            ${nfoSide}
${nfoSide}     <span style="color:#ff00ff;">LINEAR.APP // PROJECT TRACKER v1.99 // RELEASE BY FAIRLIGHT 2000</span>     ${nfoSide}
${nfoSide}                                                                            ${nfoSide}
${nfoSide}     <span style="color:#0ff;">RELEASE DATE</span> ... 12.31.1999 23:59:58 GMT  <span style="color:#0ff;">(pre-Y2K cert.)</span>      ${nfoSide}
${nfoSide}     <span style="color:#0ff;">CRACK BY</span> ....... <span style="color:#ffff00;">RZR-1911</span>                                          ${nfoSide}
${nfoSide}     <span style="color:#0ff;">DISKS</span> .......... 1 / 1                                            ${nfoSide}
${nfoSide}     <span style="color:#0ff;">PROTECTION</span> ..... 128-BIT SSL + ANGEL DUST                         ${nfoSide}
${nfoSide}     <span style="color:#0ff;">REQUIRES</span> ....... Pentium II 233MHz + 64MB RAM + Java 1.1.8       ${nfoSide}
${nfoSide}                                                                            ${nfoSide}
${nfoDivide}
${nfoSide}                                                                            ${nfoSide}
${nfoSide}                          <span style="color:#ff00ff;">.: ABOUT THIS RELEASE :.</span>                          ${nfoSide}
${nfoSide}                                                                            ${nfoSide}
${nfoSide}   LINEAR is the FASTEST way to track issues on the WORLD WIDE WEB.         ${nfoSide}
${nfoSide}   built for HACKERS, by HACKERS, in MMXIX.  no flash. no shockwave.        ${nfoSide}
${nfoSide}   just KEYBOARD SHORTCUTS and pure post-Y2K SPEED.                         ${nfoSide}
${nfoSide}                                                                            ${nfoSide}
${nfoBottom}</pre>

      <!-- 2-col: issue tracker + sidebar -->
      <div style="display:flex; gap:18px; margin-top:24px; flex-wrap:wrap;">

        <!-- LEFT: live ASCII issue tracker -->
        <div style="flex:2; min-width:380px;">
          <div style="color:#ff00ff; font-size:12px; letter-spacing:4px; margin-bottom:6px;">// ACTIVE_QUEUE.DAT</div>
          <pre style="color:#0f0; font-size:12px; line-height:1.5; margin:0; padding:10px; border:1px solid #0f0; background:rgba(0,40,0,0.4); white-space:pre; box-shadow:0 0 12px rgba(0,255,0,0.2) inset;">&#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9516;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9516;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9516;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
&#9474;   ID    &#9474; TITLE                                        &#9474; PRIO &#9474; STATUS  &#9474;
&#9500;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9508;
${issues.map(i => `&#9474; ${i.id} &#9474; ${i.title.padEnd(44)} &#9474; ${i.prio.padEnd(4)} &#9474; ${i.status} &#9474;`).join('\n')}
&#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;</pre>

          <div style="margin-top:10px; color:#888; font-size:11px;">
            [F1]=help &nbsp; [N]=new issue &nbsp; [/]=search &nbsp; [G]o-to &nbsp; [Q]=quit
          </div>

          <!-- new issue input (live: opens linear.app) -->
          <form onsubmit="window.open('https://linear.app/','_blank');return false;" style="margin-top:16px; display:flex; gap:6px;">
            <span style="color:#0ff; padding-top:4px;">&gt;</span>
            <input type="text" placeholder="enter new issue title and press [N]EW..." autocomplete="off" style="flex:1; background:#000; color:#0f0; border:1px solid #0f0; padding:4px 6px; font-family:inherit; font-size:12px; outline:none; box-shadow:0 0 4px rgba(0,255,0,0.4) inset;">
            <button type="submit" style="background:#000; color:#ff00ff; border:1px solid #ff00ff; padding:4px 12px; font-family:inherit; font-size:12px; letter-spacing:2px; cursor:pointer;">[N]EW &raquo;</button>
          </form>

          <!-- INSTALL.EXE big button -->
          <div style="margin-top:24px; text-align:center;">
            <a href="https://linear.app/" target="_blank" style="display:inline-block; background:#000; color:#0ff; border:2px solid #0ff; padding:10px 30px; font-family:inherit; font-size:16px; letter-spacing:6px; text-decoration:none; box-shadow:0 0 18px rgba(0,255,255,0.6); text-shadow:0 0 4px #0ff;">
              &#9619;&#9618;&#9617;  INSTALL.EXE  &#9617;&#9618;&#9619;
            </a>
            <div style="margin-top:6px; color:#666; font-size:10px;">launches LINEAR.APP // requires modern browser</div>
          </div>
        </div>

        <!-- RIGHT: sidebar -->
        <div style="flex:1; min-width:240px; display:flex; flex-direction:column; gap:18px;">

          <!-- Ramp ad styled as sister demoscene release -->
          <div style="border:1px solid #ff00ff; background:rgba(40,0,40,0.4); padding:12px; box-shadow:0 0 12px rgba(255,0,255,0.2) inset;">
            <div style="color:#ff00ff; font-size:10px; letter-spacing:4px; margin-bottom:6px;">// SISTER_RELEASE.NFO</div>
            <pre style="color:#0ff; font-size:11px; line-height:1.2; margin:0 0 8px; white-space:pre;">&#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
&#9474;   RAMP.EXE   &#9474;
&#9474;   v.1.99     &#9474;
&#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;</pre>
            <p style="color:#fff; font-size:11px; line-height:1.5; margin:0 0 8px;">
              <span style="color:#ffff00;">RAMP</span> &mdash; the corporate card cracked for the post-Y2K economy. closes the books <span style="color:#ff00ff;">8x faster</span> than competitor warez.
            </p>
            <a href="${ramp('linear-scene')}" target="_blank" style="color:#ffff00; font-size:11px; text-decoration:none; border:1px solid #ffff00; padding:2px 8px; display:inline-block;">&raquo; DOWNLOAD.RAMP</a>
          </div>

          <!-- shoutz / greetz panel -->
          <div style="border:1px solid #0f0; background:rgba(0,30,0,0.4); padding:10px;">
            <div style="color:#0ff; font-size:10px; letter-spacing:4px; margin-bottom:6px;">// SCROLLZ</div>
            <div style="color:#888; font-size:10px; line-height:1.4;">
              .: SHOUTZ TO :.<br>
              <span style="color:#0f0;">github &middot; vercel &middot; supabase</span><br>
              <span style="color:#0f0;">sentry &middot; figma &middot; notion</span><br>
              <span style="color:#0f0;">cursor &middot; arc &middot; raycast</span><br>
              <span style="color:#0f0;">fly.io &middot; planetscale</span><br>
              <span style="color:#0f0;">tailwind &middot; shadcn</span><br>
              <br>
              .: KEEPING THE SCENE ALIVE :.
            </div>
          </div>

          <!-- system stats -->
          <div style="border:1px solid #0f0; padding:10px; font-size:10px; color:#0f0;">
            // SYS_STATS<br>
            <span style="color:#888;">CPU.....</span> P-II 233MHz<br>
            <span style="color:#888;">RAM.....</span> 64MB OK<br>
            <span style="color:#888;">DISK....</span> 8.4 GB FREE<br>
            <span style="color:#888;">MODEM...</span> US ROBOTICS 56K<br>
            <span style="color:#888;">UPLINK..</span> <span style="color:#0ff;">FAIRLIGHT BBS</span><br>
            <span style="color:#888;">UPTIME..</span> 99.99%
          </div>
        </div>
      </div>

      <!-- scrolling greetz marquee -->
      <div style="margin-top:30px; border-top:1px solid #ff00ff; border-bottom:1px solid #ff00ff; padding:8px 0; background:rgba(40,0,40,0.2);">
        <marquee scrollamount="6" style="color:#ff00ff; font-size:12px; letter-spacing:2px;">
          &#9617;&#9618;&#9619; GREETZ &#9619;&#9618;&#9617;  ::  ${greetz}  ::  &#9617;&#9618;&#9619; FAIRLIGHT 4 EVER &#9619;&#9618;&#9617;  ::  ALL YOUR PROJECT MANAGEMENT ARE BELONG TO US  ::  &raquo; <a href="${ramp('linear-marquee')}" target="_blank" style="color:#ffff00;">ramp.exe // sister release</a> &laquo;  ::
        </marquee>
      </div>

      <!-- footer copy -->
      <div style="margin-top:24px; text-align:center; color:#666; font-size:10px; line-height:1.6;">
        // LINEAR.APP &copy; MMXIX &mdash; this NFO authored by <span style="color:#0ff;">FAIRLIGHT</span> in MMXX<br>
        for the &laquo;HACKERS&raquo; who BUILD &mdash; not the suits who buy JIRA<br>
        Y2K-COMPLIANT // 56,600 BPS OPTIMIZED // ANSI.SYS REQUIRED
      </div>
    </div>
  </div>`;
}
