import { html, css, LitElement } from '../../lit-core-2.7.4.min.js';

class MarketplaceWindow extends LitElement {
    static properties = {
        isOpen: { type: Boolean },
        searchQuery: { type: String },
        availableButtons: { type: Array },
        selectedButtons: { type: Array },
        windowPosition: { type: Object }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.searchQuery = '';
        this.selectedButtons = this._loadSelectedButtons();
        this.windowPosition = { x: null, y: null };
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.availableButtons = [
            {
                id: 'home',
                name: 'Home',
                icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9,22 9,12 15,12 15,22',
                category: 'Navigation',
                description: 'Navigate to home page'
            },
            {
                id: 'chat',
                name: 'Chat',
                icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
                category: 'Communication',
                description: 'Open chat interface'
            },
            {
                id: 'history',
                name: 'History',
                icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12,6 12,12 16,14',
                category: 'Navigation',
                description: 'View conversation history'
            },
            {
                id: 'models',
                name: 'Models',
                icon: 'M3 3h18v18H3z M8.5 8.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0 M21 15l-5-5L5 21',
                category: 'AI',
                description: 'Manage AI models'
            },
            {
                id: 'customize',
                name: 'Customize',
                icon: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
                category: 'Settings',
                description: 'Customize appearance and settings'
            },
            {
                id: 'help',
                name: 'Help',
                icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01',
                category: 'Support',
                description: 'Get help and shortcuts'
            },
            {
                id: 'audio-window',
                name: 'Audio Window',
                icon: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z',
                category: 'Audio',
                description: 'Open audio controls window'
            },
            {
                id: 'new-chat',
                name: 'New Chat',
                icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M12 7v6m-3-3h6',
                category: 'Communication',
                description: 'Start a new conversation'
            },
            {
                id: 'toggle-audio',
                name: 'Toggle Audio',
                icon: 'M2 10v3 M6 6v11 M10 3v18 M14 8v7 M18 5v13 M22 10v3',
                category: 'Audio',
                description: 'Toggle audio recording'
            },
            {
                id: 'toggle-video',
                name: 'Toggle Video',
                icon: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5 M2 6h14v12H2z',
                category: 'Video',
                description: 'Toggle video recording'
            },
            {
                id: 'content-protection',
                name: 'Content Protection',
                icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                category: 'Privacy',
                description: 'Toggle content protection and visibility'
            },
            {
                id: 'workspace-visibility',
                name: 'All Workspaces',
                icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
                category: 'Workspace',
                description: 'Toggle visibility on all workspaces'
            }
        ];
    }

    // Load selected buttons from localStorage
    _loadSelectedButtons() {
        try {
            const saved = localStorage.getItem('buddy-custom-menu-buttons');
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('MarketplaceWindow: Loaded buttons from localStorage:', parsed);
                return parsed;
            }
        } catch (error) {
            console.error('Error loading selected buttons:', error);
        }
        // Default buttons if nothing saved
        const defaultButtons = ['home', 'chat', 'history', 'models', 'customize', 'help'];
        console.log('MarketplaceWindow: Using default buttons:', defaultButtons);
        return defaultButtons;
    }

    // Save selected buttons to localStorage
    _saveSelectedButtons() {
        try {
            localStorage.setItem('buddy-custom-menu-buttons', JSON.stringify(this.selectedButtons));
            console.log('MarketplaceWindow: Saved buttons to localStorage:', this.selectedButtons);
        } catch (error) {
            console.error('Error saving selected buttons:', error);
        }
    }

    static styles = css`
        :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .marketplace-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .marketplace-overlay.open {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .marketplace-window {
            position: absolute;
            background: #1a1a1a;
            width: 90vw;
            max-width: 800px;
            height: 80vh;
            max-height: 600px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            cursor: move;
        }

        .marketplace-overlay.open .marketplace-window {
            transform: scale(1);
        }

        .marketplace-window.dragging {
            transition: none;
            user-select: none;
            z-index: 1001;
        }

        .marketplace-window.dragging .marketplace-header {
            background: rgba(0, 122, 255, 0.1);
        }

        .marketplace-header {
            padding: 20px 24px 16px;
            border-bottom: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            user-select: none;
        }

        .marketplace-title {
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            margin: 0;
        }

        .close-btn {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .close-btn:hover {
            background: #333;
            color: #fff;
        }

        .search-container {
            padding: 16px 24px;
            border-bottom: 1px solid #333;
        }

        .search-input {
            width: 100%;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 12px;
            padding: 12px 16px;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
        }

        .search-input:focus {
            border-color: #007AFF;
        }

        .search-input::placeholder {
            color: #666;
        }

        .marketplace-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px 24px;
        }

        .buttons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        }

        .button-card {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        .button-card:hover {
            background: #333;
            border-color: #555;
            transform: translateY(-2px);
        }

        .button-card.selected {
            background: #1a3a5c;
            border-color: #007AFF;
        }

        .button-card.selected::after {
            content: '';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 20px;
            height: 20px;
            background: #007AFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .button-card.selected::before {
            content: '✓';
            position: absolute;
            top: 12px;
            right: 12px;
            color: white;
            font-size: 12px;
            font-weight: bold;
            z-index: 1;
        }

        .button-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 12px;
            color: #007AFF;
        }

        .button-name {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 4px;
        }

        .button-category {
            font-size: 12px;
            color: #007AFF;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .button-description {
            font-size: 13px;
            color: #888;
            line-height: 1.4;
        }

        .marketplace-footer {
            padding: 16px 24px;
            border-top: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .selected-count {
            color: #888;
            font-size: 14px;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-secondary {
            background: #333;
            color: #fff;
        }

        .btn-secondary:hover {
            background: #444;
        }

        .btn-primary {
            background: #007AFF;
            color: white;
        }

        .btn-primary:hover {
            background: #0056CC;
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .no-results {
            text-align: center;
            color: #666;
            padding: 40px 20px;
        }

        .no-results-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 16px;
            opacity: 0.5;
        }
    `;

    get filteredButtons() {
        if (!this.searchQuery) return this.availableButtons;
        
        const query = this.searchQuery.toLowerCase();
        return this.availableButtons.filter(button => 
            button.name.toLowerCase().includes(query) ||
            button.category.toLowerCase().includes(query) ||
            button.description.toLowerCase().includes(query)
        );
    }

    _handleSearch(e) {
        this.searchQuery = e.target.value;
    }

    _toggleButton(buttonId) {
        const isSelected = this.selectedButtons.includes(buttonId);
        if (isSelected) {
            this.selectedButtons = this.selectedButtons.filter(id => id !== buttonId);
        } else {
            this.selectedButtons = [...this.selectedButtons, buttonId];
        }
        this._saveSelectedButtons();
        this.requestUpdate();
    }

    _handleClose() {
        this.isOpen = false;
        // Reset position when closing
        this.windowPosition = { x: null, y: null };
        this.dispatchEvent(new CustomEvent('marketplace-close', { bubbles: true, composed: true }));
    }

    static openExternalWindow(selectedButtons = [], onApply = null, onClose = null) {
        const windowFeatures = 'width=900,height=700,resizable=yes,scrollbars=no,status=no,menubar=no,toolbar=no,location=no';
        const marketplaceWindow = window.open('', 'marketplace', windowFeatures);
        
        if (!marketplaceWindow) {
            alert('Please allow popups for this site to open the marketplace window.');
            return null;
        }

        // Create the HTML content for the external window
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marketplace - Customize Menu</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .marketplace-header {
            padding: 20px 24px 16px;
            border-bottom: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #1a1a1a;
        }

        .marketplace-title {
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            margin: 0;
        }

        .close-btn {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .close-btn:hover {
            background: #333;
            color: #fff;
        }

        .search-container {
            padding: 16px 24px;
            border-bottom: 1px solid #333;
            background: #1a1a1a;
        }

        .search-input {
            width: 100%;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 12px;
            padding: 12px 16px;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
        }

        .search-input:focus {
            border-color: #007AFF;
        }

        .search-input::placeholder {
            color: #666;
        }

        .marketplace-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px 24px;
            background: #000;
        }

        .buttons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        }

        .button-card {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        .button-card:hover {
            background: #333;
            border-color: #555;
            transform: translateY(-2px);
        }

        .button-card.selected {
            background: #1a3a5c;
            border-color: #007AFF;
        }

        .button-card.selected::after {
            content: '';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 20px;
            height: 20px;
            background: #007AFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .button-card.selected::before {
            content: '✓';
            position: absolute;
            top: 12px;
            right: 12px;
            color: white;
            font-size: 12px;
            font-weight: bold;
            z-index: 1;
        }

        .button-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 12px;
            color: #007AFF;
        }

        .button-name {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 4px;
        }

        .button-category {
            font-size: 12px;
            color: #007AFF;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .button-description {
            font-size: 13px;
            color: #888;
            line-height: 1.4;
        }

        .marketplace-footer {
            padding: 16px 24px;
            border-top: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #1a1a1a;
        }

        .selected-count {
            color: #888;
            font-size: 14px;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-secondary {
            background: #333;
            color: #fff;
        }

        .btn-secondary:hover {
            background: #444;
        }

        .btn-primary {
            background: #007AFF;
            color: white;
        }

        .btn-primary:hover {
            background: #0056CC;
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .no-results {
            text-align: center;
            color: #666;
            padding: 40px 20px;
        }

        .no-results-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 16px;
            opacity: 0.5;
        }
    </style>
</head>
<body>
    <div class="marketplace-header">
        <h2 class="marketplace-title">Marketplace - Customize Menu</h2>
        <button class="close-btn" onclick="window.close()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>

    <div class="search-container">
        <input 
            type="text" 
            class="search-input" 
            placeholder="Search buttons, categories, or descriptions..."
            id="searchInput"
        >
    </div>

    <div class="marketplace-content">
        <div class="buttons-grid" id="buttonsGrid">
            <!-- Buttons will be populated by JavaScript -->
        </div>
        <div class="no-results" id="noResults" style="display: none;">
            <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
            </svg>
            <div id="noResultsText">No buttons found</div>
        </div>
    </div>

    <div class="marketplace-footer">
        <div class="selected-count" id="selectedCount">
            0 buttons selected
        </div>
        <div class="action-buttons">
            <button class="btn btn-secondary" onclick="resetSelection()">
                Reset
            </button>
            <button class="btn btn-primary" onclick="applyChanges()">
                Apply Changes
            </button>
        </div>
    </div>

    <script>
        const availableButtons = [
            {
                id: 'home',
                name: 'Home',
                icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9,22 9,12 15,12 15,22',
                category: 'Navigation',
                description: 'Navigate to home page'
            },
            {
                id: 'chat',
                name: 'Chat',
                icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
                category: 'Communication',
                description: 'Open chat interface'
            },
            {
                id: 'history',
                name: 'History',
                icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12,6 12,12 16,14',
                category: 'Navigation',
                description: 'View conversation history'
            },
            {
                id: 'models',
                name: 'Models',
                icon: 'M3 3h18v18H3z M8.5 8.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0 M21 15l-5-5L5 21',
                category: 'AI',
                description: 'Manage AI models'
            },
            {
                id: 'customize',
                name: 'Customize',
                icon: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
                category: 'Settings',
                description: 'Customize appearance and settings'
            },
            {
                id: 'help',
                name: 'Help',
                icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01',
                category: 'Support',
                description: 'Get help and shortcuts'
            },
            {
                id: 'audio-window',
                name: 'Audio Window',
                icon: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z',
                category: 'Audio',
                description: 'Open audio controls window'
            },
            {
                id: 'new-chat',
                name: 'New Chat',
                icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M12 7v6m-3-3h6',
                category: 'Communication',
                description: 'Start a new conversation'
            },
            {
                id: 'toggle-audio',
                name: 'Toggle Audio',
                icon: 'M2 10v3 M6 6v11 M10 3v18 M14 8v7 M18 5v13 M22 10v3',
                category: 'Audio',
                description: 'Toggle audio recording'
            },
            {
                id: 'toggle-video',
                name: 'Toggle Video',
                icon: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5 M2 6h14v12H2z',
                category: 'Video',
                description: 'Toggle video recording'
            },
            {
                id: 'content-protection',
                name: 'Content Protection',
                icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                category: 'Privacy',
                description: 'Toggle content protection and visibility'
            },
            {
                id: 'workspace-visibility',
                name: 'All Workspaces',
                icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
                category: 'Workspace',
                description: 'Toggle visibility on all workspaces'
            }
        ];

        let selectedButtons = ${JSON.stringify(selectedButtons)};
        let searchQuery = '';

        function renderButtons() {
            const buttonsGrid = document.getElementById('buttonsGrid');
            const noResults = document.getElementById('noResults');
            
            const filteredButtons = searchQuery ? 
                availableButtons.filter(button => 
                    button.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    button.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    button.description.toLowerCase().includes(searchQuery.toLowerCase())
                ) : availableButtons;

            if (filteredButtons.length === 0) {
                buttonsGrid.style.display = 'none';
                noResults.style.display = 'block';
                document.getElementById('noResultsText').textContent = 
                    searchQuery ? \`No buttons found matching "\${searchQuery}"\` : 'No buttons available';
                return;
            }

            buttonsGrid.style.display = 'grid';
            noResults.style.display = 'none';

            buttonsGrid.innerHTML = filteredButtons.map(button => \`
                <div class="button-card \${selectedButtons.includes(button.id) ? 'selected' : ''}" 
                     onclick="toggleButton('\${button.id}')">
                    <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="\${button.icon}"/>
                    </svg>
                    <div class="button-name">\${button.name}</div>
                    <div class="button-category">\${button.category}</div>
                    <div class="button-description">\${button.description}</div>
                </div>
            \`).join('');

            updateSelectedCount();
        }

        function toggleButton(buttonId) {
            const index = selectedButtons.indexOf(buttonId);
            if (index > -1) {
                selectedButtons.splice(index, 1);
            } else {
                selectedButtons.push(buttonId);
            }
            renderButtons();
        }

        function updateSelectedCount() {
            const count = selectedButtons.length;
            document.getElementById('selectedCount').textContent = 
                \`\${count} button\${count !== 1 ? 's' : ''} selected\`;
        }

        function resetSelection() {
            selectedButtons = [];
            renderButtons();
        }

        function applyChanges() {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'marketplace-apply',
                    selectedButtons: selectedButtons
                }, '*');
            }
            window.close();
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderButtons();
        });

        // Handle window close
        window.addEventListener('beforeunload', () => {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'marketplace-close'
                }, '*');
            }
        });

        // Initial render
        renderButtons();
    </script>
</body>
</html>
        `;

        marketplaceWindow.document.write(htmlContent);
        marketplaceWindow.document.close();

        // Focus the new window
        marketplaceWindow.focus();

        return marketplaceWindow;
    }

    _handleApply() {
        this._saveSelectedButtons();
        this.dispatchEvent(new CustomEvent('marketplace-apply', { 
            detail: { selectedButtons: this.selectedButtons },
            bubbles: true, 
            composed: true 
        }));
        this._handleClose();
    }

    _handleReset() {
        this.selectedButtons = [];
        this.requestUpdate();
    }

    _handleMouseDown(e) {
        if (e.target.closest('.close-btn') || e.target.closest('.search-input') || e.target.closest('.marketplace-content') || e.target.closest('.marketplace-footer')) {
            return;
        }

        this.isDragging = true;
        const window = this.renderRoot.querySelector('.marketplace-window');
        const rect = window.getBoundingClientRect();
        
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        window.classList.add('dragging');
        
        document.addEventListener('mousemove', this._handleMouseMove.bind(this));
        document.addEventListener('mouseup', this._handleMouseUp.bind(this));
        
        e.preventDefault();
    }

    _handleMouseMove(e) {
        if (!this.isDragging) return;

        const newX = e.clientX - this.dragOffset.x + 10; // Add 10px offset to the right
        const newY = e.clientY - this.dragOffset.y;

        // Constrain to viewport
        const window = this.renderRoot.querySelector('.marketplace-window');
        const windowRect = window.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;

        const constrainedX = Math.max(0, Math.min(newX, viewportWidth - windowRect.width));
        const constrainedY = Math.max(0, Math.min(newY, viewportHeight - windowRect.height));

        this.windowPosition = { x: constrainedX, y: constrainedY };
        this.requestUpdate();
    }

    _handleMouseUp() {
        if (!this.isDragging) return;

        this.isDragging = false;
        const window = this.renderRoot.querySelector('.marketplace-window');
        window.classList.remove('dragging');
        
        document.removeEventListener('mousemove', this._handleMouseMove.bind(this));
        document.removeEventListener('mouseup', this._handleMouseUp.bind(this));
    }

    _getWindowStyle() {
        if (this.windowPosition.x !== null && this.windowPosition.y !== null) {
            return `left: ${this.windowPosition.x}px; top: ${this.windowPosition.y}px;`;
        }
        
        // Default centered position
        return `left: 50%; top: 50%; transform: translate(-50%, -50%) scale(${this.isOpen ? '1' : '0.9'});`;
    }

    render() {
        const filteredButtons = this.filteredButtons;
        
        return html`
            <div class="marketplace-overlay ${this.isOpen ? 'open' : ''}" @click=${this._handleOverlayClick}>
                <div 
                    class="marketplace-window" 
                    style="${this._getWindowStyle()}"
                    @click=${e => e.stopPropagation()}
                    @mousedown=${this._handleMouseDown}
                >
                    <div class="marketplace-header">
                        <h2 class="marketplace-title">Marketplace - Customize Menu</h2>
                        <button class="close-btn" @click=${this._handleClose}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>

                    <div class="search-container">
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="Search buttons, categories, or descriptions..."
                            .value=${this.searchQuery}
                            @input=${this._handleSearch}
                        >
                    </div>

                    <div class="marketplace-content">
                        ${filteredButtons.length > 0 ? html`
                            <div class="buttons-grid">
                                ${filteredButtons.map(button => html`
                                    <div 
                                        class="button-card ${this.selectedButtons.includes(button.id) ? 'selected' : ''}"
                                        @click=${() => this._toggleButton(button.id)}
                                    >
                                        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="${button.icon}"/>
                                        </svg>
                                        <div class="button-name">${button.name}</div>
                                        <div class="button-category">${button.category}</div>
                                        <div class="button-description">${button.description}</div>
                                    </div>
                                `)}
                            </div>
                        ` : html`
                            <div class="no-results">
                                <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                                <div>No buttons found matching "${this.searchQuery}"</div>
                            </div>
                        `}
                    </div>

                    <div class="marketplace-footer">
                        <div class="selected-count">
                            ${this.selectedButtons.length} button${this.selectedButtons.length !== 1 ? 's' : ''} selected
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" @click=${this._handleReset}>
                                Reset
                            </button>
                            <button class="btn btn-primary" @click=${this._handleApply}>
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            this._handleClose();
        }
    }
}

customElements.define('marketplace-window', MarketplaceWindow);