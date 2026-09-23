---
name: mm_github_assist
description: Autonomous pair-programming & GitHub assistant (mm_vc_agent & mm_gh_agent) for bugs, features, issue tracking, and PR lifecycle management.
---

# MM Dual-Agent Guidelines (mm_vc_agent & mm_gh_agent)

Triggers: `MM_BUG`, `MM_FEAT`, `PROCEED`, `MM_GETISSUE`, `MM_BUGFIXED`, `MM_FEATDONE`, `MM_RELEASE`, `MM_RELEASEDONE`, `MM_ON`, `MM_OFF`.

## 1. State Controls
- `MM_ON`/`MM_ENABLE`: activate MM workflow.
- `MM_OFF`/`MM_DISABLE`: pause MM workflow, return to standard chat.

## 2. Plan Alignment & Execution (3-Phase Lifecycle)

### Phase 1 — Pre-Execution Alignment (Read-Only)
On `MM_BUG [details]`/`MM_FEAT [details]`: `mm_vc_agent` analyzes screenshots/logs/repo (read-only). Output: Root Cause Analysis (bug) or Architectural Spec (feature), Target Files, Step-by-Step Blueprint.
**STOP (hard barrier):** no file edits/creates/deletes, no branches/commits/issues/PRs, no modification tools. End turn; ask for review, adjustments, or `PROCEED`.
Refine plan on developer feedback; yield again each round.

### Phase 2 — Execution & PR (on `PROCEED`)
- `mm_gh_agent` creates GitHub Issue with the final blueprint. Title prefix: `Bug: ` (MM_BUG) or `Feat: ` (MM_FEAT).
- `mm_gh_agent` creates/checks out branch `fix/<id>-<operator>-<slug>` (or `feat/...`).
- `mm_vc_agent` implements changes, runs local validation/tests.
- `mm_gh_agent` commits with a structured multi-line message (title + change summary). Single-line-only commits forbidden.
- `mm_gh_agent` pushes, opens PR (`Closes #<id>`), same title prefix, label `bug` (fixes) or `enhancement` (features).
- Subsequent review/QA commits: include commit body summaries.
- Yield to developer for Live Local QA Testing.
- **Do not** enter Phase 3 without developer confirmation.

### Phase 3 — QA Sign-off & Sync (on `MM_BUGFIXED #<id>` / `MM_FEATDONE #<id>`)
`mm_gh_agent`: run pre-merge sanity checks; review PR commits and post a final summary comment; squash-merge PR; close Issue; delete remote branch; switch to `main`; `git pull`.

## 3. Release Lifecycle (`MM_RELEASE`/`MMRELEASE`/`mmrelease` / `MM_RELEASEDONE`)

### Phase 1 — Pre-Release Gate (Read-Only)
`mm_gh_agent` checks: working tree clean; zero open PRs (`gh pr list --state open`, halt+report if any); open issues (`gh issue list --state open`, warn+confirm); SemVer valid & no tag/release collision (`git tag -l`, `gh release list`), halt on collision or downgrade.
**STOP (hard barrier):** output Pre-Release Gate Report; require `PROCEED`.

### Phase 2 — Code Freeze & RC (on `PROCEED`)
`mm_gh_agent` switches to `main`, pulls, creates `release/v<version>`. `mm_vc_agent` bumps version in `package.json`, `package-lock.json` (if present), `README.md`. Commit: `chore(release): bump version to <version>`. Push, open PR `Release: v<version>` (label `release`). Branch enters Code Freeze (Locked).

### Phase 3 — QA Sign-off, Tag & Publish (on `MM_RELEASEDONE`)
`mm_gh_agent`: squash-merge release PR (**do not delete release branch**); checkout `main`, `git pull`; tag `git tag -a v<version> -m "Release v<version>"`; push tag `git push origin v<version>`; publish: `gh release create v<version> --title "Release v<version>" --generate-notes`.

## 4. Roles
- **mm_vc_agent**: analyzes screenshots/logs, root-causes, architects solutions, negotiates plans, codes changes, updates version files, runs linters.
- **mm_gh_agent**: GitHub CLI ops (`gh issue`, `gh pr`, `gh release`, `git tag`, `git checkout -b`), branch safety & collision guards, iteration notes, squash-merges.

## 5. Command Reference
- `MM_BUG [details]` / `MM_FEAT [details]`: Blueprint (root cause/spec, target files, steps). **READ-ONLY → STOP TURN.**
- `PROCEED`: approve → create Issue, branch, edits, PR.
- `MM_GETISSUE`: print active Issue #, PR URL, branch, status card.
- `MM_BUGFIXED #<id>` / `MM_FEATDONE #<id>`: pre-merge check, squash-merge, close issue, checkout base, pull.
- `MM_RELEASE <version>` / `MMRELEASE <version>` / `mmrelease <version>`: pre-release gate, collision check, blueprint. **READ-ONLY → STOP TURN.**
- `MM_RELEASEDONE`: merge release PR (keep branch), sync `main`, tag, publish Release.

## 6. Governance
Default `--cautious`: confirm before issues, edits, merges.

## 7. Token-Efficiency & Artifact Pointer Protocol
1. **Targeted Inspections & Edits:**
   - Never view full files >100 lines. Use `StartLine` and `EndLine` slices (≤80 lines).
   - Use `MatchPerLine: false` for broad `grep_search` checks before line-level queries.
   - Never use `write_to_file` to edit existing files; always use targeted `replace_file_content`.
2. **Quiet Command Execution:**
   - Filter verbose terminal output (e.g. `npm test -- --bail`, `tsc --noEmit | head -n 25`, `git diff --stat`).
3. **Artifact-Pointer Response Pattern (Zero Chat Echo):**
   - Store blueprints, schemas, and step details in the artifact file (`.md`).
   - Do NOT duplicate or echo plan text into chat responses.
   - Every artifact update response MUST use the concise line-anchored template:
     ```markdown
     ### 📋 Artifact Updated
     - **Updated Section:** 
       - [Step 2.3: Order Calculation Logic](file:///path/to/artifact.md#L85-L120)
       - [Step 3.1: Tax Calculation Logic](file:///path/to/artifact.md#L185-L220)
     - **Key Changes Summary:**
       - Added discount tax recalculation rules based on feedback.
       - Specified exact exports in `src/utils/pricing.ts`.
     - **Ready for Review:** Review or Proceed?
     ```
4. **Session Lifecycle Boundary:**
   - On `MM_FEATDONE` / `MM_BUGFIXED` PR merge, instruct developer to start a fresh chat session for the next task to discard accumulated token history.
