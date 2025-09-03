# Chrome Setup Guide - AI Image Automator

## ✅ Ready for Chrome!

Your extension is now configured for **Chrome with Manifest V3**. Here's how to install and use it:

## 🚀 Installation Steps

### 1. Open Chrome Extensions
- Open Chrome browser
- Go to `chrome://extensions/`
- **Enable "Developer mode"** (toggle in top-right corner)

### 2. Load the Extension
- Click **"Load unpacked"** button
- Navigate to your extension folder
- Select the folder containing `manifest.json`
- Click **"Select Folder"**

### 3. Verify Installation
- Extension should appear in the list
- Look for **"AI Image Generation Automator"**
- **Pin it to toolbar** (click the puzzle piece icon, then pin)

## 🧪 Quick Test

### Test with Test Page
1. **Open `test-page.html`** in Chrome
2. **Click extension icon** in toolbar
3. **Load `sample_prompts.txt`**
4. **Click "Test Connection"** → Should show ✅ success
5. **Click "Start Automation"** → Watch it work!

### Test with Real AI Site
1. **Go to an AI image site** (like Runware.ai, Leonardo.ai)
2. **Make sure you're logged in**
3. **Navigate to the generation page**
4. **Click extension icon**
5. **Load your prompts file**
6. **Click "Test Connection"** first
7. **Set wait time** (30-60 seconds)
8. **Click "Start Automation"**

## 🔧 Features

- ✅ **Manifest V3** compatible
- ✅ **Service Worker** background script
- ✅ **Modern Chrome APIs** (scripting, action)
- ✅ **Robust element detection**
- ✅ **Error handling and recovery**
- ✅ **Progress tracking**
- ✅ **Debug tools**

## 🛠️ Troubleshooting

### Extension won't load
- Make sure **Developer mode is ON**
- Check for **error messages** in extensions page
- Try **reloading** the extension
- Ensure **Chrome version 88+**

### "Service worker inactive"
- This is normal - it activates when needed
- Click the extension icon to wake it up
- Check "Inspect views: service worker" for logs

### Automation issues
- Use **"Debug Elements"** button
- Check **browser console** (F12)
- Try **"Test Connection"** first
- Make sure page is **fully loaded**

## 📁 File Structure

```
Extension/
├── manifest.json          # Manifest V3 for Chrome
├── background.js          # Service worker script
├── popup.html            # Extension popup
├── popup.js              # Popup logic
├── content.js            # Content script
├── styles.css            # Popup styles
├── test-page.html        # Test page
├── sample_prompts.txt    # Sample prompts
└── icons/                # Extension icons
```

## 🎯 Key Differences from Firefox

- Uses **Manifest V3** instead of V2
- **Service Worker** instead of background scripts
- **chrome.action** instead of chrome.browserAction
- **chrome.scripting** instead of chrome.tabs.executeScript
- **host_permissions** separate from permissions

## 🚀 Ready to Go!

Your extension is now **Chrome-ready** with:
- Modern Manifest V3 architecture
- Proper service worker implementation
- Chrome-specific API usage
- Enhanced error handling

Just load it in Chrome and start automating your AI image generation! 🎨✨
