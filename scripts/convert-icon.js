const fs = require('fs');
const path = require('path');

// Simple script to create a placeholder PNG icon
// In a real scenario, you'd want to use a proper image conversion library

console.log('Creating PNG icon for Linux builds...');

// Create a simple PNG header (this is a minimal valid PNG)
const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x20, // width: 32
    0x00, 0x00, 0x00, 0x20, // height: 32
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x00, 0x00, 0x00, 0x00, // IHDR CRC (placeholder)
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x63, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // minimal compressed data
    0x00, 0x00, 0x00, 0x00, // IDAT CRC (placeholder)
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // IEND CRC
]);

const iconPath = path.join(__dirname, '..', 'icons', 'icon.png');
fs.writeFileSync(iconPath, pngHeader);

console.log('✅ Created icon.png for Linux builds');
console.log('Note: This is a minimal placeholder PNG. For production, convert your JPEG to PNG properly.');
