/* ============================================================
   FOR CIANNA  ·  a little proposal
   ============================================================
   EVERYTHING you might want to change is in CONFIG below.
   - Change the words, the questions, the replies, the taunts.
   - Set finale.giftUrl to the live Cynnanex site link once it's up.
   No need to touch the engine underneath unless you want to.
   ============================================================ */

const CONFIG = {
  name: 'Cianna',

  // The opening screen
  intro: {
    eyebrow: 'a little something',
    title: 'Hi Cutiefly 🩷',
    body: "I'm not great at saying the big stuff out loud, so I made you this instead. Walk through it with me?",
    cta: "Okay, let's 💕",
  },

  // The lead-up questions. Add or remove freely.
  //  type: 'choice'  -> she picks a button, you reply, it moves on
  //  type: 'scale'   -> she taps 1 to 5 hearts, you reply, it moves on
  questions: [
    {
      type: 'choice',
      q: 'Be honest, do you know how much you mean to me?',
      options: [
        { label: 'I think I do', reply: 'More than that. I promise.' },
        { label: 'Tell me?', reply: "Then let me show you. Keep going." },
      ],
    },
    {
      type: 'scale',
      q: 'How much do you like spending time with me?',
      // replies by number of hearts (1 to 5); last one is the "max" answer
      replies: [
        "I think you misclicked. ",
        "Misclick?. ",
        "Erm, no need to be shy.",
        "Okay, now you're making me blush. 🩷",
        "You just made my whole week. 🩷",
      ],
    },
    {
      type: 'choice',
      q: 'Do I make you smile, even on the bad days?',
      options: [
        { label: 'Always', reply: 'You do the same for me. Every day.' },
        { label: 'Most days 😄', reply: "Erm, my b. I'll work on the rest of them." },
      ],
    },
    {
      type: 'choice',
      q: "Would you say we're pretty wonderful together?",
      options: [
        { label: 'We really are', reply: 'Heh, I think so too. So here goes nothing.' },
        { label: 'Obviously 💗', reply: 'Damn right, Obviously.' },
      ],
    },
  ],

  // A heartfelt message shown before the "deep breath" pause.
  // (body uses <br> for line breaks — it's rendered as HTML.)
  prebuildup: {
    title: 'You mean the world to me.',
    body: "You saved me from this lonely hell.<br>Please find it in your heart.<br>Don't give up on us Cici.<br>Don't leave me all alone in this hell.",
    cta: "Next.",
  },

  // The pause right before the big question
  buildup: {
    title: 'Okay. Deep breath. 🫶',
    body: "There's something I've been wanting to ask you.",
    cta: "I'm ready",
  },

  // THE question
  bigQuestion: 'Cianna, can I be your boyfriend?',
  yesLabel: 'YES! 🥹',
  noLabel: 'No',

  // What the runaway "No" button says as it dodges (in order).
  noTaunts: [
    'are you sure?',
    'wait, really?',
    'think about it',
    "but we're so good together 🩷",
    'please? for me?',
    "my heart can't take this 💔",
    'the No button is broken, sorry',
    "still broken sorry:(",
    '(it is never going to happen 😌)',
    'just say yes, you know you want to 💗',
  ],

  // The celebration
  finale: {
    yell: 'SUGOIIIII I HAD A FEELING YOU WOULD SAY YES HEHE!',
    sub: 'You just made me the happiest guy alive. 🥹',
    body: "Ever since I met you, everything has been better with you in it. I can't wait to make more memories with you. I Love You 🩷",
    giftLabel: 'A gift for you 🎁',
    // ↓↓↓ PUT THE LIVE CYNNANEX SITE URL HERE once the domain is live ↓↓↓
    giftUrl: 'https://cynnanex.com/',
  },

  signature: 'made just for you 🩷',
};

/* ============================================================
   Engine — you usually don't need to edit below here.
   ============================================================ */
(function () {
  'use strict';

  const HEART_PATH =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const app = document.getElementById('app');

  /* ---------- tiny element helper ---------- */
  function el(tag, opts) {
    const node = document.createElement(tag);
    opts = opts || {};
    if (opts.class) node.className = opts.class;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.html != null) node.innerHTML = opts.html;
    if (opts.attrs) for (const k in opts.attrs) node.setAttribute(k, opts.attrs[k]);
    if (opts.on) for (const ev in opts.on) node.addEventListener(ev, opts.on[ev]);
    (opts.kids || []).forEach((k) => k && node.appendChild(k));
    return node;
  }

  function heartSVG(cls) {
    const span = el('span', { class: cls || '' });
    span.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' +
      HEART_PATH +
      '"></path></svg>';
    return span.firstChild;
  }

  /* ---------- build the full step list ---------- */
  const STEPS = [{ type: 'intro' }];
  CONFIG.questions.forEach((q) => STEPS.push(Object.assign({ isQ: true }, q)));
  STEPS.push({ type: 'prebuildup' });
  STEPS.push({ type: 'buildup' });
  STEPS.push({ type: 'final' });
  STEPS.push({ type: 'finale' });

  const totalQ = STEPS.filter((s) => s.isQ).length;
  let index = 0;

  function next() {
    index = Math.min(index + 1, STEPS.length - 1);
    render();
  }

  /* ---------- progress row of hearts ---------- */
  function progressRow() {
    const done = STEPS.slice(0, index).filter((s) => s.isQ).length;
    const row = el('div', { class: 'progress', attrs: { 'aria-hidden': 'true' } });
    for (let i = 0; i < totalQ; i++) {
      const h = heartSVG('pdot' + (i < done ? ' on' : ''));
      row.appendChild(h);
    }
    return row;
  }

  /* ---------- card mounting + transition ---------- */
  function mount(card) {
    app.innerHTML = '';
    card.classList.add('card');
    app.appendChild(card);
    // restart the entrance animation
    card.classList.remove('in');
    void card.offsetWidth;
    card.classList.add('in');
    const focusable = card.querySelector('button, a, [tabindex]');
    if (focusable) focusable.focus({ preventScroll: true });
  }

  /* ---------- renderers per step ---------- */
  function renderIntro(step, card) {
    const c = CONFIG.intro;
    card.appendChild(
      el('img', {
        class: 'accent',
        attrs: { src: 'assets/art/IMG_7739.jpg', alt: 'A photo of us', width: 1000, height: 691, decoding: 'async' },
      })
    );
    card.appendChild(el('p', { class: 'eyebrow', text: c.eyebrow }));
    card.appendChild(el('h1', { class: 'title', text: c.title }));
    card.appendChild(el('p', { class: 'lead', text: c.body }));
    card.appendChild(
      el('div', {
        class: 'btns',
        kids: [el('button', { class: 'btn', attrs: { type: 'button' }, text: c.cta, on: { click: next } })],
      })
    );
  }

  function renderChoice(step, card) {
    card.appendChild(progressRow());
    card.appendChild(el('h2', { class: 'q', text: step.q }));

    const reply = el('p', { class: 'reply', attrs: { role: 'status', 'aria-live': 'polite' } });
    const grid = el('div', { class: 'choices' + (step.options.length === 2 ? ' two' : '') });

    step.options.forEach((opt, i) => {
      const btn = el('button', {
        class: 'btn' + (i % 2 ? ' ghost' : ''),
        attrs: { type: 'button' },
        text: opt.label,
        on: {
          click: () => {
            grid.querySelectorAll('button').forEach((b) => (b.disabled = true));
            reply.textContent = opt.reply || '';
            window.setTimeout(next, 1450);
          },
        },
      });
      grid.appendChild(btn);
    });

    card.appendChild(grid);
    card.appendChild(reply);
  }

  function renderScale(step, card) {
    card.appendChild(progressRow());
    card.appendChild(el('h2', { class: 'q', text: step.q }));

    const reply = el('p', { class: 'reply', attrs: { role: 'status', 'aria-live': 'polite' } });
    const row = el('div', { class: 'scale', attrs: { role: 'group', 'aria-label': step.q } });
    let locked = false;

    const hearts = [];
    function paint(upto) {
      hearts.forEach((h, i) => h.classList.toggle('on', i < upto));
    }

    for (let i = 0; i < 5; i++) {
      const value = i + 1;
      const btn = el('button', {
        class: 'heart-pick',
        attrs: { type: 'button', 'aria-label': value + (value === 1 ? ' heart' : ' hearts') },
      });
      btn.appendChild(heartSVG(''));
      btn.addEventListener('pointerenter', () => { if (!locked) paint(value); });
      btn.addEventListener('focus', () => { if (!locked) paint(value); });
      btn.addEventListener('click', () => {
        if (locked) return;
        locked = true;
        paint(value);
        btn.classList.add('locked');
        row.querySelectorAll('button').forEach((b) => (b.disabled = true));
        reply.textContent = step.replies[value - 1] || '';
        window.setTimeout(next, 1500);
      });
      hearts.push(btn);
      row.appendChild(btn);
    }
    row.addEventListener('pointerleave', () => { if (!locked) paint(0); });

    card.appendChild(row);
    card.appendChild(reply);
  }

  function renderPrebuildup(step, card) {
    const c = CONFIG.prebuildup;
    card.appendChild(el('h2', { class: 'title', text: c.title }));
    card.appendChild(el('p', { class: 'lead', html: c.body }));
    card.appendChild(
      el('div', {
        class: 'btns',
        kids: [el('button', { class: 'btn', attrs: { type: 'button' }, text: c.cta, on: { click: next } })],
      })
    );
  }

  function renderBuildup(step, card) {
    const c = CONFIG.buildup;
    card.appendChild(el('h2', { class: 'title', text: c.title }));
    card.appendChild(el('p', { class: 'lead', text: c.body }));
    card.appendChild(
      el('div', {
        class: 'btns',
        kids: [el('button', { class: 'btn', attrs: { type: 'button' }, text: c.cta, on: { click: next } })],
      })
    );
  }

  function renderFinal(step, card) {
    card.classList.add('final');
    card.appendChild(el('h2', { class: 'q', text: CONFIG.bigQuestion }));

    const yes = el('button', {
      class: 'btn btn-yes',
      attrs: { type: 'button' },
      text: CONFIG.yesLabel,
      on: { click: () => { index = STEPS.length - 1; render(); } },
    });
    const no = el('button', {
      class: 'btn ghost btn-no',
      attrs: { type: 'button' },
      text: CONFIG.noLabel,
    });

    const zone = el('div', { class: 'zone', kids: [yes, no] });
    card.appendChild(zone);
    setupDodge(no, yes, zone);
  }

  /* ---------- the "No" button: desktop dodges in a zone; mobile stacks under Yes ---------- */
  function setupDodge(no, yes, zone) {
    const taunts = CONFIG.noTaunts;
    let attempts = 0;
    let yesScale = 1;
    let lastAdvance = 0;
    let gone = false;
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    // Desktop: buttons sit absolutely in the zone (translateY centres them).
    // Mobile: they're stacked in normal flow, so no translateY.
    const yPrefix = isMobile ? '' : 'translateY(-50%) ';
    function applyYes() {
      yes.style.transform = (yPrefix + (yesScale > 1 ? 'scale(' + yesScale.toFixed(3) + ')' : '')).trim();
    }
    if (!isMobile) no.style.transform = 'translateY(-50%)';
    applyYes();

    // How big Yes may get. Mobile: grows upward, capped so it stays on-screen
    // and No stays tappable below it. Desktop: huge, ~filling the viewport.
    function maxYes() {
      const baseW = yes.offsetWidth || 160, baseH = yes.offsetHeight || 56;
      const cw = document.documentElement.clientWidth, ch = document.documentElement.clientHeight;
      if (isMobile) {
        const upRoom = yes.getBoundingClientRect().bottom - 12;
        return Math.max(1.5, Math.min(cw * 0.96 / baseW, upRoom / baseH));
      }
      return Math.max(1.8, Math.min(cw * 0.94 / baseW, ch * 0.86 / baseH));
    }
    function growYes() {
      yesScale = Math.min(yesScale + (isMobile ? 0.3 : 0.45), maxYes());
      applyYes();
    }

    // After the last plea, No gives up and disappears, leaving a giant Yes.
    function vanish() {
      gone = true;
      no.classList.add('gone');
      no.disabled = true;
      growYes();
    }

    // Show the next taunt + grow Yes. `paced` throttles a fast pointer (desktop).
    function advance(paced) {
      if (paced) {
        const now = Date.now();
        if (now - lastAdvance < 260) return;
        lastAdvance = now;
      }
      if (attempts >= taunts.length) { vanish(); return; }
      no.textContent = taunts[attempts];
      attempts++;
      growYes();
    }

    // MOBILE (stacked) or reduced motion: No stays put; each tap cycles a taunt
    // and grows Yes; after the last taunt it vanishes.
    if (isMobile || reduceMotion) {
      no.addEventListener('click', (e) => { if (e) e.preventDefault(); advance(false); });
      return;
    }

    // DESKTOP: center the Yes + No pair, then let No dodge within the zone.
    requestAnimationFrame(() => {
      const z = zone.getBoundingClientRect();
      const yw = yes.getBoundingClientRect().width;
      const nw = no.getBoundingClientRect().width;
      const gap = 16;
      const startX = Math.max(6, (z.width - (yw + gap + nw)) / 2);
      yes.style.left = startX + 'px';
      no.style.left = (startX + yw + gap) + 'px';
    });

    // Move No away from (px, py), staying inside the zone AND the viewport.
    function moveNo(px, py) {
      if (gone) return;
      const z = zone.getBoundingClientRect();
      const b = no.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      let dx = (b.left + b.width / 2) - px;
      let dy = (b.top + b.height / 2) - py;
      const mag = Math.hypot(dx, dy) || 1;
      dx /= mag;
      dy /= mag;
      let newLeft = (b.left - z.left) + dx * 240;
      let newTop = (b.top - z.top) + dy * 240;
      newLeft = clamp(newLeft, 0, z.width - b.width);
      newTop = clamp(newTop, 0, z.height - b.height);
      newLeft = clamp(newLeft, -z.left, vw - z.left - b.width);
      newTop = clamp(newTop, -z.top, vh - z.top - b.height);
      no.style.left = newLeft + 'px';
      no.style.top = newTop + 'px';
      no.style.transform = 'none';
      advance(true);
    }

    zone.addEventListener('pointermove', (e) => {
      if (gone) return;
      const b = no.getBoundingClientRect();
      const d = Math.hypot((b.left + b.width / 2) - e.clientX, (b.top + b.height / 2) - e.clientY);
      if (d < 140) moveNo(e.clientX, e.clientY);
    });
    no.addEventListener('pointerdown', (e) => { e.preventDefault(); moveNo(e.clientX, e.clientY); });
    no.addEventListener('click', (e) => e.preventDefault());
  }

  /* ---------- finale ---------- */
  function renderFinale(step, card) {
    const c = CONFIG.finale;
    card.classList.add('finale');
    card.appendChild(el('h1', { class: 'yell', text: c.yell }));
    card.appendChild(el('p', { class: 'sub', text: c.sub }));
    card.appendChild(el('p', { class: 'lead', text: c.body }));
    card.appendChild(
      el('a', {
        class: 'gift-btn',
        text: c.giftLabel,
        attrs: { href: c.giftUrl, target: '_blank', rel: 'noopener' },
      })
    );
    card.appendChild(el('p', { class: 'signature', text: CONFIG.signature }));

    celebrate();
    heartRain();
  }

  /* ---------- render dispatch ---------- */
  function render() {
    const step = STEPS[index];
    const card = el('div', {});
    switch (step.type || (step.isQ ? step.type : '')) {
      case 'intro': renderIntro(step, card); break;
      case 'prebuildup': renderPrebuildup(step, card); break;
      case 'buildup': renderBuildup(step, card); break;
      case 'final': renderFinal(step, card); break;
      case 'finale': renderFinale(step, card); break;
      default:
        if (step.type === 'scale') renderScale(step, card);
        else renderChoice(step, card);
    }
    mount(card);
  }

  /* ============================================================
     Confetti + raining hearts (decorative)
     ============================================================ */
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();

  function celebrate() {
    const colors = ['#DB2777', '#F48BB0', '#FAD1E1', '#B49BE3', '#FFD36E', '#FFFFFF'];
    const count = reduceMotion ? 50 : 180;
    const parts = [];
    for (let i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.5,
        vx: (Math.random() - 0.5) * 2.4,
        vy: 2 + Math.random() * 3.6,
        s: 6 + Math.random() * 9,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[(Math.random() * colors.length) | 0],
        round: Math.random() < 0.5,
      });
    }

    const start = performance.now();
    const life = reduceMotion ? 1400 : 5500;

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of parts) {
        p.vy += 0.05;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.55);
        }
        ctx.restore();
      }
      if (elapsed < life) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }
    requestAnimationFrame(frame);
  }

  function heartRain() {
    if (reduceMotion) return;
    const layer = document.getElementById('hearts');
    const colors = ['#DB2777', '#EC6594', '#F48BB0', '#B49BE3'];
    const make = (n) => {
      for (let i = 0; i < n; i++) {
        const wrap = document.createElement('span');
        wrap.className = 'fh';
        const size = 14 + Math.random() * 26;
        const dur = 5 + Math.random() * 4;
        wrap.style.left = Math.random() * 100 + 'vw';
        wrap.style.color = colors[(Math.random() * colors.length) | 0];
        wrap.style.setProperty('--s', (size / 22).toFixed(2));
        wrap.style.setProperty('--o', (0.55 + Math.random() * 0.4).toFixed(2));
        wrap.style.setProperty('--r', (Math.random() * 60 - 30).toFixed(0) + 'deg');
        wrap.style.animationDuration = dur + 's';
        wrap.style.animationDelay = Math.random() * 1.2 + 's';
        wrap.innerHTML =
          '<svg width="' + size + '" height="' + size +
          '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' +
          HEART_PATH + '"></path></svg>';
        layer.appendChild(wrap);
        window.setTimeout(() => wrap.remove(), (dur + 1.4) * 1000);
      }
    };
    make(22);
    let bursts = 0;
    const timer = window.setInterval(() => {
      make(10);
      if (++bursts >= 6) window.clearInterval(timer);
    }, 1100);
  }

  /* ---------- go ---------- */
  render();
})();
