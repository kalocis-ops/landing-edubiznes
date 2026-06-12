---
name: landing-edubiznes-deploy
description: "Jak deployować landing Edubiznes (CLI z root, nie dist) i stan domeny webinar.klaudiarogalska.pl"
metadata: 
  node_type: memory
  type: project
  originSessionId: a356919a-c7a2-4ea8-a8d1-cdc385646f01
---

Landing webinaru "Od Tablicy do Biznesu Online" (Klaudia Rogalska-Kalota). Projekt: `/Users/klaudiarogalska/Desktop/landing Edubiznes`.

**Deploy (od 2026-06-12: bezpośrednio z katalogu projektu, NIE z dist):**
```bash
cd "/Users/klaudiarogalska/Desktop/landing Edubiznes"
netlify deploy --prod --dir .
```
Netlify automatycznie pakuje `netlify/functions/`. Plik `_redirects` jest w root — trafia do deployu. Netlify **nie** jest podpięte do GitHub — deploy tylko przez CLI.

**Stary przepis z dist jest nieaktualny** — .gitignore wyklucza `*.mp4`, więc dist nigdy nie zawierało wideo (jest serwowane z root przez Netlify). Deployowanie z root działa i jest prostsze.

**Cache-busting:** `?v=N` przy css/js w index.html. Przy dużych zmianach CSS/JS podbić N.

**Netlify:** projekt `landing-edubiznes`, siteId `c364613f-1311-4c0a-8e09-1ce02fcbe5b0`, konto kalocis@gmail.com. URL: https://webinar.klaudiarogalska.pl.

**GitHub:** repo `kalocis-ops/landing-edubiznes`. Push + deploy to dwa osobne kroki — git push nie triggeruje deployu na Netlify.

**Podgląd lokalny:** `npx http-server -p 8080 -c-1` (NIE python http.server — brak HTTP Range → scrubbing wideo nie działa).

**Podgląd widoków SPA:** lokalnie `#oto` / `#dziekuje`, na produkcji `/oto` / `/dziekuje`.

**Memory na nowym komputerze** (po `git clone`):
```bash
mkdir -p ~/.claude/projects/-Users-klaudiarogalska-Desktop-landing-Edubiznes/memory
cp .claude/memory/*.md ~/.claude/projects/-Users-klaudiarogalska-Desktop-landing-Edubiznes/memory/
```

Zobacz też [[landing-edubiznes-stan]] i [[landing-edubiznes-hero-video]].
