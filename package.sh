#!/bin/bash

# AI Image Automator Extension Packaging Script

echo "🤖 AI Image Automator - Extension Packaging"
echo "=========================================="

# Create a temporary directory for packaging
TEMP_DIR="ai-image-automator-extension"
XPI_NAME="ai-image-automator.xpi"

# Clean up any existing package
rm -rf "$TEMP_DIR"
rm -f "$XPI_NAME"

# Create package directory
mkdir "$TEMP_DIR"

echo "📦 Copying extension files..."

# Copy essential extension files
cp manifest.json "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"

# Copy icons directory
cp -r icons "$TEMP_DIR/"

echo "✅ Files copied successfully"

# Create XPI package (Firefox extension format)
echo "🔧 Creating XPI package..."
cd "$TEMP_DIR"
zip -r "../$XPI_NAME" ./*
cd ..

# Clean up temporary directory
rm -rf "$TEMP_DIR"

echo "🎉 Package created: $XPI_NAME"
echo ""
echo "Installation Instructions:"
echo "========================="
echo "1. Open Firefox"
echo "2. Navigate to about:addons"
echo "3. Click the gear icon and select 'Install Add-on From File'"
echo "4. Select the $XPI_NAME file"
echo "5. Click 'Add' when prompted"
echo ""
echo "Or for development:"
echo "1. Navigate to about:debugging"
echo "2. Click 'This Firefox'"
echo "3. Click 'Load Temporary Add-on'"
echo "4. Select manifest.json from the extracted files"
echo ""
echo "Test the extension using test_page.html"
echo "Happy automating! 🚀"
