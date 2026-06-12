---
name: landing-edubiznes-stan
description: "Stan prac nad landingiem Edubiznes na 2026-06-12 — co wdrożone, hero auto-start, pasek ogłoszenia, dziękujemy e-book"
metadata: 
  node_type: memory
  type: project
  originSessionId: a356919a-c7a2-4ea8-a8d1-cdc385646f01
---

**Stan na 2026-06-12. Produkcja live na webinar.klaudiarogalska.pl.**

**Wdrożone 2026-06-12:**
- **Hero auto-start + skip ring:** animacja startuje od razu po załadowaniu strony (bez czekania na scroll). Scroll zablokowany przez 3 sekundy (D=3). SVG kółko z ✕ w prawym dolnym rogu hero — ring wypełnia się przez 3s, kliknięcie pomija. Wideo scrubuje w tempie 7s (D_VID=7), leci do końca nawet po odblokowaniu scrolla. Szczegóły w [[landing-edubiznes-hero-video]].
- **Pasek ogłoszenia:** ciemny pasek (#20224d) nad nawigacją, pulsująca bursztynowa kropka + "Uwaga. Ta oferta pojawia się tylko raz." Header-nav przesunięty do top:50px (desktop) / top:42px (mobile ≤576px) żeby dać miejsce.
- **Strona dziękujemy:** karta "Twój e-book" zaktualizowana + bursztynowy baner z ikoną: "Aby odebrać e-book, musisz pojawić się na webinarze na żywo. Link otrzymasz po zakończeniu transmisji."
- **Repo uzupełnione:** assets/, netlify/functions/, _redirects, .claude/memory/ — wszystko na GitHubie.

**Wdrożone wcześniej (v=13, 2026-06-11):** liquid glass menu pill, ramka iPada dla ebooka, zdjęcie bio-omnie.jpg.

**Deploy:** `netlify deploy --prod --dir .` z katalogu projektu (NIE z dist — zmiana 2026-06-12, stary przepis w deploy-memory był nieaktualny). Netlify nie jest podpięte do GitHub auto-deploy — trzeba odpalać CLI ręcznie.

**Routing SPA:** `webinar.klaudiarogalska.pl/oto` i `/dziekuje` działają. Lokalnie: `#oto` / `#dziekuje` z `npx http-server -p 8080 -c-1`.

**Memory na nowym komputerze:** pliki są w repo pod `.claude/memory/`. Po sklonowaniu:
```bash
mkdir -p ~/.claude/projects/-Users-klaudiarogalska-Desktop-landing-Edubiznes/memory
cp .claude/memory/*.md ~/.claude/projects/-Users-klaudiarogalska-Desktop-landing-Edubiznes/memory/
```
Ścieżka musi odpowiadać lokalizacji projektu na dysku (np. jeśli projekt jest w `/Users/klaudiarogalska/Desktop/landing Edubiznes`, ścieżka jest `-Users-klaudiarogalska-Desktop-landing-Edubiznes`).

**GetResponse:** klucz API w env Netlify `GETRESPONSE_API_KEY`. Funkcja traktuje 202 i 409 jako sukces.

**Znane drobiazgi:** strona OTO ma mock płatności (initOtoPurchase w main.js) — przed kampanią podpiąć prawdziwą bramkę. Footer "Regulamin Strony" to martwy link. Webinar: 30 czerwca 2026, wtorek, 20:00.

Zobacz też [[landing-edubiznes-deploy]] i [[landing-edubiznes-hero-video]].
