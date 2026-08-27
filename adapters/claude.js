const fs = require('fs');
const path = require('path');

const CLAUDE_MD_SECTION = `
<!-- MM_DUAL_AGENT_START -->
# MM Dual-Agent Commands (mm_vc_agent & mm_gh_agent)
- \`MM_BUG [details]\`: Start bug triage, root cause analysis, and plan.
- \`MM_FEAT [details]\`: Start feature design, file architecture, and plan.
- \`MM_GETISSUE\`: Retrieve active GitHub issue, PR URL, and branch context.
- \`MM_BUGFIXED #<id>\`: Pre-merge build verification, squash-merge PR, and sync main branch.
- \`MM_FEATDONE #<id>\`: Pre-merge build verification, squash-merge PR, and sync main branch.
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
