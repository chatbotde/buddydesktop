# PowerShell script to create a release
param(
    [string]$Version
)

# Read current version from package.json
$packagePath = Join-Path $PSScriptRoot ".." "package.json"
$packageJson = Get-Content $packagePath | ConvertFrom-Json
$currentVersion = $packageJson.version

Write-Host "📦 Current version: $currentVersion" -ForegroundColor Green

# Use provided version or current version
if (-not $Version) {
    $Version = $currentVersion
}

$tagName = "v$Version"
Write-Host "🏷️  Creating release: $tagName" -ForegroundColor Blue

try {
    # Update package.json version if different
    if ($Version -ne $currentVersion) {
        $packageJson.version = $Version
        $packageJson | ConvertTo-Json -Depth 100 | Set-Content $packagePath
        Write-Host "✅ Updated package.json version to $Version" -ForegroundColor Green
        
        # Commit version change
        git add package.json
        git commit -m "chore: bump version to $Version"
    }

    # Create and push tag
    git tag -a $tagName -m "Release $tagName"
    Write-Host "✅ Created tag: $tagName" -ForegroundColor Green

    git push origin $tagName
    Write-Host "✅ Pushed tag: $tagName" -ForegroundColor Green

    Write-Host @"

🚀 Release process started!

The GitHub Actions workflow will now:
1. Build Windows version (x64)
2. Build macOS version (x64 and ARM64) 
3. Create a GitHub release with all installers

Check the progress at: https://github.com/chatbotde/buddydesktop/actions

The release will be available at: https://github.com/chatbotde/buddydesktop/releases

"@ -ForegroundColor Cyan

} catch {
    Write-Host "❌ Error creating release: $_" -ForegroundColor Red
    exit 1
}
