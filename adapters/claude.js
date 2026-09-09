const fs = require('fs');
const path = require('path');

const CLAUDE_MD_SECTION = `
<!-- MM_DUAL_AGENT_START -->
# MM Dual-Agent Commands (mm_vc_agent & mm_gh_agent)
- \`MM_ON\` / \`MM_ENABLE\`: Activate MM automated workflow.
- \`MM_OFF\` / \`MM_DISABLE\`: Pause MM automated workflow for standard chat.
- \`MM_BUG [details]\`: (Phase 1) Start bug triage, root cause analysis & plan. STRICTLY READ-ONLY: Do not modify files or create branches/issues. Yield turn for developer alignment.
- \`MM_FEAT [details]\`: (Phase 1) Start feature design, file architecture & plan. STRICTLY READ-ONLY: Do not modify files or create branches/issues. Yield turn for developer alignment.
- \`PROCEED\`: (Phase 2) Developer approval. mm_gh_agent creates Issue & branch; mm_vc_agent applies edits; mm_gh_agent commits with detailed bulleted summaries, pushes, and opens PR for QA. Iteration commits must log progress comments on PR.
- \`MM_GETISSUE\`: Retrieve active GitHub issue, PR URL, and branch context.
- \`MM_BUGFIXED #<id>\`: (Phase 3) Pre-merge build verification, squash-merge PR, and sync main branch.
- \`MM_FEATDONE #<id>\`: (Phase 3) Pre-merge build verification, squash-merge PR, and sync main branch.
<!-- MM_DUAL_AGENT_END -->
`;

module.exports = {
  install(projectDir) {
    const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
    let content = fs.existsSync(claudeMdPath) ? fs.readFileSync(claudeMdPath, 'utf8') : '';
    if (!content.includes('MM_DUAL_AGENT_START')) {
      content += '\n' + CLAUDE_MD_SECTION.trim() + '\n';
      fs.writeFileSync(claudeMdPath, content, 'utf8');
    }

    const skillsDir = path.join(projectDir, '.claude', 'skills', 'mm_github_ops');
    fs.mkdirSync(skillsDir, { recursive: true });
    fs.writeFileSync(
      path.join(skillsDir, 'SKILL.md'),
      `# MM GitHub Ops Skill\nProvides gh CLI issue/PR lifecycle management for mm_gh_agent.`,
      'utf8'
    );
  },

  uninstall(projectDir) {
    const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
    if (fs.existsSync(claudeMdPath)) {
      let content = fs.readFileSync(claudeMdPath, 'utf8');
      const startTag = '<!-- MM_DUAL_AGENT_START -->';
      const endTag = '<!-- MM_DUAL_AGENT_END -->';
      const startIndex = content.indexOf(startTag);
      const endIndex = content.indexOf(endTag);
      if (startIndex !== -1 && endIndex !== -1) {
        content = content.slice(0, startIndex) + content.slice(endIndex + endTag.length);
        fs.writeFileSync(claudeMdPath, content.trim() + '\n', 'utf8');
      }
    }
    const skillsDir = path.join(projectDir, '.claude', 'skills', 'mm_github_ops');
    if (fs.existsSync(skillsDir)) {
      fs.rmSync(skillsDir, { recursive: true, force: true });
    }
  }
};
