const fs = require('fs');
const path = require('path');

const CANONICAL_CLAUDE_MD = path.join(__dirname, '..', 'CLAUDE.md');
const CANONICAL_CLAUDE_SKILL = path.join(__dirname, '..', '.claude', 'skills', 'mm_github_ops', 'SKILL.md');

function getClaudeSection() {
  if (fs.existsSync(CANONICAL_CLAUDE_MD)) {
    return fs.readFileSync(CANONICAL_CLAUDE_MD, 'utf8').trim();
  }
  return '';
}

module.exports = {
  install(projectDir) {
    const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
    let content = fs.existsSync(claudeMdPath) ? fs.readFileSync(claudeMdPath, 'utf8') : '';
    const section = getClaudeSection();
    const startTag = '<!-- MM_DUAL_AGENT_START -->';
    const endTag = '<!-- MM_DUAL_AGENT_END -->';

    if (section) {
      if (content.includes(startTag) && content.includes(endTag)) {
        const startIndex = content.indexOf(startTag);
        const endIndex = content.indexOf(endTag) + endTag.length;
        content = content.slice(0, startIndex) + section + content.slice(endIndex);
        fs.writeFileSync(claudeMdPath, content, 'utf8');
      } else {
        content = content ? content.trim() + '\n\n' + section + '\n' : section + '\n';
        fs.writeFileSync(claudeMdPath, content, 'utf8');
      }
    }

    const skillsDir = path.join(projectDir, '.claude', 'skills', 'mm_github_ops');
    fs.mkdirSync(skillsDir, { recursive: true });
    if (fs.existsSync(CANONICAL_CLAUDE_SKILL)) {
      fs.copyFileSync(CANONICAL_CLAUDE_SKILL, path.join(skillsDir, 'SKILL.md'));
    }
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
