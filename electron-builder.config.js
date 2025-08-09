/**
 * Electron Builder Configuration for Portable Single-File Build
 * This creates a truly portable single .exe file
 */
module.exports = {
  appId: "com.buddy.desktop",
  productName: "Buddy Desktop",
  directories: {
    app: ".",
    output: "dist"
  },
  files: [
    "src/**/*",
    "icons/**/*",
    "package.json",
    "!*.md",
    "!docs/**/*",
    "!scripts/**/*",
    "!server/**/*",
    "!test*",
    "!*demo*",
    "!*debug*",
    "!*.ps1",
    "!.env*",
    "!.git*",
    "!.prettier*"
  ],
  extraFiles: [
    {
      from: "src/SystemAudioDump",
      to: "resources/SystemAudioDump"
    }
  ],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"]
      },
      {
        target: "portable", // This creates a portable .exe
        arch: ["x64"]
      }
    ],
    icon: "icons/icon.ico",
    asar: true,
    asarUnpack: [
      "src/SystemAudioDump/**/*"
    ]
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "Buddy Desktop"
  },
  portable: {
    artifactName: "${productName}-${version}-portable.exe"
  },
  publish: null // Don't auto-publish
};
