const fs = require('fs');
const path = require('path');

const SNIPPETS = {
  "MM Bug Trigger": {
    "prefix": "mmbug",
    "body": [
      "MM_BUG: ${1:Describe bug symptoms, error message, or UI defect here}"
    ],
    "description": "Trigger mm_vc_agent to analyze bug and formulate fix plan"
  },
  "MM Feature Trigger": {
    "prefix": "mmfeat",
    "body": [
      "MM_FEAT: ${1:Describe feature requirements and scope here}"
    ],
    "description": "Trigger mm_vc_agent to design feature architecture and plan"
  },
  "MM Get Active Issue": {
    "prefix": "mmgetissue",
    "body": [
      "MM_GETISSUE"
    ],
    "description": "Query mm_gh_agent for current active Issue #, PR, and branch status"
  },
  "MM Bug Fixed Sign-off": {
    "prefix": "mmfix",
    "body": [
      "MM_BUGFIXED #${1:issue_number}"
    ],
    "description": "Signal QA passed for bug fix, squash-merge PR, and sync main branch"
  },
  "MM Feature Done Sign-off": {
    "prefix": "mmdone",
    "body": [
      "MM_FEATDONE #${1:issue_number}"
    ],
    "description": "Signal QA passed for feature, squash-merge PR, and sync main branch"
  }
};

module.exports = {
  install(projectDir) {
    const vscodeDir = path.join(projectDir, '.vscode');
    fs.mkdirSync(vscodeDir, { recursive: true });

    // 1. Snippets injection
    const snippetFile = path.join(vscodeDir, 'mm_snippets.code-snippets');
    fs.writeFileSync(snippetFile, JSON.stringify(SNIPPETS, null, 2), 'utf8');

    // 2. Keybindings injection with surgical comments if exists
    const keybindingsFile = path.join(vscodeDir, 'keybindings.json');
    let keybindings = [];
    if (fs.existsSync(keybindingsFile)) {
      try {
        keybindings = JSON.parse(fs.readFileSync(keybindingsFile, 'utf8'));
      } catch (e) {
        keybindings = [];
      }
    }
    const hasMmBinding = keybindings.some(k => k.command && k.command.startsWith('mm_'));
    if (!hasMmBinding) {
      keybindings.push({
        key: 'ctrl+alt+m',
        command: 'workbench.action.quickOpen',
        args: 'mmbug',
        when: 'editorTextFocus'
      });
      fs.writeFileSync(keybindingsFile, JSON.stringify(keybindings, null, 2), 'utf8');
    }
  },

  uninstall(projectDir) {
    const snippetFile = path.join(projectDir, '.vscode', 'mm_snippets.code-snippets');
    if (fs.existsSync(snippetFile)) {
      fs.unlinkSync(snippetFile);
    }

    const keybindingsFile = path.join(projectDir, '.vscode', 'keybindings.json');
    if (fs.existsSync(keybindingsFile)) {
      try {
        let keybindings = JSON.parse(fs.readFileSync(keybindingsFile, 'utf8'));
        keybindings = keybindings.filter(k => !(k.command && k.command.startsWith('mm_')) && k.key !== 'ctrl+alt+m');
        fs.writeFileSync(keybindingsFile, JSON.stringify(keybindings, null, 2), 'utf8');
      } catch (e) {}
    }
  }
};
