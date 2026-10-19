/* Tradesite site.js
   Motion ui-bahnexpress-fi:n motion.js:n pohjalta (header, segmented, valikko, karuselli, morph, rullaavat numerot,
   aikajana, fit-to-width) + Tradesiten omat: yhteysvalikko, välilehdet, scrollspy, demokortit, lomakkeet, video, evästeet. */
(() => {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vt = fn => (!reduce && document.startViewTransition) ? document.startViewTransition(fn) : (fn(), null);
  const onView = (els, cb, opts = { threshold: 0.35 }) => {
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } }), opts);
    els.forEach(el => io.observe(el));
  };
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ei tallennusta */ } },
  };

  /* 1. Header: tausta tulee CSS scroll-timelinellä, fallback luokalla */
  const header = document.querySelector('.site-header');
  if (header) {
    const set = () => header.classList.toggle('is-scrolled', scrollY > 8);
    set(); addEventListener('scroll', set, { passive: true });
    // Kun käyttäjä pysähtyy, yläpalkki väistyy sekunnin kuluttua. Vieritys tai hiiri yläreunassa tuo sen takaisin.
    let idleT;
    const wake = () => {
      header.classList.remove('is-hidden'); clearTimeout(idleT);
      if (scrollY > 120) idleT = setTimeout(() => header.classList.add('is-hidden'), 1000);
    };
    addEventListener('scroll', wake, { passive: true });
    addEventListener('mousemove', e => { if (e.clientY < 90) wake(); }, { passive: true });
  }

  /* 2. Segmented: liukuva valintapilleri (nav + välilehdet) */
  const placers = [];
  document.querySelectorAll('[data-segmented]').forEach(seg => {
    const items = [...seg.querySelectorAll('.segmented__label')];
    const current = () => items.find(i => i.hasAttribute('aria-current') || i.getAttribute('aria-selected') === 'true');
    const place = () => {
      const el = current();
      if (!el) { seg.style.setProperty('--chip-width', '0px'); return; }
      seg.style.setProperty('--chip-left', el.offsetLeft + 'px');
      seg.style.setProperty('--chip-width', el.offsetWidth + 'px');
    };
    seg._place = place; placers.push(place); place();
  });
  addEventListener('resize', () => placers.forEach(p => p()));
  if (document.fonts) document.fonts.ready.then(() => placers.forEach(p => p()));

  /* 3. Scrollspy navigaatiolle */
  const spyLinks = [...document.querySelectorAll('.nav [data-spy]')];
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const targets = spyLinks.map(a => document.getElementById(a.dataset.spy)).filter(Boolean);
    const seg = document.querySelector('.nav [data-segmented]');
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        const a = spyLinks.find(l => l.dataset.spy === e.target.id);
        if (!a) return;
        if (e.isIntersecting) { spyLinks.forEach(l => l.removeAttribute('aria-current')); a.setAttribute('aria-current', 'location'); }
        else if (a.hasAttribute('aria-current')) a.removeAttribute('aria-current');
      });
      seg?._place();
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(t => io.observe(t));
  }

  /* 4. Dropdown (Ota yhteyttä) */
  document.querySelectorAll('[data-dropdown]').forEach(btn => {
    const sheet = document.getElementById(btn.getAttribute('aria-controls'));
    const close = () => { sheet.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const open = sheet.hidden;
      sheet.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      if (open) sheet.querySelector('a')?.focus({ preventScroll: true });
    });
    sheet.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('click', e => { if (!btn.parentElement.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) { close(); btn.focus(); } });
  });

  /* 5. Mobiilivalikko */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
  if (toggle && menu) {
    let scrim;
    const open = () => {
      menu.hidden = false; delete menu.dataset.state;
      toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', toggle.dataset.labelClose);
      header.classList.add('is-menu-open');
      scrim = document.createElement('div'); scrim.className = 'menu-scrim'; scrim.addEventListener('click', close); header.appendChild(scrim);
    };
    const close = () => {
      menu.dataset.state = 'closed';
      setTimeout(() => { menu.hidden = true; delete menu.dataset.state; }, reduce ? 0 : 180);
      toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', toggle.dataset.labelOpen);
      header.classList.remove('is-menu-open'); scrim?.remove();
    };
    toggle.addEventListener('click', () => toggle.getAttribute('aria-expanded') === 'true' ? close() : open());
    menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); } });
  }

  /* 6. Välilehdet (showcase) */
  document.querySelectorAll('[data-tabs]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      list._place?.();
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* 7. Karuselli: scroll-snap, nuolet, autoplay 6 s, sivuindikaattori */
  document.querySelectorAll('[data-carousel]').forEach(car => {
    const track = car.querySelector('.carousel__track');
    const slides = [...track.children];
    const ind = car.querySelector('[data-indicator]');
    const dur = parseFloat(css.getPropertyValue('--autoplay-duration')) * 1000 || 6000;
    let idx = 0, timer = null, paused = reduce, visible = false;
    if (reduce) car.setAttribute('data-paused', '');
    const playBtn = car.querySelector('[data-carousel-play]');
    const setPlayIcon = () => {
      if (!playBtn) return;
      playBtn.setAttribute('aria-label', paused ? playBtn.dataset.labelPlay : playBtn.dataset.labelPause);
      playBtn.innerHTML = paused
        ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
        : '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="14" y="4" width="4" height="16"/><rect x="6" y="4" width="4" height="16"/></svg>';
    };
    const dots = slides.map((s, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'page-indicator__dot'; b.setAttribute('aria-label', s.getAttribute('aria-label') || `${i + 1}`);
      b.onclick = () => go(i); ind?.appendChild(b); return b;
    });
    const mark = () => {
      slides.forEach((s, i) => s.toggleAttribute('data-current', i === idx));
      dots.forEach((d, i) => { d.removeAttribute('aria-current'); if (i === idx) { void d.offsetWidth; d.setAttribute('aria-current', 'true'); } });
    };
    const go = i => {
      idx = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[idx].offsetLeft - slides[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
      mark(); schedule();
    };
    const schedule = () => { clearTimeout(timer); if (!paused && visible && car.hasAttribute('data-autoplay')) timer = setTimeout(() => go(idx + 1), dur); };
    car.querySelector('[data-carousel-next]')?.addEventListener('click', () => go(idx + 1));
    car.querySelector('[data-carousel-prev]')?.addEventListener('click', () => go(idx - 1));
    playBtn?.addEventListener('click', () => { paused = !paused; car.toggleAttribute('data-paused', paused); setPlayIcon(); mark(); schedule(); });
    car.addEventListener('pointerenter', () => clearTimeout(timer)); car.addEventListener('pointerleave', schedule);
    car.addEventListener('focusin', () => clearTimeout(timer)); car.addEventListener('focusout', schedule);
    let st;
    track.addEventListener('scroll', () => {
      clearTimeout(st);
      st = setTimeout(() => {
        const x = track.scrollLeft; let best = 0;
        slides.forEach((s, i) => { if (Math.abs(s.offsetLeft - slides[0].offsetLeft - x) < Math.abs(slides[best].offsetLeft - slides[0].offsetLeft - x)) best = i; });
        if (best !== idx) { idx = best; mark(); schedule(); }
      }, 120);
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) { mark(); schedule(); } else clearTimeout(timer); }, { threshold: 0.4 }).observe(car);
    }
    setPlayIcon(); mark();
  });


  /* 7b. Karusellit (ominaisuudet, puhelimet): siirtyvät askeleittain yhden kortin verran.
     Napit ja niiden välissä aikapalkki: kun palkki täyttyy, karuselli siirtyy eteenpäin ja palkki alkaa alusta.
     Pysähtyy, kun käyttäjä vie hiiren päälle, koskee tai kohdistaa. Reduced motion: ei automaattista siirtoa. */
  const AUTO_MS = 4500;
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const list = rail.querySelector('[data-rail-track]');
    const bar = rail.querySelector('[data-rail-progress]');
    const center = rail.dataset.railAlign === 'center';
    // Päättymätön kierto: kortit kopioidaan molemmille puolille, ja reunalle tultaessa hypätään huomaamatta keskijoukkoon
    const originals = [...list.children]; const n = originals.length;
    const clone = el => { const c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); return c; };
    [...originals].reverse().forEach(el => list.prepend(clone(el)));
    originals.forEach(el => list.append(clone(el)));
    const cards = () => [...list.children];
    const padL = () => parseFloat(getComputedStyle(list).paddingLeft || 0);
    const target = c => center ? c.offsetLeft + c.offsetWidth / 2 - list.clientWidth / 2 : c.offsetLeft - padL();
    const current = () => { const x = list.scrollLeft; let best = 0, d = Infinity; cards().forEach((c, i) => { const dd = Math.abs(target(c) - x); if (dd < d) { d = dd; best = i; } }); return best; };
    const jump = i => { list.style.scrollSnapType = 'none'; list.scrollLeft = target(cards()[i]); void list.offsetWidth; list.style.scrollSnapType = ''; };
    const normalize = () => { const cur = current(); if (cur < n) jump(cur + n); else if (cur >= 2 * n) jump(cur - n); };
    const go = i => list.scrollTo({ left: target(cards()[i]), behavior: reduce ? 'auto' : 'smooth' });
    const move = dir => go(current() + dir);
    const start = +(rail.dataset.railStart || 0);
    const init = () => jump(n + start);
    requestAnimationFrame(init); addEventListener('load', init);
    addEventListener('resize', () => jump(n + ((current() - n) % n + n) % n));
    let settleT;
    list.addEventListener('scroll', () => { clearTimeout(settleT); settleT = setTimeout(normalize, 160); }, { passive: true });
    let elapsed = 0, held = false, visible = false, last = 0, resumeT;
    rail.querySelectorAll('[data-rail-prev]').forEach(b => b.addEventListener('click', () => { move(-1); elapsed = 0; }));
    rail.querySelectorAll('[data-rail-next]').forEach(b => b.addEventListener('click', () => { move(1); elapsed = 0; }));
    if (reduce || !bar) return;
    // Pysähtyy vain, kun käyttäjä koskee tai liikkuu näppäimistöllä korttien sisällä
    const hold = () => { held = true; clearTimeout(resumeT); };
    const release = () => { clearTimeout(resumeT); resumeT = setTimeout(() => { held = false; }, 2500); };
    list.addEventListener('pointerdown', hold, { passive: true });
    list.addEventListener('touchstart', hold, { passive: true });
    ['pointerup', 'touchend', 'pointercancel'].forEach(ev => list.addEventListener(ev, release, { passive: true }));
    list.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) hold(); });
    list.addEventListener('focusout', release);
    const tick = t => {
      const dt = last ? Math.min(64, t - last) : 16; last = t;
      if (!held && visible && !document.hidden) {
        elapsed += dt;
        if (elapsed >= AUTO_MS) { move(1); elapsed = 0; }
      }
      bar.style.transform = `scaleX(${Math.min(1, elapsed / AUTO_MS)})`;
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.25 }).observe(list);
    else visible = true;
    requestAnimationFrame(tick);
  });

  /* 7d. Referenssikartta: piste avaa kortin (hiiri, näppäimistö tai kosketus) */
  document.querySelectorAll('[data-refmap]').forEach(map => {
    const pins = [...map.querySelectorAll('.refmap__pin')];
    pins.forEach(pin => pin.querySelector('.refmap__dot').addEventListener('click', () => {
      const open = !pin.classList.contains('is-open');
      pins.forEach(p => { p.classList.remove('is-open'); p.querySelector('.refmap__dot').setAttribute('aria-expanded', 'false'); });
      if (open) { pin.classList.add('is-open'); pin.querySelector('.refmap__dot').setAttribute('aria-expanded', 'true'); }
    }));
  });

  /* 7e. Esimerkkikeskustelu: viestit tulevat näkyviin yksi kerrallaan, kun osio tulee esiin */
  document.querySelectorAll('[data-chat]').forEach(chat => {
    if (reduce || !('IntersectionObserver' in window)) return;
    chat.classList.add('is-pending');
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { chat.classList.replace('is-pending', 'is-live'); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(chat);
  });

  /* 7c. Hintalaskurin demo: laskee esimerkkihinnoilla haarukan */
  document.querySelectorAll('[data-calc]').forEach(box => {
    const panel = box.querySelector('.calc');
    const out = box.querySelector('[data-calc-out]');
    const areaOut = box.querySelector('[data-calc-area]');
    const fmt = n => Math.round(n / 10) * 10;
    const calc = () => {
      const rate = +box.querySelector('[name="calc-work"]:checked').value;
      const area = +box.querySelector('[name="calc-area"]').value;
      const coats = +box.querySelector('[name="calc-coats"]:checked').value;
      const base = rate * area * (coats === 2 ? 1.6 : 1);
      areaOut.textContent = area;
      out.textContent = `${fmt(base * 0.9).toLocaleString('fi-FI')}-${fmt(base * 1.15).toLocaleString('fi-FI')} €`;
    };
    panel.addEventListener('input', calc); calc();
  });

  /* 8. Demokortit: avautuvat täysleveiksi View Transitions -morphilla */
  document.querySelectorAll('[data-demos]').forEach(grid => {
    const cards = [...grid.querySelectorAll('.demo-card')];
    cards.forEach((s, i) => { s.style.viewTransitionName = `uc-${i}`; s.style.viewTransitionClass = 'use-case'; });
    const set = (target, focus = true) => {
      root.dataset.ucVt = '';
      const t = vt(() => cards.forEach(s => {
        const on = s === target;
        s.toggleAttribute('data-open', on);
        s.querySelector('.demo-card__more').hidden = !on;
        s.querySelector('.demo-card__open').setAttribute('aria-expanded', String(on));
      }));
      (t ? t.finished : Promise.resolve()).finally(() => {
        delete root.dataset.ucVt;
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
          if (focus) target.querySelector('.demo-card__close')?.focus({ preventScroll: true });
        }
      });
    };
    cards.forEach(s => {
      s.querySelector('.demo-card__open').addEventListener('click', () => set(s));
      s.querySelector('.demo-card__close').addEventListener('click', () => { set(null); s.querySelector('.demo-card__open').focus({ preventScroll: true }); });
      s.addEventListener('keydown', e => { if (e.key === 'Escape' && s.hasAttribute('data-open')) { set(null); s.querySelector('.demo-card__open').focus(); } });
    });
    // Linkki #demo-sahko avaa suoraan oikean kortin (hyvä myyntiviesteihin)
    const fromHash = () => { const m = location.hash.match(/^#demo-([\w-]+)$/); const card = m && document.getElementById(`demo-${m[1]}`); if (card && !card.hasAttribute('data-open')) set(card, false); };
    addEventListener('hashchange', fromHash); fromHash();
  });

  /* "Tee minulle tällainen": esivalitse ala demolomakkeessa */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-industry]');
    if (!a) return;
    const sel = document.querySelector('#yhteys-demo select[name="industry"]');
    if (sel) [...sel.options].forEach(o => { if (o.text === a.dataset.industry) sel.value = o.value || o.text; });
  });

  /* 9. Rullaavat numerot */
  const stagger = parseFloat(css.getPropertyValue('--stagger-base')) || 90;
  const rolls = [...document.querySelectorAll('[data-roll]')];
  rolls.forEach(el => {
    const val = el.dataset.roll || el.textContent.trim(); el.textContent = ''; el.classList.add('roll');
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = val; el.appendChild(sr);
    const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true'); el.appendChild(vis);
    let n = 0;
    [...val].forEach(ch => {
      if (!/\d/.test(ch)) { vis.append(ch); return; }
      const d = +ch, box = document.createElement('span'); box.className = 'roll__digit';
      box.innerHTML = `<span class="roll__ghost">${ch}</span><span class="roll__strip" style="transition-delay:${n * stagger}ms">${Array.from({ length: d + 1 }, (_, k) => `<span>${k}</span>`).join('')}</span>`;
      box.dataset.target = d; vis.appendChild(box); n++;
    });
  });
  onView(rolls, el => el.querySelectorAll('.roll__digit').forEach(b => { const d = +b.dataset.target; b.querySelector('.roll__strip').style.transform = `translateY(${-(d / (d + 1)) * 100}%)`; }), { threshold: 0.6 });

  /* 10. Aikajana piirtyy näkyviin tullessa */
  onView([...document.querySelectorAll('.timeline[data-draw="idle"]')], tl => { tl.dataset.draw = 'on'; }, { threshold: 0.25 });

  /* 11. Fit-to-width: display-otsikko askel pienemmäksi, jos pisin sana ei mahdu */
  const steps = [96, 80, 72, 56, 48, 44, 40, 36, 32, 28];
  const fit = () => document.querySelectorAll('[data-fit]').forEach(el => {
    el.style.fontSize = ''; el.style.lineHeight = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0';
    el.appendChild(probe);
    const longest = () => { let w = 0; el.textContent.replace(probe.textContent, '').split(/\s+/).forEach(t => { probe.textContent = t; w = Math.max(w, probe.offsetWidth); }); return w; };
    while (longest() > el.clientWidth && size > 28) { size = steps.find(s => s < size) || 28; el.style.fontSize = size + 'px'; el.style.lineHeight = size + 'px'; }
    probe.remove();
  });
  if (document.fonts) { document.fonts.ready.then(fit); document.fonts.addEventListener?.('loadingdone', () => { fit(); placers.forEach(p => p()); }); } else fit();
  addEventListener('load', fit);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 120); });

  /* 12. Hero-video: autoplay vain jos ei reduced motionia eikä säästötilaa */
  const video = document.querySelector('[data-hero-video]');
  if (video) {
    const save = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
    if (reduce || save || innerWidth < 768) video.remove();
    else video.play().catch(() => {});
  }

  /* 13. Lomakkeet: FORM_ENDPOINT, inline-kiitos, ei sivunvaihtoa */
  const cfg = window.TRADESITE || {};
  document.querySelectorAll('form[data-form]').forEach(form => {
    const status = form.querySelector('.form-status');
    form.addEventListener('input', e => e.target.closest('.field')?.classList.remove('is-invalid'));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('input[required], select[required]').forEach(i => {
        const bad = !i.value.trim() || (i.type === 'tel' && i.value.replace(/\D/g, '').length < 6) || !i.checkValidity();
        i.closest('.field')?.classList.toggle('is-invalid', bad);
        i.setAttribute('aria-invalid', String(bad));
        if (bad) ok = false;
      });
      if (!ok) {
        if (status) { status.dataset.kind = 'error'; status.textContent = cfg.invalid || ''; }
        form.querySelector('.is-invalid input, .is-invalid select')?.focus();
        return;
      }
      const data = Object.fromEntries(new FormData(form));
      if (data.website) return; // roskapostiansa
      delete data.website;
      data.page = location.href;
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      if (status) { status.dataset.kind = ''; status.textContent = cfg.sending || ''; }
      try {
        if (cfg.formEndpoint) {
          const res = await fetch(cfg.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error(res.status);
        } else {
          console.info('[Tradesite] FORM_ENDPOINT puuttuu, lähetys simuloitu:', data);
          await new Promise(r => setTimeout(r, 400));
        }
        const done = document.createElement('div');
        done.className = 'form-success'; done.setAttribute('role', 'status'); done.tabIndex = -1;
        done.innerHTML = '<span class="tile"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>';
        done.append(document.createTextNode(cfg.success || 'Kiitos!'));
        form.replaceChildren(done);
        done.focus({ preventScroll: true });
        window.dispatchEvent(new CustomEvent('tradesite:event', { detail: { event: 'form-success', form: form.dataset.form } }));
      } catch {
        btn.disabled = false;
        if (status) { status.dataset.kind = 'error'; status.textContent = cfg.error || ''; }
      }
    });
  });

  /* 14. Tapahtumamerkinnät: data-event -> CustomEvent (seuranta kytketään myöhemmin) */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-event]');
    if (el) window.dispatchEvent(new CustomEvent('tradesite:event', { detail: { event: el.dataset.event, form: el.dataset.formName } }));
  });

  /* 15. Evästeilmoitus */
  const banner = document.querySelector('[data-cookie]');
  if (banner) {
    if (!store.get('ts-cookie-ok')) banner.hidden = false;
    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => { store.set('ts-cookie-ok', '1'); banner.hidden = true; });
    document.querySelectorAll('[data-cookie-settings]').forEach(b => b.addEventListener('click', () => { banner.hidden = false; banner.querySelector('button')?.focus(); }));
  }
})();
