# Buddy Desktop Release Process

This document explains how to create releases for both Windows and macOS platforms.

## Overview

The Buddy Desktop application is built using Electron and Electron Forge. We use GitHub Actions to automatically build and release versions for both platforms when you create a new git tag.

## Quick Release

### Option 1: Using the Release Script (Recommended)

```bash
# Create a release with current version
npm run create-release

# Or create a release with a new version
npm run create-release 0.1.8
```

### Option 2: Using PowerShell (Windows)

```powershell
# Create a release with current version
.\scripts\create-release.ps1

# Or create a release with a new version
.\scripts\create-release.ps1 -Version "0.1.8"
```

### Option 3: Manual Process

1. Update the version in `package.json`:
   ```bash
   # Update version manually or use npm version
   npm version 0.1.8
   ```

2. Create and push a git tag:
   ```bash
   git tag -a v0.1.8 -m "Release v0.1.8"
   git push origin v0.1.8
   ```

## What Happens After Creating a Release

Once you push a tag (starting with `v`), GitHub Actions will automatically:

1. **Build Windows Version**:
   - Creates `buddy-setup.exe` (Windows installer)
   - Creates `.nupkg` files for auto-updates
   - Builds on Windows Server environment

2. **Build macOS Versions**:
   - Creates `buddy-mac-x64.dmg` (Intel Macs)
   - Creates `buddy-mac-arm64.dmg` (Apple Silicon Macs)
   - Builds on macOS environment with proper code signing

3. **Create GitHub Release**:
   - Creates a new release on GitHub
   - Uploads all installers as release assets
   - Adds release notes with download instructions

## Built Files

### Windows
- **buddy-setup.exe**: Main installer for Windows 10/11 (64-bit)
- **buddy-{version}-full.nupkg**: Update package for existing installations
- **RELEASES**: Metadata file for the update system

### macOS
- **buddy-mac-x64.dmg**: DMG installer for Intel-based Macs
- **buddy-mac-arm64.dmg**: DMG installer for Apple Silicon Macs (M1/M2/M3)

## Local Building

### Build for Current Platform Only

```bash
# Build for your current platform
npm run make
```

### Build Windows (only works on Windows)

```bash
npm run build-windows
```

The built files will be in the `out/make/` directory.

## Distribution Strategy

### For Users
1. **Windows Users**: Download and run `buddy-setup.exe`
2. **Mac Users (Intel)**: Download and install `buddy-mac-x64.dmg`
3. **Mac Users (Apple Silicon)**: Download and install `buddy-mac-arm64.dmg`

### Auto-Updates
The application includes `electron-updater` which will automatically check for and install updates on Windows. macOS updates are handled through the DMG distribution.

## Monitoring Releases

- **GitHub Actions**: https://github.com/chatbotde/buddydesktop/actions
- **Releases**: https://github.com/chatbotde/buddydesktop/releases

## Troubleshooting

### Build Fails
1. Check the GitHub Actions logs for detailed error messages
2. Ensure all dependencies are properly listed in `package.json`
3. Verify that icons exist in the `icons/` directory

### macOS Code Signing Issues
- macOS builds must be done on macOS runners in GitHub Actions
- Cross-compilation from Windows to macOS is not supported for signed apps

### Version Conflicts
- Ensure the version in `package.json` matches the git tag version
- Use semantic versioning (e.g., `0.1.8`, not `v0.1.8` in package.json)

## Security Notes

- The source code is protected and not included in releases
- Only compiled binaries are distributed
- The `asar` archive is encrypted and integrity-validated
- All builds use security fuses to disable Node.js access

## File Sizes

Expect the following approximate file sizes:
- Windows installer: ~100-150 MB
- macOS DMG files: ~100-150 MB each

These sizes include the full Electron runtime and all dependencies.
