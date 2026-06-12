---
name: landing-edubiznes-hero-video
description: "Mechanika hero: auto-start, 3s scroll lock, skip ring SVG, wideo D_VID=7s, wymogi mp4"
metadata: 
  node_type: memory
  type: project
  originSessionId: a356919a-c7a2-4ea8-a8d1-cdc385646f01
---

Hero na desktopie: wideo Klaudii (`assets/vidhero-scrub.mp4`) scrubowane przez GSAP. Kod w `js/gsap-animations.js` (sekcja HERO SCROLL-STORY).

**Aktualne zachowanie (2026-06-12):**
- Animacja startuje **od razu** po załadowaniu strony — bez czekania na scroll użytkownika.
- Scroll zablokowany przez **D=3 sekundy** (wheel event preventDefault).
- **SVG skip ring** w prawym dolnym rogu (`#heroSkip`, `.hero-skip`): kółko z ✕, ring (`stroke-dashoffset`) wypełnia się przez 3s. Kliknięcie pomija animację. Skrypt: `skipBtn.style.display = 'flex'` w `runAutoplay()`, chowany w `finish()`.
- Wideo ma **oddzielny tween** (`videoTween = gsap.to(heroVideo, { currentTime: ..., duration: D_VID=7, ease:'none' })`) — scrubuje w tempie 7s niezależnie od blokady. Po odblokowaniu scrolla leci do końca (NIE killowany w `finish()`).
- Główna timeline (`tl`, D=3): pasek postępu, ring, nagłówek, floaty, finaleItems.
- Fallback timeout: 4000ms (wcześniej 5000ms).

**Wymogi techniczne (twarde lekcje):**
- MP4 musi mieć klatkę kluczową co klatkę: ffmpeg `-g 1` — inaczej scrubbing skacze.
- Poster = pierwsza klatka wideo (`assets/vidhero-poster.jpg`, ffmpeg -frames:v 1) + `heroVideo.currentTime = 0.001` po loadedmetadata — inaczej "przeskok" przy starcie.
- Serwer musi wspierać HTTP Range (Netlify tak; `python http.server` NIE).
- Filtry CSS/GSAP na background-clip:text mogą ukryć tekst (Safari) — filtry na cały `.hero-headline`, nie na span.

**Choreografia (D=3 dla UI, D_VID=7 dla wideo):**
- Pasek i ring: 0→1 przez D=3s liniowo.
- Nagłówek: scale .95→1, opacity .94→1 przez D*0.8.
- Gradient accent: saturate→1 brightness→1 przez D*0.6; drop-shadow poświata przy D*0.75.
- Floaty (social proof): back.out przy D*0.55 / 0.68 / 0.80.
- finaleItems (podtytuł, licznik, CTA): wjeżdżają przy D*0.82.

**Mobile/reduced-motion:** statyczne zdjęcie (assets/hero-klaudia-mobile.jpg) — skip button, pasek, floaty ukryte przez media query.

Zobacz też [[landing-edubiznes-deploy]].
