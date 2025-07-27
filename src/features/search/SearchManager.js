/**
 * SearchManager - Manages search operations and coordination
 * Handles different types of searches: files, content, web, etc.
 */
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

class SearchManager {
    constructor() {
        this.isInitialized = false;
        this.searchProviders = new Map();
        this.searchHistory = [];
        this.maxHistorySize = 100;
        this.searchCache = new Map();
        this.maxCacheSize = 50;
    }

    /**
     * Initialize the search manager
     * @param {Object} options - Initialization options
     */
    async initialize(options = {}) {
        if (this.isInitialized) {
            console.log('SearchManager already initialized');
            return;
        }

        try {
            // Initialize search providers
            await this.initializeSearchProviders(options);
            
            this.isInitialized = true;
            console.log('SearchManager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize SearchManager:', error);
            throw error;
        }
    }

    /**
     * Initialize different search providers
     * @param {Object} options - Provider options
     */
    async initializeSearchProviders(options) {
        // File search provider
        this.searchProviders.set('files', {
            name: 'File Search',
            search: this.searchFiles.bind(this),
            enabled: true
        });

        // Content search provider
        this.searchProviders.set('content', {
            name: 'Content Search',
            search: this.searchContent.bind(this),
            enabled: true
        });

        // Web search provider (placeholder)
        this.searchProviders.set('web', {
            name: 'Web Search',
            search: this.searchWeb.bind(this),
            enabled: options.enableWebSearch || false
        });

        console.log('Search providers initialized:', Array.from(this.searchProviders.keys()));
    }

    /**
     * Perform a comprehensive search
     * @param {string} query - Search query
     * @param {Object} filters - Search filters
     * @returns {Promise<Array>} Combined search results
     */
    async search(query, filters = {}) {
        if (!this.isInitialized) {
            throw new Error('SearchManager not initialized');
        }

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return [];
        }

        const normalizedQuery = query.trim().toLowerCase();
        const cacheKey = `${normalizedQuery}_${JSON.stringify(filters)}`;

        // Check cache first
        if (this.searchCache.has(cacheKey)) {
            console.log('Returning cached search results for:', normalizedQuery);
            return this.searchCache.get(cacheKey);
        }

        try {
            const searchPromises = [];
            const enabledProviders = Array.from(this.searchProviders.entries())
                .filter(([key, provider]) => provider.enabled && this.isProviderEnabled(key, filters));

            // Execute searches in parallel
            for (const [key, provider] of enabledProviders) {
                searchPromises.push(
                    provider.search(query, filters)
                        .then(results => ({ provider: key, results }))
                        .catch(error => {
                            console.error(`Search provider ${key} failed:`, error);
                            return { provider: key, results: [] };
                        })
                );
            }

            const searchResults = await Promise.all(searchPromises);
            
            // Combine and rank results
            const combinedResults = this.combineAndRankResults(searchResults, query);
            
            // Cache results
            this.cacheResults(cacheKey, combinedResults);
            
            // Add to search history
            this.addToHistory(query, combinedResults.length);
            
            console.log(`Search completed: "${query}" returned ${combinedResults.length} results`);
            return combinedResults;
            
        } catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    }

    /**
     * Search for files
     * @param {string} query - Search query
     * @param {Object} filters - Search filters
     * @returns {Promise<Array>} File search results
     */
    async searchFiles(query, filters = {}) {
        const results = [];
        const workspaceRoot = this.getWorkspaceRoot();
        
        if (!workspaceRoot) {
            console.warn('No workspace root found for file search');
            return results;
        }

        try {
            // Build glob patterns based on file type filters
            const patterns = this.buildFilePatterns(filters);
            const searchOptions = {
                cwd: workspaceRoot,
                ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
                nodir: true,
                absolute: false
            };

            for (const pattern of patterns) {
                try {
                    const files = await glob(pattern, searchOptions);
                    
                    for (const file of files) {
                        const filePath = path.join(workspaceRoot, file);
                        const fileName = path.basename(file);
                        const relativePath = file;
                        
                        // Check if filename matches query
                        if (fileName.toLowerCase().includes(query.toLowerCase())) {
                            try {
                                const stats = await fs.stat(filePath);
                                results.push({
                                    type: 'file',
                                    title: fileName,
                                    path: relativePath,
                                    fullPath: filePath,
                                    content: `File: ${fileName}`,
                                    relevance: this.calculateFileRelevance(fileName, query),
                                    size: stats.size,
                                    modified: stats.mtime,
                                    extension: path.extname(fileName)
                                });
                            } catch (statError) {
                                console.warn('Failed to get file stats:', statError);
                            }
                        }
                    }
                } catch (globError) {
                    console.warn('Glob pattern failed:', pattern, globError);
                }
            }
            
        } catch (error) {
            console.error('File search failed:', error);
        }

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Search file contents
     * @param {string} query - Search query
     * @param {Object} filters - Search filters
     * @returns {Promise<Array>} Content search results
     */
    async searchContent(query, filters = {}) {
        const results = [];
        const workspaceRoot = this.getWorkspaceRoot();
        
        if (!workspaceRoot) {
            console.warn('No workspace root found for content search');
            return results;
        }

        try {
            const patterns = this.buildFilePatterns(filters);
            const searchOptions = {
                cwd: workspaceRoot,
                ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '*.min.*'],
                nodir: true,
                absolute: false
            };

            for (const pattern of patterns) {
                try {
                    const files = await glob(pattern, searchOptions);
                    
                    // Limit concurrent file reads
                    const batchSize = 10;
                    for (let i = 0; i < files.length; i += batchSize) {
                        const batch = files.slice(i, i + batchSize);
                        const batchPromises = batch.map(file => this.searchFileContent(file, query, workspaceRoot));
                        const batchResults = await Promise.all(batchPromises);
                        
                        results.push(...batchResults.filter(result => result !== null));
                    }
                } catch (globError) {
                    console.warn('Content search glob failed:', pattern, globError);
                }
            }
            
        } catch (error) {
            console.error('Content search failed:', error);
        }

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Search a single file's content
     * @param {string} file - Relative file path
     * @param {string} query - Search query
     * @param {string} workspaceRoot - Workspace root path
     * @returns {Promise<Object|null>} Search result or null
     */
    async searchFileContent(file, query, workspaceRoot) {
        const filePath = path.join(workspaceRoot, file);
        
        try {
            // Check file size (skip very large files)
            const stats = await fs.stat(filePath);
            if (stats.size > 1024 * 1024) { // Skip files larger than 1MB
                return null;
            }

            // Check if file is likely text-based
            if (!this.isTextFile(file)) {
                return null;
            }

            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            const matches = [];

            // Search for query in file content
            lines.forEach((line, lineNumber) => {
                const index = line.toLowerCase().indexOf(query.toLowerCase());
                if (index !== -1) {
                    matches.push({
                        lineNumber: lineNumber + 1,
                        line: line.trim(),
                        index
                    });
                }
            });

            if (matches.length > 0) {
                // Create content snippet with context
                const snippet = this.createContentSnippet(matches, lines, query);
                const relevance = this.calculateContentRelevance(matches, content, query);

                return {
                    type: 'content',
                    title: `${path.basename(file)} (${matches.length} matches)`,
                    path: file,
                    fullPath: filePath,
                    content: snippet,
                    relevance,
                    matches: matches.length,
                    size: stats.size,
                    modified: stats.mtime,
                    extension: path.extname(file)
                };
            }
            
        } catch (error) {
            // Silently handle errors for individual files
            return null;
        }

        return null;
    }

    /**
     * Web search (placeholder implementation)
     * @param {string} query - Search query
     * @param {Object} filters - Search filters
     * @returns {Promise<Array>} Web search results
     */
    async searchWeb(query, filters = {}) {
        // Placeholder for web search functionality
        // Could integrate with search engines, documentation sites, etc.
        console.log('Web search not implemented yet:', query);
        return [];
    }

    /**
     * Combine and rank results from different providers
     * @param {Array} searchResults - Results from different providers
     * @param {string} query - Original search query
     * @returns {Array} Combined and ranked results
     */
    combineAndRankResults(searchResults, query) {
        const allResults = [];
        
        for (const { provider, results } of searchResults) {
            for (const result of results) {
                allResults.push({
                    ...result,
                    provider,
                    searchQuery: query
                });
            }
        }

        // Sort by relevance and provider priority
        return allResults
            .sort((a, b) => {
                // First by relevance
                if (b.relevance !== a.relevance) {
                    return b.relevance - a.relevance;
                }
                // Then by provider priority (files > content > web)
                const providerPriority = { files: 3, content: 2, web: 1 };
                return (providerPriority[b.provider] || 0) - (providerPriority[a.provider] || 0);
            })
            .slice(0, 100); // Limit results
    }

    /**
     * Check if a provider should be enabled based on filters
     * @param {string} providerKey - Provider key
     * @param {Object} filters - Search filters
     * @returns {boolean} Whether provider should be enabled
     */
    isProviderEnabled(providerKey, filters) {
        if (!filters.searchTypes) return true;
        
        const mapping = {
            files: 'files',
            content: 'content',
            web: 'web'
        };
        
        return filters.searchTypes[mapping[providerKey]] !== false;
    }

    /**
     * Build file patterns based on filters
     * @param {Object} filters - Search filters
     * @returns {Array} Glob patterns
     */
    buildFilePatterns(filters) {
        const patterns = [];
        const fileTypes = filters.fileTypes || {};
        
        if (fileTypes.js !== false) patterns.push('**/*.{js,jsx,ts,tsx}');
        if (fileTypes.css !== false) patterns.push('**/*.{css,scss,sass,less}');
        if (fileTypes.html !== false) patterns.push('**/*.{html,htm}');
        if (fileTypes.md !== false) patterns.push('**/*.{md,markdown}');
        
        // If no specific types are enabled, search all text files
        if (patterns.length === 0) {
            patterns.push('**/*.{js,jsx,ts,tsx,css,scss,sass,less,html,htm,md,markdown,json,txt,xml,yaml,yml}');
        }
        
        return patterns;
    }

    /**
     * Calculate file relevance based on filename match
     * @param {string} fileName - File name
     * @param {string} query - Search query
     * @returns {number} Relevance score (0-1)
     */
    calculateFileRelevance(fileName, query) {
        const normalizedName = fileName.toLowerCase();
        const normalizedQuery = query.toLowerCase();
        
        if (normalizedName === normalizedQuery) return 1.0;
        if (normalizedName.startsWith(normalizedQuery)) return 0.9;
        if (normalizedName.includes(normalizedQuery)) return 0.7;
        
        // Check for partial matches
        const words = normalizedQuery.split(/\s+/);
        let matchedWords = 0;
        for (const word of words) {
            if (normalizedName.includes(word)) {
                matchedWords++;
            }
        }
        
        return matchedWords / words.length * 0.5;
    }

    /**
     * Calculate content relevance based on matches
     * @param {Array} matches - Content matches
     * @param {string} content - File content
     * @param {string} query - Search query
     * @returns {number} Relevance score (0-1)
     */
    calculateContentRelevance(matches, content, query) {
        const matchCount = matches.length;
        const contentLength = content.length;
        const queryLength = query.length;
        
        // Base score on match frequency
        let score = Math.min(matchCount / 10, 1.0);
        
        // Boost for exact matches
        const exactMatches = matches.filter(match => 
            match.line.toLowerCase().includes(query.toLowerCase())
        ).length;
        score += exactMatches * 0.1;
        
        // Normalize by content length
        const density = (matchCount * queryLength) / contentLength;
        score += Math.min(density * 100, 0.2);
        
        return Math.min(score, 1.0);
    }

    /**
     * Create a content snippet from matches
     * @param {Array} matches - Content matches
     * @param {Array} lines - File lines
     * @param {string} query - Search query
     * @returns {string} Content snippet
     */
    createContentSnippet(matches, lines, query) {
        if (matches.length === 0) return '';
        
        // Take the first few matches
        const topMatches = matches.slice(0, 3);
        const snippets = topMatches.map(match => {
            const line = match.line;
            const maxLength = 100;
            
            if (line.length <= maxLength) {
                return line;
            }
            
            // Center the snippet around the match
            const start = Math.max(0, match.index - 30);
            const end = Math.min(line.length, start + maxLength);
            let snippet = line.substring(start, end);
            
            if (start > 0) snippet = '...' + snippet;
            if (end < line.length) snippet += '...';
            
            return snippet;
        });
        
        return snippets.join(' | ');
    }

    /**
     * Check if a file is likely a text file
     * @param {string} filePath - File path
     * @returns {boolean} Whether file is text-based
     */
    isTextFile(filePath) {
        const textExtensions = [
            '.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass', '.less',
            '.html', '.htm', '.xml', '.svg', '.md', '.markdown', '.txt',
            '.json', '.yaml', '.yml', '.toml', '.ini', '.conf', '.config',
            '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
            '.py', '.rb', '.php', '.java', '.c', '.cpp', '.h', '.hpp',
            '.rs', '.go', '.kt', '.swift', '.dart', '.vue', '.svelte'
        ];
        
        const ext = path.extname(filePath).toLowerCase();
        return textExtensions.includes(ext);
    }

    /**
     * Get the workspace root directory
     * @returns {string|null} Workspace root path
     */
    getWorkspaceRoot() {
        // Try to get from VS Code workspace
        if (process.env.WORKSPACE_FOLDER) {
            return process.env.WORKSPACE_FOLDER;
        }
        
        // Fallback to current working directory
        return process.cwd();
    }

    /**
     * Cache search results
     * @param {string} cacheKey - Cache key
     * @param {Array} results - Search results
     */
    cacheResults(cacheKey, results) {
        // Implement LRU cache behavior
        if (this.searchCache.size >= this.maxCacheSize) {
            const firstKey = this.searchCache.keys().next().value;
            this.searchCache.delete(firstKey);
        }
        
        this.searchCache.set(cacheKey, results);
    }

    /**
     * Add search to history
     * @param {string} query - Search query
     * @param {number} resultCount - Number of results
     */
    addToHistory(query, resultCount) {
        const historyEntry = {
            query,
            resultCount,
            timestamp: new Date().toISOString()
        };
        
        this.searchHistory.unshift(historyEntry);
        
        // Limit history size
        if (this.searchHistory.length > this.maxHistorySize) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Get search history
     * @returns {Array} Search history
     */
    getSearchHistory() {
        return [...this.searchHistory];
    }

    /**
     * Clear search cache
     */
    clearCache() {
        this.searchCache.clear();
        console.log('Search cache cleared');
    }

    /**
     * Clear search history
     */
    clearHistory() {
        this.searchHistory = [];
        console.log('Search history cleared');
    }

    /**
     * Get search statistics
     * @returns {Object} Search statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            providersCount: this.searchProviders.size,
            cacheSize: this.searchCache.size,
            historySize: this.searchHistory.length,
            providers: Array.from(this.searchProviders.keys())
        };
    }
}

// Create singleton instance
const searchManager = new SearchManager();

// Initialize search manager
const initializeSearchManager = async (options) => {
    return await searchManager.initialize(options);
};

// Perform search
const performSearch = async (query, filters) => {
    return await searchManager.search(query, filters);
};

// Get search stats
const getSearchStats = () => {
    return searchManager.getStats();
};

module.exports = {
    SearchManager,
    searchManager,
    initializeSearchManager,
    performSearch,
    getSearchStats
};
