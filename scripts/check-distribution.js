#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🎯 Buddy Desktop Distribution Status');
console.log('=====================================\n');

// Read version
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

console.log(`📦 Current Version: v${version}\n`);

// Check local builds
const outDir = path.join(__dirname, '..', 'out', 'make');
if (fs.existsSync(outDir)) {
  console.log('💻 Available Local Builds:');
  
  const windowsSetup = path.join(outDir, 'squirrel.windows', 'x64', `buddy-${version} Setup.exe`);
  const oldWindowsSetup = path.join(outDir, 'squirrel.windows', 'x64', 'buddy-0.1.7 Setup.exe');
  
  if (fs.existsSync(windowsSetup)) {
    const stats = fs.statSync(windowsSetup);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    console.log(`  ✅ Windows: buddy-${version} Setup.exe (${sizeMB} MB)`);
  } else if (fs.existsSync(oldWindowsSetup)) {
    const stats = fs.statSync(oldWindowsSetup);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    console.log(`  ✅ Windows: buddy-0.1.7 Setup.exe (${sizeMB} MB) [Older version]`);
  } else {
    console.log('  ❌ Windows: Not built locally');
  }
  
  console.log('  ⏳ macOS: Built via GitHub Actions only\n');
} else {
  console.log('❌ No local builds found. Run: npm run make\n');
}

// Distribution links
console.log('🌐 Distribution Links:');
console.log(`  📋 Releases Page: https://github.com/chatbotde/buddydesktop/releases`);
console.log(`  📥 Windows: https://github.com/chatbotde/buddydesktop/releases/latest/download/buddy-setup.exe`);
console.log(`  📥 Mac Intel: https://github.com/chatbotde/buddydesktop/releases/latest/download/buddy-mac-x64.dmg`);
console.log(`  📥 Mac ARM64: https://github.com/chatbotde/buddydesktop/releases/latest/download/buddy-mac-arm64.dmg\n`);

// Next steps
console.log('🚀 What to do now:');
console.log('  1. Visit: https://github.com/chatbotde/buddydesktop/releases');
console.log('  2. Check if v' + version + ' release is available');
console.log('  3. Share the download links with your users');
console.log('  4. Monitor download stats and user feedback\n');

console.log('💡 Quick sharing message:');
console.log(`"🎉 Buddy Desktop v${version} is now available!"`);
console.log(`"📥 Download: https://github.com/chatbotde/buddydesktop/releases"`);
console.log(`"✅ Windows & Mac support"`);
console.log(`"🤖 AI-powered interview assistant"`);
