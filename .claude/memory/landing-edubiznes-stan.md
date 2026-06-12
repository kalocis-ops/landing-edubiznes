---
name: landing-edubiznes-stan
description: "Stan prac nad landingiem Edubiznes na 2026-06-10 — co wdrożone, co czeka na deploy, integracja GetResponse"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4ac0bb73-d39e-4e08-81d4-9e9732db7ff3
---

**Stan na 2026-06-11 (wieczór). Produkcja = v=13.**

**Wdrożone w v=12-13 (2026-06-11):** ramka tabletu ebooka w stylu "najnowszy iPad" (jednolite bezele 11px, border #48484d, kamerka absolute w bezelu — .ebook-tablet-* w main.css); menu jako liquid glass floating pill jak w demo-glass-hero (blur+saturate, gradientowy ring ::before z mask-composite, .scrolled tylko zmienia tło pilla; .header-nav top:14px, padding 0 16px); zdjęcie w sekcji "O mnie" podmienione na assets/bio-omnie.jpg (zoptymalizowane z omnie.jpg 14 MB w katalogu głównym → 1200x1800 ~370 KB przez sips; stare assets/bio-klaudia.jpg zostało w repo nieużywane). Przy podmianie obrazków dawać NOWĄ nazwę pliku zamiast nadpisywać (obrazki nie mają ?v=N, cache).

**Weryfikacja zrzutami (headless Chrome na Macu):** min. szerokość okna 500px, crop do --window-size — mobile testować przez iframe o zadanej szerokości + --allow-file-access-from-files; dodawać --force-device-scale-factor=1 (inaczej DPR=2 i viewport o połowę mniejszy). Sekcji bio/dalszych nie da się doscrollować programowo (choreografia GSAP/hero przejmuje scroll) — weryfikować na żywo w przeglądarce.

**Wdrożone na produkcji (v=6):** scroll-video hero (autoplay 7s, linear, blokada scrolla przy pierwszym wheel, skip przy drugim), routing SPA (/oto, /dziekuje), GetResponse (main + VIP `fHuoS`), drugi formularz zapisu (#zapisz-sie-2) na navy tle po FAQ, mocniejsze kolory sekcji (zielone/navy akcenty), get-card z lewym zielonym obramowaniem, bonus-box gradient.

**Routing SPA:** `webinar.klaudiarogalska.pl/oto` i `/dziekuje` działają. Lokalnie: `#oto` / `#dziekuje` z `npx http-server -p 8080 -c-1`.

**Domena:** webinar.klaudiarogalska.pl działa (DNS zaktualizowany 2026-06-11).

**Bonus:** treść e-booka do zmiany gdy użytkownik potwierdzi nowy tytuł/opis. Plik mockup: `assets/ebook_mockup.png`..

**GetResponse:** klucz API w env Netlify `GETRESPONSE_API_KEY` (ustawiony przez netlify env:set). Klucz: 9e9j1p5kimdmbaporeb3j2ubmsfshrtp (podany przez użytkownika w rozmowie). Funkcja traktuje 202 i 409 jako sukces. Zmienna GETRESPONSE_VIP_TAG_ID już nieużywana.

**Otwarte tematy:** użytkownik wspominał o "dodaniu do kalendarza Google" jako kolejnym temacie (przycisk na stronie podziękowania już generuje wydarzenie 30.06 20:00–21:30 przez calendar.google.com/render — może chodzić o coś więcej). Webinar: 30 czerwca 2026, wtorek, 20:00, ~90 min. Licznik dni w hero liczy do tej daty i znika po niej.

**Znane drobiazgi:** strona OTO ma mock płatności (initOtoPurchase w main.js — alert + przejście na podziękowanie) — przed kampanią trzeba podpiąć prawdziwą bramkę. Footer "Regulamin Strony" to martwy link.

Zobacz też [[landing-edubiznes-deploy]] i [[landing-edubiznes-hero-video]].
