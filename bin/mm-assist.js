#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Import Adapters
const antigravity = require('../adapters/antigravity');
const cursor = require('../adapters/cursor');
const claude = require('../adapters/claude');
const vscode = require('../adapters/vscode');
const windsurf = require('../adapters/windsurf');

const ADAPTERS = {
  antigravity,
  cursor,
  claude,
  vscode,
  windsurf
};

const args = process.argv.slice(2);
const command = args[0] || 'help';

function printBanner() {
  console.log('\n======================================================');
  console.log('  🚀 MM GitHub Assist Suite (mm_vc_agent & mm_gh_agent)');
  console.log('  Autonomous AI Pair-Programming & GitHub Assistant');
  console.log('  Crafted by Mustafa Malik (MM)');
  console.log('======================================================\n');
}

function checkGitAndGitHub(targetDir) {
  console.log('🔍 Checking environment prerequisites...');
  
  // Check Git
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: targetDir, stdio: 'ignore' });
    console.log('  ✅ Git repository detected.');
  } catch (e) {
    console.warn('  ⚠️ Warning: Current directory is not a Git repository. Run "git init" first.');
  }

  // Check GitHub CLI
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    console.log('  ✅ GitHub CLI (gh) is authenticated.');
  } catch (e) {
    console.log('  ℹ️ Note: GitHub CLI (gh) not logged in. You can run "gh auth login" or configure .env.mm_agent.local');
  }
}

function secureGitignore(targetDir) {
  const gitignorePath = path.join(targetDir, '.gitignore');
  const secretEntry = '.env.mm_agent.local';
  if (fs.existsSync(gitignorePath)) {
    let content = fs.readFileSync(gitignorePath, 'utf8');
    if (!content.includes(secretEntry)) {
      fs.appendFileSync(gitignorePath, `\n# MM Agent Secrets\n${secretEntry}\n`, 'utf8');
      console.log(`  🔒 Added ${secretEntry} to .gitignore.`);
    }
  }
}

function runInit(targetDir) {
  printBanner();
  console.log(`📦 Installing MM GitHub Assist into: ${targetDir}\n`);

  checkGitAndGitHub(targetDir);

  // Install all IDE adapters
  console.log('\n⚙️ Provisioning IDE Adapters and Agent Rules...');
  for (const [name, adapter] of Object.entries(ADAPTERS)) {
    try {
      adapter.install(targetDir);
      console.log(`  ✅ Installed adapter: ${name}`);
    } catch (err) {
      console.warn(`  ⚠️ Failed to install adapter ${name}: ${err.message}`);
    }
  }

  // Copy template .env.mm_agent.example if not exists
  const envExampleSource = path.join(__dirname, '..', 'templates', '.env.mm_agent.example');
  const envExampleDest = path.join(targetDir, '.env.mm_agent.example');
  if (fs.existsSync(envExampleSource) && !fs.existsSync(envExampleDest)) {
    fs.copyFileSync(envExampleSource, envExampleDest);
    console.log('  📄 Created .env.mm_agent.example template');
  }

  // Ensure gitignore protects secrets
  secureGitignore(targetDir);

  console.log('\n🎉 Setup complete! You are ready to vibe code.');
  console.log('\n💡 Quick Cheat Sheet:');
  console.log('  • MM_BUG [details]     ➔ Start bug investigation & plan');
  console.log('  • MM_FEAT [details]    ➔ Start feature design & plan');
  console.log('  • MM_GETISSUE          ➔ Check active issue # and PR link');
  console.log('  • MM_BUGFIXED #<id>    ➔ Verify & squash-merge bug PR');
  console.log('  • MM_FEATDONE #<id>    ➔ Verify & squash-merge feature PR');
  console.log('\n✨ Snippets: Type "mmbug", "mmfeat", "mmgetissue", "mmfix", "mmdone" + Tab in your editor.\n');
}

function runUninstall(targetDir) {
  printBanner();
  console.log(`🧹 Surgically removing MM GitHub Assist from: ${targetDir}\n`);

  for (const [name, adapter] of Object.entries(ADAPTERS)) {
    try {
      adapter.uninstall(targetDir);
      console.log(`  ✅ Removed adapter: ${name}`);
    } catch (err) {
      console.warn(`  ⚠️ Failed to cleanly remove ${name}: ${err.message}`);
    }
  }

  const envLocal = path.join(targetDir, '.env.mm_agent.local');
  if (fs.existsSync(envLocal)) {
    console.log('  ℹ️ Notice: .env.mm_agent.local was preserved for security. Delete manually if desired.');
  }

  console.log('\n✨ Uninstallation complete. Repository returned to pristine state.\n');
}

function printHelp() {
  printBanner();
  console.log('Usage:');
  console.log('  npx mm-github-assist init        Install MM Dual-Agent into current project');
  console.log('  npx mm-github-assist uninstall   Surgically remove MM Dual-Agent from current project');
  console.log('  npx mm-github-assist help        Show this help reference\n');
}

// Execution
const targetDirectory = process.cwd();

if (command === 'init' || command === 'install') {
  runInit(targetDirectory);
} else if (command === 'uninstall' || command === 'remove') {
  runUninstall(targetDirectory);
} else {
  printHelp();
}
