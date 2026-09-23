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
