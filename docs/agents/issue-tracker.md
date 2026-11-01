# Issue tracker: GitHub & Local Markdown Fallback

Issues and specs for OHO TECH live as GitHub issues on `Himansu-Nayak/OHOTECHN`.
Where the `gh` CLI is not available or for offline local work, issues live under `.scratch/<feature-slug>/`.

## GitHub Conventions (Primary)

Target Repository: `Himansu-Nayak/OHOTECHN` (`https://github.com/Himansu-Nayak/OHOTECHN.git`)

- **Create an issue**: `gh issue create --repo Himansu-Nayak/OHOTECHN --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --repo Himansu-Nayak/OHOTECHN --json number,title,body,labels,comments`.
- **List issues**: `gh issue list --repo Himansu-Nayak/OHOTECHN --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Sub-issue / Parent**: `gh issue edit <parent> --add-sub-issue <child>` or include `Part of #<parent>` at the top of the child body.
- **Blocking**: Add `Blocked by: #<n>, #<n>` at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Comment on an issue**: `gh issue comment <number> --repo Himansu-Nayak/OHOTECHN --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --repo Himansu-Nayak/OHOTECHN --add-label "..."` / `--remove-label "..."`
- **Close**: post the explanation with `gh issue comment <number> --body "..."`, then `gh issue close <number>`.

## Pull Requests as a Triage Surface

**PRs as a request surface: no.**
External pull requests are not automatically treated as triage tickets unless explicitly requested.

## Local Markdown Conventions (Offline / Standalone Fallback)

Where `gh` is unavailable or during disconnected work:
- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`.
- Triage state is recorded as a `Status:` line near the top of each issue file (using the canonical roles from `docs/agents/triage-labels.md`).
- Comments and conversation history append to the bottom of the file under a `## Comments` heading.

## When a skill says "publish to the issue tracker"

Create a GitHub issue via `gh issue create` if `gh` is authenticated, or create `.scratch/<feature-slug>/issues/<NN>-<slug>.md` if operating in local fallback mode.

## When a skill says "fetch the relevant ticket"

Read the ticket via `gh issue view` or the local markdown file path.

## Wayfinding Operations

Used by `/wayfinder`:
- **Map**: Single issue or `.scratch/<effort>/map.md` (holding Notes / Decisions-so-far / Fog body).
- **Child tickets**: Sub-issues or `.scratch/<effort>/issues/NN-<slug>.md`.
- **Frontier**: Scans open, unblocked, unclaimed tickets in sequence.
- **Claim**: Set assignee or `Status: claimed`.
- **Resolve**: Record resolution and update Decisions-so-far.
