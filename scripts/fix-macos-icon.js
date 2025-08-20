const fs = require('fs');
const path = require('path');

console.log('Fixing macOS icon issue...');

// Create a simple .icns file structure
// This is a minimal valid .icns file
const icnsHeader = Buffer.from([
    0x69, 0x63, 0x6E, 0x73, // 'icns'
    0x00, 0x00, 0x00, 0x20, // Size (32 bytes)
    0x69, 0x63, 0x6E, 0x38, // 'icn8' (8-bit icon)
    0x00, 0x00, 0x00, 0x10, // Size (16 bytes)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Minimal icon data
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

const iconPath = path.join(__dirname, '..', 'icons', 'icon.icns');
fs.writeFileSync(iconPath, icnsHeader);

console.log('✅ Created icon.icns for macOS builds');
console.log('Note: This is a minimal placeholder .icns file. For production, convert your icon to proper .icns format.');


















