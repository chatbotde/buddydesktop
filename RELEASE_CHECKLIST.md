# Release Checklist

## Pre-Release Steps

### 1. Update Version
- [ ] Update version in `package.json`
- [ ] Update version in any other version files
- [ ] Update `CHANGELOG.md` with new features/fixes

### 2. Code Quality
- [ ] Run tests (if any)
- [ ] Check for any console errors
- [ ] Verify all features work correctly
- [ ] Test on different platforms if possible

### 3. Documentation
- [ ] Update README.md if needed
- [ ] Update CHANGELOG.md with release notes
- [ ] Check all documentation links work

### 4. Configuration
- [ ] Update `forge.config.js` with correct repository details
- [ ] Verify GitHub repository settings
- [ ] Check API keys and environment variables

## Release Process

### Option 1: Automated Release (Recommended)
1. [ ] Commit all changes
2. [ ] Push to main branch
3. [ ] Run: `npm run release`
4. [ ] Go to GitHub repository
5. [ ] Navigate to Releases section
6. [ ] Edit the draft release
7. [ ] Add release notes from CHANGELOG.md
8. [ ] Publish the release

### Option 2: Manual Release
1. [ ] Build the application: `npm run make`
2. [ ] Create git tag: `git tag v<version>`
3. [ ] Push tag: `git push origin v<version>`
4. [ ] Publish: `npm run publish`
5. [ ] Edit release on GitHub

## Post-Release Steps

### 1. Verification
- [ ] Check that release assets are uploaded
- [ ] Verify download links work
- [ ] Test installation on different platforms
- [ ] Check that auto-updater works (if configured)

### 2. Communication
- [ ] Update any external documentation
- [ ] Notify users about the release
- [ ] Share on social media if applicable

### 3. Prepare for Next Release
- [ ] Create new branch for next development cycle
- [ ] Update version to next development version
- [ ] Update CHANGELOG.md with [Unreleased] section

## Troubleshooting

### Common Issues
- **Build fails**: Check Node.js version and dependencies
- **GitHub token issues**: Verify repository permissions
- **Missing assets**: Check forge configuration
- **Auto-updater issues**: Verify signing certificates

### Useful Commands
```bash
# Build for current platform
npm run make

# Build for all platforms
npm run make -- --targets=@electron-forge/maker-squirrel,@electron-forge/maker-dmg,@electron-forge/maker-deb

# Publish to GitHub
npm run publish

# Run release script
npm run release
```




