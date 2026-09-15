const fs = require('fs');
const path = require('path');

const CANONICAL_WINDSURF_RULES = path.join(__dirname, '..', '.windsurfrules');

function getWindsurfSection() {
  if (fs.existsSync(CANONICAL_WINDSURF_RULES)) {
    return fs.readFileSync(CANONICAL_WINDSURF_RULES, 'utf8').trim();
  }
  return '';
}

module.exports = {
  install(projectDir) {
    const rulesFile = path.join(projectDir, '.windsurfrules');
    let content = fs.existsSync(rulesFile) ? fs.readFileSync(rulesFile, 'utf8') : '';
    const section = getWindsurfSection();
    const startTag = '<!-- MM_RULES_START -->';
    const endTag = '<!-- MM_RULES_END -->';

    if (section) {
      if (content.includes(startTag) && content.includes(endTag)) {
        const startIndex = content.indexOf(startTag);
        const endIndex = content.indexOf(endTag) + endTag.length;
        content = content.slice(0, startIndex) + section + content.slice(endIndex);
        fs.writeFileSync(rulesFile, content, 'utf8');
      } else {
        content = content ? content.trim() + '\n\n' + section + '\n' : section + '\n';
        fs.writeFileSync(rulesFile, content, 'utf8');
      }
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
