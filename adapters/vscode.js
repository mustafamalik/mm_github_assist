const fs = require('fs');
const path = require('path');

const CANONICAL_SNIPPETS = path.join(__dirname, '..', '.vscode', 'mm_snippets.code-snippets');

module.exports = {
  install(projectDir) {
    const vscodeDir = path.join(projectDir, '.vscode');
    fs.mkdirSync(vscodeDir, { recursive: true });

    // 1. Snippets injection from canonical source
    const snippetFile = path.join(vscodeDir, 'mm_snippets.code-snippets');
    if (fs.existsSync(CANONICAL_SNIPPETS)) {
      fs.copyFileSync(CANONICAL_SNIPPETS, snippetFile);
    }

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
