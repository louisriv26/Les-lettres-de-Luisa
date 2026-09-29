# Lettres 2.8 B1 — Wave 0 data-integrity candidate

Predecessor authority: exact live main commit `20d29f09330818f655ddc1370cbb4f56bad957bf` (2.4 B1).

This fresh candidate supersedes failed/unqualified candidates 2.5, 2.6 and 2.7. Those candidates remain immutable.

Authorized mutation: `BKP-LETTRES-01` data-integrity closure plus exact successor identity/CSP/cache binding only.

- New notes are bounded to 10,000 characters at the editor and new-note save path.
- Existing/legacy notes longer than 10,000 characters remain loadable and restorable.
- Artificial 5,000-record truncation is removed for notes and highlights; the 24 MiB whole-file normal-backup/direct-import ceiling remains the finite resource bound.
- Current corpus remains unchanged: 909 display paragraphs; maximum paragraph length 803 characters, so the existing 1,000-character highlight-text bound does not reject a highlight creatable from the current corpus.
- Current-facing version labels are bound to 2.8; historical provenance comments labelled v2.4 remain historical and do not represent installed-app identity.
- Corpus, Search, reading positions, concurrency protocol, provenance data and unrelated UX remain protected.
- Production deployment is NOT authorized by candidate construction.
