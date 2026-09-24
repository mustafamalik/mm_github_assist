# MM Dual-Agent Project Guidelines

This project is enabled with the **MM Dual-Agent Suite** (`mm_vc_agent` & `mm_gh_agent`).

## 1. Quick Command Reference
* `MM_BUG [details]`: Bug investigation, root cause, interactive artifact plan. (Read-Only)
* `MM_FEAT [details]`: Feature architecture design, interactive artifact plan. (Read-Only)
* `PROCEED` / `COMMIT` / `APPROVE`: Approve plan ➔ issue/branch created ➔ local edits ➔ **STOP FOR CODE REVIEW** ➔ approve diff ➔ commit & open PR.
* `MM_GETISSUE`: Active issue #, PR link (4-line card).
* `MM_BUGFIXED #<id>`: Merge bug fix, close issue.
* `MM_FEATDONE #<id>`: Merge feature, close issue.
* `MM_RELEASE <version>`: Pre-release gate, collision check, code-freeze branch, release PR.
* `MM_RELEASEDONE`: Squash-merge release PR (keep branch), tag version on main, publish GitHub Release.

## 2. Governance Flags
* `--cautious`: step-by-step confirmation prompts.
* `--nocautious`: streamlined flow.

## 3. Token-Efficiency & Artifact Pointer Protocol
1. **Targeted Inspections**: Limit `view_file` to ≤80 lines (`StartLine`/`EndLine`).
2. **Quiet Commands**: Filter verbose logs (`tsc --noEmit | head -n 25`, `npm test -- --bail | head -n 30`, `git diff --stat`, `git status -s`).
3. **Artifact-Pointer Pattern (Zero Chat Echo)**:
   - Detailed plans/schemas live in the artifact markdown file.
   - Initial plan creation and updates point directly to line ranges in the artifact:
     ```markdown
     ### 📋 Blueprint Artifact Created
     - **Plan Artifact:** [Fix Blueprint](file:///path/to/artifact.md#L1-L80)
     - **Target Files:** `src/components/Example.tsx`
     - **Key Objective:** 1-2 line summary.
     - **Ready for Review:** Review, adjust, or reply `PROCEED`.
     ```
4. **Developer Code Review Gate**: Stop after local edits before commits/PR. Limit fix attempts to 2 max.
5. **Session Boundary**: Start a fresh chat session after every PR merge (`MM_FEATDONE` / `MM_BUGFIXED`) to discard historical transcript tokens.

