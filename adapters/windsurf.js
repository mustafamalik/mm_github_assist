const fs = require('fs');
const path = require('path');

const WINDSURF_SECTION = `
<!-- MM_RULES_START -->
# MM Dual-Agent Rules (mm_vc_agent & mm_gh_agent)
- \`MM_ON\` / \`MM_ENABLE\`: Activate MM automated workflow.
- \`MM_OFF\` / \`MM_DISABLE\`: Pause MM automated workflow for standard chat.
- \`MM_BUG [details]\`: (Phase 1) Ingest bug details, analyze root cause, list target files & plan. STRICTLY READ-ONLY: Do not modify files or create branches/issues. Yield turn for developer alignment.
- \`MM_FEAT [details]\`: (Phase 1) Ingest feature spec, plan architecture & target files. STRICTLY READ-ONLY: Do not modify files or create branches/issues. Yield turn for developer alignment.
- \`PROCEED\`: (Phase 2) Developer approval. mm_gh_agent creates Issue & branch; mm_vc_agent applies edits; mm_gh_agent commits with detailed bulleted summaries, pushes, and opens PR for QA. Iteration commits must log progress comments on PR.
- \`MM_GETISSUE\`: Retrieve active GitHub issue, PR URL, and branch context.
- \`MM_BUGFIXED #<id>\`: (Phase 3) Pre-merge build verification, squash-merge PR, and sync main branch.
- \`MM_FEATDONE #<id>\`: (Phase 3) Pre-merge build verification, squash-merge PR, and sync main branch.
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
