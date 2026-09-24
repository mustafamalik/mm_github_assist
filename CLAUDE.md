
<!-- MM_DUAL_AGENT_START -->
# MM Dual-Agent Commands (mm_vc_agent & mm_gh_agent)
- `MM_BUG [details]`: Bug triage, root cause, interactive artifact plan. (Read-Only)
- `MM_FEAT [details]`: Feature design, architecture, interactive artifact plan. (Read-Only)
- `PROCEED` / `COMMIT` / `APPROVE`: Approve plan ➔ issue/branch created ➔ local edits ➔ **STOP FOR CODE REVIEW** ➔ approve diff ➔ commit & open PR.
- `MM_GETISSUE`: Active GitHub issue, PR URL, branch context (4-line card).
- `MM_BUGFIXED #<id>`: Pre-merge check, squash-merge PR, sync main.
- `MM_FEATDONE #<id>`: Pre-merge check, squash-merge PR, sync main.
- `MM_RELEASE <version>`: Pre-release gate, collision check, code-freeze branch, release PR.
- `MM_RELEASEDONE`: Squash-merge release PR (keep branch), tag version, publish GitHub Release.

## Token-Efficiency & Artifact-Pointer Protocol
1. Targeted Inspection: View max ≤80 lines per call (`StartLine`/`EndLine`).
2. Quiet Commands: Filter logs (`tsc --noEmit | head -n 25`, `npm test -- --bail | head -n 30`, `git diff --stat`, `git status -s`).
3. Zero Chat Echo: Store detailed blueprints and schemas in artifact files (`.md`).
4. Artifact-Pointer Pattern: Assistant responses point to line ranges in the artifact:
   ```markdown
   ### 📋 Blueprint Artifact Created
   - **Plan Artifact:** [Fix Blueprint](file:///path/to/artifact.md#L1-L80)
   - **Target Files:** `src/components/Example.tsx`
   - **Key Objective:** 1-2 line summary.
   - **Ready for Review:** Review, adjust, or reply `PROCEED`.
   ```
5. Developer Code Review Gate: Stop after local edits before commits/PR. Limit fix attempts to 2 max.
6. Session Reset: Start fresh chat after each PR merge (`MM_FEATDONE` / `MM_BUGFIXED`).
<!-- MM_DUAL_AGENT_END -->
