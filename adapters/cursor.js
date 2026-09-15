const fs = require('fs');
const path = require('path');

const CANONICAL_CURSOR_MDC = path.join(__dirname, '..', '.cursor', 'rules', 'mm_dual_agent.mdc');

module.exports = {
  install(projectDir) {
    const rulesDir = path.join(projectDir, '.cursor', 'rules');
    fs.mkdirSync(rulesDir, { recursive: true });
    if (fs.existsSync(CANONICAL_CURSOR_MDC)) {
      fs.copyFileSync(CANONICAL_CURSOR_MDC, path.join(rulesDir, 'mm_dual_agent.mdc'));
    }
  },

  uninstall(projectDir) {
    const mdcPath = path.join(projectDir, '.cursor', 'rules', 'mm_dual_agent.mdc');
    if (fs.existsSync(mdcPath)) {
      fs.unlinkSync(mdcPath);
    }
  }
};
