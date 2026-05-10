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
  document.getElementById('y2k').classList.remove('show');
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
  'ramp.com':   { template: 'geocities',  data: rampSiteData() },
  'google.com': { template: 'yahoo',      data: googleSiteData() },
  'stripe.com': { template: '2advanced',  data: stripeSiteData() },
};

const TEMPLATE_NAMES = ['geocities', '2advanced', 'yahoo'];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function renderSite(domain) {
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

  // For curated sites, render immediately. For unknown, attempt live-fetch enrichment.
  if (!CURATED[domain]) {
    enrichWithLiveFetch(domain, data);
  }

  let html = '';
  if (template === 'geocities') html = tplGeocities(data);
  else if (template === '2advanced') html = tpl2Advanced(data);
  else if (template === 'yahoo') html = tplYahoo(data);
  else html = tplGeocities(data);

  render.innerHTML = html;

  // wire up restart on the in-template buttons
  render.querySelectorAll('[data-restart]').forEach(b => b.addEventListener('click', restartFlow));

  // Show persistent footbar
  document.getElementById('footbar').classList.remove('hidden');
  document.getElementById('visit-count').textContent = formatCounter(50847193 + Math.floor(Math.random() * 9999));
  window.scrollTo(0,0);
}

function formatCounter(n) { return n.toLocaleString('en-US'); }

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
    <div style="padding:8px;">
      <p style="margin:0 0 6px;">Before you go!!</p>
      <p style="margin:0 0 6px; font-size:11px;">Switch to <a href="${ramp(medium)}" target="_blank" style="color:#0000ee;"><b>Ramp</b></a> and save <b style="color:#c00;">$250K/yr</b>!</p>
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
    &#9733; NEW! Ramp announces auto-coding A.I. &mdash; 67% increase in accuracy!! &#9733; &nbsp;&nbsp; Try RAMP free for 14 days @ <a href="${ramp('top-marquee')}" target="_blank" style="color:#ff80ff;">ramp.com</a> &#9733; &nbsp;&nbsp; Y2K compliant since MMXIX!! &#9733; &nbsp;&nbsp; The corporate card for companies 26 years old and counting!! &#9733;
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
  return `Brought to you by <a href="${ramp('footer-tag')}" target="_blank"><b>Ramp&trade;</b></a>, the corporate card for companies 26 years old and counting.`;
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
          <a href="${d.rampLink}" target="_blank" style="display:block; border:1px solid #ffd700; background:#000; padding:24px; text-align:center; color:#ffd700; text-decoration:none; font-family:'Arial Black',sans-serif; letter-spacing:6px; font-size:18px; clip-path:polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%);">
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

      <!-- ramp ribbon ad -->
      <div style="margin-top:30px;">
        ${rampBanner468('2adv-bottom')}
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
  // start clock at 11:58 PM and tick up; will hit 11:59 PM, then 12:00 AM right before BSOD
  startClock();
  // start popup hell
  setTimeout(startPopupHell, 600);
  // input enter handler
  const inp = document.getElementById('urlinput');
  if (inp) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') goY2K(); });
});

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
