# AI Image Generation Automator - Firefox Extension

A powerful Firefox extension that automates AI image generation by processing multiple prompts from text files sequentially.

## Features

- 🤖 **Automated Prompt Processing**: Load text files with multiple prompts and process them automatically
- ⏱️ **Customizable Timing**: Set wait times between each prompt submission
- 🪟 **Popup to Window**: Convert the extension popup into a separate window for better workflow
- 📁 **File Upload**: Easy drag-and-drop or click to upload text files with prompts
- 📊 **Progress Tracking**: Visual progress bar and status updates
- 🎯 **Smart Element Detection**: Automatically finds textarea and generate buttons on AI image generation websites
- 💾 **State Persistence**: Remembers your settings and progress between sessions

## Supported Websites

The extension works with most AI image generation websites that have:
- A textarea for prompt input
- A generate/submit button

Tested and optimized for popular platforms like:
- Midjourney
- OpenAI DALL-E
- Stability AI
- Runware AI
- Leonardo AI
- And many more!

## Installation

### Method 1: Load as Temporary Extension (Development)

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the extension folder and select `manifest.json`
6. The extension will be loaded and appear in your toolbar

### Method 2: Create XPI Package (Recommended)

1. Zip all the extension files (excluding README.md and sample files)
2. Rename the zip file to have a `.xpi` extension
3. Drag and drop the XPI file into Firefox to install

## How to Use

### Step 1: Prepare Your Prompts
Create a text file with one prompt per line. For example:

```
A majestic dragon soaring through clouds
A futuristic cityscape with neon lights
A peaceful forest clearing at sunset
```

### Step 2: Navigate to AI Image Generation Website
Open your preferred AI image generation website (e.g., Midjourney, DALL-E, etc.)

### Step 3: Start the Extension
1. Click the extension icon in your Firefox toolbar
2. Click "Select Text File with Prompts" and choose your prompts file
3. Set the wait time between prompts (default: 30 seconds)
4. Click "Start Automation"

### Step 4: Monitor Progress
- The extension will automatically paste each prompt and click the generate button
- Monitor progress through the visual progress bar
- Use the status messages to track current activity

## Features in Detail

### Popup to Window Conversion
Click the window icon in the top-right corner of the popup to convert it into a separate browser window. This is useful for:
- Better visibility while working
- Easier monitoring of long automation sessions
- Multi-tasking without losing the extension interface

### Smart Element Detection
The extension uses multiple strategies to find the correct elements:
1. **Specific selectors** for known websites
2. **Generic selectors** for common patterns
3. **Content-based detection** using placeholder text and class names
4. **Fallback methods** for edge cases

### Error Handling
- Automatic detection of missing page elements
- Graceful handling of disabled buttons
- Clear error messages and recovery suggestions
- Automatic retry mechanisms for temporary issues

## File Format

The extension accepts plain text files (.txt) with:
- One prompt per line
- Empty lines are ignored
- No special formatting required
- UTF-8 encoding supported

Example file structure:
```
Prompt 1 here
Prompt 2 here

Prompt 3 here (empty line above is ignored)
```

## Settings

- **Wait Time**: Time to wait between each prompt (1-300 seconds)
- **File Selection**: Support for .txt files
- **Progress Tracking**: Visual and text-based progress indicators
- **State Persistence**: Settings and progress are saved automatically

## Troubleshooting

### Extension Not Working
1. Refresh the AI image generation website
2. Check that the page has loaded completely
3. Verify the website has a visible prompt textarea and generate button
4. Try reloading the extension

### Generate Button Not Found
1. Make sure you're on the correct page
2. Check if the button is visible and not hidden
3. Try scrolling to make sure all elements are loaded
4. Some sites may have dynamic loading - wait a moment and try again

### Prompts Not Being Pasted
1. Ensure the textarea is visible and clickable
2. Check if the website requires login or has other restrictions
3. Try manually clicking the textarea first
4. Some sites may have anti-automation measures

## Development

### File Structure
```
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── content.js             # Content script for page interaction
├── background.js          # Background script for extension management
├── styles.css             # Popup styling
├── icons/                 # Extension icons
│   ├── icon-16.svg
│   ├── icon-32.svg
│   ├── icon-48.svg
│   └── icon-128.svg
└── sample_prompts.txt     # Example prompts file
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with different AI image generation websites
5. Submit a pull request

## Privacy & Security

- The extension only accesses the current tab when automation is active
- No data is sent to external servers
- All processing happens locally in your browser
- Prompts and settings are stored locally using Firefox's storage API

## License

This project is open source and available under the MIT License.

## Support

If you encounter issues or have suggestions:
1. Check the troubleshooting section above
2. Ensure you're using a supported website
3. Try the extension on different AI image generation platforms
4. Report bugs with detailed information about the website and error messages

## Version History

### v1.0.0
- Initial release
- Basic automation functionality
- File upload and processing
- Popup to window conversion
- Progress tracking and status updates
- Smart element detection
- Error handling and recovery
