const fs = require('fs');
const path = require('path');

const SKILL_MD_CONTENT = `---
name: mm_github_assist
description: Autonomous pair-programming & GitHub assistant (mm_vc_agent & mm_gh_agent) for bugs, features, issue tracking, and PR lifecycle management.
---

# MM Dual-Agent Guidelines (mm_vc_agent & mm_gh_agent)

When the user types \`MM_BUG\`, \`MM_FEAT\`, \`PROCEED\`, \`MM_GETISSUE\`, \`MM_BUGFIXED\`, \`MM_FEATDONE\`, \`MM_ON\`, or \`MM_OFF\`, follow the dual-agent lifecycle:

## 1. Suite State Controls
- \`MM_ON\` / \`MM_ENABLE\`: Activates the MM agent workflow.
- \`MM_OFF\` / \`MM_DISABLE\`: Pauses the MM agent workflow, returning to standard unconstrained AI chat.

## 2. Collaborative Plan Alignment Protocol (Strict 3-Phase Lifecycle)

### Phase 1: Pre-Execution Alignment Loop (Read-Only Analysis)
1. Upon \`MM_BUG [details]\` or \`MM_FEAT [details]\`:
   - \`mm_vc_agent\` analyzes screenshots, logs, and inspects repository files in **READ-ONLY** mode.
   - Outputs:
     - 🔍 **Root Cause Analysis** (for bug) or **Architectural Spec** (for feature)
     - 🎯 **Target Files** (list of files to touch)
     - 🛠️ **Step-by-Step Execution Blueprint**
2. **🛑 CRITICAL EXECUTION BARRIER (Hard Stop):**
   - **DO NOT** edit, create, or delete any files.
   - **DO NOT** create git branches, commits, GitHub issues, or PRs.
   - **DO NOT** call modification tools.
   - **YOU MUST END YOUR TURN IMMEDIATELY** with a prompt asking for developer review, file adjustments, or explicit \`PROCEED\` consent.
3. **Interactive Refinement**: If the developer suggests file changes or scope adjustments, update the plan and yield back again.

### Phase 2: Execution & PR Provisioning (Triggered by \`PROCEED\`)
1. Only when the developer explicitly types \`PROCEED\` (or gives explicit approval to proceed):
   - \`mm_gh_agent\` creates the official GitHub Issue embedding the final aligned blueprint.
   - \`mm_gh_agent\` creates and checks out the branch \`fix/<issue-id>-<operator>-<slug>\` (or \`feat/...\`).
   - \`mm_vc_agent\` implements the code modifications and executes local validation/tests.
   - \`mm_gh_agent\` commits, pushes, and opens a Pull Request (\`Closes #<issue-id>\`).
   - Yields back to the developer for **Live Local QA Testing**.

### Phase 3: QA Sign-off & Sync (Triggered by \`MM_BUGFIXED\` / \`MM_FEATDONE\`)
1. When developer types \`MM_BUGFIXED #<id>\` or \`MM_FEATDONE #<id>\`:
   - \`mm_gh_agent\` runs pre-merge sanity checks.
   - \`mm_gh_agent\` squash-merges the PR, closes the Issue, deletes the remote branch, switches to default branch (\`main\`), and executes \`git pull\`.

## 3. Roles & Identities (When Active)
- **mm_vc_agent**: Analyzes screenshots/logs, identifies root causes, architects solutions, negotiates plans, applies code changes, and runs local linters.
- **mm_gh_agent**: Handles GitHub CLI operations (\`gh issue\`, \`gh pr\`, \`git checkout -b\`), logs iteration notes with developer attribution, and squash-merges on completion.

## 4. Command Trigger Matrix
- \`MM_BUG [details]\`: Formulate Root Cause, Target Files, and Blueprint. **(READ-ONLY -> STOP TURN)**.
- \`MM_FEAT [details]\`: Formulate Architectural Spec, Target Files, and Blueprint. **(READ-ONLY -> STOP TURN)**.
- \`PROCEED\`: Developer approval to create Issue, checkout branch, apply edits, and open PR.
- \`MM_GETISSUE\`: Print active Issue #, PR URL, active branch, and status card.
- \`MM_BUGFIXED #<id>\`: Run pre-merge check, squash-merge PR, close issue, checkout base branch, and git pull.
- \`MM_FEATDONE #<id>\`: Run pre-merge check, squash-merge PR, close issue, checkout base branch, and git pull.

## 5. Governance
- Default to \`--cautious\` mode: Ask for explicit user confirmation before creating issues, editing code, or merging.
`;

module.exports = {
  install(projectDir) {
    // 1. Clean up legacy skill directory if it exists from previous installations
    const legacySkillDir = path.join(projectDir, '.agents', 'skills', 'mm_dual_agent');
    if (fs.existsSync(legacySkillDir)) {
      try {
        fs.rmSync(legacySkillDir, { recursive: true, force: true });
      } catch (e) {}
    }

    // 2. Install mm_github_assist skill
    const skillDir = path.join(projectDir, '.agents', 'skills', 'mm_github_assist');
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
    const skillDir = path.join(projectDir, '.agents', 'skills', 'mm_github_assist');
    if (fs.existsSync(skillDir)) {
      fs.rmSync(skillDir, { recursive: true, force: true });
    }
    const vcAgent = path.join(projectDir, '.agents', 'agents', 'mm_vc_agent.json');
    const ghAgent = path.join(projectDir, '.agents', 'agents', 'mm_gh_agent.json');
    if (fs.existsSync(vcAgent)) fs.unlinkSync(vcAgent);
    if (fs.existsSync(ghAgent)) fs.unlinkSync(ghAgent);
  }
};
