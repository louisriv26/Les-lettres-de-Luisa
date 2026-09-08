# Lettres de Luisa Piccarreta — PWA

Application de lecture, recherche et exploration d’une collection éditoriale actuelle de Lettres de Luisa Piccarreta.  
136 entrées de la collection · Spiritualité de la Divine Volonté · PWA installable avec repli hors ligne après première ouverture en ligne

---

## Version courante : v2.2.9

- Collection actuelle : 136 entrées (`luisa-letters-corpus-v2.2.9`) — IDs et 909 paragraphes d’affichage préservés ; elle ne représente pas l’ensemble de la correspondance connue ni une édition critique définitive
- SW cache : `luisa-letters-shell-v2.2.9-r8` · corpus cache : `luisa-letters-corpus-v2.2.9-r4` (corpus inchangé depuis R4)
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
git commit -m "fix: v2.2.9 R8 HTTP fallback hardening"
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




## v2.2.9 R8 — Durcissement du repli HTTP du Service Worker (8 septembre 2026)

- Prédécesseur immédiat : v2.2.9 R7 ZIP SHA-256 `ca8d89584fac9e936d869557d307683e8cc59dbbc82b2d8ee1d1f1fb5eeae4e5`.
- Un audit applicatif élargi a identifié un défaut de résilience actif mais antérieur à R7 : les stratégies `networkFirstShell()` et `networkFirstCorpus()` revenaient au cache lorsque `fetch()` levait une erreur réseau, mais renvoyaient directement une réponse HTTP non-OK (par exemple 503) même lorsqu'une copie valide était déjà en cache. Cela ne satisfaisait pas pleinement le contrat documenté « network-first avec repli cache ».
- R8 traite désormais une réponse HTTP non-OK comme une condition de repli : si une copie valide existe, le shell/corpus mis en cache est servi ; si aucun cache n'existe, la réponse HTTP non-OK d'origine est conservée. Une erreur réseau sans cache conserve le repli 503 synthétique existant.
- Les réponses réseau 2xx restent prioritaires et continuent seules à rafraîchir les caches. Une réponse non-OK n'écrase jamais une copie connue comme bonne.
- **Aucun changement de corpus ni de renderer** : mêmes 136 lettres, 909 DPs, 45 mutations gouvernées, 17 lettres mutées, 7 loci HOLD, 200/200 DPs historiques `is_signature:true` neutres et 5 DPs / 19 géométries de migration.
- Le cache shell passe à `luisa-letters-shell-v2.2.9-r8`; le cache corpus reste `luisa-letters-corpus-v2.2.9-r4`.
- La validation R8 ajoute des scénarios explicites HTTP 503 avec cache, HTTP non-OK sans cache, erreur réseau avec cache, installation échouant fermée sur ressource non-OK, et conserve tous les tests renderer/Aide/migration.
- Validation physique iPhone/iPad/Samsung, cycle PWA installé R7→R8 sur origine HTTPS et VoiceOver/TalkBack/NVDA restent externes.


## v2.2.9 R7 — Garde de conflit des rôles de fin de lettre (8 septembre 2026)

- Prédécesseur immédiat : v2.2.9 R6 ZIP SHA-256 `f3ee6123b7c745539468fdfcceb2d615b9f6c0974dda5c43f689b8b2fa89393d`.
- Audit adversarial R6 : un cas résiduel a été trouvé — Lettre 70 `LP.LETTER.070.DP007` porte à la fois `is_signature:true` et le `split_reason` historique `devotional_opening`; R6 supprimait la classe `signature` mais lui laissait donc la classe visuelle `salutation`.
- R7 applique une règle de conflit conservatrice : un `split_reason` d'ouverture/salutation ne peut ajouter la classe `salutation` lorsqu'un même DP porte aussi le marqueur historique `is_signature:true`. En cas de métadonnées contradictoires, le rendu neutre prévaut.
- Cette garde ne crée aucune typographie de signature et ne reclassifie aucune donnée du corpus. Elle change le rendu d'exactement **1 DP** par rapport à R6 : `LP.LETTER.070.DP007`.
- Les **200/200** DPs historiques `is_signature:true` rendent désormais avec la classe de paragraphe extérieure normale `dp` (les spans de provenance éditoriale explicitement établis restent distincts). Les **153** DPs non marqués `is_signature` dont le `split_reason` appartient aux rôles d'ouverture/salutation conservent leur rendu `salutation` antérieur.
- **Aucun changement de corpus** : mêmes 136 lettres, 909 DPs, 45 mutations gouvernées, 17 lettres mutées, 7 loci HOLD et 5 DPs / 19 géométries de migration.
- Le cache shell passe à `luisa-letters-shell-v2.2.9-r7`; le cache corpus reste `luisa-letters-corpus-v2.2.9-r4`.
- Le test Service Worker R7 validait le repli sur erreur réseau levée, mais ne couvrait pas encore les réponses HTTP non-OK ; cette lacune transversale est explicitement corrigée et testée en R8. Validation physique iPhone/iPad/Samsung, cycle PWA installé R6→R7 sur origine HTTPS et VoiceOver/TalkBack/NVDA restent externes.


## v2.2.9 R6 — Rendu neutre des fins de lettres (8 septembre 2026)

- Prédécesseur immédiat : v2.2.9 R5 R2 ZIP SHA-256 `174c83afc59a2a72e0ec40a059fa0ad34792df1072eaadb07efc4f0cdde7ca18`.
- **Aucun changement de corpus** : `corpus.json` reste byte-identical à R5/R4 ; 136 entrées, 909 paragraphes d’affichage, 45 mutations gouvernées, 17 lettres mutées, 7 loci HOLD et 5 DPs de migration / 19 géométries sont inchangés.
- Le renderer n’interprète plus `is_signature`, les motifs historiques `signature*`, ni une regex de contenu comme une instruction typographique. Ces données restent conservées pour leurs usages non visuels existants.
- R6 a supprimé le rendu décoratif `.dp.signature` (`✦ ✦ ✦`, trait, centrage, réduction de taille, italique/couleur atténuée propres à cette classe). L’audit R7 a ensuite identifié un chevauchement résiduel distinct : `LP.LETTER.070.DP007` recevait encore la classe préexistante `salutation` à cause d’un `split_reason=devotional_opening` contradictoire.
- Les paragraphes techniques restent distincts et leurs IDs sont strictement conservés : aucun paragraphe n’est fusionné, supprimé, déplacé ou renuméroté.
- Les notes éditoriales explicitement identifiées (`editorial_note_spans`) conservent leur rendu de provenance distinct ; la modification R6 ne neutralise pas cette information source-critique.
- Les exclusions historiques de la **Lettre du jour** fondées sur `is_signature` / `EXCL_LDJ` sont conservées byte-for-byte afin d’éviter un changement fonctionnel non demandé.
- Le cache shell passe à `luisa-letters-shell-v2.2.9-r6`. Le cache corpus reste volontairement `luisa-letters-corpus-v2.2.9-r4`, puisque `corpus.json` est strictement inchangé.
- La validation R6 avait bien vérifié l’absence de classe `signature`/ornement, mais son test autorisait aussi `dp salutation` et a donc laissé passer l’unique conflit L70 DP007. Ce PASS historique est supersédé sur ce point par l’audit et le correctif R7.
- Validation physique iPhone/iPad/Samsung, cycle PWA installé R5→R6 sur origine HTTPS et VoiceOver/TalkBack/NVDA restent externes.



## v2.2.9 R5 — Accès contextuel à l’Aide (8 septembre 2026)

- Prédécesseur immédiat : v2.2.9 R4 ZIP SHA-256 `2f1cf376993165eaa8c519e8e8519135e5119ab5bff90a94cc7500dda2d1f681`.
- **Aucun changement de corpus** : `corpus.json` reste byte-identical à R4, avec les 45 mutations gouvernées, 17 lettres mutées, 7 loci HOLD et 5 DPs de migration / 19 géométries inchangés.
- Téléphone : un contrôle Aide `?` est désormais accessible en un geste depuis Accueil, Lettres, Recherche, Mon Espace, Explorer et le lecteur plein écran. Chaque accès ouvre directement la rubrique pertinente (`Recherche`, `Explorer`, `Mon Espace`, `Lire et organiser une lettre`, etc.).
- Tablette/ordinateur : un contrôle permanent **Aide** est ajouté en bas de la barre latérale. Il résout la rubrique à partir de la surface active ; dans Lettres avec un lecteur actif, il ouvre la rubrique Lecteur.
- Réglages : le bouton historique **Ouvrir l’aide** est conservé comme accès secondaire et ouvre maintenant directement la rubrique Réglages.
- Premier lancement : la première rubrique explique explicitement comment rouvrir l’Aide ultérieurement.
- Navigation primaire inchangée : Accueil · Lettres · Recherche · Mon Espace · Explorer ; aucune sixième destination n’est ajoutée à la barre du bas.
- Le cache shell passe à `luisa-letters-shell-v2.2.9-r5`. Le cache corpus reste volontairement `luisa-letters-corpus-v2.2.9-r4`, puisque ses octets sont strictement inchangés.
- Validation automatisée R5 couvre la présence/visibilité responsive des nouveaux accès, leur routage contextuel, les cibles tactiles existantes ≥44×44, le Service Worker, le workflow GitHub, et l’identité stricte du corpus R4.
- Validation physique iPhone/iPad/Samsung, cycle PWA installé R4→R5 sur origine HTTPS et VoiceOver/TalkBack/NVDA restent externes.

## v2.2.9 R4 — Adjudication adversariale Letter 48 et cache corpus (8 septembre 2026)

- Prédécesseur immédiat de R4 : v2.2.9 R3 ZIP SHA-256 `08f157905f96d704a3010cf57fc30f605a6b44458999d4c398492d3fb0fc563c`.
- Baseline pré-source-critique : v2.2.8 ZIP SHA-256 `75971305d624d898c4ca488f65fa8c0eb6c24bc4bf6439d53807e37a7ef97359`.
- Package d’acquisition/contrôle source-critique : SHA-256 `ac147c04f236fece9a708085bf4ada0320ed039e080593a787ee06c642d98335`.
- La mutation `V229.TEXT.048.TUTTI` est retirée de l’autorité : les témoins italiens acquis divergent entre `tutti` et `tutto` et aucun témoin matériellement plus fort ne tranche la variante. La formulation française déployée `nous transforme complètement en Jésus` est donc restaurée en attente d’une preuve plus forte.
- Gouvernance source-critique courante : **45 mutations autorisées**, **17 lettres mutées**, **7 loci tenus en HOLD**. Letter 48 devient `HOLD_NO_MUTATION`.
- Les cinq autres corrections textuelles restent autorisées : #57 (`Voluntate`), #71 (1939), #82 (note éditoriale : 7 octobre 1938), #97 (`braccia` → « bras »), #122 (unité de sens restaurée).
- Les 34 mutations de métadonnées et les 6 classifications d’appareil éditorial restent inchangées et autorisées.
- 136 IDs de lettre et 909 IDs de paragraphe d’affichage sont conservés ; aucun ajout, suppression, fusion ou renumérotation de lettre.
- Migration de sélection : seules les **cinq** modifications textuelles encore actives entre la baseline v2.2.8 et R4 disposent d’une règle de réancrage. Letter 48 n’en a plus besoin car son texte R4 est identique au texte déployé v2.2.8 à ce locus.
- Le corpus et le shell utilisent tous deux un suffixe de cache `-r4` afin qu’une PWA installée ne puisse pas conserver le corpus R3 supersédé sous la même clé de cache.
- Le gate GitHub Actions accepte désormais un suffixe de révision optionnel `-rN` pour **SHELL_CACHE et CORPUS_CACHE**, tout en imposant la même version sémantique 2.2.9.
- « Source et validation » conserve les formulations prudentes introduites en R3 : collection éditoriale actuelle, base historique anglaise, contrôle italien ciblé et borné, sans revendication d’autographes ni d’édition critique définitive.
- Les numéros 1 à 136 restent des numéros éditoriaux stables de l’application ; `canonical_number` demeure un nom de champ historique (legacy), pas une preuve de numérotation originale de Luisa.
- Le panneau « Source et validation » n’expose pas les huit empreintes unitaires héritées incohérentes (#65, #67, #68, #70, #72–#75). Elles restent une dette métadonnée séparée ; l’empreinte globale R4 est recomputée indépendamment.
- Validation physique iPhone/iPad/Samsung, cycle PWA installé R3/R4 sur origine HTTPS et VoiceOver/TalkBack/NVDA restent externes.

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
- Le corpus de la collection reste inchangé.


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
