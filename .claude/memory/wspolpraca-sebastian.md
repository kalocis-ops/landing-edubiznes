---
name: wspolpraca-sebastian
description: Jak pracować z Sebastianem (kalocis) przy landingu Edubiznes — preferencje i styl współpracy
metadata: 
  node_type: memory
  type: user
  originSessionId: 4ac0bb73-d39e-4e08-81d4-9e9732db7ff3
---

Użytkownik: Sebastian Kalota (kalocis@gmail.com), git kalocis-ops. Buduje landing dla Klaudii Rogalskiej-Kaloty (żony/partnerki biznesowej — strona o niej). Pisze po polsku, szybko, z literówkami — czytać intencję, nie literę.

**Why:** kilkukrotnie korygował styl pracy, te preferencje są stałe.

**How to apply:**
- Przy większych zmianach designu/UX chce wybierać z opcji ZANIM wprowadzę zmiany ("zapytaj mnie przed zmianami", "pytaj") — używać AskUserQuestion z konkretnymi wariantami i preview. Drobne poprawki robić od razu.
- Efekty animacji: subtelne i czytelne, nie chaotyczne. Odrzucił magnetyczne przyciski i storytelling z wieloma zmieniającymi się hasłami; wybrał statyczny nagłówek z podświetleniem. Elementy wchodzące mają być WYRAŹNE (glass plakiety, obramowania), nie ledwo widoczne.
- Estetyka: glassmorphism z dużą przezroczystością (rgba ~0.40-0.45 + blur), ciemny granat #20224d + mięta, brand Akademia Nauczyciela Online.
- Nie lubi confirm-shamingu (zawstydzających linków rezygnacji).
- Weryfikować zmiany zrzutami ekranu (desktop 1440 i mobile 390) PRZED pokazaniem mu — sam testuje na żywo i szybko wyłapuje regresy.
- Deploy tylko gdy poprosi; potrafi poprosić o wstrzymanie ("narazie nie deployuj") i zbiorczy deploy później.
