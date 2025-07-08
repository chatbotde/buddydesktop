#!/usr/bin/env node
/**
 * DSPy Setup Script for Buddy Desktop
 * Installs and configures DSPy for the application
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DSPySetup {
    constructor() {
        this.pythonPath = null;
        this.dspyInstalled = false;
        this.setupComplete = false;
    }

    async run() {
        console.log('🚀 DSPy Setup for Buddy Desktop');
        console.log('================================\n');

        try {
            // Step 1: Check Python installation
            await this.checkPython();

            // Step 2: Install DSPy
            await this.installDSPy();

            // Step 3: Verify installation
            await this.verifyInstallation();

            // Step 4: Create configuration
            await this.createConfiguration();

            console.log('\n✅ DSPy setup completed successfully!');
            console.log('\nNext steps:');
            console.log('1. Restart your Buddy Desktop application');
            console.log('2. Select "DSPy (Advanced)" as your AI provider');
            console.log('3. Enter your API key for the underlying model (OpenAI, Anthropic, etc.)');
            console.log('4. Start using DSPy-powered conversations!');

            this.setupComplete = true;
        } catch (error) {
            console.error('\n❌ DSPy setup failed:', error.message);
            console.log('\nTroubleshooting:');
            console.log('1. Make sure Python 3.8+ is installed and in your PATH');
            console.log('2. Try running: pip install -U dspy-ai');
            console.log('3. Check your internet connection');
            process.exit(1);
        }
    }

    async checkPython() {
        console.log('🔍 Checking Python installation...');

        const pythonCommands = ['python3', 'python', 'py'];
        let pythonFound = false;

        for (const cmd of pythonCommands) {
            try {
                const version = await this.execCommand(`${cmd} --version`);
                if (version.includes('Python 3')) {
                    this.pythonPath = cmd;
                    pythonFound = true;
                    console.log(`✅ Found Python: ${version.trim()}`);
                    break;
                }
            } catch (error) {
                // Continue to next command
            }
        }

        if (!pythonFound) {
            throw new Error('Python 3.8+ not found. Please install Python and try again.');
        }

        // Check Python version
        const versionOutput = await this.execCommand(`${this.pythonPath} --version`);
        const versionMatch = versionOutput.match(/Python (\d+\.\d+)/);
        if (versionMatch) {
            const majorVersion = parseInt(versionMatch[1].split('.')[0]);
            const minorVersion = parseInt(versionMatch[1].split('.')[1]);
            
            if (majorVersion < 3 || (majorVersion === 3 && minorVersion < 8)) {
                throw new Error('Python 3.8+ is required. Current version: ' + versionMatch[1]);
            }
        }
    }

    async installDSPy() {
        console.log('\n📦 Installing DSPy...');

        try {
            // Check if DSPy is already installed
            await this.execCommand(`${this.pythonPath} -c "import dspy; print('DSPy already installed')"`);
            console.log('✅ DSPy is already installed');
            this.dspyInstalled = true;
            return;
        } catch (error) {
            // DSPy not installed, proceed with installation
        }

        try {
            console.log('Installing DSPy via pip...');
            const installOutput = await this.execCommand(`${this.pythonPath} -m pip install -U dspy-ai`);
            console.log('✅ DSPy installed successfully');
            this.dspyInstalled = true;
        } catch (error) {
            console.error('Failed to install DSPy via pip:', error.message);
            
            // Try alternative installation methods
            console.log('Trying alternative installation methods...');
            
            try {
                await this.execCommand(`${this.pythonPath} -m pip install --user -U dspy-ai`);
                console.log('✅ DSPy installed successfully (user installation)');
                this.dspyInstalled = true;
            } catch (error2) {
                throw new Error(`Failed to install DSPy: ${error2.message}`);
            }
        }
    }

    async verifyInstallation() {
        console.log('\n🔍 Verifying DSPy installation...');

        try {
            const testOutput = await this.execCommand(`${this.pythonPath} -c "
import dspy
print('DSPy version:', dspy.__version__)
print('DSPy modules available:', [m for m in dir(dspy) if not m.startswith('_')])
"`);
            console.log('✅ DSPy verification successful');
            console.log(testOutput);
        } catch (error) {
            throw new Error(`DSPy verification failed: ${error.message}`);
        }
    }

    async createConfiguration() {
        console.log('\n⚙️  Creating DSPy configuration...');

        const configDir = path.join(__dirname, 'config');
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        const configFile = path.join(configDir, 'dspy-config.json');
        const config = {
            version: '1.0.0',
            pythonPath: this.pythonPath,
            dspyInstalled: this.dspyInstalled,
            setupComplete: true,
            setupDate: new Date().toISOString(),
            defaultPort: 8765,
            autoRestart: true,
            maxRestarts: 3,
            healthCheckInterval: 5000,
            requestTimeout: 30000
        };

        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
        console.log('✅ DSPy configuration created');

        // Create example usage file
        const exampleFile = path.join(configDir, 'example-usage.js');
        const exampleContent = `// DSPy Example Usage
const DSPyService = require('../DSPyService');

async function example() {
    // Initialize DSPy service
    const dspyService = new DSPyService({
        port: 8765,
        autoRestart: true
    });

    // Start the service
    await dspyService.start();

    // Configure with your API key
    await dspyService.configure('openai', 'gpt-3.5-turbo', 'your-api-key-here');

    // Generate a response
    const result = await dspyService.generate('Hello, how are you?', '', 'basic');
    console.log('Response:', result.response);

    // Stop the service
    await dspyService.stop();
}

example().catch(console.error);
`;

        fs.writeFileSync(exampleFile, exampleContent);
        console.log('✅ Example usage file created');
    }

    execCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve(stdout);
                }
            });
        });
    }
}

// Run setup if this script is executed directly
if (require.main === module) {
    const setup = new DSPySetup();
    setup.run().catch(console.error);
}

module.exports = DSPySetup; 