# Search Window Feature

This search window feature provides a dedicated floating window for searching files, content, and other resources within your workspace.

## Files Structure

```
src/features/search/
├── SearchWindow.js         # Main search window implementation
├── SearchManager.js        # Search logic and providers
├── SearchFeature.js        # Feature coordination and integration
├── search-window.html      # Search window UI
├── search-window.css       # Search window styles
├── search-example.js       # Frontend JavaScript for the window
└── index.js               # Module exports and utilities
```

## Integration

The search feature is integrated into the buddy-header.js component with:

1. **Property**: `isSearchActive` - tracks search state
2. **Handlers**: 
   - `_handleToggleSearch()` - toggle search in controls
   - `_handleMenuToggleSearch()` - toggle search in main menu
   - `_handleOpenSearchWindow()` - open dedicated search window
3. **Menu Items**:
   - "Search" toggle in main menu
   - "Search Window" option in main menu

## Usage

### From Header Menu
- Click the main menu button (☰)
- Select "Search" to toggle search functionality
- Select "Search Window" to open the dedicated search window

### Search Window Features
- **File Search**: Find files by name and path
- **Content Search**: Search within file contents
- **Filters**: Filter by file types (JS, CSS, HTML, MD)
- **Real-time Results**: Live search with debounced input
- **Expandable Interface**: Compact input expands to show results
- **Theme Support**: Light/dark theme toggle

### Search Types
1. **Files**: Search by filename and path
2. **Content**: Search within file contents with context
3. **Web**: Placeholder for future web search integration

## Events

The search feature dispatches these events:

- `toggle-search`: Toggle search functionality
- `open-search-window`: Open the search window
- `search-open-file`: Open a file from search results
- `search-open-file-location`: Open file at specific content location

## Configuration

Default configuration in `SearchFeature.js`:

```javascript
{
    enableWebSearch: false,
    maxResults: 100,
    searchDelay: 300,
    cacheResults: true
}
```

## Dependencies

The search feature requires:
- `glob` package for file pattern matching
- Electron's `ipcMain` and `BrowserWindow`
- Node.js `fs` and `path` modules

## Future Enhancements

- Web search integration
- Search history with persistence
- Advanced search operators
- Search result preview
- Custom search providers
- Saved searches and filters
