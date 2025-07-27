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
            filterBtn: document.getElementById('filterBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            themeToggle: document.getElementById('themeToggle'),
            minimizeBtn: document.getElementById('minimizeBtn'),
            closeBtn: document.getElementById('closeBtn'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            resultsPanel: document.getElementById('resultsPanel'),
            resultsCount: document.getElementById('resultsCount'),
            expandBtn: document.getElementById('expandBtn'),
            resultsList: document.getElementById('resultsList'),
            filterPanel: document.getElementById('filterPanel'),
            filterCloseBtn: document.getElementById('filterCloseBtn'),
            statusText: document.getElementById('statusText'),
            searchStatus: document.getElementById('searchStatus'),
            
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

        // Results panel
        this.elements.expandBtn.addEventListener('click', () => {
            this.toggleResultsExpansion();
        });

        // Filter panel
        this.elements.filterCloseBtn.addEventListener('click', () => {
            this.hideFilterPanel();
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

        // Show clear button if there's text
        if (query.trim()) {
            this.elements.clearBtn.style.display = 'flex';
        } else {
            this.elements.clearBtn.style.display = 'none';
            this.clearResults();
            return;
        }

        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    async performSearch(query) {
        if (!query.trim()) return;

        this.setLoading(true);
        this.updateStatus('Searching...', 'searching');

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

            this.displayResults(results);
            this.updateStatus(`Found ${results.length} results`, 'success');
            
        } catch (error) {
            console.error('Search error:', error);
            this.updateStatus('Search failed', 'error');
            this.displayResults([]);
        } finally {
            this.setLoading(false);
        }
    }

    async mockSearch(query) {
        // Mock search for development/testing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [
            {
                type: 'file',
                title: `File containing "${query}"`,
                path: '/src/components/buddy-header.js',
                content: `This file contains references to ${query} in the header component...`,
                relevance: 0.9
            },
            {
                type: 'content',
                title: `Content match for "${query}"`,
                path: '/docs/README.md',
                content: `Documentation about ${query} and its usage in the application...`,
                relevance: 0.7
            },
            {
                type: 'file',
                title: `Configuration for "${query}"`,
                path: '/config/settings.json',
                content: `Configuration settings related to ${query}...`,
                relevance: 0.6
            }
        ];
    }

    displayResults(results) {
        this.searchResults = results;
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        // Update results count
        this.elements.resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;

        // Generate results HTML
        const resultsHTML = results.map((result, index) => {
            const typeIcon = this.getTypeIcon(result.type);
            const highlightedContent = this.highlightSearchTerms(result.content, this.elements.searchInput.value);
            
            return `
                <div class="result-item" data-index="${index}">
                    <div class="result-title">
                        ${typeIcon}
                        ${this.escapeHtml(result.title)}
                    </div>
                    <div class="result-path">${this.escapeHtml(result.path)}</div>
                    <div class="result-content">${highlightedContent}</div>
                </div>
            `;
        }).join('');

        this.elements.resultsList.innerHTML = resultsHTML;

        // Add click listeners to results
        this.elements.resultsList.querySelectorAll('.result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectResult(results[index]);
            });
        });

        // Show results panel
        this.showResults();
    }

    showNoResults() {
        this.elements.resultsCount.textContent = '0 results';
        this.elements.resultsList.innerHTML = `
            <div class="no-results">
                <svg class="no-results-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <div class="no-results-text">No results found</div>
                <div class="no-results-subtitle">Try adjusting your search terms or filters</div>
            </div>
        `;
        this.showResults();
    }

    showResults() {
        this.elements.resultsPanel.style.display = 'flex';
        this.elements.resultsPanel.classList.add('fade-in');
        this.isExpanded = true;
        this.updateExpandButton();
    }

    hideResults() {
        this.elements.resultsPanel.style.display = 'none';
        this.isExpanded = false;
        this.updateExpandButton();
    }

    clearResults() {
        this.searchResults = [];
        this.hideResults();
        this.updateStatus('Ready to search', 'ready');
    }

    clearSearch() {
        this.elements.searchInput.value = '';
        this.elements.clearBtn.style.display = 'none';
        this.clearResults();
        this.elements.searchInput.focus();
    }

    async selectResult(result) {
        console.log('Selected result:', result);
        
        try {
            if (window.electronAPI && window.electronAPI.invoke) {
                await window.electronAPI.invoke('search-window-select-result', result);
            }
            
            // Provide visual feedback
            this.updateStatus(`Opened: ${result.title}`, 'success');
            
        } catch (error) {
            console.error('Error selecting result:', error);
            this.updateStatus('Failed to open result', 'error');
        }
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

    toggleResultsExpansion() {
        // This could control detailed vs compact view
        this.elements.expandBtn.classList.toggle('collapsed');
    }

    updateExpandButton() {
        if (this.isExpanded) {
            this.elements.expandBtn.classList.remove('collapsed');
        } else {
            this.elements.expandBtn.classList.add('collapsed');
        }
    }

    openSettings() {
        // Placeholder for settings functionality
        console.log('Opening search settings...');
        this.updateStatus('Search settings coming soon', 'info');
    }

    setLoading(loading) {
        this.isLoading = loading;
        if (loading) {
            this.elements.loadingIndicator.style.display = 'flex';
        } else {
            this.elements.loadingIndicator.style.display = 'none';
        }
    }

    updateStatus(text, type = 'ready') {
        this.elements.statusText.textContent = text;
        
        // Update status indicator
        this.elements.searchStatus.className = `status-indicator ${type}`;
        
        // Auto-clear status after a delay for non-permanent states
        if (type !== 'ready') {
            setTimeout(() => {
                this.updateStatus('Ready to search', 'ready');
            }, 3000);
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
        if (window.electronAPI && window.electronAPI.invoke) {
            await window.electronAPI.invoke('search-window-minimize');
        }
    }

    async closeWindow() {
        if (window.electronAPI && window.electronAPI.invoke) {
            await window.electronAPI.invoke('search-window-close');
        }
    }

    getTypeIcon(type) {
        const icons = {
            file: '<svg class="result-type-icon" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/></svg>',
            content: '<svg class="result-type-icon" viewBox="0 0 24 24"><path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" fill="currentColor"/></svg>',
            web: '<svg class="result-type-icon" viewBox="0 0 24 24"><path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8Z" fill="currentColor"/></svg>'
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
