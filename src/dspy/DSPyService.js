const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');

class DSPyService extends EventEmitter {
    constructor(options = {}) {
        super();
        
        // Detect Python path based on platform
        let defaultPythonPath = 'python3';
        if (process.platform === 'win32') {
            defaultPythonPath = 'python'; // Windows typically uses 'python'
        }
        
        this.options = {
            port: options.port || 8765,
            pythonPath: options.pythonPath || defaultPythonPath,
            dspyPath: options.dspyPath || path.join(__dirname, 'dspy-service.py'),
            autoRestart: options.autoRestart !== false,
            maxRestarts: options.maxRestarts || 3,
            restartDelay: options.restartDelay || 2000,
            ...options
        };
        
        this.process = null;
        this.isRunning = false;
        this.isHealthy = false;
        this.restartCount = 0;
        this.lastError = null;
        this.healthCheckInterval = null;
        this.requestQueue = [];
        this.pendingRequests = new Map();
        this.requestId = 0;
    }

    /**
     * Start the DSPy service
     */
    async start() {
        if (this.isRunning) {
            console.log('DSPy service is already running');
            return true;
        }

        try {
            // Check if Python and DSPy are available
            await this.checkDependencies();
            
            // Start the Python process
            await this.startProcess();
            
            // Start health monitoring
            this.startHealthCheck();
            
            console.log(`DSPy service started on port ${this.options.port}`);
            return true;
        } catch (error) {
            console.error('Failed to start DSPy service:', error);
            this.emit('error', error);
            return false;
        }
    }

    /**
     * Stop the DSPy service
     */
    async stop() {
        if (!this.isRunning) {
            return;
        }

        console.log('Stopping DSPy service...');
        
        // Stop health check
        this.stopHealthCheck();
        
        // Kill the process
        if (this.process) {
            this.process.kill('SIGTERM');
            this.process = null;
        }
        
        this.isRunning = false;
        this.isHealthy = false;
        this.emit('stopped');
        
        console.log('DSPy service stopped');
    }

    /**
     * Check if Python and DSPy dependencies are available
     */
    async checkDependencies() {
        return new Promise((resolve, reject) => {
            // Try multiple Python commands for Windows compatibility
            const pythonCommands = ['python', 'python3', 'py'];
            let currentCommandIndex = 0;
            
            const tryPythonCommand = () => {
                if (currentCommandIndex >= pythonCommands.length) {
                    reject(new Error('Python not found. Please install Python and ensure it\'s in your PATH.'));
                    return;
                }
                
                const pythonCommand = pythonCommands[currentCommandIndex];
                console.log(`Trying Python command: ${pythonCommand}`);
                
                exec(`${pythonCommand} --version`, (error, stdout) => {
                    if (error) {
                        currentCommandIndex++;
                        tryPythonCommand();
                        return;
                    }
                    
                    // Update the python path to the working command
                    this.options.pythonPath = pythonCommand;
                    console.log(`Python version: ${stdout.trim()}`);
                    
                    // Check if DSPy is installed
                    exec(`${pythonCommand} -c "import dspy; print('DSPy available')"`, (error) => {
                        if (error) {
                            console.warn('DSPy not installed. Attempting to install...');
                            this.installDSPy().then(resolve).catch(reject);
                        } else {
                            console.log('DSPy is available');
                            resolve();
                        }
                    });
                });
            };
            
            tryPythonCommand();
        });
    }

    /**
     * Install DSPy if not available
     */
    async installDSPy() {
        return new Promise((resolve, reject) => {
            console.log('Installing DSPy...');
            exec(`${this.options.pythonPath} -m pip install -U dspy-ai`, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Failed to install DSPy: ${error.message}`));
                    return;
                }
                console.log('DSPy installed successfully');
                resolve();
            });
        });
    }

    /**
     * Start the Python DSPy process
     */
    async startProcess() {
        return new Promise((resolve, reject) => {
            const args = [this.options.dspyPath, this.options.port.toString()];
            
            this.process = spawn(this.options.pythonPath, args, {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: path.dirname(this.options.dspyPath)
            });

            let startupTimeout = setTimeout(() => {
                reject(new Error('DSPy service startup timeout'));
            }, 10000);

            this.process.stdout.on('data', (data) => {
                const output = data.toString().trim();
                console.log(`DSPy stdout: ${output}`);
                
                // Check if service is ready
                if (output.includes('DSPy service starting') || output.includes('Starting on http://localhost')) {
                    clearTimeout(startupTimeout);
                    this.isRunning = true;
                    this.restartCount = 0;
                    this.emit('started');
                    resolve();
                }
            });

            this.process.stderr.on('data', (data) => {
                const error = data.toString().trim();
                console.error(`DSPy stderr: ${error}`);
                this.lastError = error;
            });

            this.process.on('error', (error) => {
                console.error('DSPy process error:', error);
                this.handleProcessError(error);
                reject(error);
            });

            this.process.on('exit', (code, signal) => {
                console.log(`DSPy process exited with code ${code} and signal ${signal}`);
                this.handleProcessExit(code, signal);
            });

            this.process.on('close', (code) => {
                console.log(`DSPy process closed with code ${code}`);
                this.handleProcessClose(code);
            });
        });
    }

    /**
     * Handle process errors
     */
    handleProcessError(error) {
        this.isRunning = false;
        this.isHealthy = false;
        this.lastError = error.message;
        this.emit('error', error);
        
        if (this.options.autoRestart && this.restartCount < this.options.maxRestarts) {
            this.scheduleRestart();
        }
    }

    /**
     * Handle process exit
     */
    handleProcessExit(code, signal) {
        this.isRunning = false;
        this.isHealthy = false;
        this.emit('exited', { code, signal });
        
        if (this.options.autoRestart && this.restartCount < this.options.maxRestarts) {
            this.scheduleRestart();
        }
    }

    /**
     * Handle process close
     */
    handleProcessClose(code) {
        this.isRunning = false;
        this.isHealthy = false;
        this.emit('closed', { code });
    }

    /**
     * Schedule a restart
     */
    scheduleRestart() {
        this.restartCount++;
        console.log(`Scheduling DSPy restart (${this.restartCount}/${this.options.maxRestarts}) in ${this.options.restartDelay}ms`);
        
        setTimeout(async () => {
            try {
                await this.startProcess();
            } catch (error) {
                console.error('Failed to restart DSPy service:', error);
            }
        }, this.options.restartDelay);
    }

    /**
     * Start health check monitoring
     */
    startHealthCheck() {
        this.healthCheckInterval = setInterval(async () => {
            try {
                const response = await this.healthCheck();
                this.isHealthy = response.status === 'healthy';
                this.emit('health', { healthy: this.isHealthy, response });
            } catch (error) {
                this.isHealthy = false;
                this.emit('health', { healthy: false, error: error.message });
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Stop health check monitoring
     */
    stopHealthCheck() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }

    /**
     * Perform health check
     */
    async healthCheck() {
        return this.request('GET', '/health');
    }

    /**
     * Make HTTP request to DSPy service
     */
    async request(method, endpoint, data = null) {
        return new Promise((resolve, reject) => {
            const requestId = ++this.requestId;
            const timeout = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject(new Error('Request timeout'));
            }, 30000);

            const request = {
                id: requestId,
                method,
                endpoint,
                data,
                resolve: (result) => {
                    clearTimeout(timeout);
                    this.pendingRequests.delete(requestId);
                    resolve(result);
                },
                reject: (error) => {
                    clearTimeout(timeout);
                    this.pendingRequests.delete(requestId);
                    reject(error);
                }
            };

            this.pendingRequests.set(requestId, request);
            this.requestQueue.push(request);
            this.processQueue();
        });
    }

    /**
     * Process the request queue
     */
    async processQueue() {
        if (!this.isRunning || this.requestQueue.length === 0) {
            return;
        }

        const request = this.requestQueue.shift();
        try {
            const result = await this.executeRequest(request);
            request.resolve(result);
        } catch (error) {
            request.reject(error);
        }
    }

    /**
     * Execute a single request
     */
    async executeRequest(request) {
        const { method, endpoint, data } = request;
        
        const url = `http://localhost:${this.options.port}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Configure DSPy with provider and model
     */
    async configure(provider, model, apiKey) {
        return this.request('POST', '/configure', {
            provider,
            model,
            api_key: apiKey
        });
    }

    /**
     * Generate response using DSPy
     */
    async generate(query, context = '', pipelineType = 'basic') {
        return this.request('POST', '/generate', {
            query,
            context,
            pipeline_type: pipelineType
        });
    }

    /**
     * Optimize DSPy pipeline with examples
     */
    async optimize(examples, pipelineType = 'basic') {
        return this.request('POST', '/optimize', {
            examples,
            pipeline_type: pipelineType
        });
    }

    /**
     * Get available models
     */
    async getModels() {
        return this.request('GET', '/models');
    }

    /**
     * Get service status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            isHealthy: this.isHealthy,
            restartCount: this.restartCount,
            lastError: this.lastError,
            pendingRequests: this.pendingRequests.size,
            queueLength: this.requestQueue.length
        };
    }

    /**
     * Restart the service
     */
    async restart() {
        console.log('Restarting DSPy service...');
        await this.stop();
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.start();
    }
}

module.exports = DSPyService; 