const fs = require('fs');
const path = require('path');

const CANONICAL_SKILL_PATH = path.join(__dirname, '..', '.agents', 'skills', 'mm_github_assist', 'SKILL.md');
const CANONICAL_AGENTS_DIR = path.join(__dirname, '..', '.agents', 'agents');

module.exports = {
  install(projectDir) {
    // 1. Clean up legacy skill directory if it exists from previous installations
    const legacySkillDir = path.join(projectDir, '.agents', 'skills', 'mm_dual_agent');
    if (fs.existsSync(legacySkillDir)) {
      try {
        fs.rmSync(legacySkillDir, { recursive: true, force: true });
      } catch (e) {}
    }

    // 2. Install mm_github_assist skill from canonical source
    const skillDir = path.join(projectDir, '.agents', 'skills', 'mm_github_assist');
    fs.mkdirSync(skillDir, { recursive: true });
    if (fs.existsSync(CANONICAL_SKILL_PATH)) {
      fs.copyFileSync(CANONICAL_SKILL_PATH, path.join(skillDir, 'SKILL.md'));
    }

    // 3. Install agent definitions from canonical source
    const agentsDir = path.join(projectDir, '.agents', 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });
    ['mm_vc_agent.json', 'mm_gh_agent.json'].forEach(agentFile => {
      const src = path.join(CANONICAL_AGENTS_DIR, agentFile);
      const dest = path.join(agentsDir, agentFile);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });
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
