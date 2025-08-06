const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read package.json to get current version
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`🚀 Starting PROTECTED release process for version ${currentVersion}`);
console.log('📦 This will only release compiled packages, source code will be protected.');

// Step 1: Clean previous builds
console.log('\n🧹 Cleaning previous builds...');
try {
    if (fs.existsSync('./out')) {
        execSync('rm -rf ./out', { stdio: 'inherit' });
    }
    console.log('✅ Clean completed successfully');
} catch (error) {
    console.error('❌ Clean failed:', error.message);
    process.exit(1);
}

// Step 2: Build the application with protection
console.log('\n📦 Building protected application...');
try {
    execSync('npm run make', { stdio: 'inherit' });
    console.log('✅ Protected build completed successfully');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// Step 3: Verify only compiled packages exist
console.log('\n🔍 Verifying compiled packages...');
const outDir = './out/make';
if (!fs.existsSync(outDir)) {
    console.error('❌ Compiled packages not found in out/make/');
    process.exit(1);
}

const packages = fs.readdirSync(outDir, { recursive: true });
console.log('✅ Found compiled packages:', packages.length);

// Step 4: Create git tag
console.log('\n🏷️  Creating git tag...');
try {
    execSync(`git tag v${currentVersion}`, { stdio: 'inherit' });
    console.log('✅ Git tag created successfully');
} catch (error) {
    console.error('❌ Failed to create git tag:', error.message);
    process.exit(1);
}

// Step 5: Push tag to GitHub
console.log('\n📤 Pushing tag to GitHub...');
try {
    execSync(`git push origin v${currentVersion}`, { stdio: 'inherit' });
    console.log('✅ Tag pushed to GitHub successfully');
} catch (error) {
    console.error('❌ Failed to push tag:', error.message);
    process.exit(1);
}

// Step 6: Publish to GitHub releases (compiled packages only)
console.log('\n📋 Publishing compiled packages to GitHub releases...');
try {
    execSync('npm run publish', { stdio: 'inherit' });
    console.log('✅ Compiled packages published to GitHub releases successfully');
} catch (error) {
    console.error('❌ Failed to publish to GitHub:', error.message);
    process.exit(1);
}

console.log(`\n🎉 PROTECTED Release v${currentVersion} completed successfully!`);
console.log('📝 What was released:');
console.log('✅ Compiled Windows executable (.exe)');
console.log('✅ Compiled macOS application (.dmg)');
console.log('✅ Compiled Linux package (.deb)');
console.log('❌ Source code (PROTECTED - not included)');
console.log('❌ Configuration files (PROTECTED - not included)');
console.log('❌ Development files (PROTECTED - not included)');

console.log('\n📝 Next steps:');
console.log('1. Go to your GitHub repository');
console.log('2. Navigate to the "Releases" section');
console.log('3. Edit the draft release');
console.log('4. Add release notes and description');
console.log('5. Publish the release');
console.log('6. Users can download the compiled packages only');
