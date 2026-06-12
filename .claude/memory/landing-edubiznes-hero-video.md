---
name: landing-edubiznes-hero-video
description: "Mechanika scroll-video w hero (GSAP pin+scrub), wymogi kodowania mp4 i choreografia elementów"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4ac0bb73-d39e-4e08-81d4-9e9732db7ff3
---

Hero na desktopie: 5-sekundowe wideo obrotu Klaudii (`assets/vidhero-scrub.mp4`) scrubowane scrollem. Kod w `js/gsap-animations.js` (sekcja HERO SCROLL-STORY).

**Wymogi techniczne (twarde lekcje):**
- MP4 musi mieć klatkę kluczową co klatkę: ffmpeg `-g 1` — inaczej scrubbing skacze. Plik robiony z oryginału `vidhero.mp4` (upscale do 1920 lanczos + unsharp 0.9, crf 22). ffmpeg ściągany przez `npm i ffmpeg-static` w /tmp.
- Poster musi być pierwszą klatką SAMEGO wideo (`assets/vidhero-poster.jpg`, ffmpeg -frames:v 1) — inny kadr powodował "przeskok" przy pierwszym scrollu. Dodatkowo `heroVideo.currentTime = 0.001` po loadedmetadata wymusza namalowanie klatki.
- Serwer musi wspierać HTTP Range (Netlify tak; python http.server NIE — currentTime wraca do 0, wideo "stoi").
- Filtry CSS/GSAP na elemencie z background-clip:text potrafią ukryć tekst (Safari) — filtry idą na cały `.hero-headline`, nie na span.

**Choreografia (oś 0–10 na 300% scrolla, pin + scrub 0.3):** wideo i pasek postępu liniowo 0–10; hint "Przewiń" znika 0.05; nagłówek w glass-boxie rośnie scale .95→1 i jaśnieje przez cały obrót; gradient "do biznesu online" (ciemna mięta #128a5c→#2eb681 wpisana wprost w main.css) zapala się drop-shadow przy 7.8; kafelki social proof (kolumna right:3%, top 26/40/54%) wskakują back.out przy 6.4/6.9/7.4. Reszta treści (podtytuł, pasek logistyczny, licznik dni, CTA) wjeżdża przy PIERWSZYM scrollu poza scrubem (revealFinale, once) i zostaje.

**Mobile/reduced-motion:** statyczne zdjęcie (assets/hero-klaudia-mobile.jpg) w układzie banerowym — .hero-media position:relative height:46svh, treść pod spodem z margin-top -64px; kafelki/pasek/hint ukryte. Fallback: gdy wideo się nie załaduje w 5 s → statyczne zdjęcie i pełna treść (showStaticFallback).

Magnetyczne przyciski GSAP usunięte — CTA mają czysty CSS hover scale(1.04). Zobacz też [[landing-edubiznes-deploy]].
