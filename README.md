# Lettres de Luisa Piccarreta — PWA

Application de référence pour les Lettres de Luisa Piccarreta.  
136 lettres · Spiritualité de la Divine Volonté · Offline-first · Installable

---

## Version courante : v1.3.12

- Corpus : 136 lettres validées (`luisa-corpus-v1.3.12`)
- SW cache : `luisa-v1.3.12`
- Testé : iPhone Safari, iPad Safari

---

## Structure

```
index.html        ← App complète (single-file PWA)
corpus.json       ← 136 lettres, ~2.2 Mo
sw.js             ← Service Worker (network-first shell + corpus)
manifest.json     ← PWA manifest (orientation: any)
icons/            ← icon-192, icon-512, apple-touch-icon, favicon-32
.github/workflows/deploy.yml ← GitHub Pages auto-deploy
```

---

## Déploiement

Push sur `main` → GitHub Actions valide + déploie automatiquement sur GitHub Pages.

```bash
git add -A
git commit -m "feat: v1.3.12"
git push origin main
```

---

## Corpus v1.3.12

| Métrique | Valeur |
|----------|--------|
| Lettres | 136 |
| Source paragraphs | 202 |
| Display paragraphs | 909 |
| Topics (topics_fr) | 45 |
| Destinataires | 74 |
| IDs stables | `LP.LETTER.001` → `LP.LETTER.136` |

**Ne pas modifier le corpus** — IDs stables référencés par les surlignages et notes utilisateur.

---

## Notes techniques

- `isWide()` = `Math.min(screen.width, screen.height) >= 680` — stable cross-rotation
- Layout contrôlé par `html[data-layout="wide|phone"]` — pas par `@media(min-width:768px)`
- `readSet` = marquage manuel uniquement (bouton "Lu"), pas d'auto-mark
- Tous les fonds "sombres" utilisent `#1A2A4A` fixe (jamais `var(--night)` qui s'inverse en dark mode)
- `text-size-bar` z-index:550 > `phone-reader` z-index:500

---

*Source-rights clearance non résolue — pas de lancement public avant résolution.*
