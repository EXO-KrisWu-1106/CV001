const data = window.resumeData;

const setText = (key, value) => {
  const element = document.querySelector(`[data-bind="${key}"]`);
  if (element) element.textContent = value;
};

const renderFacts = () => {
  document.querySelector('[data-module="facts"]').innerHTML = data.facts.map((fact) => `<div><span>${fact.label}</span><strong>${fact.value}</strong></div>`).join('');
};

const renderExperience = () => {
  document.querySelector('[data-module="experience"]').innerHTML = data.experience.map((item) => `<article class="timeline-item reveal"><div class="timeline-date">${item.date}</div><div class="timeline-marker"></div><div class="timeline-content"><p class="role">${item.role}</p><h3>${item.company}</h3><p>${item.description}</p><span class="impact">${item.impact}</span></div></article>`).join('');
};

const renderProjects = () => {
  document.querySelector('[data-module="work"]').innerHTML = data.projects.map((project, index) => `<article class="work-card ${index === 0 ? 'work-card-large' : ''} reveal" data-stack-card><div class="work-visual ${project.visualClass}" data-cursor-follow="img">${project.art}<span class="visual-note">${project.visualNote}</span><span class="visual-number">${project.number}</span></div><div class="work-meta"><div><p class="work-type">${project.type}</p><h3>${project.title}</h3></div><p class="work-description">${project.description}</p></div>${project.link ? `<a class="card-link g_btn" href="${project.link}" target="_blank" rel="noreferrer">${project.linkLabel} <span class="btn-arrow">↗</span></a>` : `<span class="award-tag">${project.award}</span>`}</article>`).join('');
};

const renderCapabilities = () => {
  document.querySelector('[data-module="capabilities"]').innerHTML = data.capabilities.map((capability, index) => `<div class="capability-list reveal"><span class="skill-number">0${index + 1}</span><h3>${capability.title}</h3><p>${capability.items.join('<br>')}</p></div>`).join('');
};

const renderResume = () => {
  Object.entries(data.identity).forEach(([key, value]) => setText(key, value));
  setText('emailText', data.identity.email);
  document.querySelector('[data-bind="profileStatement"]').innerHTML = data.identity.profileStatement.replace('\n', '<br>').replace('human pulse.', '<span>human pulse.</span>');
  document.querySelectorAll('[data-bind-href="email"]').forEach((element) => { element.href = `mailto:${data.identity.email}`; });
  renderFacts(); renderExperience(); renderProjects();
  document.querySelector('[data-module="research"]').innerHTML = `<span>${data.research.label}</span><strong>${data.research.title}</strong><p>${data.research.description}</p>`;
  renderCapabilities();
};

renderResume();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const ScrollToPlugin = window.ScrollToPlugin;

const scheduler = [
  { id: 'reveal', selectors: '[data-scroll-animate] .reveal', priority: 10, onEach: (element) => animateReveal(element) },
  { id: 'cursor', selectors: '[data-cursor-follow]', priority: 20, onEach: (element) => bindCursorFollow(element) },
  { id: 'stack', selectors: '[data-stack-card]', priority: 30, onEach: (element, index) => bindStackCard(element, index) },
  { id: 'insights', selectors: '[data-insights-card-hover] article', priority: 40, onEach: (element) => bindInsightHover(element) },
  { id: 'clients', selectors: '[data-client-hover] span', priority: 50, onEach: (element) => bindClientHover(element) }
];

const animateReveal = (element) => {
  if (!hasGsap || reducedMotion) { element.classList.add('visible'); return; }
  gsap.set(element, { autoAlpha: 0, scale: .9, willChange: 'transform, opacity' });
  if (ScrollTrigger) {
    gsap.to(element, { autoAlpha: 1, scale: 1, duration: .7, ease: 'back.out(1.2)', stagger: .125, clearProps: 'willChange', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
  }
};

const bindCursorFollow = (element) => {
  if (reducedMotion || !window.matchMedia('(hover: hover) and (min-width: 992px)').matches) return;
  const follower = document.querySelector('.cursor-follower');
  if (!follower) return;
  element.addEventListener('mouseenter', () => gsap?.to(follower, { autoAlpha: 1, scale: 1.3, duration: .3, ease: 'power3.out' }));
  element.addEventListener('mousemove', (event) => gsap?.to(follower, { x: event.clientX, y: event.clientY, rotation: gsap.utils.random(-20, 20), duration: 1.5, ease: 'power3.out' }));
  element.addEventListener('mouseleave', () => gsap?.to(follower, { autoAlpha: 0, scale: .7, duration: .6, ease: 'power3.out' }));
};

const bindStackCard = (element, index) => {
  if (!ScrollTrigger || reducedMotion) return;
  gsap.to(element, { y: index * -10, scale: 1 - index * .025, scrollTrigger: { trigger: element.parentElement, start: 'top 75%', end: 'bottom 20%', scrub: true } });
};

const bindInsightHover = (element) => {
  element.addEventListener('mouseenter', () => element.classList.add('is-hovered'));
  element.addEventListener('mouseleave', () => element.classList.remove('is-hovered'));
};

const bindClientHover = (element) => {
  element.addEventListener('mouseenter', () => element.classList.add('is-hovered'));
  element.addEventListener('mouseleave', () => element.classList.remove('is-hovered'));
};

const initCursor = () => {
  const dot = document.querySelector('.cursor');
  if (!dot || !window.matchMedia('(hover: hover) and (min-width: 992px)').matches) return;
  document.addEventListener('mousemove', (event) => {
    if (hasGsap) gsap.to(dot, { x: event.clientX, y: event.clientY, duration: .18, ease: 'power3.out' });
  });
  document.querySelectorAll('a, button, input, textarea, iframe').forEach((element) => element.addEventListener('mouseenter', () => document.body.classList.add('cursor-pointer')));
  document.querySelectorAll('a, button, input, textarea, iframe').forEach((element) => element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-pointer')));
  document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, [data-text]').forEach((element) => element.addEventListener('mouseenter', () => document.body.classList.add('cursor-text')));
  document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, [data-text]').forEach((element) => element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text')));
};

const initLenis = () => {
  if (!window.Lenis || reducedMotion) return;
  const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  window.resumeLenis = lenis;
};

const initMobileMenu = () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    document.body.classList.toggle('is-menu-open', !isOpen);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('is-menu-open'); }));
};

const initPageTransitions = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    if (hasGsap && !reducedMotion) gsap.to(window, { duration: .8, scrollTo: { y: target, offsetY: 20 }, ease: 'power2.inOut' });
    else target.scrollIntoView({ behavior: 'smooth' });
  }));
};

const initHomePreloader = () => {
  const hero = document.querySelector('[data-home-preloader]');
  if (!hero || reducedMotion || sessionStorage.getItem('home-preloader-played')) return;
  sessionStorage.setItem('home-preloader-played', 'true');
  if (hasGsap) gsap.fromTo(hero, { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .7, delay: 1.2, ease: 'back.out(1.4)', clearProps: 'all' });
};

const initNavigationState = () => {
  const logo = document.querySelector('[data-hide-logo-scroll]');
  const links = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  if (ScrollTrigger && logo && !reducedMotion) {
    ScrollTrigger.create({ trigger: document.body, start: 'top top', end: 'max', onUpdate: (self) => gsap.to(logo, { y: self.direction === 1 ? '-6rem' : 0, duration: .4, ease: 'power2.inOut', overwrite: true }) });
  }
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const updateActive = () => {
    const current = sections.reduce((active, section) => (section.getBoundingClientRect().top <= 140 ? section : active), sections[0]);
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
};

const initInteractions = () => {
  if (hasGsap) gsap.registerPlugin(...[ScrollTrigger, ScrollToPlugin].filter(Boolean));
  scheduler.sort((a, b) => a.priority - b.priority).forEach((module) => document.querySelectorAll(module.selectors).forEach((element, index) => module.onEach(element, index)));
  initCursor(); initLenis(); initMobileMenu(); initPageTransitions(); initHomePreloader(); initNavigationState();
};

initInteractions();
