# Icon Setup Guide for Buddy Electron App

This guide will help you set up icons for different operating systems in your Electron app.

## Current Setup

✅ **SVG Icon Created**: `icons/icon.svg` - A modern AI-themed icon with gradient background
✅ **Forge Config Updated**: Icons are now configured for all platforms
✅ **Placeholder Files Created**: Ready for actual icon files

## Required Icon Files

### Windows (.ico)
- **File**: `icons/icon.ico`
- **Sizes**: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16
- **Usage**: Windows executable and installer icons

### macOS (.icns)
- **File**: `icons/icon.icns`
- **Sizes**: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
- **Usage**: macOS app bundle and DMG installer

### Linux (.png)
- **File**: `icons/icon.png`
- **Size**: 512x512 (recommended)
- **Usage**: Linux package icons

## How to Generate Icons

### Option 1: Online Converters (Recommended)

1. **For Windows (.ico)**:
   - Go to https://convertio.co/svg-ico/
   - Upload `icons/icon.svg`
   - Download as `icon.ico`
   - Place in `icons/` directory

2. **For macOS (.icns)**:
   - Go to https://cloudconvert.com/svg-to-icns
   - Upload `icons/icon.svg`
   - Download as `icon.icns`
   - Place in `icons/` directory

3. **For Linux (.png)**:
   - Go to https://convertio.co/svg-png/
   - Upload `icons/icon.svg`
   - Set size to 512x512
   - Download as `icon.png`
   - Place in `icons/` directory

### Option 2: Command Line Tools

```bash
# Install tools
npm install -g svg2png svg2ico

# Generate icons
svg2png icons/icon.svg -o icons/icon.png -w 512 -h 512
svg2ico icons/icon.svg -o icons/icon.ico
```

### Option 3: macOS Icon Composer (macOS only)

1. Open "Icon Composer" (part of Xcode)
2. Import your SVG
3. Export as `.icns`

## Testing Your Icons

After generating the icon files:

1. **Replace placeholder files** with actual icon files
2. **Test the build**:
   ```bash
   npm run make
   ```
3. **Check the output** in `out/` directory

## Configuration Details

The `forge.config.js` has been updated with:

- **Global icon**: `./icons/icon` (auto-detects extensions)
- **Windows**: `./icons/icon.ico` for installer
- **macOS**: `./icons/icon.icns` for DMG
- **Linux**: `./icons/icon.png` for packages

## Optional: Custom DMG Background

For a more professional macOS installer, you can create a custom DMG background:

1. Create `icons/dmg-background.png` (600x400px recommended)
2. The background is already configured in the DMG maker

## Troubleshooting

### Common Issues

1. **Icons not showing**: Make sure file paths are correct
2. **Wrong sizes**: Use the recommended sizes for each platform
3. **Build errors**: Check that icon files exist and are valid

### Verification

After setup, verify your icons work by:

```bash
# Test packaging
npm run package

# Test making installers
npm run make

# Check output files have correct icons
```

## Next Steps

1. Generate actual icon files using one of the methods above
2. Replace placeholder files in `icons/` directory
3. Test the build with `npm run make`
4. Verify icons appear correctly in the built applications

## File Structure

```
buddydesktop/
├── icons/
│   ├── icon.svg          # Source SVG (✅ created)
│   ├── icon.ico          # Windows icon (⏳ placeholder)
│   ├── icon.icns         # macOS icon (⏳ placeholder)
│   └── icon.png          # Linux icon (⏳ placeholder)
├── forge.config.js       # Updated with icon configs (✅ done)
└── scripts/
    └── generate-icons.js # Icon generation script (✅ created)
```

Your Electron app is now configured to use platform-specific icons! 🎉 