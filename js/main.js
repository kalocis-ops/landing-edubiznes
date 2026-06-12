document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFormHandler();
  initOtoPurchase();
  initRoiCalculator();
  initTestimonialsSlider();
  initScrollReveal();
  initPrivacyModal();
  initMobileCtaBar();
  initWebinarCountdown();
  initViewRouting();
});

/* 0b. PODGLĄD WIDOKÓW PRZEZ URL
   Produkcja: /oto, /dziekuje (rewrite w _redirects)
   Lokalnie:  #oto, #dziekuje */
function initViewRouting() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash;

  if (path.endsWith('/oto') || hash === '#oto') {
    window.switchView('view-oto');
  } else if (path.endsWith('/dziekuje') || path.endsWith('/dziekujemy') || hash === '#dziekuje') {
    window.switchView('view-thankyou');
  }
}

/* WEBINAR COUNTDOWN — "Do webinaru zostało: X dni" */
function initWebinarCountdown() {
  const box = document.getElementById('hero-countdown');
  const daysEl = document.getElementById('hero-countdown-days');
  if (!box || !daysEl) return;

  const webinarDate = new Date('2026-06-30T20:00:00+02:00');
  const msLeft = webinarDate - new Date();
  if (msLeft <= 0) return; // po webinarze licznik zostaje ukryty

  const days = Math.ceil(msLeft / 86400000);
  if (days === 1) daysEl.textContent = '1 dzień';
  else daysEl.textContent = days + ' dni';
  box.hidden = false;
}

/* 0. MOBILE STICKY CTA BAR — shows after scrolling past the hero */
function initMobileCtaBar() {
  const bar = document.getElementById('mobile-cta-bar');
  const hero = document.querySelector('.hero-section');
  const formSection = document.getElementById('zapisz-sie');
  if (!bar || !hero) return;

  const update = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    // Hide the bar while the signup form itself is on screen
    let formVisible = false;
    if (formSection) {
      const r = formSection.getBoundingClientRect();
      formVisible = r.top < window.innerHeight && r.bottom > 0;
    }
    bar.classList.toggle('visible', heroBottom < 0 && !formVisible);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* 1. SPA VIEW NAVIGATION WITH VIEW TRANSITIONS */
function initNavigation() {
  window.switchView = function(viewId) {
    const targetView = document.getElementById(viewId);
    if (!targetView) return;

    const views = document.querySelectorAll('.page-view');
    
    // Check if View Transitions API is supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        updateDOMViews(views, viewId);
      });
    } else {
      updateDOMViews(views, viewId);
    }

    // Scroll to top on transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus management for accessibility
    setTimeout(() => {
      const heading = targetView.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }, 100);

    // If switching to OTO page, start/resume countdown timer
    if (viewId === 'view-oto') {
      startOtoTimer();
    }
  };

  // Sticky header handled by gsap-animations.js via Lenis scroll event

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

function updateDOMViews(views, activeViewId) {
  views.forEach(view => {
    if (view.id === activeViewId) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Hide or show the navigation menu links based on the active view
  // On OTO and Thank You pages, we want to minimize distractions (no header links)
  const navLinks = document.querySelector('.nav-links');
  const navOtoNotice = document.getElementById('navOtoNotice');
  if (navLinks) {
    if (activeViewId === 'view-webinar') {
      navLinks.style.display = '';
    } else {
      navLinks.style.display = 'none';
    }
  }
  if (navOtoNotice) {
    navOtoNotice.style.display = activeViewId === 'view-oto' ? 'flex' : 'none';
  }
}

/* 2. FORM → NETLIFY FUNCTION → GETRESPONSE API */
function setupSignupForm(formId, nameId, emailId, vipId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const nameInput = document.getElementById(nameId);
    const emailInput = document.getElementById(emailId);
    const vipCheck = document.getElementById(vipId);

    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.innerHTML = '<span>Rejestracja...</span>';
    }

    const restoreBtn = () => {
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '';
        btn.innerHTML = '<span>ZAPISZ SIĘ BEZPŁATNIE →</span>';
      }
    };

    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          vip: !!(vipCheck && vipCheck.checked),
        }),
      });

      if (!res.ok) throw new Error('subscribe failed');

      restoreBtn();
      window.switchView('view-oto');
    } catch (err) {
      restoreBtn();
      alert('Ups, nie udało się zapisać. Sprawdź połączenie i spróbuj ponownie — a jeśli problem wraca, napisz na kontakt@klaudiarogalska.pl.');
    }
  });
}

function initFormHandler() {
  setupSignupForm('webinar-signup-form', 'field-name', 'field-email', 'field-vip');
  setupSignupForm('webinar-signup-form-2', 'field-name-2', 'field-email-2', 'field-vip-2');
}

/* 3. OTO PERSISTENT COUNTDOWN TIMER */
let timerInterval = null;

function startOtoTimer() {
  if (timerInterval) return; // Prevent multiple intervals

  const duration = 15 * 60; // 15 minutes in seconds
  let timerKey = 'oto_countdown_end_time';
  let endTime = localStorage.getItem(timerKey);
  const now = Math.floor(Date.now() / 1000);

  if (!endTime || parseInt(endTime) < now) {
    endTime = now + duration;
    localStorage.setItem(timerKey, endTime.toString());
  } else {
    endTime = parseInt(endTime);
  }

  const minEl = document.getElementById('timer-min');
  const secEl = document.getElementById('timer-sec');

  const updateTimer = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      localStorage.removeItem(timerKey);
      if (minEl && secEl) {
        minEl.textContent = '00';
        secEl.textContent = '00';
      }
      
      // Oferta wygasła — ciche przejście do podsumowania, bez blokującego alertu
      window.switchView('view-thankyou');
      return;
    }

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    if (minEl && secEl) {
      minEl.textContent = minutes.toString().padStart(2, '0');
      secEl.textContent = seconds.toString().padStart(2, '0');
    }
  };

  updateTimer(); // Initial call
  timerInterval = setInterval(updateTimer, 1000);
}

/* 4. INTERACTIVE ROI CALCULATOR */
function initRoiCalculator() {
  const audienceSlider = document.getElementById('calc-audience');
  const priceSlider = document.getElementById('calc-price');
  
  const audienceVal = document.getElementById('calc-audience-val');
  const priceVal = document.getElementById('calc-price-val');
  const resultVal = document.getElementById('calc-result-value');

  if (!audienceSlider || !priceSlider) return;

  const calculateROI = () => {
    const audienceSize = parseInt(audienceSlider.value);
    const productPrice = parseInt(priceSlider.value);
    
    // We assume a conservative 2% conversion rate for target audience (teachers learning to buy from teachers)
    const conversionRate = 0.02;
    const salesCount = Math.round(audienceSize * conversionRate);
    
    // Minimum 1 sale to keep it motivating
    const finalSales = salesCount > 0 ? salesCount : 1;
    const totalEarnings = finalSales * productPrice;

    // Formatting numbers with spaces
    resultVal.textContent = totalEarnings.toLocaleString('pl-PL') + ' PLN';
  };

  // Event listeners for real-time updates
  audienceSlider.addEventListener('input', () => {
    audienceVal.textContent = parseInt(audienceSlider.value).toLocaleString('pl-PL');
    calculateROI();
  });

  priceSlider.addEventListener('input', () => {
    priceVal.textContent = priceSlider.value + ' PLN';
    calculateROI();
  });

  // Run initial calculation
  calculateROI();
}

/* 5. TESTIMONIALS SLIDER */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('testimonials-dots');
  const slides = document.querySelectorAll('.testimonial-slide');

  if (!track || !dotsContainer || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoPlayInterval = null;

  // Create indicator dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonials-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Pokaż opinię ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.testimonials-dot');

  const goToSlide = (index) => {
    if (index < 0 || index >= slideCount) return;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const startAutoplay = () => {
    autoPlayInterval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slideCount;
      goToSlide(nextIndex);
    }, 6000);
  };

  const resetAutoplay = () => {
    clearInterval(autoPlayInterval);
    startAutoplay();
  };

  startAutoplay();
}

/* 6. SCROLL REVEAL ANIMATIONS (FALLBACK FOR BROWSER SUPPORT) */
function initScrollReveal() {
  // If the browser supports native view() timelines, we use performant CSS animations
  if (CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    return;
  }

  // Fallback using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-hidden');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // viewport
      threshold: 0.15, // trigger when 15% visible
      rootMargin: '0px 0px -50px 0px' // offset bottom slightly
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Legacy fallback (IE/older browsers)
    revealElements.forEach(el => {
      el.classList.add('reveal-visible');
    });
  }
}

/* 7. PRIVACY MODAL */
function initPrivacyModal() {
  const overlay = document.getElementById('modal-privacy');
  const openBtn = document.getElementById('open-privacy');
  const closeBtn = document.getElementById('close-privacy');
  if (!overlay || !openBtn) return;

  openBtn.addEventListener('click', e => {
    e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });
}

/* 8. OTO MOCK PURCHASE CHECKOUT */
function initOtoPurchase() {
  const buyBtn = document.getElementById('oto-buy-btn');
  if (!buyBtn) return;

  buyBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const originalContent = buyBtn.innerHTML;
    buyBtn.style.pointerEvents = 'none';
    buyBtn.style.opacity = '0.7';
    buyBtn.innerHTML = '<span>Przetwarzanie płatności BLIK...</span>';

    setTimeout(() => {
      alert('Płatność zakończona sukcesem! Dziękujemy za zakup Mini-Kursu "Sesja Zdjęciowa z AI". Pakiet został dodany do Twojego konta.');
      
      // Update thank you page copy to reflect the purchase
      const thankYouTitle = document.querySelector('.thank-you-title');
      const thankYouDesc = document.querySelector('.thank-you-desc');
      const infoCards = document.querySelector('.info-cards');

      if (thankYouTitle) {
        thankYouTitle.textContent = 'Gratulacje! Zapis i zakup zakończone sukcesem.';
      }
      
      if (thankYouDesc) {
        thankYouDesc.innerHTML = 'Twoje miejsce na webinarze „Od tablicy do biznesu online” jest bezpieczne, a dostęp do Mini-Kursu „Sesja Zdjęciowa z AI” został przyznany! Wszystkie dane dostępowe oraz linki wysłaliśmy na Twój adres e-mail.';
      }

      if (infoCards) {
        // Prevent duplicate cards if they click multiple times
        const existingCard = document.getElementById('info-card-ai');
        if (!existingCard) {
          const aiCard = document.createElement('div');
          aiCard.id = 'info-card-ai';
          aiCard.classList.add('info-card');
          aiCard.style.border = '2px solid var(--color-accent)';
          aiCard.innerHTML = `
            <div class="info-card-title" style="color: var(--color-accent);">Mini-Kurs: Sesja AI</div>
            <div class="info-card-text">Dostęp do lekcji wideo oraz biblioteki promptów wysłaliśmy w osobnej wiadomości.</div>
          `;
          infoCards.appendChild(aiCard);
        }
      }

      // Switch to thank you page
      window.switchView('view-thankyou');

      // Reset button state in case they navigate back
      buyBtn.style.pointerEvents = '';
      buyBtn.style.opacity = '';
      buyBtn.innerHTML = originalContent;
    }, 1500);
  });
}

