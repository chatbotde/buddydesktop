const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
    packagerConfig: {
    externals: ['electron-squirrel-startup'],
    
        asar: true,
        extraResource: ['./src/SystemAudioDump'],
        icon: './icons/icon', // Base icon path (Electron Forge will auto-detect extensions)
        // Ignore only dev and doc folders/files. Do not exclude node_modules or src.
        ignore: [
            // Build and development directories
            /^\/(?:out|server|scripts|docs|test|tests|coverage)(?:\/.+)?$/,
            /^\/\.(?:git|github)(?:\/.+)?$/,
            
            // Environment and config files
            /env\.example$/i,
            /\.env$/,
            /\.gitignore$/,
            /\.prettierrc$/,
            /\.prettierignore$/,
            
            // Documentation files
            /CHANGELOG\.md$/i,
            /RELEASE_CHECKLIST\.md$/i,
            /SYSTEM-DESIGN\.md$/i,
            /README.*\.md$/i,
            /\.md$/i,
            /\.markdown$/i,
            /\.txt$/i,
            
            // Demo and test files
            /capability-demo\.html$/i,
            /capability-detection-demo\.html$/i,
            /debug-live-streaming\.html$/i,
            /live-media-test\.html$/i,
            /usage-dashboard\.html$/i,
            /user-stats-dashboard\.html$/i,
            /-demo\./i,
            /-test\./i,
            /-example\./i,
            /demo\./i,
            /test\./i,
            /example\./i,
            
            // Development and debug files
            /console-debug\.js$/i,
            /quick-debug\.js$/i,
            /fix-live-streaming\.js$/i,
            /test-installation\.js$/i,
            /start-usage-tracking\.ps1$/i,
            
            // Backup and alternative files
            /-original\./i,
            /-backup\./i,
            /-modular\./i,
            /renderer-original-backup\.js$/i,
            /buddy-element-original\.js$/i,
            /index-original\.js$/i,
            /buddy-element-modular\.js$/i,
            /index-modular\.js$/i,
            /renderer-modular\.js$/i,
            
            // Math test files
            /test-unified-renderer\.html$/i,
            
            // PowerShell scripts
            /\.ps1$/i,
            
            // Temporary and cache files
            /\.tmp$/i,
            /\.cache$/i,
            /\.temp$/i
        ],
        // Additional protection
        overwrite: true,
        prune: true
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'buddy',
                productName: 'buddy',
                shortcutName: 'Buddy',
                createDesktopShortcut: true,
                createStartMenuShortcut: true,
                iconUrl: 'https://raw.githubusercontent.com/chatbotde/buddydesktop/main/icons/icon.ico',
                setupIcon: './icons/icon.ico',
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['win32'],
            config: {
                // Creates a portable ZIP file
            },
        },
        {
            name: '@electron-forge/maker-dmg',
            platforms: ['darwin'],
            config: {
                icon: './icons/icon.icns',
                // Removed background reference to avoid build errors
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'chatbotde',
                    name: 'buddydesktop'
                },
                prerelease: false,
                draft: true,
                tagName: 'v{{ version }}',
                name: 'v{{ version }}',
                body: 'Release {{ version }} of Buddy Desktop - Compiled packages only. Source code is protected.',
                // Only upload the compiled packages, not source code
                assets: [
                    {
                        name: 'buddy-win-x64.exe',
                        path: './out/make/squirrel.windows/x64/buddy-{{ version }} Setup.exe'
                    },
                    {
                        name: 'buddy-mac-x64.dmg',
                        path: './out/make/buddy-{{ version }}-x64.dmg'
                    }
                ]
            }
        }
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};
