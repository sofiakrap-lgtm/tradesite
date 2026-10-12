/* <before-after>: ennen ja jälkeen -slideri (custom element, ei riippuvuuksia).
   Rakenne:
   <before-after start="50" nudge label="Vertaa">
     <div class="ba__layer ba__after"> kuva jälkeen </div>
     <div class="ba__layer ba__before"> kuva ennen </div>
     <span class="ba__pill ba__pill--before">Ennen</span> <span class="ba__pill ba__pill--after">Jälkeen</span>
   </before-after>
   Kahva luodaan automaattisesti. Toimii hiirellä, kosketuksella ja nuolinäppäimillä (role="slider"). */
class BeforeAfter extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.pos = clamp(parseFloat(this.getAttribute('start') ?? '50'));

    const line = document.createElement('span');
    line.className = 'ba__line';
    const handle = document.createElement('div');
    handle.className = 'ba__handle';
    handle.tabIndex = 0;
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', this.getAttribute('label') || 'Ennen ja jälkeen');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-orientation', 'horizontal');
    handle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    this.append(line, handle);
    this.handle = handle;
    this.set(this.pos);

    let dragging = false;
    const fromEvent = e => {
      const r = this.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    };
    this.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      dragging = true;
      this.setPointerCapture(e.pointerId);
      this.set(fromEvent(e));
      this.stopNudge();
    });
    this.addEventListener('pointermove', e => { if (dragging) this.set(fromEvent(e)); });
    const end = () => { dragging = false; };
    this.addEventListener('pointerup', end);
    this.addEventListener('pointercancel', end);

    handle.addEventListener('keydown', e => {
      const step = e.shiftKey ? 10 : 5;
      const map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
      if (e.key in map) { this.set(this.pos + map[e.key]); e.preventDefault(); }
      else if (e.key === 'Home') { this.set(0); e.preventDefault(); }
      else if (e.key === 'End') { this.set(100); e.preventDefault(); }
      else if (e.key === 'PageUp' || e.key === 'PageDown') { this.set(this.pos + (e.key === 'PageUp' ? 20 : -20)); e.preventDefault(); }
      this.stopNudge();
    });

    // Kun slideri tulee näkyviin, kahva liukuu kerran kevyesti ja palaa. Ei reduced motionilla.
    if (this.hasAttribute('nudge') && !this.reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(en => en.isIntersecting)) { io.disconnect(); this.nudge(); }
      }, { threshold: 0.6 });
      io.observe(this);
    }
  }

  set(v) {
    this.pos = clamp(v);
    this.style.setProperty('--pos', this.pos + '%');
    this.handle.setAttribute('aria-valuenow', String(Math.round(this.pos)));
    this.handle.setAttribute('aria-valuetext', `${Math.round(this.pos)} %`);
  }

  nudge() {
    const start = this.pos, amp = 9, dur = 1100, t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const t = Math.min(1, (now - t0) / dur);
      // ylös ja takaisin: sin-kaari pehmeällä easingilla
      this.set(start + Math.sin(ease(t) * Math.PI) * amp);
      if (t < 1) this._raf = requestAnimationFrame(tick); else this.set(start);
    };
    this._raf = requestAnimationFrame(tick);
  }

  stopNudge() { if (this._raf) cancelAnimationFrame(this._raf); this._raf = null; }
}

function clamp(v) { return Math.min(100, Math.max(0, Number.isFinite(v) ? v : 50)); }

if (!customElements.get('before-after')) customElements.define('before-after', BeforeAfter);
