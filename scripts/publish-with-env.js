const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    envVars.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
    
    console.log('✅ Loaded environment variables from .env file');
}

// Check if GITHUB_TOKEN is set
if (!process.env.GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN not found in environment variables');
    console.log('Please set GITHUB_TOKEN in your .env file or as an environment variable');
    process.exit(1);
}

console.log('🚀 Publishing to GitHub with token...');

try {
    execSync('npm run publish', { stdio: 'inherit' });
    console.log('✅ Published successfully!');
} catch (error) {
    console.error('❌ Publishing failed:', error.message);
    process.exit(1);
}
