const { autoUpdater } = require('electron-updater');
const { app, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

class AutoUpdateService {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.isUpdateAvailable = false;
        this.isUpdateDownloaded = false;
        
        // Configure auto-updater
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = true;
        
        // Set update server URL (you can use GitHub releases or your own server)
        // For GitHub releases, this will be automatically detected
        // For custom server, uncomment and set your URL:
        // autoUpdater.setFeedURL({
        //     provider: 'generic',
        //     url: 'https://your-update-server.com/updates'
        // });
        
        this.setupEventListeners();
        this.setupIpcHandlers();
    }

    setupEventListeners() {
        // Check for updates when app starts
        autoUpdater.on('checking-for-update', () => {
            console.log('Checking for updates...');
            this.sendStatusToWindow('checking-for-update', 'Checking for updates...');
        });

        autoUpdater.on('update-available', (info) => {
            console.log('Update available:', info);
            this.isUpdateAvailable = true;
            this.sendStatusToWindow('update-available', {
                message: 'Update available',
                version: info.version,
                releaseDate: info.releaseDate
            });
            
            // Show update dialog
            this.showUpdateDialog(info);
        });

        autoUpdater.on('update-not-available', (info) => {
            console.log('Update not available:', info);
            this.sendStatusToWindow('update-not-available', 'No updates available');
        });

        autoUpdater.on('error', (err) => {
            console.error('Auto-updater error:', err);
            this.sendStatusToWindow('error', {
                message: 'Update error',
                error: err.message
            });
        });

        autoUpdater.on('download-progress', (progressObj) => {
            const logMessage = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
            console.log(logMessage);
            this.sendStatusToWindow('download-progress', {
                bytesPerSecond: progressObj.bytesPerSecond,
                percent: progressObj.percent,
                transferred: progressObj.transferred,
                total: progressObj.total
            });
        });

        autoUpdater.on('update-downloaded', (info) => {
            console.log('Update downloaded:', info);
            this.isUpdateDownloaded = true;
            this.sendStatusToWindow('update-downloaded', {
                message: 'Update downloaded and ready to install',
                version: info.version
            });
            
            // Show install dialog
            this.showInstallDialog(info);
        });
    }

    setupIpcHandlers() {
        // Handle manual update check from renderer
        ipcMain.handle('check-for-updates', async () => {
            try {
                await this.checkForUpdates();
                return { success: true };
            } catch (error) {
                console.error('Error checking for updates:', error);
                return { success: false, error: error.message };
            }
        });

        // Handle download update request
        ipcMain.handle('download-update', async () => {
            try {
                if (this.isUpdateAvailable) {
                    await autoUpdater.downloadUpdate();
                    return { success: true };
                } else {
                    return { success: false, error: 'No update available' };
                }
            } catch (error) {
                console.error('Error downloading update:', error);
                return { success: false, error: error.message };
            }
        });

        // Handle install update request
        ipcMain.handle('install-update', async () => {
            try {
                if (this.isUpdateDownloaded) {
                    autoUpdater.quitAndInstall();
                    return { success: true };
                } else {
                    return { success: false, error: 'No update downloaded' };
                }
            } catch (error) {
                console.error('Error installing update:', error);
                return { success: false, error: error.message };
            }
        });

        // Get current version
        ipcMain.handle('get-app-version', () => {
            return app.getVersion();
        });
    }

    async checkForUpdates() {
        try {
            console.log('Checking for updates...');
            await autoUpdater.checkForUpdates();
        } catch (error) {
            console.error('Error checking for updates:', error);
            throw error;
        }
    }

    showUpdateDialog(info) {
        const options = {
            type: 'info',
            title: 'Update Available',
            message: `A new version (${info.version}) is available!`,
            detail: `Current version: ${app.getVersion()}\nNew version: ${info.version}\n\nWould you like to download and install the update?`,
            buttons: ['Download Update', 'Remind Me Later', 'Skip This Version'],
            defaultId: 0,
            cancelId: 1
        };

        dialog.showMessageBox(this.mainWindow, options).then((result) => {
            switch (result.response) {
                case 0: // Download Update
                    this.downloadUpdate();
                    break;
                case 1: // Remind Me Later
                    // Schedule check for later (e.g., next app start)
                    break;
                case 2: // Skip This Version
                    // Could implement version skipping logic here
                    break;
            }
        });
    }

    showInstallDialog(info) {
        const options = {
            type: 'info',
            title: 'Update Ready',
            message: `Update ${info.version} has been downloaded!`,
            detail: 'The update is ready to install. The app will restart to complete the installation.',
            buttons: ['Install Now', 'Install Later'],
            defaultId: 0,
            cancelId: 1
        };

        dialog.showMessageBox(this.mainWindow, options).then((result) => {
            if (result.response === 0) {
                // Install now
                autoUpdater.quitAndInstall();
            }
            // If "Install Later", the update will be installed on next app quit
        });
    }

    async downloadUpdate() {
        try {
            console.log('Starting update download...');
            await autoUpdater.downloadUpdate();
        } catch (error) {
            console.error('Error downloading update:', error);
            this.sendStatusToWindow('error', {
                message: 'Download failed',
                error: error.message
            });
        }
    }

    sendStatusToWindow(channel, data) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send(`update-${channel}`, data);
        }
    }

    // Start checking for updates (called from main process)
    start() {
        // Check for updates after a short delay to let the app fully start
        setTimeout(() => {
            this.checkForUpdates();
        }, 3000);
    }
}

module.exports = AutoUpdateService; 