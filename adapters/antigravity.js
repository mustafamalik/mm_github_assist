const fs = require('fs');
const path = require('path');

const SKILL_MD_CONTENT = `---
name: mm_dual_agent
description: Autonomous pair-programming & GitHub assistant (mm_vc_agent & mm_gh_agent) for bugs, features, issue tracking, and PR lifecycle management.
---

# MM Dual-Agent Guidelines (mm_vc_agent & mm_gh_agent)

When the user types \`MM_BUG\`, \`MM_FEAT\`, \`MM_GETISSUE\`, \`MM_BUGFIXED\`, or \`MM_FEATDONE\`, follow the dual-agent lifecycle:

## 1. Roles & Identities
- **mm_vc_agent**: Analyzes screenshots/logs, identifies root causes, architects solutions, applies code changes, and runs local linters.
- **mm_gh_agent**: Handles GitHub CLI operations (\`gh issue\`, \`gh pr\`, \`git checkout -b\`), logs iteration notes with developer attribution, and squash-merges on completion.

## 2. Command Trigger Matrix
- \`MM_BUG [details]\`: Formulate Root Cause, Target Files, and Step-by-Step Blueprint.
- \`MM_FEAT [details]\`: Formulate Architectural Spec, Target Files, and Implementation Blueprint.
- \`MM_GETISSUE\`: Print active Issue #, PR URL, active branch, and status card.
- \`MM_BUGFIXED #<id>\`: Run pre-merge check, squash-merge PR, close issue, checkout base branch, and git pull.
- \`MM_FEATDONE #<id>\`: Run pre-merge check, squash-merge PR, close issue, checkout base branch, and git pull.

## 3. Governance
- Default to \`--cautious\` mode: Ask for explicit user confirmation before creating issues, editing code, or merging.
`;

module.exports = {
  install(projectDir) {
    const skillDir = path.join(projectDir, '.agents', 'skills', 'mm_dual_agent');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), SKILL_MD_CONTENT, 'utf8');

    const agentsDir = path.join(projectDir, '.agents', 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });
    fs.writeFileSync(
      path.join(agentsDir, 'mm_vc_agent.json'),
      JSON.stringify({ name: 'mm_vc_agent', role: 'Vibe Code Architect', model: 'gemini-2.5-pro' }, null, 2),
      'utf8'
    );
    fs.writeFileSync(
      path.join(agentsDir, 'mm_gh_agent.json'),
      JSON.stringify({ name: 'mm_gh_agent', role: 'GitHub Assistant', tools: ['gh', 'git'] }, null, 2),
      'utf8'
    );
  },

  uninstall(projectDir) {
    const skillDir = path.join(projectDir, '.agents', 'skills', 'mm_dual_agent');
    if (fs.existsSync(skillDir)) {
      fs.rmSync(skillDir, { recursive: true, force: true });
    }
    const vcAgent = path.join(projectDir, '.agents', 'agents', 'mm_vc_agent.json');
    const ghAgent = path.join(projectDir, '.agents', 'agents', 'mm_gh_agent.json');
    if (fs.existsSync(vcAgent)) fs.unlinkSync(vcAgent);
    if (fs.existsSync(ghAgent)) fs.unlinkSync(ghAgent);
  }
};
