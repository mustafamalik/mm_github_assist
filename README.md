# 🚀 MM GitHub Assist (`mm_github_assist`)

> **Autonomous AI Pair Programming & GitHub Assistant for Vibe Coding**  
> _version 1.0.4_

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Compatible With](https://img.shields.io/badge/IDE-Antigravity%20%7C%20Cursor%20%7C%20Claude%20%7C%20VS%20Code%20%7C%20Windsurf-orange)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](README.md)

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Multi-Developer & Team Attribution](#multi-developer--team-attribution)
3. [Prerequisites & GitHub Setup (Essential)](#prerequisites--github-setup-essential)
4. [Quick Installation & Automated Keybinding Setup (30 Seconds)](#quick-installation--automated-keybinding-setup-30-seconds)
5. [What Happens on GitHub? (The Lifecycle)](#what-happens-on-github-the-lifecycle)
6. [Complete Command & Trigger Reference](#complete-command--trigger-reference)
7. [IDE Shortcuts & Snippets Reference](#ide-shortcuts--snippets-reference)
8. [End-to-End Walkthrough Tutorial](#end-to-end-walkthrough-tutorial)
9. [Governance & Safety: `--cautious` vs `--nocautious`](#governance--safety---cautious-vs---nocautious)
10. [Team Collaboration & Best Practices](#team-collaboration--best-practices)
11. [Uninstallation & Clean Removal Guide](#uninstallation--clean-removal-guide)
12. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Overview

The **MM GitHub Assist Suite** turns your AI assistant into an agile pair-programming team:

- 🧠 **`mm_vc_agent` (MM Vibe Code Agent / Architect)**: Reads your codebase, analyzes multi-modal bug screenshots, writes clean code adhering to your architecture, and verifies builds locally.
- 🐙 **`mm_gh_agent` (MM GitHub Assistant / Release Manager)**: An intelligent GitHub assistant that communicates with GitHub, opens Issues with root cause blueprints, creates feature branches, submits Pull Requests, logs iteration notes, and safely squash-merges into your main branch.

---

## 2. Multi-Developer & Team Attribution

When multiple team members (e.g., Alice, Bob, and Mustafa) use the MM Dual-Agent Suite on the same project:

- **Automatic Identity Detection**: The agent inspects the active developer's Git config (`git config user.name`) and GitHub login (`gh auth status`).
- **Attributed PRs & Comments**: Every PR description and comment is clearly branded with the developer's handle:
  `### 🤖 [mm_gh_agent for @mustafamalik] · Status Update`
- **No Collision**: Each developer gets unique branch names (`fix/142-mustafa-expense-overflow`), ensuring zero branch collisions between teammates.

---

## 3. Prerequisites & GitHub Setup (Essential)

Before using the agents, your local environment needs permissions to talk to GitHub. You have **two easy options**:

### Option A: GitHub CLI (`gh`) — _Recommended (Easiest & Safest)_

The GitHub CLI allows the agents to run securely using your local authenticated credentials without exposing tokens.

1. **Install GitHub CLI:**
   - **Windows (Winget / Chocolatey / Scoop):**
     ```powershell
     winget install --id GitHub.cli
     # or: choco install gh
     ```
   - **macOS (Homebrew):**
     ```bash
     brew install gh
     ```
   - **Linux (apt):**
     ```bash
     sudo apt install gh
     ```
2. **Reload Terminal Session (Windows Only):**

   > ⚠️ **Important on Windows:** New terminal sessions or existing windows need their `PATH` refreshed after installing `gh`. Run:

   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   ```

   _(Or simply close and reopen your PowerShell / IDE terminal)._

3. **Authenticate with your GitHub account:**
   ```bash
   gh auth login
   ```
   _Follow the prompts: Choose `GitHub.com` ➔ `HTTPS` or `SSH` ➔ `Login with a web browser`._
4. **Verify it works:**
   ```bash
   gh auth status
   ```
   _(You should see: `Logged in to github.com account <username>`)_

---

### Option B: Personal Access Token (Fine-Grained PAT) — _For Headless or CI Environments_

If you prefer using a token instead of the GitHub CLI:

1. Go to **GitHub Settings ➔ Developer Settings ➔ Personal Access Tokens ➔ Fine-grained tokens** (or [click here](https://github.com/settings/tokens?type=beta)).
2. Click **Generate new token**.
3. Set **Repository access**: Select `Only select repositories` and choose your project.
4. Under **Permissions**, grant:
   - **Issues**: `Read and write`
   - **Pull requests**: `Read and write`
   - **Contents**: `Read and write` (to allow branch creation and pushes)
5. Copy your token (starts with `github_pat_...`).
6. Place it in a file named `.env.mm_agent.local` in your project root:
   ```env
   GITHUB_TOKEN=github_pat_your_token_here
   ```
   _(Note: The installer automatically adds `.env.mm_agent.local` to `.gitignore` so your key is never committed)._

---

### 3.3 IDE Terminal Permissions (Granular Command Allowlist) — _Recommended for Seamless Flow_

To allow `mm_gh_agent` to manage branches, issues, and PRs without interrupting you with repetitive terminal confirmation dialogs, add these **specific 2-to-3 token command prefixes** to your IDE's auto-approved command list:

#### Specific Command Prefixes Used by the Agents:

| Category                   | Specific Command Prefix to Allow                     | Purpose                                        |
| :------------------------- | :--------------------------------------------------- | :--------------------------------------------- |
| **GitHub Issues**          | `gh issue create`, `gh issue view`, `gh issue close` | Create, read, and close issues                 |
| **GitHub Pull Requests**   | `gh pr create`, `gh pr view`, `gh pr merge`          | Open PRs, check status, and squash-merge       |
| **GitHub Auth Check**      | `gh auth status`                                     | Verify authentication                          |
| **Git Branching**          | `git checkout`, `git branch`                         | Switch/create feature branches and sync main   |
| **Git Status & Staging**   | `git status`, `git add`                              | Check workspace state and stage modified files |
| **Git Commit & Push/Pull** | `git commit`, `git push`, `git pull`                 | Create tracked commits, push PRs, pull latest  |
| **Pre-Merge Verification** | `npm run build`, `npx tsc`                           | Sanity validation before merging               |

#### How to Configure in Your IDE:

- **Google Antigravity IDE**: Go to **Settings ➔ Advanced ➔ Allow List Terminal Commands**, and enter the specific prefixes from the table above (e.g. `gh issue create`, `gh pr create`, `gh pr merge`, `git checkout`, `git commit`, `git push`, `git pull`).
- **Cursor**: Go to **Settings ➔ Features ➔ Terminal / Composer**, and add the exact prefixes above to auto-approved commands.
- **VS Code (Cline / Roo Code / Copilot)**: In extension settings under **Auto-approved terminal commands**, add the specific prefixes above.

---

## 4. Quick Installation & Automated Keybinding Setup (30 Seconds)

Run the automated installer inside any existing project workspace:

```bash
npx mm-github-assist init
```

The interactive CLI will automatically:

1. Detect your active code editor (**Antigravity, Cursor, Claude Code, VS Code, Windsurf**).
2. Validate your GitHub connection (`gh auth status`).
3. **Auto-Inject `mm_` Tagged Configs**: Injects `.vscode/mm_snippets.code-snippets`, keybindings tagged with `/* MM_KEYBINDINGS_START */`, and rules files without touching existing user configurations.
4. Provision GitHub labels (`agent-generated`, `type:bug`, `type:feature`, `status:in-progress`).

---

## 5. What Happens on GitHub? (The Lifecycle)

Here is exactly what the agents do on your GitHub repository during a task:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer (You)
    participant VC as mm_vc_agent (Coder)
    participant GH as mm_gh_agent (GitHub Assistant)
    participant Remote as GitHub.com

    Dev->>VC: 1. "MM_BUG [issue] + screenshot" or "MM_FEAT"
    VC->>Dev: 2. Initial Root Cause + Target Files + Fix Blueprint

    rect rgb(240, 245, 255)
        note over Dev,VC: Pre-Execution Alignment Loop (HITL)
        Dev->>VC: Developer Feedback / File adjustments / Scope changes
        VC->>Dev: Updated & Refined Action Plan
    end

    Dev->>GH: 3. "PROCEED" (Final HITL Approval on Aligned Plan)
    GH->>Remote: 4. Creates Issue #142 (Embeds Final Aligned Blueprint)
    GH->>GH: 5. git checkout -b fix/142-slug
    VC->>VC: 6. Applies code changes & validates locally
    VC->>GH: 7. Ready for PR
    GH->>Remote: 8. git push + Opens PR #143 (Closes #142)
    Note over Dev,Remote: Live Local QA Testing
    Dev->>GH: 9. "MM_BUGFIXED #142"
    GH->>GH: 10. Runs sanity build check
    GH->>Remote: 11. Squash-merges PR #143 & closes Issue #142
    GH->>GH: 12. git checkout main && git pull
    GH->>Dev: 13. All synced & resolved!
```

### What You See on GitHub:

1. **GitHub Issues**: An issue is opened with label `agent-generated` and title `[BUG] <Summary>` or `[FEAT] <Summary>`. **The body contains the complete Root Cause Analysis, list of Target Files, and Final Aligned Blueprint.**
2. **GitHub Branches**: A clean branch `fix/<issue-id>-<operator>-<slug>` (or `feat/...`) is created.
3. **Structured Multi-Line Commits**: Every commit includes a descriptive subject line, an explanatory bulleted summary of changes in the body, and co-authorship attribution. Single-line commits without detail are strictly avoided.
4. **GitHub Pull Requests**: A PR is opened with a description linking `Closes #<id>`, showing full diffs and changelogs.
5. **PR / Issue Iteration Comments**: Every review/QA iteration commit automatically posts a status update comment to the PR timeline detailing the commit hash, operator handle, and a breakdown of exact changes made in that commit.
6. **Clean Merges**: On sign-off, PR is squash-merged, remote branch is deleted, and your local workspace is updated.

---

## 6. Complete Command & Trigger Reference

| Command                         | Trigger Agent                 | Purpose & What It Does                                                                                                | Example                                                   |
| :------------------------------ | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **`MM_ON`** / **`MM_ENABLE`**   | Suite Control                 | Activates the automated MM Dual-Agent pair programming and GitHub tracking.                                           | `MM_ON`                                                   |
| **`MM_OFF`** / **`MM_DISABLE`** | Suite Control                 | Pauses the MM suite for standard, unconstrained AI chat without issue/PR tracking.                                    | `MM_OFF`                                                  |
| **`MM_BUG [details]`**          | `mm_vc_agent`                 | (Phase 1) Ingests screenshots/logs, inspects code, presents root cause & blueprint. **Strictly Read-Only**.           | `MM_BUG Tooltip gets clipped on mobile view in Analytics` |
| **`MM_FEAT [details]`**         | `mm_vc_agent`                 | (Phase 1) Analyzes architecture, plans target files & implementation blueprint. **Strictly Read-Only**.               | `MM_FEAT Add export CSV button with date range filter`    |
| **`PROCEED`**                   | `mm_gh_agent` / `mm_vc_agent` | (Phase 2) Final developer approval. Creates GitHub Issue & branch, applies code edits, and opens PR for QA.           | `PROCEED`                                                 |
| **`MM_GETISSUE`**               | `mm_gh_agent`                 | Instantly retrieves active Issue #, PR link, active branch, and status if chat is long.                               | `MM_GETISSUE`                                             |
| **`MM_BUGFIXED #<id>`**         | `mm_gh_agent`                 | (Phase 3) Signals QA passed for a bug. Runs pre-merge build checks, squash-merges PR, closes issue, and pulls `main`. | `MM_BUGFIXED #142` (or `MM_BUGFIXED`)                     |
| **`MM_FEATDONE #<id>`**         | `mm_gh_agent`                 | (Phase 3) Signals QA passed for a feature. Verifies build, squash-merges PR, closes issue, and syncs branch.          | `MM_FEATDONE #143` (or `MM_FEATDONE`)                     |
| **`MM_RELEASE <version>`**       | `mm_gh_agent` / `mm_vc_agent` | (Release Phase 1 & 2) Runs pre-release gate, collision guard, code freeze, version bumps, and opens release PR.       | `MM_RELEASE 1.0.5`                                        |
| **`MM_RELEASEDONE`**             | `mm_gh_agent`                 | (Release Phase 3) Merges release PR, tags annotated SemVer on `main`, and publishes GitHub Release with notes.        | `MM_RELEASEDONE`                                          |
| **`--cautious`**                | Flag                          | Enforces strict confirmation at every individual transition step.                                                     | `MM_BUG --cautious Fix chart overflow`                    |
| **`--nocautious`**              | Flag                          | Fast-tracks execution, pausing only at Initial Plan and Final QA.                                                     | `MM_BUG --nocautious Fix chart overflow`                  |

---

## 7. IDE Shortcuts & Snippets Reference

Once installed, use these built-in snippets in your IDE chat or files:

| Snippet Shortcut | Action               | What Gets Injected   |
| :--------------- | :------------------- | :------------------- |
| `mmon`           | Press <kbd>Tab</kbd> | `MM_ON`              |
| `mmoff`          | Press <kbd>Tab</kbd> | `MM_OFF`             |
| `mmbug`          | Press <kbd>Tab</kbd> | `MM_BUG: `           |
| `mmfeat`         | Press <kbd>Tab</kbd> | `MM_FEAT: `          |
| `mmgetissue`     | Press <kbd>Tab</kbd> | `MM_GETISSUE`        |
| `mmfix`          | Press <kbd>Tab</kbd> | `MM_BUGFIXED #`      |
| `mmdone`         | Press <kbd>Tab</kbd> | `MM_FEATDONE #`      |
| `mmrelease`      | Press <kbd>Tab</kbd> | `MM_RELEASE `        |
| `mmreleasedone`  | Press <kbd>Tab</kbd> | `MM_RELEASEDONE`     |

_(Keybindings like <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>M</kbd> are auto-configured in your IDE during installation)._

---

## 8. End-to-End Walkthrough Tutorial

### Step 1: Reporting a Bug

In your IDE chat, paste a screenshot or error and type:

```text
MM_BUG The expense breakdown chart tooltip flickers and gets cut off on mobile screens.
```

`mm_vc_agent` will inspect your components, identify the CSS / component issue, and present a **Fix Plan with Root Cause and Target Files**.

### Step 2: Collaborative Alignment & Refinement Loop

You can review the plan and provide feedback:

```text
Also make sure to check the dark-mode tooltip styling in expense-analytics-dark.css.
```

`mm_vc_agent` refines the blueprint and presents the updated target files.

### Step 3: Granting Final Approval

When you are fully aligned with the blueprint, reply:

```text
PROCEED
```

`mm_gh_agent` creates **GitHub Issue #105** (posting the complete aligned Root Cause Analysis and Blueprint in the description) and switches to branch `fix/105-mustafa-chart-tooltip-flicker`.

### Step 4: Coding & PR Creation

`mm_vc_agent` writes the fix and verifies the build. `mm_gh_agent` creates a structured multi-line commit with a descriptive subject and a bulleted summary of changes, pushes to remote, and creates **Pull Request #106**.

```bash
# Example of commit created automatically by mm_gh_agent:
git commit -m "fix(#105): resolve chart tooltip clipping on mobile screens" \
  -m "- Adjusted boundary detection logic to dynamically calculate right/bottom margins
- Added responsive CSS overflow overrides for screens < 640px
- Verified layout across standard and dark theme modes" \
  -m "Co-authored-by: mm_vc_agent <agent@mm-automation.local>"
```

### Step 5: Live Testing & QA Iteration

You test on your local dev server (`npm run dev`). If you notice something minor:

```text
The tooltip looks great, but let's make the background slightly darker.
```

`mm_vc_agent` adjusts the color, and `mm_gh_agent` commits with an iteration summary, pushes to remote, and automatically posts an **Iteration Status Update comment** to the PR conversation:

```markdown
### 🤖 [mm_gh_agent for @mustafamalik] · Status Update

- **Iteration:** #2
- **Commit:** [`7d3d57b`](https://github.com/.../commit/7d3d57b)
- **Summary of Changes:**
  - Darkened tooltip background opacity to 0.95 for higher contrast
- **Status:** Awaiting User Validation
```

### Step 5: Getting Context in Long Chats

If you've had a long conversation and forgot the issue number:

```text
MM_GETISSUE
```

`mm_gh_agent` prints the active Issue `#105` and PR `#106` summary card with operator attribution.

### Step 6: Closing & Merging

Once tested and verified, type:

```text
MM_BUGFIXED #105
```

`mm_gh_agent` runs a pre-merge sanity check, squash-merges PR `#106`, closes Issue `#105`, checks out `main`, and runs `git pull`.

---

## 9. Governance & Safety: `--cautious` vs `--nocautious`

- **`--cautious` (Default / Maximum Safety)**:
  The agents will ask for your explicit confirmation before:
  1. Creating an Issue and Branch on GitHub.
  2. Modifying files in the workspace.
  3. Pushing code and opening a PR.
  4. Merging the PR to main.
- **`--nocautious` (Fast Execution)**:
  The agents will proceed autonomously from Plan approval directly to PR creation, stopping only when ready for your local manual testing.

---

## 10. Team Collaboration & Best Practices

1. **Clear Attribution**: All PRs and comments are tagged `[mm_gh_agent for @username]` or `[mm_vc_agent for @username]`, ensuring human teammates can immediately see agent contributions in the PR timeline.
2. **Never Commit Secrets**: Ensure `.env.mm_agent.local` remains in `.gitignore`.
3. **No Direct Pushes to Main**: All code must go through a branch and PR flow, preserving CI/CD integrity.
4. **Squash Merges**: Default squash-merging keeps your main branch git history clean and readable.

---

## 11. Uninstallation & Clean Removal Guide

If you ever wish to remove the MM Dual-Agent Suite from your project workspace, you can run the automated uninstaller:

```bash
npx mm-github-assist uninstall
```

### What Gets Removed (Identified by `mm_` Tags):

- ✅ Surgically strips injected MM shortcuts bounded by `/* MM_KEYBINDINGS_START */` and `/* MM_KEYBINDINGS_END */` from `.vscode/keybindings.json`.
- ✅ Deletes `.vscode/mm_snippets.code-snippets`.
- ✅ Removes all generated agent rules (`.cursor/rules/mm_dual_agent.mdc`, `.windsurfrules` MM blocks, `.agents/skills/mm_github_assist/`).
- ✅ Prompts to securely delete or archive `.env.mm_agent.local`.

### What Stays Untouched:

- 🛡️ Your source code, Git history, closed GitHub issues, and merged Pull Requests remain 100% intact and untouched.

---

## 12. Troubleshooting & FAQ

#### Q: `gh: command not found`

- **Fix**: Install GitHub CLI (`winget install GitHub.cli` or `brew install gh`), restart your terminal/IDE, and run `gh auth login`.

#### Q: `Authentication failed / Unauthorized`

- **Fix**: Run `gh auth status`. If expired, run `gh auth refresh -h github.com -s repo` or check your `GITHUB_TOKEN` in `.env.mm_agent.local`.

#### Q: `Git working tree is dirty / uncommitted changes`

- **Fix**: `mm_gh_agent` will warn you before switching branches. Stash your changes with `git stash` or commit them before starting a new `MM_BUG` or `MM_FEAT`.

#### Q: Can I use this with private repositories?

- **Yes!** As long as your GitHub account or PAT has access to the private repository, the suite operates identically.

#### Q: How do I change the default branch from `main` to `master` or `develop`?

- **Fix**: Configure `base_branch` in `.env.mm_agent.example` or pass `--base develop`.

---

## 📄 License

Released under the [MIT License](LICENSE). Built with ❤️ for the AI developer community.
