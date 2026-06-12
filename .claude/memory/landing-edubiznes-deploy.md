---
name: landing-edubiznes-deploy
description: "Jak deployować landing Edubiznes (dist, Netlify, wersjonowanie cache) i stan domeny webinar.klaudiarogalska.pl"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4ac0bb73-d39e-4e08-81d4-9e9732db7ff3
---

Landing webinaru "Od Tablicy do Biznesu Online" (Klaudia Rogalska-Kalota). Projekt: `/Users/klaudiarogalska/Desktop/landing Edubiznes`.

**Deploy (NIGDY z katalogu głównego — leży tam 320 MB .mov i 60 MB oryginalnych JPG):**
```bash
cd "/Users/klaudiarogalska/Desktop/landing Edubiznes" && rm -rf dist && mkdir -p dist \
  && cp index.html _redirects dist/ && cp -r css js assets dist/ \
  && cp ANO_podstawowa_zielony_1_poziom.png ANO_podstawowa_zielony_1_pion.png dist/ \
  && netlify deploy --prod --dir dist --functions netlify/functions
```
WAŻNE: `_redirects` musi trafić do dist (rewrites /oto i /dziekuje → index.html).

**Cache-busting:** przy każdym deployu podbić `?v=N` przy css/js w index.html (stan na 2026-06-10: v=4; po kolejnych zmianach podbić na v=5). Bez tego użytkownicy dostają stare style (raz przez to "zniknął" zielony nagłówek — gradient z niezaładowanej zmiennej CSS).

**Netlify:** projekt `landing-edubiznes` (siteId c364613f-1311-4c0a-8e09-1ce02fcbe5b0), konto kalocis@gmail.com (Sebastian Kalota). URL: https://landing-edubiznes.netlify.app.

**Domena docelowa:** webinar.klaudiarogalska.pl — ustawiona w Netlify jako custom_domain, ale DNS (hostowany na webd.pl, ns5/ns7.webd.pl) na 2026-06-10 wieczorem wciąż wskazywał CNAME → squeeze.gr8.com (GetResponse). Użytkownik twierdzi, że zmienił na landing-edubiznes.netlify.app — czekaliśmy na publikację strefy. Sprawdzenie: `dig @ns5.webd.pl webinar.klaudiarogalska.pl CNAME +short`. Poprzednia subdomena edubiznes.klaudiarogalska.pl wskazuje na sites.gamma.app (stara strona z Gamma — celowo zostawiona).

**Podgląd lokalny:** `npx http-server -p 8080 -c-1` — NIE python http.server (brak obsługi HTTP Range → scrubbing wideo nie działa, currentTime wraca do 0). Podgląd widoków SPA: lokalnie `#oto` / `#dziekuje`, na produkcji `/oto` / `/dziekuje`.

Zobacz też [[landing-edubiznes-stan]] i [[landing-edubiznes-hero-video]].
