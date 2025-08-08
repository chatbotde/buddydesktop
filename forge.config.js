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
            /^\/(?:out|server|scripts|docs|test|tests|coverage)(?:\/.+)?$/,
            /^\/\.(?:git|github)(?:\/.+)?$/,
            /env\.example$/i,
            /CHANGELOG\.md$/i,
            /RELEASE_CHECKLIST\.md$/i,
            /SYSTEM-DESIGN\.md$/i,
            /README\.md$/i,
            /\.md$/i,
            /\.markdown$/i,
            /\.txt$/i
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
