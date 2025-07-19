/**
 * Global Highlight.js Loader for Buddy Desktop
 * Ensures highlight.js is loaded once and available globally
 */

class HighlightLoader {
    constructor() {
        this.isLoaded = false;
        this.isLoading = false;
        this.loadPromise = null;
        this.callbacks = [];
    }

    async load() {
        if (this.isLoaded && window.hljs) {
            return Promise.resolve(window.hljs);
        }

        if (this.isLoading) {
            return this.loadPromise;
        }

        this.isLoading = true;
        this.loadPromise = this._loadHighlightJS();
        
        try {
            await this.loadPromise;
            this.isLoaded = true;
            this.isLoading = false;
            
            // Execute any pending callbacks
            this.callbacks.forEach(callback => callback(window.hljs));
            this.callbacks = [];
            
            return window.hljs;
        } catch (error) {
            this.isLoading = false;
            throw error;
        }
    }

    async _loadHighlightJS() {
        if (window.hljs) {
            return window.hljs;
        }

        // Try loading from local files first
        try {
            await this._loadFromLocal();
            if (window.hljs) {
                console.log('Highlight.js loaded from local files');
                return window.hljs;
            }
        } catch (error) {
            console.warn('Failed to load highlight.js from local files:', error);
        }

        // Fallback to CDN
        try {
            await this._loadFromCDN();
            if (window.hljs) {
                console.log('Highlight.js loaded from CDN');
                return window.hljs;
            }
        } catch (error) {
            console.error('Failed to load highlight.js from CDN:', error);
            throw new Error('Could not load highlight.js from any source');
        }
    }

    _loadFromLocal() {
        return new Promise((resolve, reject) => {
            // Try multiple possible paths
            const paths = [
                './src/highlight.min.js',
                './highlight.min.js',
                'src/highlight.min.js',
                'highlight.min.js',
                '../highlight.min.js'
            ];
            
            const cssPaths = [
                './src/highlight.min.css',
                './highlight.min.css',
                'src/highlight.min.css',
                'highlight.min.css',
                '../highlight.min.css'
            ];
            
            let currentPathIndex = 0;
            
            const tryNextPath = () => {
                if (currentPathIndex >= paths.length) {
                    reject(new Error('Failed to load local highlight.js from any path'));
                    return;
                }
                
                const script = document.createElement('script');
                script.src = paths[currentPathIndex];
                
                script.onload = () => {
                    console.log(`Highlight.js loaded from: ${paths[currentPathIndex]}`);
                    
                    // Load corresponding CSS
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssPaths[currentPathIndex];
                    document.head.appendChild(link);
                    
                    this._configureHighlightJS();
                    resolve(window.hljs);
                };
                
                script.onerror = () => {
                    console.warn(`Failed to load from: ${paths[currentPathIndex]}`);
                    currentPathIndex++;
                    tryNextPath();
                };
                
                document.head.appendChild(script);
            };
            
            tryNextPath();
        });
    }

    _loadFromCDN() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
            
            script.onload = () => {
                // Load CSS from CDN
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css';
                document.head.appendChild(link);
                
                this._configureHighlightJS();
                resolve(window.hljs);
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load CDN highlight.js'));
            };
            
            document.head.appendChild(script);
        });
    }

    _configureHighlightJS() {
        if (window.hljs) {
            window.hljs.configure({
                ignoreUnescapedHTML: true,
                throwUnescapedHTML: false
            });
            
            console.log('Highlight.js configured successfully');
            console.log('Available languages:', window.hljs.listLanguages().length);
            console.log('Sample languages:', window.hljs.listLanguages().slice(0, 10));
        } else {
            console.warn('window.hljs not available for configuration');
        }
    }

    onReady(callback) {
        if (this.isLoaded && window.hljs) {
            callback(window.hljs);
        } else {
            this.callbacks.push(callback);
        }
    }
}

// Create global instance
const highlightLoader = new HighlightLoader();

// Auto-load on module import
highlightLoader.load().catch(error => {
    console.warn('Auto-load of highlight.js failed:', error);
});

export { highlightLoader };