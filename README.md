# Lettres de Luisa Piccarreta — PWA

Application de lecture, recherche et exploration d’une collection éditoriale actuelle de Lettres de Luisa Piccarreta.  
136 entrées de la collection · Spiritualité de la Divine Volonté · PWA installable avec repli hors ligne après première ouverture en ligne

---

## Version courante : v2.2.9

- Collection actuelle : 136 entrées (`luisa-letters-corpus-v2.2.9`) — IDs et 909 paragraphes d’affichage préservés ; elle ne représente pas l’ensemble de la correspondance connue ni une édition critique définitive
- SW cache : `luisa-letters-shell-v2.2.9-r3`
- LET-A : stockage isolé par domaine, import strict et transactionnel
- LET-B : tailles sémantiques Petit 16 / Normal 19 / Grand 22 / Très grand 26, aperçu, thème Automatique/Clair/Sombre, champs iOS ≥16px
- Candidat de déploiement contrôlé ; validation physique iPhone/iPad/Android et cycle PWA installé restent requis avant un PASS technique complet

---

## Structure

```
index.html        ← App complète (single-file PWA)
corpus.json       ← 136 entrées de la collection, ~2.1 Mo
sw.js             ← Service Worker (network-first shell + corpus)
manifest.json     ← PWA manifest (orientation: any)
icons/            ← famille finale verrouillée v1 : 60/120/180/192/512, maskable 512, favicons 16/32/ICO
.github/workflows/deploy.yml ← GitHub Pages auto-deploy
```

---

## Déploiement

Push sur `main` → GitHub Actions valide + déploie automatiquement sur GitHub Pages.

```bash
git add -A
git commit -m "docs: v2.2.9 R3 source-truthfulness alignment"
git push origin main
```

---

## Corpus protégé

| Métrique | Valeur |
|----------|--------|
| Lettres | 136 |
| Source paragraphs | 202 |
| Display paragraphs | 909 |
| Topics (topics_fr) | 45 |
| Destinataires | 73 |
| IDs stables | `LP.LETTER.001` → `LP.LETTER.136` |

**Ne jamais renuméroter les IDs stables.** Toute mutation de corpus doit être bornée par un ledger source-critique et préserver les 136 IDs de lettre et 909 IDs de paragraphe d’affichage.

---

## Notes techniques

- `isWide()` : les appareils de classe téléphone restent en mode phone; tablette/desktop utilisent la largeur **courante du viewport** (seuil 768px), y compris Split View.
- Layout contrôlé par `html[data-layout="wide|phone"]`; un iPhone paysage reste phone, un iPad Split View étroit peut devenir phone.
- `readSet` = marquage manuel uniquement (bouton "Lu"), pas d'auto-mark
- Schéma d'état courant : `lp_state_schema=5`; `lp_positions` stocke `letter_id + dp_id + fraction_within_dp + letter_fraction + legacy_pct`; les anciens pourcentages sont migrés.
- `lp_size` stocke `small|normal|large|xlarge` et les anciens réglages numériques sont migrés une seule fois.
- `lp_paths` est migré une seule fois vers `lp_read`, puis supprimé
- Sauvegarde machine : format `luisa-letters-user-data`, schéma 5; import compatible avec les sauvegardes schémas 2, 3 et 4 ainsi que l’ancien format v1.
- Un remplacement crée `lp_pre_restore_snapshot`; le dernier import peut être annulé depuis « Mon espace »
- Les surfaces sombres principales utilisent `#1A2A4A` fixe (jamais `var(--night)` qui s'inverse en dark mode) ; la barre contextuelle de sélection conserve intentionnellement son fond distinct `#1C1830`.
- `text-size-bar` est la feuille « Réglages de lecture » (z-index:550) avec aperçu utilisant les mêmes variables typographiques que le lecteur

---

*Droits de diffusion : autorisation confirmée par le propriétaire le 2026-08-13. Le déploiement public de cette version est autorisé.*




## v2.2.9 R3 — Alignement source-critique de l’Aide et d’À propos (8 septembre 2026)

- Prédécesseur immédiat immuable de R3 : v2.2.9 R2 ZIP SHA-256 `72f482e0977110309c6afae3ab8e6980ee9968acf911aa184cf9ba7234d752b0`.
- Baseline pré-source-critique utilisée par R2 : v2.2.8 ZIP SHA-256 `75971305d624d898c4ca488f65fa8c0eb6c24bc4bf6439d53807e37a7ef97359`.
- Package d’acquisition/contrôle source-critique : SHA-256 `ac147c04f236fece9a708085bf4ada0320ed039e080593a787ee06c642d98335`.
- 136 IDs de lettre et 909 IDs de paragraphe d’affichage conservés ; aucun ajout, suppression, fusion ou renumérotation de lettre.
- Corrections françaises bornées : #48 (`tutti` → « tous »), #57 (`Voluntate`), #71 (1939), #82 (note éditoriale : 7 octobre 1938), #97 (`braccia` → « bras »), #122 (unité de sens restaurée).
- Métadonnées bornées : destinataires #52/#107 ; dates/lieux #53/#66/#71/#82/#93/#111/#134.
- Appareil éditorial identifié sans suppression de texte/ID dans #55/#60/#61/#63/#68/#82 ; #63 est rendu comme intertitre éditorial distinct.
- Migration bornée héritée de R2 : pour les six DP modifiés entre la baseline v2.2.8 et R2, les surlignages et notes dont la sélection traverse un remplacement textuel v2.2.9 sont réancrés sur le texte corrigé sans renumérotation de DP ; R3 ne modifie aucun DP.
- Variantes non résolues et versions plus complètes (#57, #97, #118, #121, #122/#123) restent explicitement hors mutation.
- « Source et validation » distingue la validation historique contre la base anglaise d’un contrôle italien ciblé, borné aux témoins disponibles ; il ne revendique pas une vérification sur manuscrits autographes ni une édition critique définitive.
- Le parallèle français est présenté comme disponible pour comparaison, sans jugement d’autorité absolu.
- Les mentions « Note éditoriale » et « Intertitre éditorial » désignent l’appareil éditorial de la source et ne sont pas présentées comme des paroles écrites par Luisa.
- Les numéros 1 à 136 sont des numéros éditoriaux stables de la collection actuelle de l’application, non une numérotation originale établie par Luisa. Le champ technique `canonical_number` reste un **nom de champ historique (legacy)** en v2.2.9 et ne constitue pas une preuve de numérotation canonique historique.
- Le panneau « Source et validation » n’affiche plus l’empreinte unitaire héritée par lettre. Huit champs `fingerprint_sha256` hérités ne correspondent pas au `body_fr` courant ; ils restent inchangés afin de préserver le verrou byte-identique de `corpus.json`. L’empreinte globale du corpus, utilisée par les contrôles d’intégrité/import, a été recomputée indépendamment et reste valide.
- R3 modifie l’Aide / À propos / libellés de confiance, le README, la révision du cache shell et la compatibilité du gate CI avec le suffixe de révision `-r3` ; `corpus.json` reste octet pour octet identique à R2.

## v2.2.8 — Four-pass audit remediation and Help truthfulness (25 août 2026)

- Aide : précise que le statut Lu n’est pas automatique pendant la lecture mais peut être restauré par un import de sauvegarde.
- Recherche : précise qu’un résultat textuel ouvre le paragraphe correspondant, tandis qu’un résultat fondé uniquement sur les métadonnées ouvre la lettre.
- Version/cache : app, README et caches service worker alignés sur v2.2.8 ; corpus inchangé.
- Audit : le dispositif de preuve est reconstruit de façon autoportante avec baseline v2.2.7 hashée, build reproductible, test Help lié au candidat exact, audit AST des fonctions critiques, scan récursif de références et audit exhaustif des revendications actives.
- Validation physique iPhone/iPad/Samsung/PWA/AT reste externe : statut maximal `LIMITED_PASS_STATIC`.


## v2.2.7 — Help truthfulness and discoverability reconciliation (25 août 2026)

- Aide : correction du Build actif (25 août 2026) et alignement de la version sur v2.2.7.
- Lecteur : l’Aide documente désormais Partager et Source et validation sans exposer inutilement les détails techniques.
- Lettres/Explorer : filtres, repères Lu/Favori et distinction Situation (large) / Thème (exact) explicités.
- Recherche, sauvegarde et hors ligne : vocabulaire simplifié et avertissement sur l’effacement des données du navigateur ajouté.
- Accessibilité de l’Aide : titres sémantiques, sommaire direct, libellés de sujets pour les points, aria-current et annonce de la section active.
- Corpus, IDs, schéma d’état 5, notes/surlignages, sélection Apple, Recherche/Explorer runtime, routes et données personnelles inchangés.
- Validation physique iPhone/iPad/Samsung/PWA/AT reste externe : statut maximal `LIMITED_PASS_STATIC`.

## v2.2.6 — Functional reconciliation (25 août 2026)

- Explorer : cartes de chronologie réparées ; vues destinataire/date/tous les destinataires désormais pilotées par un état de vue persistant et un rendu unique.
- Thèmes : les cartes de taxonomie utilisent l’appartenance exacte ; les situations dévotionnelles conservent volontairement une recherche thématique large.
- Import : normalisation des chevauchements partagée avec le démarrage ; lecteur ouvert et carte « Continuer la lecture » synchronisés immédiatement.
- Lecteur : les positions dans l’en-tête utilisent le fractionnement de lettre ; navigation clavier limitée au lecteur réellement visible.
- Thème sombre : couleurs explicites lisibles pour les pastilles de thème et les correspondances de recherche.
- Corpus protégé, IDs, schéma d’état 5 et modèle de sélection Apple inchangés.
- Validation physique iPhone/iPad/Samsung/PWA/AT reste externe.

## v2.2.5 — LET-J3 barre contextuelle iPad / sélection Apple

- `Surligner · Note · Copier · Fermer` reste dans une barre sombre fixe au bas du lecteur, séparée du menu natif Apple.
- La position ne dépend plus du rectangle de sélection; la barre reste au-dessus des actions du lecteur et de la zone sûre.
- Le sélecteur des cinq couleurs se replie dans le viewport sur petit écran.
- Garde d’interaction iOS ajouté sans changer les offsets, empreintes ou schémas de notes/surlignages.
- Corpus, IDs, manifest, workflow, routes, Recherche, Explorer, données privées et famille d’icônes inchangés.
- Validation physique iPhone/iPad/PWA/live/AT reste externe: statut maximal `LIMITED_PASS_STATIC`.


## v2.2.4 — Famille finale d’icônes Collection Luisa v1

- Identité **Lettres** remplacée par l’icône finale verrouillée de la famille Collection Luisa v1 (livre doré chaud avec plume et enveloppe).
- Neuf actifs plateforme sont liés : favicons 16/32/ICO, Apple 60/120/180, PWA 192/512 et maskable 512 dédié.
- Le manifest n’utilise plus une icône normale comme `maskable`; il référence l’actif maskable verrouillé prévu pour Android/PWA.
- Les nouveaux actifs sont inclus dans le cache shell afin qu’ils restent disponibles après une installation en ligne réussie.
- Aucun changement de corpus, ID stable, navigation, recherche, surlignage, notes, positions, sauvegarde/import, routes Hub ou contrat de données privées.
- Validation physique iPhone/iPad/Samsung, PWA installée, origine live et lecteurs d’écran reste externe au stage.


## v2.2.3 — LET-J1 harmonisation d’interaction

- Aide et À propos consolidés : À propos est désormais la dernière section de l’Aide, sans bouton À propos séparé dans Réglages.
- Palette de surlignage visible harmonisée : Jaune · Bleu · Vert · Violet · Rose. Le choix Jaune conserve la clé interne historique `gold` afin d’éviter une migration de schéma inutile ; `purple` est ajouté comme nouvelle clé prise en charge.
- Le contrat contextuel reste `Surligner · Note · Copier · Fermer`.
- Les contrats Lien/Partager, Samsung/Android, corpus, routes, notes, positions et sauvegardes ne sont pas modifiés.
- Validation physique iPhone/iPad/Samsung, PWA installée, Hub réel et lecteurs d’écran reste externe à ce stage.

## v2.2.2 — Aide et À propos finalisés

- Aide portée de 6 à 11 sections et alignée sur le runtime actuel : navigation, Lettre du jour/reprise, lecteur, actions de sélection, Mon Espace, Recherche, Explorer/parcours, taille/thème, sauvegarde/import, liens/support/PWA et À propos.
- Le nombre de sections d’aide est désormais dérivé du DOM au lieu d’un compteur fragile codé en dur.
- Ajout d’un accès distinct **À propos** dans Réglages et aide, ouvrant la section dédiée.
- À propos expose uniquement les informations utiles au public : objet de l’app, version/build, corpus 136/909 et confidentialité locale.
- Aucun texte du corpus, ID stable, schéma de données utilisateur, logique de recherche/lecture/annotation, manifest ou contrat de routes n’est modifié.


## LET-C — contextual actions, notes, highlighting and swipe safety

- Selection actions: **Surligner · Note · Copier · Fermer**.
- Highlight rendering uses canonical original-text offsets with paragraph/corpus fingerprints and conservative stale recovery.
- Legacy notes/highlights remain compatible; LET-D advances the shared state envelope to schema 5 without changing corpus IDs or corpus text.
- Note/highlight deletion is reversible through in-app Undo.
- Phone swipe navigation is guarded against selection, contextual UI, interactive controls and vertical gestures.
- Android/Samsung paragraph-only highlighting remains conditional on physical-device evidence and is not claimed by this build.


## LET-D — semantic reading position and responsive/orientation hardening

- Reading position persists a stable display-paragraph ID plus within-paragraph fraction; letter fraction and legacy percentage remain fallback evidence.
- Restart/resume, text-size changes and phone↔wide transitions restore the semantic position.
- Long paragraphs crossing the top of the reader remain valid anchors.
- iPhone-class hardware remains phone layout across rotation; iPad/desktop layout follows current viewport width for Split View and resized windows.
- Physical iPad Safari Split View/orientation proof remains required before full LET-D PASS.

## LET-E — recherche, Lettre du jour, Explorer et parcours

- Recherche normalisée en français : accents, œ/oe, æ/ae, variantes d’apostrophes, espaces insécables/étroits et ponctuation.
- Recherche sur texte, titre, destinataire, thèmes, numéro, date et lieu, avec surlignage remappé au texte original et debounce 140 ms.
- Retour depuis un résultat de recherche : conservation de la requête et de la position de la liste.
- Lettre du jour : identité persistée pour la date civile locale ; elle ne change pas après marquage Lu/rechargement le même jour.
- Explorer : comptes de situations strictement dérivés du corpus, vue « Tous les destinataires », chronologie conservée.
- Les six parcours sont validés contre les 136 numéros stables de l’application et leurs IDs stables avant l’initialisation. Leur progression dérive uniquement de `lp_read`.



## LET-F — navigation et Mon Espace

- Navigation principale : Accueil · Lettres · Recherche · Mon Espace · Explorer.
- Mon Espace conserve Favoris · Notes · Surlignages, avec totaux explicites et section À réancrer.
- Réglages, aide et sauvegarde sont regroupés dans une surface unique.
- Le corpus canonique reste inchangé.


## LET-G — PWA, hors ligne, ressources et mises à jour

- `index.html` et `corpus.json` restent **network-first**, avec contournement du cache HTTP du navigateur pour éviter de réinjecter des octets périmés dans un nouveau release cache.
- L’installation du nouveau Service Worker échoue fermée si le shell frais ne peut pas être mis en cache ; l’ancien Service Worker reste alors la version de travail.
- Les caches utilisent le préfixe propriétaire `luisa-letters-`; le nettoyage ne supprime que les caches de cette app (plus ses anciens noms v1.x explicitement reconnus).
- Une mise à jour en attente n’est jamais appliquée automatiquement dans une session active. Elle attend l’action de l’utilisateur et refuse de recharger si une note non enregistrée ou un import est en cours.
- Promesse hors ligne : **la toute première installation/ouverture nécessite Internet**. L’installation du Service Worker met maintenant en cache de façon fraîche le shell **et `corpus.json`** avant de pouvoir réussir ; après activation, les 136 entrées de la collection disposent donc d’un repli hors ligne. Les routes profondes et raccourcis avec paramètres retombent sur le shell canonique mis en cache. Le cycle réel installé reste à valider sur appareils.
- Les polices Google restent un embellissement optionnel avec repli `Georgia`; les icônes Tabler sont épinglées et disposent de glyphes de secours locaux, donc l’interaction essentielle ne dépend pas du CDN.
- `manifest.json` conserve `orientation: any`; les raccourcis Lettre du jour et Recherche utilisent des routes explicites.
- La validation physique iPhone/iPad/Android et le cycle PWA réellement installé sur l’origine HTTPS restent requis avant un PASS de release LET-G.


## LET-H — accessibilité, sécurité et maintenabilité

- Cibles tactiles fréquentes : minimum 44×44 CSS px, y compris actions lecteur, navigation, couleurs de surlignage et contrôles de feuilles/modales.
- Focus clavier visible, gestion partagée des modales (piège Tab, Échap, clic arrière-plan, retour du focus) et `aria-modal`/noms accessibles cohérents.
- Champs éditables utilisateur maintenus à ≥16px sur iOS.
- Reflow/zoom et préférence `prefers-reduced-motion` couverts par les contrôles automatisés LET-H.
- Le doré décoratif est conservé ; le texte/interactions dorés sur fond clair utilisent un jeton plus sombre (`--gold-text`) pour le contraste.
- Les contenus générés depuis notes/surlignages/imports n’insèrent plus de données utilisateur dans des chaînes `onclick`; les actions dynamiques passent par `data-action` + délégation.
- Des frontières de helpers pures sont explicitées/testées pour route, normalisation française, segmentation de plages et validation des parcours. Le monolithe reste volontairement sans framework.
- CSP stricte différée : des handlers inline statiques restent présents. Le roadmap demande de réduire cette dépendance avant d’ajouter une CSP qui casserait le single-file PWA.
- Une validation réelle VoiceOver/TalkBack/NVDA reste nécessaire avant toute revendication d’accessibilité publique complète.


## LET-I — Hub, liens stables et interopérabilité

- Le Hub ouvre l’app par un lien HTTPS ordinaire ; aucune donnée privée n’est partagée entre apps et le Hub ne doit jamais lire le `localStorage` de Lettres.
- Contrat de liens stables :
  - racine : `index.html`
  - écran : `?screen=home|list|search|notes|explore`
  - lettre : `?letter=LP.LETTER.042`
  - paragraphe : `?letter=LP.LETTER.042&dp=LP.LETTER.042.DP003`
  - recherche : `?screen=search&q=Fiat`
  - parcours : `?screen=explore&path=paix`
  - Lettre du jour : `?screen=home&action=letter-of-day`
- Les paramètres inconnus ou invalides sont ignorés ou reçoivent un message non bloquant ; aucune valeur de lien n’est injectée comme HTML exécutable.
- `Partager` inclut désormais l’URL stable, le titre et la référence ; le repli presse-papiers copie le lien et la référence.
- Réglages et aide propose également **Copier le lien courant**, **Signaler un problème de texte** et **Copier le diagnostic**. Les notes, surlignages, favoris et positions de lecture ne sont jamais inclus automatiquement.
- Le contrat de route ne dépend d’aucun transfert spécifique de plateforme. Son comportement réel en navigateur et en PWA installée doit encore être validé sur l’exact candidat avant toute revendication d’équivalence.
- Le déploiement public est autorisé. Les validations physiques/installées/live restent nécessaires avant un **PASS technique complet** et demeurent des contrôles post-déploiement recommandés.
