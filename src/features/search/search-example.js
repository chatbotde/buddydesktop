/**
 * Search Window Frontend JavaScript
 * Handles UI interactions and communication with the main process
 */

class SearchWindowUI {
    constructor() {
        this.currentTheme = 'dark';
        this.isExpanded = false;
        this.searchTimeout = null;
        this.searchResults = [];
        this.isLoading = false;
        this.hasQuery = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupIpcListeners();
        this.updateTheme();
        console.log('Search window UI initialized');
    }

    initializeElements() {
        // Get all DOM elements
        this.elements = {
            container: document.getElementById('searchContainer'),
            searchInput: document.getElementById('searchInput'),
            clearBtn: document.getElementById('clearBtn'),
            expandableContent: document.getElementById('expandableContent'),
            searchControls: document.getElementById('searchControls'),
            filterBtn: document.getElementById('filterBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            themeToggle: document.getElementById('themeToggle'),
            minimizeBtn: document.getElementById('minimizeBtn'),
            closeBtn: document.getElementById('closeBtn'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            resultsSection: document.getElementById('resultsSection'),
            resultsHeader: document.getElementById('resultsHeader'),
            resultsCount: document.getElementById('resultsCount'),
            resultsTime: document.getElementById('resultsTime'),
            resultsContainer: document.getElementById('resultsContainer'),
            resultsList: document.getElementById('resultsList'),
            noResults: document.getElementById('noResults'),
            resultsSkeleton: document.getElementById('resultsSkeleton'),
            resultsFooter: document.getElementById('resultsFooter'),
            filterPanel: document.getElementById('filterPanel'),
            filterCloseBtn: document.getElementById('filterCloseBtn'),
            
            // Filter checkboxes
            filterFiles: document.getElementById('filterFiles'),
            filterContent: document.getElementById('filterContent'),
            filterWeb: document.getElementById('filterWeb'),
            filterJs: document.getElementById('filterJs'),
            filterCss: document.getElementById('filterCss'),
            filterHtml: document.getElementById('filterHtml'),
            filterMd: document.getElementById('filterMd')
        };
    }

    setupEventListeners() {
        // Search input events
        this.elements.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        this.elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            } else if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        // Clear button
        this.elements.clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Control buttons
        this.elements.filterBtn.addEventListener('click', () => {
            this.toggleFilterPanel();
        });

        this.elements.settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });

        // Header controls
        this.elements.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        this.elements.minimizeBtn.addEventListener('click', () => {
            this.minimizeWindow();
        });

        this.elements.closeBtn.addEventListener('click', () => {
            this.closeWindow();
        });

        // Filter panel
        this.elements.filterCloseBtn.addEventListener('click', () => {
            this.hideFilterPanel();
        });

        // Suggestion tags
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-tag')) {
                const query = e.target.getAttribute('data-query');
                this.elements.searchInput.value = query;
                this.performSearch(query);
            }
        });

        // Filter checkboxes
        const filterCheckboxes = [
            this.elements.filterFiles,
            this.elements.filterContent,
            this.elements.filterWeb,
            this.elements.filterJs,
            this.elements.filterCss,
            this.elements.filterHtml,
            this.elements.filterMd
        ];

        filterCheckboxes.forEach(checkbox => {
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    this.updateSearchFilters();
                });
            }
        });

        // Prevent default drag behavior
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }

    setupIpcListeners() {
        // Listen for theme toggle from main process
        if (window.electronAPI && window.electronAPI.on) {
            window.electronAPI.on('search-window-theme-toggle', () => {
                this.toggleTheme();
            });
        }
    }

    handleSearchInput(query) {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        const hasQuery = query.trim().length > 0;
        this.hasQuery = hasQuery;

        // Show/hide clear button
        if (hasQuery) {
            this.elements.clearBtn.style.display = 'flex';
            this.elements.clearBtn.classList.add('visible');
        } else {
            this.elements.clearBtn.style.display = 'none';
            this.elements.clearBtn.classList.remove('visible');
            this.collapseWindow();
            return;
        }

        // Expand window when user starts typing
        if (hasQuery && !this.isExpanded) {
            this.expandWindow();
        }

        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    async performSearch(query) {
        if (!query.trim()) return;

        const startTime = performance.now();
        this.setLoading(true);
        this.showResultsSkeleton();

        try {
            // Get search filters
            const filters = this.getSearchFilters();
            
            // Perform search via IPC
            let results = [];
            if (window.electronAPI && window.electronAPI.invoke) {
                results = await window.electronAPI.invoke('search-window-perform-search', {
                    query,
                    filters
                });
            } else {
                // Fallback for development/testing
                results = await this.mockSearch(query);
            }

            const endTime = performance.now();
            const searchTime = Math.round(endTime - startTime);
            
            this.displayResults(results, searchTime);
            
        } catch (error) {
            console.error('Search error:', error);
            this.displayResults([], 0);
        } finally {
            this.setLoading(false);
            this.hideResultsSkeleton();
        }
    }

    async mockSearch(query) {
        // Mock search for development/testing
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockResults = [
            // File results
            {
                type: 'file',
                title: `SearchWindow.js`,
                path: '/src/features/search/SearchWindow.js',
                content: `Main search window class that handles window creation, IPC communication, and ${query} functionality. Contains methods for expanding/collapsing the window dynamically.`,
                relevance: 0.95
            },
            {
                type: 'file',
                title: `search-example.js`,
                path: '/src/features/search/search-example.js',
                content: `Frontend JavaScript for search UI interactions. Handles user input, ${query} processing, and dynamic window resizing with smooth animations.`,
                relevance: 0.92
            },
            {
                type: 'file',
                title: `search-window.css`,
                path: '/src/features/search/search-window.css',
                content: `Styles for the dynamic search interface. Includes CSS transitions for ${query} results, expandable content areas, and modern glass effects.`,
                relevance: 0.88
            },
            {
                type: 'file',
                title: `buddy-header.js`,
                path: '/src/components/buddy-header.js',
                content: `Header component with navigation and ${query} integration. Provides quick access to search functionality from the main interface.`,
                relevance: 0.85
            },
            
            // Content results
            {
                type: 'content',
                title: `Dynamic Search Implementation Guide`,
                path: '/docs/DYNAMIC-SEARCH-IMPROVEMENTS.md',
                content: `Complete guide for implementing dynamic ${query} interfaces. Covers progressive disclosure, smooth animations, and responsive design patterns.`,
                relevance: 0.90
            },
            {
                type: 'content',
                title: `Search Feature Documentation`,
                path: '/docs/features/search.md',
                content: `Documentation for the search feature including ${query} algorithms, filtering options, and integration with AI assistance capabilities.`,
                relevance: 0.87
            },
            {
                type: 'content',
                title: `API Reference - Search Methods`,
                path: '/docs/api/search-api.md',
                content: `API documentation for search-related methods. Includes ${query} parameters, response formats, and error handling examples.`,
                relevance: 0.82
            },
            
            // Configuration results
            {
                type: 'file',
                title: `package.json`,
                path: '/package.json',
                content: `Project configuration with dependencies for ${query} functionality including Electron, React, and search-related libraries.`,
                relevance: 0.75
            },
            {
                type: 'file',
                title: `search-config.json`,
                path: '/config/search-config.json',
                content: `Configuration file for search settings including ${query} indexing options, result limits, and filter preferences.`,
                relevance: 0.78
            },
            
            // Web results (if web search is enabled)
            {
                type: 'web',
                title: `Best Practices for ${query} UI Design`,
                path: 'https://ux-design.com/search-interfaces',
                content: `Modern approaches to ${query} interface design including progressive disclosure, real-time feedback, and accessibility considerations.`,
                relevance: 0.70
            },
            {
                type: 'web',
                title: `Electron Search Window Tutorial`,
                path: 'https://electronjs.org/docs/search-windows',
                content: `Official Electron documentation for creating ${query} windows with dynamic sizing, transparency effects, and IPC communication.`,
                relevance: 0.68
            }
        ];

        // Filter results based on current filter settings
        const filters = this.getSearchFilters();
        let filteredResults = mockResults.filter(result => {
            // Filter by search type
            if (result.type === 'file' && !filters.searchTypes.files) return false;
            if (result.type === 'content' && !filters.searchTypes.content) return false;
            if (result.type === 'web' && !filters.searchTypes.web) return false;
            
            // Filter by file type (only for file results)
            if (result.type === 'file') {
                const extension = result.path.split('.').pop()?.toLowerCase();
                if (extension === 'js' && !filters.fileTypes.js) return false;
                if (extension === 'css' && !filters.fileTypes.css) return false;
                if (extension === 'html' && !filters.fileTypes.html) return false;
                if (extension === 'md' && !filters.fileTypes.md) return false;
            }
            
            return true;
        });

        // Sort by relevance
        filteredResults.sort((a, b) => b.relevance - a.relevance);
        
        // Demo mode: Show different results for common search terms
        const demoTerms = {
            'search': filteredResults.slice(0, 8),
            'window': filteredResults.filter(r => r.path.includes('window')).slice(0, 5),
            'css': filteredResults.filter(r => r.path.includes('.css') || r.content.includes('CSS')).slice(0, 4),
            'js': filteredResults.filter(r => r.path.includes('.js') || r.content.includes('JavaScript')).slice(0, 6),
            'config': filteredResults.filter(r => r.path.includes('config') || r.type === 'file').slice(0, 3),
            'docs': filteredResults.filter(r => r.path.includes('docs') || r.type === 'content').slice(0, 5)
        };

        const lowerQuery = query.toLowerCase();
        if (demoTerms[lowerQuery]) {
            return demoTerms[lowerQuery];
        }

        // Return different amounts based on query length to test scrolling
        if (query.length <= 2) {
            return filteredResults.slice(0, 3);
        } else if (query.length <= 4) {
            return filteredResults.slice(0, 6);
        } else {
            return filteredResults.slice(0, 9);
        }
    }

    displayResults(results, searchTime = 0) {
        this.searchResults = results;
        
        // Show search controls and results section
        this.elements.searchControls.style.display = 'flex';
        this.elements.resultsSection.style.display = 'flex';
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        // Update results count and time
        this.elements.resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
        this.elements.resultsTime.textContent = `in ${searchTime}ms`;

        // Generate results HTML with enhanced structure
        const resultsHTML = results.map((result, index) => {
            const typeIcon = this.getTypeIcon(result.type);
            const highlightedContent = this.highlightSearchTerms(result.content, this.elements.searchInput.value);
            const highlightedTitle = this.highlightSearchTerms(result.title, this.elements.searchInput.value);
            
            return `
                <div class="result-item" data-index="${index}" tabindex="0" role="option">
                    <div class="result-title">
                        ${typeIcon}
                        <span class="result-title-text">${highlightedTitle}</span>
                        <span class="result-relevance" title="Relevance: ${Math.round(result.relevance * 100)}%">
                            ${Math.round(result.relevance * 100)}%
                        </span>
                    </div>
                    <div class="result-path">${this.escapeHtml(result.path)}</div>
                    <div class="result-content">${highlightedContent}</div>
                    <div class="result-actions">
                        <button class="result-action-btn" title="Open" data-action="open">
                            <svg viewBox="0 0 24 24"><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"/></svg>
                        </button>
                        <button class="result-action-btn" title="Copy path" data-action="copy">
                            <svg viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5Z"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.resultsList.innerHTML = resultsHTML;

        // Add click listeners to results
        this.elements.resultsList.querySelectorAll('.result-item').forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.result-action-btn')) {
                    this.selectResult(results[index]);
                }
            });
            
            // Add keyboard navigation
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectResult(results[index]);
                }
            });
        });

        // Add action button listeners
        this.elements.resultsList.querySelectorAll('.result-action-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const resultIndex = parseInt(btn.closest('.result-item').getAttribute('data-index'));
                this.handleResultAction(action, results[resultIndex]);
            });
        });

        // Show results and footer
        this.showResults();
        this.elements.resultsFooter.style.display = 'flex';
    }

    showNoResults() {
        this.elements.resultsCount.textContent = '0 results';
        this.elements.resultsTime.textContent = 'in 0ms';
        this.elements.resultsList.innerHTML = '';
        this.elements.noResults.style.display = 'flex';
        this.elements.resultsFooter.style.display = 'none';
    }

    showResults() {
        this.elements.noResults.style.display = 'none';
    }

    hideResults() {
        this.elements.resultsSection.style.display = 'none';
        this.elements.searchControls.style.display = 'none';
    }

    clearResults() {
        this.searchResults = [];
        this.hideResults();
    }

    showResultsSkeleton() {
        this.elements.resultsSection.style.display = 'flex';
        this.elements.resultsSkeleton.style.display = 'block';
        this.elements.resultsList.style.display = 'none';
        this.elements.noResults.style.display = 'none';
    }

    hideResultsSkeleton() {
        this.elements.resultsSkeleton.style.display = 'none';
        this.elements.resultsList.style.display = 'block';
    }

    handleResultAction(action, result) {
        switch (action) {
            case 'open':
                this.selectResult(result);
                break;
            case 'copy':
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(result.path);
                    this.showStatusMessage('Path copied to clipboard', 'success');
                }
                break;
        }
    }

    clearSearch() {
        this.elements.searchInput.value = '';
        this.elements.clearBtn.style.display = 'none';
        this.elements.clearBtn.classList.remove('visible');
        this.hasQuery = false;
        this.clearResults();
        this.collapseWindow();
        this.elements.searchInput.focus();
    }

    async selectResult(result) {
        console.log('Selected result:', result);
        
        // Add visual feedback to the selected item
        const resultElement = document.querySelector(`[data-index="${this.searchResults.indexOf(result)}"]`);
        if (resultElement) {
            resultElement.style.background = 'var(--accent-light)';
            resultElement.style.borderColor = 'var(--accent-color)';
            resultElement.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                if (resultElement) {
                    resultElement.style.background = '';
                    resultElement.style.borderColor = '';
                    resultElement.style.transform = '';
                }
            }, 200);
        }
        
        try {
            if (window.electronAPI && window.electronAPI.invoke) {
                await window.electronAPI.invoke('search-window-select-result', result);
            } else {
                // Demo mode - just show a message
                this.showStatusMessage(`Opening: ${result.title}`, 'success');
            }
            
        } catch (error) {
            console.error('Error selecting result:', error);
            this.showStatusMessage('Failed to open result', 'error');
        }
    }

    showStatusMessage(message, type = 'info') {
        // Create a temporary status message
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: var(--accent-color);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        
        if (type === 'error') {
            statusDiv.style.background = 'var(--error-color)';
        } else if (type === 'success') {
            statusDiv.style.background = 'var(--success-color)';
        }
        
        document.body.appendChild(statusDiv);
        
        setTimeout(() => {
            statusDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 300);
        }, 2000);
    }

    getSearchFilters() {
        return {
            searchTypes: {
                files: this.elements.filterFiles?.checked ?? true,
                content: this.elements.filterContent?.checked ?? true,
                web: this.elements.filterWeb?.checked ?? false
            },
            fileTypes: {
                js: this.elements.filterJs?.checked ?? true,
                css: this.elements.filterCss?.checked ?? true,
                html: this.elements.filterHtml?.checked ?? true,
                md: this.elements.filterMd?.checked ?? true
            }
        };
    }

    updateSearchFilters() {
        // Re-run search with new filters if there's a current query
        const query = this.elements.searchInput.value.trim();
        if (query) {
            this.performSearch(query);
        }
    }

    toggleFilterPanel() {
        const isVisible = this.elements.filterPanel.style.display === 'block';
        if (isVisible) {
            this.hideFilterPanel();
        } else {
            this.showFilterPanel();
        }
    }

    showFilterPanel() {
        this.elements.filterPanel.style.display = 'block';
        this.elements.filterPanel.classList.add('slide-down');
        this.elements.filterBtn.classList.add('active');
    }

    hideFilterPanel() {
        this.elements.filterPanel.style.display = 'none';
        this.elements.filterBtn.classList.remove('active');
    }



    openSettings() {
        // Placeholder for settings functionality
        console.log('Opening search settings...');
        this.updateStatus('Search settings coming soon', 'info');
    }

    expandWindow() {
        if (this.isExpanded) return;
        
        this.elements.container.classList.remove('collapsed');
        this.elements.container.classList.add('expanded');
        this.isExpanded = true;
        
        // Notify main process about size change
        if (window.electronAPI && window.electronAPI.invoke) {
            window.electronAPI.invoke('search-window-toggle-expand');
        }
    }

    collapseWindow() {
        if (!this.isExpanded) return;
        
        this.elements.container.classList.remove('expanded');
        this.elements.container.classList.add('collapsed');
        this.isExpanded = false;
        this.hideResults();
        this.hideFilterPanel();
        
        // Notify main process about size change
        if (window.electronAPI && window.electronAPI.invoke) {
            window.electronAPI.invoke('search-window-toggle-expand');
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        if (loading) {
            this.elements.loadingIndicator.style.display = 'flex';
        } else {
            this.elements.loadingIndicator.style.display = 'none';
        }
    }



    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.updateTheme();
        
        // Notify main process
        if (window.electronAPI && window.electronAPI.invoke) {
            window.electronAPI.invoke('search-window-toggle-theme');
        }
    }

    updateTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        console.log('Theme updated to:', this.currentTheme);
    }

    async minimizeWindow() {
        console.log('Search window minimize requested');
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('search-window-minimize');
        } else {
            console.error('Electron require not available');
        }
    }

    async closeWindow() {
        console.log('Search window close requested');
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('search-window-close');
        } else {
            console.error('Electron require not available');
        }
    }

    getTypeIcon(type) {
        const icons = {
            file: '<svg class="result-type-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>',
            content: '<svg class="result-type-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/></svg>',
            web: '<svg class="result-type-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A1,1 0 0,0 10,17M17.9,17.39C17.64,16.58 16.9,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39Z"/></svg>',
            config: '<svg class="result-type-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>',
            folder: '<svg class="result-type-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/></svg>'
        };
        return icons[type] || icons.file;
    }

    highlightSearchTerms(text, searchTerm) {
        if (!searchTerm || !text) return this.escapeHtml(text);
        
        const escapedText = this.escapeHtml(text);
        const escapedTerm = this.escapeHtml(searchTerm);
        const regex = new RegExp(`(${escapedTerm})`, 'gi');
        
        return escapedText.replace(regex, '<span class="result-highlight">$1</span>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the search window UI
new SearchWindowUI();
