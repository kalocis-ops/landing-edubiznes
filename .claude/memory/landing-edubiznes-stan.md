---
name: landing-edubiznes-stan
description: "Stan prac nad landingiem Edubiznes na 2026-06-12 — hero auto-start, pasek ogłoszenia, /oto nav notice, dziękujemy e-book"
metadata: 
  node_type: memory
  type: project
  originSessionId: a356919a-c7a2-4ea8-a8d1-cdc385646f01
---

**Stan na 2026-06-12 (wieczór). Produkcja live na webinar.klaudiarogalska.pl.**

**Wdrożone 2026-06-12:**
- **Hero auto-start + skip ring (3s):** animacja startuje od razu. Scroll zablokowany 3s. SVG kółko ✕ w prawym dolnym rogu. Wideo D_VID=7s, leci do końca po odblokowaniu. Szczegóły w [[landing-edubiznes-hero-video]].
- **Pasek ogłoszenia (główna strona):** ciemny pasek (#20224d) z pulsującą bursztynową kropką nad navem — "Uwaga. Ta oferta pojawia się tylko raz." Widoczny TYLKO na view-webinar (chowany na /oto i /dziekuje przez JS w switchView).
- **/oto navbar:** gdy aktywny view-oto, nav-links ukryte (jak poprzednio), a w ich miejscu wyśrodkowana (position:absolute, left:50%, translateX(-50%)) wiadomość z kropką — "Uwaga. Ta oferta pojawia się tylko raz." Element: `#navOtoNotice .nav-oto-notice`. Top announcement bar na /oto ukryty (nie dubluje).
- **/dziekujemy e-book:** usunięty `.ebook-notice` baner alertu. Informacja "dostępny wyłącznie dla uczestników na żywo" tylko w kafelku `info-card`.
- **Repo uzupełnione:** assets/, netlify/functions/, _redirects, .claude/memory/ na GitHubie.

**Logika switchView (js/main.js):** przy każdej zmianie widoku: nav-links (tylko view-webinar), navOtoNotice (tylko view-oto), announcementBar (tylko view-webinar) — show/hide.

**Wdrożone wcześniej (2026-06-11):** liquid glass menu pill, ramka iPada dla ebooka, zdjęcie bio-omnie.jpg.

**Deploy:** `netlify deploy --prod --dir .` z katalogu projektu. Netlify nie jest podpięte do GitHub — CLI ręcznie.

**Memory na nowym komputerze** (po `git clone`):
```bash
mkdir -p ~/.claude/projects/-Users-klaudiarogalska-Desktop-landing-Edubiznes/memory
cp .claude/memory/*.md ~/.claude/projects/-Users-klaudiarogalska-Desktop-landing-Edubiznes/memory/
```

**GetResponse:** klucz API w env Netlify `GETRESPONSE_API_KEY`. Webinar: 30 czerwca 2026, wtorek, 20:00.

**Znane drobiazgi:** strona OTO ma mock płatności (initOtoPurchase w main.js) — przed kampanią podpiąć prawdziwą bramkę. Footer "Regulamin Strony" to martwy link.

Zobacz też [[landing-edubiznes-deploy]] i [[landing-edubiznes-hero-video]].
