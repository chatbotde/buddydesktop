# Auto-Update Setup Guide

This guide will help you set up automatic updates for your Buddy desktop application.

## Prerequisites

1. A GitHub repository for your app
2. GitHub Personal Access Token with repo permissions
3. Electron Forge configured (already done)

## Setup Steps

### 1. Configure GitHub Repository

Update the `forge.config.js` file with your actual GitHub repository details:

```javascript
publishers: [
    {
        name: '@electron-forge/publisher-github',
        config: {
            repository: {
                owner: 'your-actual-github-username',  // Replace with your username
                name: 'your-actual-repo-name'          // Replace with your repo name
            },
            prerelease: false,
            draft: false
        }
    }
]
```

### 2. Set GitHub Token

Create a GitHub Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Set the token as an environment variable:

```bash
# Windows
set GITHUB_TOKEN=your_token_here

# macOS/Linux
export GITHUB_TOKEN=your_token_here
```

### 3. Build and Publish

To create a new release and publish it:

```bash
# Build the app
npm run make

# Publish to GitHub (this will create a release)
npm run publish
```

### 4. Update Version

Before publishing a new version, update the version in `package.json`:

```json
{
    "version": "0.1.2"  // Increment this version
}
```

### 5. Alternative: Custom Update Server

If you prefer to use your own update server instead of GitHub releases:

1. Update the `auto-updater.js` file:
```javascript
// Uncomment and configure your custom server
autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://your-update-server.com/updates'
});
```

2. Your server should return a JSON response like:
```json
{
    "version": "0.1.2",
    "files": [
        {
            "url": "https://your-server.com/downloads/buddy-0.1.2.exe",
            "sha512": "sha512-hash-here",
            "size": 12345678
        }
    ],
    "path": "buddy-0.1.2.exe",
    "sha512": "sha512-hash-here",
    "releaseDate": "2024-01-01T00:00:00.000Z"
}
```

## How It Works

1. **Automatic Check**: The app checks for updates 3 seconds after startup
2. **Manual Check**: Users can check for updates from the Help view
3. **Download**: Updates are downloaded automatically when available
4. **Install**: Users are prompted to install updates immediately or later
5. **Restart**: The app restarts to complete the installation

## Features

- ✅ Automatic update checking on app start
- ✅ Manual update checking from Help view
- ✅ Progress tracking during download
- ✅ User-friendly update dialogs
- ✅ Error handling and retry functionality
- ✅ Support for GitHub releases and custom servers
- ✅ Cross-platform support (Windows, macOS, Linux)

## Troubleshooting

### Common Issues

1. **"No updates available" when there should be**
   - Check that the version in `package.json` is higher than the published version
   - Verify GitHub token has correct permissions
   - Ensure the release is published (not draft)

2. **"Update error" messages**
   - Check network connectivity
   - Verify GitHub repository configuration
   - Check console logs for detailed error messages

3. **Updates not downloading**
   - Ensure the app has write permissions to its directory
   - Check available disk space
   - Verify firewall/antivirus isn't blocking the download

### Debug Mode

To enable debug logging, add this to your main process:

```javascript
// In index.js, after requiring auto-updater
if (process.env.NODE_ENV === 'development') {
    autoUpdater.logger = require('electron-log');
    autoUpdater.logger.transports.file.level = 'info';
}
```

## Security Notes

- Always verify update signatures when possible
- Use HTTPS for custom update servers
- Consider implementing update signing for production apps
- Keep your GitHub token secure and rotate it regularly

## Next Steps

1. Test the update system with a development build
2. Create your first GitHub release
3. Distribute the initial version to users
4. Monitor update success rates and user feedback 