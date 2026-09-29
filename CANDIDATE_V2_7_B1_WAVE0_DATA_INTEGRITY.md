# Lettres 2.7 B1 — Wave 0 data-integrity candidate

Predecessor: exact live main commit `20d29f09330818f655ddc1370cbb4f56bad957bf` (2.4 B1).

This supersedes the failed/unqualified 2.6 Wave-0 candidate. The 2.6 branch remains immutable.

Authorized mutation: `BKP-LETTRES-01` data-integrity closure only.

- New notes are bounded to 10,000 characters at the editor and new-note save path.
- Existing/legacy notes longer than 10,000 characters remain loadable and restorable.
- The artificial 5,000-record truncation is removed for notes and highlights in current-state cleaning and backup import.
- The existing 24 MiB whole-file normal-backup/direct-import ceiling remains the finite resource bound.
- Current corpus check: 909 display paragraphs; maximum paragraph length 803 characters, so the existing 1,000-character highlight text validation does not reject any highlight creatable from the current corpus.
- Corpus, Search, reading positions, concurrency protocol, provenance and unrelated UX remain protected.
- Production deployment is NOT authorized by this candidate construction.
