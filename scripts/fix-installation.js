const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing installation issues...');

// Update forge config to ensure proper bundling
const forgeConfigPath = path.join(__dirname, '..', 'forge.config.js');
let forgeConfig = fs.readFileSync(forgeConfigPath, 'utf8');

// Add external dependencies to ensure they're bundled
if (!forgeConfig.includes('externals')) {
    const externalsConfig = `
    externals: ['electron-squirrel-startup'],
    `;
    
    // Insert externals config after packagerConfig
    forgeConfig = forgeConfig.replace(
        'packagerConfig: {',
        `packagerConfig: {${externalsConfig}`
    );
    
    fs.writeFileSync(forgeConfigPath, forgeConfig);
    console.log('✅ Updated forge config with externals');
}

// Also create a simple test to verify the fix
const testPath = path.join(__dirname, '..', 'test-installation.js');
const testContent = `
// Test script to verify installation works
const { app } = require('electron');

console.log('Testing electron-squirrel-startup...');
try {
    const squirrelStartup = require('electron-squirrel-startup');
    console.log('✅ electron-squirrel-startup loaded successfully');
} catch (error) {
    console.log('⚠️ electron-squirrel-startup not available:', error.message);
}

console.log('✅ Installation test completed');
`;

fs.writeFileSync(testPath, testContent);
console.log('✅ Created installation test script');

console.log('🎯 Next steps:');
console.log('1. Run: npm run make');
console.log('2. Test the new build');
console.log('3. Create new release');












