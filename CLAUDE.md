
<!-- MM_DUAL_AGENT_START -->
# MM Dual-Agent Commands (mm_vc_agent & mm_gh_agent)
- `MM_BUG [details]`: Bug triage, root cause, plan.
- `MM_FEAT [details]`: Feature design, file architecture, plan.
- `MM_GETISSUE`: Active GitHub issue, PR URL, branch context.
- `MM_BUGFIXED #<id>`: Pre-merge check, squash-merge PR, sync main.
- `MM_FEATDONE #<id>`: Pre-merge check, squash-merge PR, sync main.
- `MM_RELEASE <version>`: Pre-release gate, collision check, code-freeze branch, release PR.
- `MM_RELEASEDONE`: Squash-merge release PR (keep branch), tag version, publish GitHub Release.

## Token-Efficiency & Artifact-Pointer Protocol
1. Targeted Inspection: View max ≤80 lines per call (`StartLine`/`EndLine`).
2. Quiet Commands: Filter logs (`tsc --noEmit | head -n 25`, `git diff --stat`).
3. Zero Chat Echo: Store detailed blueprints and schemas in artifact files (`.md`).
4. Artifact-Pointer Pattern: Assistant responses point to line ranges in the artifact:
   ```markdown
   ### 📋 Artifact Updated
   - **Updated Section:** 
     - [Step 2.3: Logic](file:///path/to/artifact.md#L85-L120)
   - **Key Changes Summary:**
     - Bulleted delta summary.
   - **Ready for Review:** Review or Proceed?
   ```
5. Session Reset: Start fresh chat after each PR merge (`MM_FEATDONE` / `MM_BUGFIXED`).
<!-- MM_DUAL_AGENT_END -->
