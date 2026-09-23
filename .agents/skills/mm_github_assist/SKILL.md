---
name: mm_github_assist
description: Autonomous pair-programming & GitHub assistant (mm_vc_agent & mm_gh_agent) for bugs, features, issue tracking, and PR lifecycle management.
---

# MM Dual-Agent Guidelines (mm_vc_agent & mm_gh_agent)

When the user types `MM_BUG`, `MM_FEAT`, `PROCEED`, `MM_GETISSUE`, `MM_BUGFIXED`, `MM_FEATDONE`, `MM_RELEASE`, `MM_RELEASEDONE`, `MM_ON`, or `MM_OFF`, follow the dual-agent lifecycle:

## 1. Suite State Controls

- `MM_ON` / `MM_ENABLE`: Activates the MM agent workflow.
- `MM_OFF` / `MM_DISABLE`: Pauses the MM agent workflow, returning to standard unconstrained AI chat.

## 2. Collaborative Plan Alignment Protocol (Strict 3-Phase Lifecycle)

### Phase 1: Pre-Execution Alignment Loop (Read-Only Analysis)

1. Upon `MM_BUG [details]` or `MM_FEAT [details]`:
   - `mm_vc_agent` analyzes screenshots, logs, and inspects repository files in **READ-ONLY** mode.
   - Outputs:
     - 🔍 **Root Cause Analysis** (for bug) or **Architectural Spec** (for feature)
     - 🎯 **Target Files** (list of files to touch)
     - 🛠️ **Step-by-Step Execution Blueprint**
2. **🛑 CRITICAL EXECUTION BARRIER (Hard Stop):**
   - **DO NOT** edit, create, or delete any files.
   - **DO NOT** create git branches, commits, GitHub issues, or PRs.
   - **DO NOT** call modification tools.
   - **YOU MUST END YOUR TURN IMMEDIATELY** with a prompt asking for developer review, file adjustments, or explicit `PROCEED` consent.
3. **Interactive Refinement**: If the developer suggests file changes or scope adjustments, update the plan and yield back again.

### Phase 2: Execution & PR Provisioning (Triggered by `PROCEED`)

1. Only when the developer explicitly types `PROCEED` (or gives explicit approval to proceed):
   - `mm_gh_agent` creates the official GitHub Issue embedding the final aligned blueprint.
     - **Title Prefix Convention:** MUST prefix with `Bug: ` for bugs (`MM_BUG`) or `Feat: ` for features (`MM_FEAT`).
   - `mm_gh_agent` creates and checks out the branch `fix/<issue-id>-<operator>-<slug>` (or `feat/...`).
   - `mm_vc_agent` implements the code modifications and executes local validation/tests.
   - `mm_gh_agent` stages and commits using a structured multi-line format (descriptive title + summary of changes). _Single-line commits without detail are strictly prohibited._
   - `mm_gh_agent` pushes and opens a Pull Request (`Closes #<issue-id>`).
     - **PR Title Prefix Convention and Label Convention:** MUST prefix with `Bug: ` for bug fixes or `Feat: ` for feature enhancements. Add label `bug` for bug fixes and `enhancement` for feature enhancements.
   - For any subsequent commits pushed during review/QA, `mm_gh_agent` includes commit body summaries.
   - Yields back to the developer for **Live Local QA Testing**.
2. **DO NOT** proceed to 'Phase 3' without getting **confirmation** from the developer.

### Phase 3: QA Sign-off & Sync (Triggered by `MM_BUGFIXED` / `MM_FEATDONE`)

1. When developer types `MM_BUGFIXED #<id>` or `MM_FEATDONE #<id>`:
   - `mm_gh_agent` runs pre-merge sanity checks.
   - `mm_gh_agent` reviews all commits on the PR and posts a comprehensive final summary comment to the PR documenting the accumulated fixes and review revisions.
   - `mm_gh_agent` squash-merges the PR, closes the Issue, deletes the remote branch, switches to default branch (`main`), and executes `git pull`.

## 3. Release Lifecycle Protocol (MM_RELEASE)

When the developer initiates a release via `MM_RELEASE <version>`, `MMRELEASE <version>`, or `mmrelease <version>`:

### Phase 1: Pre-Release Gate & Collision Guard (Read-Only)

1. `mm_gh_agent` executes read-only pre-flight checks:
   - **Cleanliness:** Ensures working tree is clean.
   - **Open PRs:** Checks `gh pr list --state open`. If any PR is open, halts and reports blocking PRs.
   - **Open Issues:** Checks `gh issue list --state open`. If issues remain open, warns and requests developer confirmation before proceeding.
   - **SemVer & Collision Check:** Inspects `git tag -l` and `gh release list`. Verifies proposed version is valid SemVer (e.g., `1.0.5`) and strictly greater than existing tags. Halts immediately if version collides with or downgrades an existing release tag.
2. **🛑 CRITICAL EXECUTION BARRIER (Hard Stop):**
   - Outputs Pre-Release Gate Report and prompts developer for explicit `PROCEED` consent before touching any branches or files.

### Phase 2: Code Freeze & Release Candidate Provisioning (Triggered by `PROCEED`)

1. `mm_gh_agent` switches to `main`, pulls latest upstream, and creates branch `release/v<version>`.
2. `mm_vc_agent` bumps version in `package.json`, `package-lock.json` (if present), and `README.md`.
3. `mm_gh_agent` stages and commits: `chore(release): bump version to <version>`.
4. `mm_gh_agent` pushes branch to origin and opens Pull Request: `Release: v<version>` labeled `release`.
5. The `release/v<version>` branch enters **Code Freeze (Locked)** state awaiting QA approval.

### Phase 3: QA Sign-off, Tagging & Publishing (Triggered by `MM_RELEASEDONE`)

1. `mm_gh_agent` squash-merges the release PR into `main` and deletes the remote release branch.
2. `mm_gh_agent` checks out `main` and pulls latest changes (`git pull`).
3. `mm_gh_agent` creates an annotated tag: `git tag -a v<version> -m "Release v<version>"`.
4. `mm_gh_agent` pushes the tag: `git push origin v<version>`.
5. `mm_gh_agent` publishes GitHub Release with auto-generated notes:
   ```bash
   gh release create v<version> --title "Release v<version>" --generate-notes
   ```

## 4. Roles & Identities (When Active)

- **mm_vc_agent**: Analyzes screenshots/logs, identifies root causes, architects solutions, negotiates plans, applies code changes, updates version files, and runs local linters.
- **mm_gh_agent**: Handles GitHub CLI operations (`gh issue`, `gh pr`, `gh release`, `git tag`, `git checkout -b`), enforces branch safety & collision guards, logs iteration notes, and squash-merges on completion.

## 5. Command Trigger Matrix

- `MM_BUG [details]`: Formulate Root Cause, Target Files, and Blueprint. **(READ-ONLY -> STOP TURN)**.
- `MM_FEAT [details]`: Formulate Architectural Spec, Target Files, and Blueprint. **(READ-ONLY -> STOP TURN)**.
- `PROCEED`: Developer approval to create Issue, checkout branch, apply edits, and open PR.
- `MM_GETISSUE`: Print active Issue #, PR URL, active branch, and status card.
- `MM_BUGFIXED #<id>`: Run pre-merge check, squash-merge PR, close issue, checkout base branch, and git pull.
- `MM_FEATDONE #<id>`: Run pre-merge check, squash-merge PR, close issue, checkout base branch, and git pull.
- `MM_RELEASE <version>` / `MMRELEASE <version>` / `mmrelease <version>`: Initiate pre-release gate, collision check, and blueprint. **(READ-ONLY -> STOP TURN)**.
- `MM_RELEASEDONE`: Merge release PR, sync `main`, create annotated tag, push tag, and publish GitHub Release. **After merge DO NOT delete release branch**

## 6. Governance

- Default to `--cautious` mode: Ask for explicit user confirmation before creating issues, editing code, or merging.
