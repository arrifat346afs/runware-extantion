# Installation Guide - AI Image Automator Chrome Extension

## Chrome Installation (Manifest V3)

### Step 1: Prepare Chrome
1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable "Developer mode"** in the top right corner
3. You should see additional buttons appear (Load unpacked, Pack extension, etc.)

### Step 2: Load the Extension
1. **Click "Load unpacked"** button
2. **Navigate to this extension folder** and select it
3. **The extension should load** and appear in your extensions list
4. **Pin the extension** to your toolbar for easy access

### Step 3: Verify Installation
1. **Look for the extension icon** in your Chrome toolbar
2. **Click the extension icon** - the popup should open
3. **You should see** "AI Image Generation Automator" interface

## Testing the Extension

### Quick Test with Test Page
1. **Open the test page**
   - Open `test-page.html` in Chrome
   - This simulates an AI image generation website
   - You should see a "🤖 AI Automator Ready" indicator appear briefly

2. **Load sample prompts**
   - Click the extension icon in your Chrome toolbar
   - Click "Select Text File with Prompts"
   - Choose `sample_prompts.txt` (contains 15 test prompts)

3. **Test connection**
   - Click "Test Connection" button
   - You should see "✅ Connection successful!" message
   - If you see an error, refresh the page and try again

4. **Start automation test**
   - Set wait time to 5 seconds (for quick testing)
   - Click "Start Automation"
   - Watch the extension automatically:
     - Fill the textarea with prompts
     - Click the generate button
     - Wait for the specified time
     - Move to the next prompt

## Using with Real AI Websites

### Supported Websites
The extension works with most AI image generation websites including:
- **Runware.ai** ✅
- **Leonardo.ai** ✅
- **Playground.ai** ✅
- **Midjourney** (Discord interface)
- **DALL-E** (OpenAI)
- **Stability AI**
- And many more!

### Steps for Real Usage:
1. **Navigate** to your AI image generation website
2. **Make sure** you're logged in and on the generation page
3. **Click the extension icon** in Chrome toolbar
4. **Load your prompts file** (one prompt per line)
5. **Click "Test Connection"** to verify compatibility
6. **Set appropriate wait time** (30-60 seconds recommended for real generation)
7. **Click "Start Automation"** and monitor the first few prompts

## Troubleshooting

### Extension not loading in Chrome
- **Make sure Developer mode is enabled** in `chrome://extensions/`
- **Check for error messages** in the extensions page
- **Try reloading the extension** (click the refresh icon)
- **Check Chrome version** - requires Chrome 88+ for Manifest V3

### "Test Connection" fails
- **Refresh the page** and try again
- **Make sure the page has loaded completely**
- **Check browser console** (F12) for error messages
- **Try the test page first** to verify extension functionality

### Automation not working
- **Use "Debug Elements"** to see what elements are found
- **Make sure the website has a visible prompt textarea**
- **Check that the generate button is clickable**
- **Some websites may have anti-automation measures**

### Generate button not found
- **The extension looks for common button patterns**
- **Make sure you're on the actual generation page**
- **Some sites load content dynamically** - wait for full page load
- **Try different selectors** - check console for debug info

## File Formats

### Prompts File
- Use plain text files (.txt)
- One prompt per line
- Empty lines are ignored
- UTF-8 encoding supported

Example:
```
A beautiful sunset over mountains
A futuristic city with flying cars
A peaceful forest scene
```

## Features

- ✅ Automatic prompt processing
- ✅ Customizable wait times
- ✅ Progress tracking
- ✅ Popup to window conversion
- ✅ Smart element detection
- ✅ Error handling and recovery
- ✅ State persistence

## Security & Privacy

- Extension only accesses the current tab when active
- No data sent to external servers
- All processing happens locally
- Prompts stored locally in browser storage

## Support

If you encounter issues:
1. Test with the included `test_page.html`
2. Check browser console for error messages
3. Try different AI generation websites
4. Ensure the website elements are visible and clickable

Happy automating! 🤖✨
