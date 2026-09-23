# MM Dual-Agent Project Guidelines

This project is enabled with the **MM Dual-Agent Suite** (`mm_vc_agent` & `mm_gh_agent`).

## 1. Quick Command Reference
* `MM_BUG [details]`: Start bug investigation with root cause and plan.
* `MM_FEAT [details]`: Start new feature architectural design and plan.
* `MM_GETISSUE`: Check current active issue # and PR link.
* `MM_BUGFIXED #<id>`: Merge bug fix and close issue.
* `MM_FEATDONE #<id>`: Merge feature and close issue.
* `MM_RELEASE <version>`: Initiate pre-release gate, collision check, code-freeze branch, and release candidate PR.
* `MM_RELEASEDONE`: Squash-merge release PR, tag version on main, and publish GitHub Release. **After merge DO NOT delete release branch**

## 2. Governance Flags
* Pass `--cautious` for step-by-step confirmation prompts.
* Pass `--nocautious` for streamlined flow.
