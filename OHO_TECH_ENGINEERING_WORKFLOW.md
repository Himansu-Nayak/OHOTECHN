# OHO TECH Engineering Workflow Guide

This document defines the standard operating procedure (SOP) for software engineering, architecture enhancement, and feature delivery in the OHO TECH platform (`https://ohotechn.com`). It bridges the Google Antigravity AI assistant with the official engineering skills developed by Matt Pocock.

---

## 1. Architecture & Skills Foundation

OHO TECH combines Next.js 16 (React 19), Spring Boot 4 (Java 21), and PostgreSQL, deployed across Vercel and a dedicated Hostinger Ubuntu VPS. To prevent regressions, protect financial transaction integrity, and maintain high code velocity, all non-trivial engineering tasks follow this deterministic lifecycle:

```
[ REQUIREMENTS ]
       │
       ▼
[ GRILL (/grill-with-docs) ] ──────────► [ DOMAIN MODEL (/domain-modeling) ]
                                                       │
                                                       ▼
[ TICKETS (/to-tickets) ] ◄───────────── [ SPECIFICATION (/to-spec) ]
       │
       ▼
[ IMPLEMENTATION (/implement) ] ───────► [ TEST-DRIVEN DEV (/tdd) ]
                                                       │
                                                       ▼
[ RETROSPECTIVE (/retro) ] ◄──────────── [ CODE REVIEW (/code-review) ]
```

---

## 2. Stage-by-Stage Engineering Pipeline

### Stage 1: Inception & Grilling (`/grill-with-docs`)
- **Trigger**: When receiving a new feature request, redesign, or architectural modification.
- **Action**: Invoke `/grill-with-docs`.
- **Function**: The agent interrogates the requirements against `GLOSSARY.md`, existing Architecture Decision Records in `docs/adr/`, and related technical documentation in `docs/`.
- **Output**: Uncovers edge cases, clarifies ambiguous assumptions, and records foundational trade-offs before writing a single line of code.

### Stage 2: Domain Modeling (`/domain-modeling`)
- **Trigger**: Introducing new domain concepts, database entities, or payment states.
- **Action**: Invoke `/domain-modeling`.
- **Function**: Analyzes entities, aggregate roots, value objects, and invariant rules.
- **Output**:
  - Updates `GLOSSARY.md` with explicit, unambiguous definitions.
  - Generates new ADRs under `docs/adr/<NNNN>-<title>.md` documenting key decisions.

### Stage 3: Technical Specification (`/to-spec`)
- **Trigger**: Following domain alignment.
- **Action**: Invoke `/to-spec`.
- **Function**: Synthesizes the grilled requirements and domain model into an exhaustive technical specification.
- **Output**: Writes `docs/specifications/<feature-slug>.md` detailing API schemas, database migrations, state machines, error codes, and acceptance criteria.

### Stage 4: Work Breakdown & Ticket Generation (`/to-tickets`)
- **Trigger**: Once the specification is finalized and approved.
- **Action**: Invoke `/to-tickets`.
- **Function**: Decomposes the specification into atomic, dependency-sequenced implementation tasks.
- **Output**: Creates issues in GitHub Issues (`Himansu-Nayak/OHOTECHN`) via `gh issue create` or writes atomic local markdown tickets in `.scratch/<feature-slug>/issues/01-<task>.md`.

### Stage 5: Wayfinding & Ticket Execution (`/wayfinder` & `/implement`)
- **Trigger**: Ready to begin active coding.
- **Action**: Use `/wayfinder` to identify the unblocked frontier, claim tickets, and invoke `/implement`.
- **Function**: Executes implementation strictly within the boundary of the claimed ticket.

### Stage 6: Test-Driven Development (`/tdd`)
- **Trigger**: Writing business logic, payment verification services, or API endpoints.
- **Action**: Invoke `/tdd`.
- **Protocol**:
  1. **Red**: Write a failing unit or slice test asserting the expected behavior.
  2. **Green**: Write the minimal production code to pass the test.
  3. **Refactor**: Clean up implementation without altering observable behavior.
- **Testing Standard**:
  - Backend: JUnit 5, Mockito, AssertJ, `@DataJpaTest`, `@WebMvcTest`.
  - Frontend: React Testing Library, Vitest/Jest, TypeScript compile check (`npx tsc --noEmit`).

### Stage 7: Adversarial Code Review (`/code-review`)
- **Trigger**: Before staging or committing code.
- **Action**: Invoke `/code-review`.
- **Function**: Performs rigorous static analysis and security auditing:
  - Financial integrity (idempotency, RRN uniqueness, race condition locks).
  - SQL injection and migration backward-compatibility.
  - Type safety and dead code detection.
- **Output**: Generates a structured review report under `docs/reviews/<date>-<feature>.md`.

### Stage 8: Retrospective & Continuous Improvement (`/retro`)
- **Trigger**: Following release or deployment milestones.
- **Action**: Invoke `/retro`.
- **Function**: Evaluates process friction, estimation accuracy, and latent defects encountered during implementation.
- **Output**: Records actionable learnings in `docs/engineering/retrospectives.md`.

---

## 3. Quick Reference: Engineering Skills Cheat Sheet

| Command / Skill | Purpose | Key Inputs | Key Deliverable |
|---|---|---|---|
| `grill-with-docs` | Interactive interview & requirement interrogation | Feature prompt + `GLOSSARY.md` | Clear requirements & resolved edge cases |
| `domain-modeling` | Establish entity relationships & invariants | Grilled findings | `GLOSSARY.md` & `docs/adr/` |
| `to-spec` | Generate detailed technical design | Requirements & models | `docs/specifications/<slug>.md` |
| `to-tickets` | Atomic work item decomposition | Specification | GitHub Issues or `.scratch/` tickets |
| `wayfinder` | Ticket frontier tracking & claiming | Issues list | Next actionable task |
| `implement` | Focused task implementation | Single ticket | Clean, targeted code changes |
| `tdd` | Red-Green-Refactor test cycle | Ticket requirements | Comprehensive test suite |
| `code-review` | Multi-perspective code audit | Git diff | Code review findings & fixes |
| `investigate` | Root-cause analysis for bugs/incidents | Bug report / stacktrace | Verified diagnosis & fix proposal |
| `improve-codebase-architecture` | Systematic architecture refactoring | Code smell / tech debt | Refactored modules & updated ADRs |
| `retro` | Team / session retrospective | Milestone diff | Actionable process improvements |

---

## 4. OHO TECH Quality & Safety Guardrails

1. **Financial Integrity**: Never bypass database transactions on payment operations. All UPI credit matching must hold an exclusive lock and verify RRN uniqueness.
2. **Offline-Safe Builds**: Frontend validations in sandbox environments must use `npx tsc --noEmit` to verify type safety without triggering network font fetches.
3. **No Blind Deployments**: Code changes are committed to git branches and reviewed before deployment to the Hostinger VPS or Vercel.
