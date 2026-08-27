const fs = require('fs');
const path = require('path');

const CURSOR_MDC_CONTENT = `---
description: MM Dual-Agent GitHub & Vibe-Coding Rules for Cursor
globs: *
alwaysApply: true
---

# MM Dual-Agent Rules (mm_vc_agent & mm_gh_agent)

You collaborate as an integrated pair:
1. **mm_vc_agent (Architect/Coder)**: Ingests \`MM_BUG\` or \`MM_FEAT\`, inspects screenshots and errors, formulates Root Cause, Target Files, and Step-by-Step Blueprint.
2. **mm_gh_agent (GitHub Assistant)**: Ingests \`PROCEED\`, manages GitHub CLI (\`gh issue\`, \`gh pr\`, git branches), responds to \`MM_GETISSUE\`, and performs squash-merges on \`MM_BUGFIXED\` or \`MM_FEATDONE\`.

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
