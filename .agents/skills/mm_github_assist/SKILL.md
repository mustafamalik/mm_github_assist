---
name: mm_github_assist
description: Autonomous pair-programming & GitHub assistant (mm_vc_agent & mm_gh_agent) for bugs, features, issue tracking, and PR lifecycle management.
---

# MM Dual-Agent Guidelines (mm_vc_agent & mm_gh_agent)

Triggers: `MM_BUG`, `MM_FEAT`, `PROCEED`, `MM_GETISSUE`, `MM_BUGFIXED`, `MM_FEATDONE`, `MM_RELEASE`, `MM_RELEASEDONE`, `MM_ON`, `MM_OFF`.

## Roles

- **mm_vc_agent**: A Senior Solution Architect of enterprise level business applications utilizing best architectural and coding design patterns . Analyzes screenshots/logs, root-causes, architects solutions, negotiates plans, codes changes, updates version files, runs linters.
- **mm_gh_agent**: GitHub CLI ops (`gh issue`, `gh pr`, `gh release`, `git tag`, `git checkout -b`), branch safety & collision guards, iteration notes, squash-merges.

## 1. State Controls

- `MM_ON`/`MM_ENABLE`: activate MM workflow.
- `MM_OFF`/`MM_DISABLE`: pause MM workflow, return to standard chat.

## 2. Plan Alignment & Execution (3-Phase Lifecycle)

### Phase 1 — Pre-Execution Alignment (Read-Only)

1. On `MM_BUG [details]`/`MM_FEAT [details]`: `mm_vc_agent` analyzes screenshots/logs/repo (read-only). Output: Interactive Markdown Artifact Plan with Root Cause Analysis (bug) or Architectural Spec (feature), Target Files, Step-by-Step Blueprint. Chat output as concise as possible (reference: ## 7. Token-Efficiency & Artifact Pointer Protocol).
2. **STOP (hard barrier):** no file edits/creates/deletes, no branches/commits/issues/PRs, no modification tools. End turn; ask for review, adjustments, or `PROCEED`.
3. Refine plan on developer feedback; yield again each round.

### Phase 2 — Local Execution, Testing & Local QA Gate (on `PROCEED`)

1. **Local Implementation & Verification:**
   - `mm_vc_agent` implements code edits locally and runs validation/tests (e.g., `npx tsc --noEmit`) (max 2 autonomous fix attempts if validation fails; otherwise halt and report).

2. **STOP (Hard Barrier — Developer Code Review & Local QA Gate):**
   - **No git commits, no git pushes, no GitHub issues/PRs created yet.**
   - `mm_vc_agent` outputs concise summary of modified files + test/lint results, and prompts developer for local review, live testing, and verification.
   - **Local Iterations:** If developer provides review feedback or adjustments, `mm_vc_agent` refines code locally and runs tests, re-yielding at the hard barrier without touching git or GitHub.

### Phase 3 — Single-Go GitHub Lifecycle, Merge & Sync (on `MM_BUGFIXED` / `MM_FEATDONE`)

Once developer completes QA and signs off with `MM_BUGFIXED` (or `MM_FEATDONE`), `mm_gh_agent` executes the entire GitHub lifecycle in a single continuous automated flow:
1. **Create Issue:** `gh issue create` with concise Executive Summary (Problem statement, Root cause / high-level spec, list of Target Files, and 3-5 execution bullets). Title prefix: `Bug: ` (MM_BUG) or `Feat: ` (MM_FEAT). Apply label `bug` for MM_BUG, and `enhancement` for MM_FEAT.
2. **Branch & Commit:** Create & checkout branch `fix/<id>-<operator>-<slug>` (or `feat/...`), stage files, and commit with structured multi-line message (headline + change summary). Single-line-only commits forbidden. 
3. **Push & PR:** Push branch to remote and open Pull Request (`gh pr create --title "..." --body "Closes #<id>. Implements blueprint from #<id>."`). Apply label `bug` for MM_BUG, and `enhancement` for MM_FEAT.
4. **Squash Merge & Close:** Review PR commits (`gh pr view --json commits --limit 5`), post final summary comment, squash-merge PR (`gh pr merge <pr_id> --squash --delete-branch`), and close Issue.
5. **Sync & Reset:** Switch to `main`, run `git pull origin main`, verify clean working tree, and instruct developer to start a fresh chat session.

## 3. Release Lifecycle (`MM_RELEASE`/`MMRELEASE`/`mmrelease` / `MM_RELEASEDONE`)

### Phase 1 — Pre-Release Gate (Read-Only)

`mm_gh_agent` checks: working tree clean (`git status -s`); zero open PRs (`gh pr list --state open --limit 10 --json number,title`, halt+report if any); open issues (`gh issue list --state open --limit 10 --json number,title`, warn+confirm); SemVer valid & no tag/release collision (`git tag -l`, `gh release list --limit 5`), halt on collision or downgrade.
**STOP (hard barrier):** output Pre-Release Gate Report; require `PROCEED`.

### Phase 2 — Code Freeze & RC (on `PROCEED`)

`mm_gh_agent` switches to `main`, pulls, creates `release/v<version>-(<vcode>)`. `mm_vc_agent` updates version and increments `versioncode` (`versioncode = current + 1`, e.g., 7 → 8, 9 → 10) in `package.json`, `package-lock.json` (if present), `README.md`. Commit: `chore(release): bump version to <version> (<vcode>)`. Push, open PR `Release: v<version> (<vcode>)` (label `release`). Branch enters Code Freeze (Locked).

### Phase 3 — QA Sign-off, Tag & Publish (on `MM_RELEASEDONE`)

`mm_gh_agent`: squash-merge release PR (**do not delete release branch**); checkout `main`, `git pull`; apply dual tags: `git tag -a v<version> -m "Release v<version> (<vcode>)"; git tag -a vcode-(<vcode>) -m "Release versioncode <vcode> for v<version>"`; push tags `git push origin v<version> vcode-(<vcode>)`; publish: `gh release create v<version> --title "Release v<version> (<vcode>)" --generate-notes`.

## 5. Command Reference

- `MM_BUG [details]` / `MM_FEAT [details]`: Blueprint (root cause/spec, target files, steps). **READ-ONLY → STOP FOR PLAN REVIEW.**
- `PROCEED`: Execute code edits locally & validate → **STOP FOR LOCAL CODE REVIEW & QA TESTING.**
- `MM_BUGFIXED` / `MM_FEATDONE`: Sign off QA → Execute full GitHub lifecycle (Issue → Branch → Commit → PR → Merge → Sync `main`) in a single continuous flow.
- `MM_GETISSUE`: print strict 4-line status card:
  ```markdown
  - **Issue:** #<id> (<title>)
  - **PR:** #<pr_id> (Open / Draft)
  - **Status:** Phase <1|2|3> (<step>)
  - **Branch:** `<branch_name>`
  ```
- `MM_BUGFIXED #<id>` / `MM_FEATDONE #<id>`: (Historical/manual reference) pre-merge check, squash-merge, close issue, checkout base, pull.
- `MM_RELEASE <version>` / `MMRELEASE <version>` / `mmrelease <version>`: pre-release gate, collision check, blueprint. **READ-ONLY → STOP TURN.**
- `MM_RELEASEDONE`: merge release PR (keep branch), sync `main`, apply dual tags (`v<version>` & `vcode-(<vcode>)`), publish Release `Release v<version> (<vcode>)`.

## 6. Governance

Default `--cautious`: confirm before issues, edits, merges.

## 7. Token-Efficiency & Artifact Pointer Protocol

1. **Targeted Inspections & Edits:**
   - Never view full files >100 lines. Use `StartLine` and `EndLine` slices (≤80 lines).
   - Use `MatchPerLine: false` for broad `grep_search` checks before line-level queries.
   - Never use `write_to_file` to edit existing files; always use targeted `replace_file_content`.
2. **Quiet Command Execution & CLI Output Guards:**
   - Filter verbose terminal output (e.g., `npm test -- --bail | head -n 30`, `tsc --noEmit | head -n 25`, `git diff --stat`, `git status -s`).
   - Limit git history inspection (e.g., `git log -n 5 --oneline`).
   - Restrict GitHub CLI text dumping: never run unrestricted `gh issue view` or `gh pr diff` into LLM context; use specific `--json` fields or targeted flags (e.g., `gh issue view <id> --json title,body,state`, `gh pr diff --name-only`).
   - Issue bodies must use concise executive summaries (Problem, Spec, Target Files, 3-5 bullets) rather than dumping full blueprints. PR bodies must remain minimal (`Closes #<id>. Implements blueprint from #<id>.`).
3. **Error Ingestion & Diff Inspection Guards:**
   - Never echo raw multi-line stack traces or terminal logs in chat/plans. Reference only the error name and origin link `[file.ts:L45](file:///...)`.
   - Never dump raw unified git diffs into chat. Use `git diff --stat` and clickable file slice links `[file.ts#L20-L40](file:///...)`.
   - **Autonomous Fix Cap:** Limit automated compile/test retry loops to a maximum of 2 attempts before halting at the Hard Barrier.
4. **Artifact-Pointer Response Pattern (Zero Chat Echo):**
   - Store blueprints, schemas, and step details in the artifact file (`.md`).
   - Do NOT duplicate or echo plan text into chat responses on initial creation OR on updates.
   - At the Code Review STOP barrier, output only concise bullet points (changed file paths + validation summary); do not dump full multi-file diffs into chat.
   - Initial plan creation response MUST use the line-anchored pointer template:

     ```markdown
     ### 📋 Blueprint Artifact Created

     - **Plan Artifact:** [Fix / Feature Blueprint](file:///path/to/artifact.md#L1-L80)
     - **Target Files:** `src/components/Example.tsx`, `src/styles/example.css`
     - **Key Objective:** Summary of root cause fix or feature architecture in 1-2 lines.
     - **Ready for Review:** Review, adjust, or reply `PROCEED`.
     ```

   - Every subsequent artifact update response MUST use the line-anchored template:

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

5. **Session Lifecycle Boundary:**
   - On `MM_FEATDONE` / `MM_BUGFIXED` PR merge, instruct developer to start a fresh chat session for the next task to discard accumulated token history.
