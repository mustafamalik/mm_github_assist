const fs = require('fs');
const path = require('path');

const WINDSURF_SECTION = `
<!-- MM_RULES_START -->
# MM Dual-Agent Rules (mm_vc_agent & mm_gh_agent)
- \`MM_BUG [details]\`: Start bug triage, root cause analysis, and plan.
- \`MM_FEAT [details]\`: Start feature design, file architecture, and plan.
- \`MM_GETISSUE\`: Retrieve active GitHub issue, PR URL, and branch context.
- \`MM_BUGFIXED #<id>\`: Pre-merge build verification, squash-merge PR, and sync main branch.
- \`MM_FEATDONE #<id>\`: Pre-merge build verification, squash-merge PR, and sync main branch.
<!-- MM_RULES_END -->
`;

module.exports = {
  install(projectDir) {
    const rulesFile = path.join(projectDir, '.windsurfrules');
    let content = fs.existsSync(rulesFile) ? fs.readFileSync(rulesFile, 'utf8') : '';
    if (!content.includes('MM_RULES_START')) {
      content += '\n' + WINDSURF_SECTION.trim() + '\n';
      fs.writeFileSync(rulesFile, content, 'utf8');
    }
  },

  uninstall(projectDir) {
    const rulesFile = path.join(projectDir, '.windsurfrules');
    if (fs.existsSync(rulesFile)) {
      let content = fs.readFileSync(rulesFile, 'utf8');
      const startTag = '<!-- MM_RULES_START -->';
      const endTag = '<!-- MM_RULES_END -->';
      const startIndex = content.indexOf(startTag);
      const endIndex = content.indexOf(endTag);
      if (startIndex !== -1 && endIndex !== -1) {
        content = content.slice(0, startIndex) + content.slice(endIndex + endTag.length);
        fs.writeFileSync(rulesFile, content.trim() + '\n', 'utf8');
      }
    }
  }
};
