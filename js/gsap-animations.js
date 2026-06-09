gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────────────────────────
  // 1. NAV — scrolled state
  // ──────────────────────────────────────────────────────────────
  const header = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  // ──────────────────────────────────────────────────────────────
  // 2. MAGNETIC BUTTONS
  // ──────────────────────────────────────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-accent').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.pageX - rect.left - rect.width  / 2;
      const y = e.pageY - rect.top  - rect.height / 2;
      gsap.to(el, { x: x * 0.28, y: y * 0.28, duration: 0.5, ease: 'power3.out' });
      const span = el.querySelector('span');
      if (span) gsap.to(span, { x: x * 0.08, y: y * 0.08, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.3)' });
      const span = el.querySelector('span');
      if (span) gsap.to(span, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.3)' });
    });
  });


  // ──────────────────────────────────────────────────────────────
  // 4. HERO ENTRANCE
  // ──────────────────────────────────────────────────────────────
  const heroItems = gsap.utils.toArray('.hero-content > *');
  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 40,
      opacity: 0,
      stagger: 0.11,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.15,
    });
  }


  // ──────────────────────────────────────────────────────────────
  // 5. SCROLL REVEAL — fade up on enter
  // ──────────────────────────────────────────────────────────────
  const revealTargets = gsap.utils.toArray(
    '.glass-card, .learn-step, .get-card, .testimonial-card, ' +
    '.info-card, .for-whom-icon, .bonus-box, .calc-slider-group, ' +
    '.disclosure, .bio-content > *, .section-title-wrapper'
  );

  revealTargets.forEach(el => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Bio image
  const bioImg = document.querySelector('.bio-image');
  if (bioImg) {
    gsap.from(bioImg, {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: bioImg, start: 'top 82%' }
    });
  }

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

});
