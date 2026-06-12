gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────────────────────────
  // 1. NAV — scrolled state
  // ──────────────────────────────────────────────────────────────
  const header = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Użytkownicy z preferencją ograniczonego ruchu nie dostają animacji dekoracyjnych
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;


  // ──────────────────────────────────────────────────────────────
  // 2. PRZYCISKI — hover w czystym CSS (delikatny scale w components.css);
  //    magnetyczny efekt GSAP usunięty, bo CTA "pływały" za kursorem
  // ──────────────────────────────────────────────────────────────


  // ──────────────────────────────────────────────────────────────
  // 3. HERO SCROLL-STORY — scroll steruje wideo + sekwencją haseł
  //    (desktop; mobile i reduced-motion dostają statyczne hero)
  // ──────────────────────────────────────────────────────────────
  const heroVideo = document.querySelector('.hero-video');
  const scrubMode = !!heroVideo && window.matchMedia('(min-width: 769px)').matches;

  if (scrubMode) {
    let scrubActive = false;

    // Nagłówek widoczny od startu: lekko przygaszony i mniejszy.
    // hero-logistics-bar widoczna od razu (data, gdzie, prowadząca).
    // Podtytuł, licznik i CTA wjeżdżają w finale animacji.
    const finaleItems = ['.hero-subheadline', '.hero-countdown', '.hero-content .btn'];
    // Filtry na całym H1, nie na klipowanym spanie — filter + background-clip:text
    // potrafi całkowicie ukryć tekst w Safari
    const headlineAccent = '.hero-headline';

    gsap.set('.hero-headline-box', { scale: 0.95, opacity: 0.94, transformOrigin: 'left bottom' });
    gsap.set(headlineAccent, { filter: 'saturate(0.3) brightness(0.96)' });
    gsap.set(finaleItems, { autoAlpha: 0, y: 34 });
    gsap.set('.hero-float', { opacity: 0 });

    // Kafelki logistyczne pojawiają się po załadowaniu strony
    gsap.from('.hero-logistics-bar', { autoAlpha: 0, y: 16, duration: 0.9, ease: 'power2.out', delay: 0.5 });

    const setupScrollStory = () => {
      scrubActive = true;

      // Wymuszamy namalowanie pierwszej klatki wideo od razu —
      // bez tego przy pierwszym scrollu poster "przeskakiwał" na kadr wideo
      heroVideo.currentTime = 0.001;

      const D = 3;    // czas blokady scrolla + animacji UI
      const D_VID = 7; // tempo wideo — takie samo jak wcześniej
      const RING_C = 125.66; // obwód okręgu SVG (2π*20)
      const skipBtn = document.getElementById('heroSkip');
      const ringFill = skipBtn ? skipBtn.querySelector('.hero-skip-ring-fill') : null;
      let tl = null;
      let videoTween = null;
      let done = false;

      const finish = () => {
        if (done) return;
        done = true;
        window.removeEventListener('wheel', onLockWheel, { passive: false });
        if (skipBtn) skipBtn.style.display = 'none';
        if (videoTween) videoTween.kill();
        if (tl) tl.progress(1);
      };

      const onLockWheel = (e) => {
        e.preventDefault(); // blokuj scroll przez cały czas trwania animacji
      };

      const runAutoplay = () => {
        // Blokuj scroll i pokaż skip button
        window.addEventListener('wheel', onLockWheel, { passive: false });
        if (skipBtn) {
          skipBtn.style.display = 'flex';
          skipBtn.addEventListener('click', finish, { once: true });
        }

        // Wideo scrubuje w oryginalnym tempie (D_VID=7s), niezależnie od blokady scrolla
        videoTween = gsap.to(heroVideo, { currentTime: heroVideo.duration, duration: D_VID, ease: 'none' });

        tl = gsap.timeline({ onComplete: finish });

        // Pasek postępu jedzie przez czas blokady (D=3s)
        tl.to('.hero-progress-fill', { scaleX: 1, duration: D, ease: 'none' }, 0);

        // Kółko skip: ring wypełnia się od 0 do pełna
        if (ringFill) {
          tl.to(ringFill, { strokeDashoffset: 0, duration: D, ease: 'none' }, 0);
        }

        // Nagłówek rośnie i jaśnieje
        tl.to('.hero-headline-box', { scale: 1, opacity: 1, duration: D * 0.8, ease: 'power1.inOut' }, 0);
        tl.to(headlineAccent, { filter: 'saturate(1) brightness(1)', duration: D * 0.6, ease: 'power1.inOut' }, D * 0.1);

        // Finałowe "zapalenie" gradientu — miętowa poświata, gdy Klaudia patrzy w kamerę
        tl.to(headlineAccent, {
          filter: 'saturate(1.15) brightness(1.06) drop-shadow(0 0 18px rgba(68,212,152,.55))',
          duration: 0.6
        }, D * 0.75);

        // Plakietki social proof: kolumna przy prawej krawędzi, jedna po drugiej
        tl.fromTo('.hero-float-1', { opacity: 0, y: 44, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, D * 0.55);
        tl.fromTo('.hero-float-2', { opacity: 0, y: 44, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, D * 0.68);
        tl.fromTo('.hero-float-3', { opacity: 0, y: 44, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, D * 0.80);

        // Podtytuł, licznik i CTA wjeżdżają na końcu
        tl.to(finaleItems, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, D * 0.82);
      };

      // Auto-start: animacja odpala się od razu po załadowaniu strony
      runAutoplay();
    };

    // Awaryjnie: wideo się nie ładuje → pokazujemy statyczne hero ze zdjęciem
    const showStaticFallback = () => {
      if (scrubActive) return;
      scrubActive = true;
      heroVideo.style.display = 'none';
      const photo = document.querySelector('.hero-photo');
      if (photo) photo.style.display = 'block';
      gsap.set('.hero-headline-box', { clearProps: 'all' });
      gsap.set(headlineAccent, { clearProps: 'all' });
      gsap.set(finaleItems, { autoAlpha: 1, y: 0 });
      gsap.set('.hero-progress, .hero-scroll-hint, .hero-skip', { display: 'none' });
    };

    // loadedmetadata mogło już odpalić, zanim ten skrypt się wykonał
    if (heroVideo.readyState >= 1) setupScrollStory();
    else heroVideo.addEventListener('loadedmetadata', setupScrollStory, { once: true });
    heroVideo.addEventListener('error', showStaticFallback, { once: true });
    setTimeout(showStaticFallback, 4000);
  }


  // ──────────────────────────────────────────────────────────────
  // 4. HERO ENTRANCE (tylko gdy nie ma scroll-story)
  // ──────────────────────────────────────────────────────────────
  const heroItems = gsap.utils.toArray('.hero-content > *');
  if (heroItems.length && !scrubMode) {
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
