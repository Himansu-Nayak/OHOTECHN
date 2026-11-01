# Domain Docs

How the engineering skills should consume OHO TECH's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root: defines the core business and technical vocabulary for OHO TECH (e-commerce, payment routing, lease locking, alerts, entitlements, licensing).
- **`docs/adr/`**: read Architecture Decision Records that touch the area you are about to work in.

If any specific ADR doesn't exist, proceed silently. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them when terms or decisions get resolved.

## File structure

Single-context repo:

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-payment-slot-lease-and-rrn-deduplication.md
│   └── ...
├── docs/agents/
│   ├── issue-tracker.md
│   ├── triage-labels.md
│   └── domain.md
├── backend/
└── frontend/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-XXXX, but worth reopening because…_
