#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read current version from package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const currentVersion = packageJson.version;
const tagName = `v${currentVersion}`;

console.log(`🚀 Creating manual release for version: ${tagName}`);

try {
  // Check if gh CLI is installed
  execSync('gh --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ GitHub CLI (gh) is not installed. Please install it from: https://cli.github.com/');
  process.exit(1);
}

// Check if we're logged in to GitHub
try {
  execSync('gh auth status', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ You are not logged in to GitHub CLI. Please run: gh auth login');
  process.exit(1);
}

try {
  // Build Windows version (only works on Windows)
  console.log('🔨 Building Windows version...');
  execSync('npm run make', { stdio: 'inherit' });
  
  // Check if Windows build exists
  const windowsSetup = path.join(__dirname, '..', 'out', 'make', 'squirrel.windows', 'x64', `buddy-${currentVersion} Setup.exe`);
  if (!fs.existsSync(windowsSetup)) {
    throw new Error(`Windows setup file not found: ${windowsSetup}`);
  }
  
  console.log('✅ Windows build completed');

  // Create release notes
  const releaseNotes = `## Buddy Desktop ${tagName}

### Downloads
- **Windows**: Download \`buddy-setup.exe\` for Windows 10/11 (x64)
- **macOS**: macOS builds need to be created on macOS (use GitHub Actions for cross-platform builds)

### Installation
- **Windows**: Run the setup.exe file and follow the installation wizard

### What's New
- Bug fixes and improvements
- Enhanced performance

---
*This is a manual release from Windows. For full cross-platform releases, use GitHub Actions.*`;

  // Create GitHub release
  console.log('📦 Creating GitHub release...');
  execSync(`gh release create ${tagName} --title "Buddy Desktop ${tagName}" --notes "${releaseNotes}" "${windowsSetup}#buddy-setup.exe"`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log(`
✅ Manual release created successfully!

Release URL: https://github.com/chatbotde/buddydesktop/releases/tag/${tagName}

Note: This release only contains the Windows version. 
For macOS builds, either:
1. Use GitHub Actions (recommended)
2. Build on a macOS machine
  `);

} catch (error) {
  console.error('❌ Error creating manual release:', error.message);
  process.exit(1);
}
