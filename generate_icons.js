// Simple icon generator for the extension
// This creates basic PNG icons using ASCII art approach

const fs = require('fs');

// Create a simple base64 encoded PNG for each size
const createIconData = (size) => {
    // This is a simple approach - in a real scenario you'd use a proper image library
    // For now, we'll create placeholder icons
    
    const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
        
        <!-- Robot head -->
        <rect x="${size * 0.2}" y="${size * 0.25}" width="${size * 0.6}" height="${size * 0.4}" fill="white" rx="${size * 0.05}"/>
        
        <!-- Robot eyes -->
        <rect x="${size * 0.3}" y="${size * 0.35}" width="${size * 0.1}" height="${size * 0.1}" fill="#667eea"/>
        <rect x="${size * 0.6}" y="${size * 0.35}" width="${size * 0.1}" height="${size * 0.1}" fill="#667eea"/>
        
        <!-- Antenna -->
        <line x1="${size * 0.5}" y1="${size * 0.25}" x2="${size * 0.5}" y2="${size * 0.1}" stroke="white" stroke-width="${size * 0.02}"/>
        <circle cx="${size * 0.5}" cy="${size * 0.1}" r="${size * 0.03}" fill="white"/>
        
        <!-- Image icon -->
        <rect x="${size * 0.25}" y="${size * 0.7}" width="${size * 0.5}" height="${size * 0.25}" fill="rgba(255,255,255,0.9)" stroke="#667eea" stroke-width="1"/>
        
        <!-- Mountain shape -->
        <polygon points="${size * 0.3},${size * 0.9} ${size * 0.4},${size * 0.8} ${size * 0.6},${size * 0.85} ${size * 0.7},${size * 0.75} ${size * 0.7},${size * 0.9}" fill="#667eea"/>
        
        <!-- Sun -->
        <circle cx="${size * 0.65}" cy="${size * 0.78}" r="${size * 0.03}" fill="#667eea"/>
    </svg>`;
    
    return canvas;
};

// Generate icons for different sizes
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
    const svgContent = createIconData(size);
    fs.writeFileSync(`icons/icon-${size}.svg`, svgContent);
    console.log(`Generated icon-${size}.svg`);
});

console.log('Icons generated! You can convert SVG to PNG using online tools or image editing software.');
console.log('For now, the extension will work with SVG icons in modern browsers.');

// Create a simple README for the icons
const readme = `# Extension Icons

This directory contains the icons for the AI Image Automator extension.

## Files:
- icon-16.svg - 16x16 icon for browser UI
- icon-32.svg - 32x32 icon for browser UI  
- icon-48.svg - 48x48 icon for extension management
- icon-128.svg - 128x128 icon for Chrome Web Store

## Converting to PNG:
If you need PNG versions, you can:
1. Open the SVG files in any image editor (GIMP, Photoshop, etc.)
2. Export as PNG at the required size
3. Use online SVG to PNG converters
4. Use command line tools like ImageMagick: \`convert icon-16.svg icon-16.png\`

The extension will work with SVG icons in modern browsers.
`;

fs.writeFileSync('icons/README.md', readme);
console.log('Created icons/README.md');
