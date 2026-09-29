# Lettres 2.6 B1 — Wave 0 data-integrity candidate

Predecessor: exact live main commit `20d29f09330818f655ddc1370cbb4f56bad957bf` (2.4 B1).

Authorized mutation: `BKP-LETTRES-01` only.

- New notes are bounded to 10,000 characters at the editor and save path.
- Existing/legacy notes longer than 10,000 characters are no longer discarded by current-state cleaning or backup import.
- The 24 MiB normal-backup/direct-import ceiling is unchanged.
- Corpus, Search, highlighting, reading-position, concurrency, provenance and unrelated UX are protected unchanged.
- Production deployment is NOT authorized by this candidate construction.
