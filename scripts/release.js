const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read package.json to get current version
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`🚀 Starting release process for version ${currentVersion}`);

// Step 1: Build the application
console.log('\n📦 Building application...');
try {
    execSync('npm run make', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// Step 2: Create git tag
console.log('\n🏷️  Creating git tag...');
try {
    execSync(`git tag v${currentVersion}`, { stdio: 'inherit' });
    console.log('✅ Git tag created successfully');
} catch (error) {
    console.error('❌ Failed to create git tag:', error.message);
    process.exit(1);
}

// Step 3: Push tag to GitHub
console.log('\n📤 Pushing tag to GitHub...');
try {
    execSync(`git push origin v${currentVersion}`, { stdio: 'inherit' });
    console.log('✅ Tag pushed to GitHub successfully');
} catch (error) {
    console.error('❌ Failed to push tag:', error.message);
    process.exit(1);
}

// Step 4: Publish to GitHub releases
console.log('\n📋 Publishing to GitHub releases...');
try {
    execSync('npm run publish', { stdio: 'inherit' });
    console.log('✅ Published to GitHub releases successfully');
} catch (error) {
    console.error('❌ Failed to publish to GitHub:', error.message);
    process.exit(1);
}

console.log(`\n🎉 Release v${currentVersion} completed successfully!`);
console.log('📝 Next steps:');
console.log('1. Go to your GitHub repository');
console.log('2. Navigate to the "Releases" section');
console.log('3. Edit the draft release');
console.log('4. Add release notes and description');
console.log('5. Publish the release');












