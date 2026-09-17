(function () {
  class LenisLite {
    constructor(options = {}) {
      this.options = options;
      this.target = window.scrollY;
      this.current = window.scrollY;
      this.running = true;
      this.onWheel = this.onWheel.bind(this);
      window.addEventListener('wheel', this.onWheel, { passive: false });
      document.addEventListener('touchstart', () => { this.target = window.scrollY; }, { passive: true });
    }

    onWheel(event) {
      if (event.target.closest('[data-lenis-prevent], [data-lenis-prevent-wheel], [data-lenis-prevent-vertical], [data-lenis-prevent-horizontal], [data-lenis-prevent-touch]')) return;
      event.preventDefault();
      this.target = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, this.target + event.deltaY));
    }

    raf() {
      if (!this.running) return;
      this.current += (this.target - this.current) * 0.12;
      window.scrollTo(0, this.current);
      if (Math.abs(this.target - this.current) > 0.5) window.dispatchEvent(new Event('scroll'));
    }

    stop() { this.running = false; }
    start() { this.running = true; this.target = window.scrollY; }
    destroy() { window.removeEventListener('wheel', this.onWheel); }
  }

  window.Lenis = LenisLite;
}());
