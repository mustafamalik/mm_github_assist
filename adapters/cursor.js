const fs = require('fs');
const path = require('path');

const CURSOR_MDC_CONTENT = `---
description: MM Dual-Agent GitHub & Vibe-Coding Rules for Cursor
globs: *
alwaysApply: true
---

# MM Dual-Agent Rules (mm_vc_agent & mm_gh_agent)

## State Controls
- \`MM_ON\` / \`MM_ENABLE\`: Activates automated agent pair workflows.
- \`MM_OFF\` / \`MM_DISABLE\`: Pauses agent workflows for standard chat.

## Collaborative Plan Alignment Protocol (Strict 3-Phase Lifecycle)

### Phase 1: Pre-Execution Alignment Loop (Read-Only Analysis)
1. Upon \`MM_BUG\` or \`MM_FEAT\`, \`mm_vc_agent\` analyzes screenshots/logs and outputs Root Cause/Spec, Target Files, and Blueprint.
2. **🛑 CRITICAL BARRIER (Hard Stop)**: Do NOT create git branches, commits, issues, PRs, or modify any files. **END TURN IMMEDIATELY** and await developer alignment or \`PROCEED\`.

### Phase 2: Execution & PR Provisioning (Triggered by \`PROCEED\`)
1. When developer types \`PROCEED\`:
   - \`mm_gh_agent\` creates GitHub Issue with the final blueprint and checks out branch.
   - \`mm_vc_agent\` applies code changes and runs local validation.
   - \`mm_gh_agent\` commits with multi-line message (subject + bulleted change details + co-author), pushes, and creates PR (\`Closes #<id>\`).
   - For review iterations, \`mm_gh_agent\` writes detailed commit summaries and logs PR status comments.
   - Yields back for Live Local QA Testing.

### Phase 3: QA Sign-off & Sync (Triggered by \`MM_BUGFIXED\` / \`MM_FEATDONE\`)
1. On \`MM_BUGFIXED #<id>\` or \`MM_FEATDONE #<id>\`:
   - \`mm_gh_agent\` verifies build, squash-merges PR, closes Issue, switches to \`main\`, and pulls latest.

## Release Lifecycle Protocol (MM_RELEASE)
- \`MM_RELEASE <version>\`: Pre-release gate, collision check, code-freeze branch, and release candidate PR.
- \`MM_RELEASEDONE\`: Squash-merge release PR, tag version on \`main\`, and publish GitHub Release.

Always request confirmation at critical transitions unless \`--nocautious\` is specified.
`;

module.exports = {
  install(projectDir) {
    const rulesDir = path.join(projectDir, '.cursor', 'rules');
    fs.mkdirSync(rulesDir, { recursive: true });
    fs.writeFileSync(path.join(rulesDir, 'mm_dual_agent.mdc'), CURSOR_MDC_CONTENT, 'utf8');
  },

  uninstall(projectDir) {
    const mdcPath = path.join(projectDir, '.cursor', 'rules', 'mm_dual_agent.mdc');
    if (fs.existsSync(mdcPath)) {
      fs.unlinkSync(mdcPath);
    }
  }
};
