# Lettres de Luisa Piccarreta — PWA

Application de référence pour les Lettres de Luisa Piccarreta.  
136 lettres · Spiritualité de la Divine Volonté · Offline-first · Installable

---

## Déploiement GitHub Pages (5 minutes)

### 1. Créer le repo

```bash
# Créer un nouveau repo sur github.com (public ou privé)
# Puis dans ce dossier :

git init
git add .
git commit -m "feat: PWA Lettres de Luisa Piccarreta v1.1.0"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/TON-REPO.git
git push -u origin main
```

### 2. Activer GitHub Pages

Dans le repo sur GitHub :
- Settings → Pages
- Source : **GitHub Actions**
- Le workflow `.github/workflows/deploy.yml` se déclenche automatiquement

L'app sera disponible sur `https://TON-USERNAME.github.io/TON-REPO/`

### 3. Installer l'app

**Chrome (desktop / Android)** : bouton installer dans la barre d'adresse, ou bannière in-app.

**iPhone / iPad (Safari)** : Partager → "Sur l'écran d'accueil".

---

## Structure

```
/
├── index.html                  ← App shell complet (5 écrans)
├── sw.js                       ← Service Worker offline-first
├── manifest.json               ← PWA manifest
├── corpus.json                 ← 136 lettres (v1.1.0, 2,2 Mo)
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── favicon-32.png
├── .github/workflows/
│   └── deploy.yml              ← Auto-deploy GitHub Pages
└── README.md
```

---

## Fonctionnalités V1

- **Lettre du jour** — rotation quotidienne automatique
- **8 situations spirituelles** — filtrage par besoin
- **136 lettres** — navigation par liste, thème, destinataire, chronologie
- **Lecteur** — display_paragraphs, signature stylisée, prev/next, swipe
- **Recherche** — full-text sur titres, corps, destinataires, topics
- **Trust panel** — source, statut validation, empreinte SHA-256
- **Favoris · Notes · À relire** — persistés en localStorage
- **Taille de texte ajustable** — 13 à 22px
- **Mode sombre** — automatique + toggle manuel
- **Offline-first** — service worker, corpus mis en cache au premier chargement
- **Installable** — manifest PWA complet, icônes toutes tailles

---

## Corpus v1.1.0

| Indicateur | Valeur |
|---|---|
| Lettres | 136 (nos 1–136, complet) |
| Display paragraphs | 909 |
| Topics | 45 |
| Destinataires | 74 |
| Lettres datées | 63 / 73 sans date |
| Base de traduction | Version anglaise (136/136) |
| Qualité | validated (136/136) |
| Fingerprint global | `ce3456243e4d5107…` |

---

## Prochaines étapes (V1.2.0)

- [ ] `key_sentence_fr` — phrase-clé pour la Lettre du jour (validation humaine)
- [ ] `reading_time_minutes` — calculé depuis word_count_fr
- [ ] Source-rights clearance — requis avant lancement public
- [ ] Deep-link par letter_id (`?letter=LP.LETTER.034`)

---

*Corpus v1.1.0 · QA PASS · Juin 2026*
