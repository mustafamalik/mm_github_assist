# MM Dual-Agent Project Guidelines

This project is enabled with the **MM Dual-Agent Suite** (`mm_vc_agent` & `mm_gh_agent`).

## 1. Quick Command Reference
* `MM_BUG [details]`: Bug investigation, root cause, plan.
* `MM_FEAT [details]`: Feature architecture design, plan.
* `MM_GETISSUE`: Active issue #, PR link.
* `MM_BUGFIXED #<id>`: Merge bug fix, close issue.
* `MM_FEATDONE #<id>`: Merge feature, close issue.
* `MM_RELEASE <version>`: Pre-release gate, collision check, code-freeze branch, release PR.
* `MM_RELEASEDONE`: Squash-merge release PR (keep branch), tag version on main, publish GitHub Release.

## 2. Governance Flags
* `--cautious`: step-by-step confirmation prompts.
* `--nocautious`: streamlined flow.

## 3. Token-Efficiency & Artifact Pointer Protocol
1. **Targeted Inspections**: Limit `view_file` to ≤80 lines (`StartLine`/`EndLine`).
2. **Quiet Commands**: Filter verbose logs (`tsc --noEmit | head -n 25`, `git diff --stat`).
3. **Artifact-Pointer Pattern (Zero Chat Echo)**:
   - Detailed plans/schemas live in the artifact markdown file.
   - Assistant responses point directly to line ranges in the artifact:
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
4. **Session Boundary**: Start a fresh chat session after every PR merge (`MM_FEATDONE` / `MM_BUGFIXED`) to discard historical transcript tokens.

