#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read current version from package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const currentVersion = packageJson.version;

console.log(`📦 Current version: ${currentVersion}`);

// Ask for new version or use current
const args = process.argv.slice(2);
const newVersion = args[0] || currentVersion;
const tagName = `v${newVersion}`;

console.log(`🏷️  Creating release: ${tagName}`);

try {
  // Update package.json version if different
  if (newVersion !== currentVersion) {
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4));
    console.log(`✅ Updated package.json version to ${newVersion}`);
    
    // Commit version change
    execSync('git add package.json', { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
  }

  // Create and push tag
  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  console.log(`✅ Created tag: ${tagName}`);

  execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
  console.log(`✅ Pushed tag: ${tagName}`);

  console.log(`
🚀 Release process started!

The GitHub Actions workflow will now:
1. Build Windows version (x64)
2. Build macOS version (x64 and ARM64) 
3. Create a GitHub release with all installers

Check the progress at: https://github.com/chatbotde/buddydesktop/actions

The release will be available at: https://github.com/chatbotde/buddydesktop/releases
  `);

} catch (error) {
  console.error('❌ Error creating release:', error.message);
  process.exit(1);
}
