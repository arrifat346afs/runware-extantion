# Troubleshooting Guide - Content Script Injection Issues

## 🚨 "Failed to inject content script" Error

This error occurs when the extension cannot inject its content script into the current page. Here are the solutions:

## ✅ Quick Fixes

### 1. Check the Page Type
**Problem**: You're on a restricted page
**Solution**: 
- ❌ Don't use on: `chrome://`, `chrome-extension://`, `about:`, `moz-extension://`
- ✅ Use on: Regular websites like `https://example.com`

### 2. Refresh and Retry
**Problem**: Page state issues
**Solution**:
1. **Refresh the current page** (F5 or Ctrl+R)
2. **Wait for page to fully load**
3. **Try "Test Connection" again**

### 3. Check Extension Permissions
**Problem**: Missing permissions
**Solution**:
1. Go to `chrome://extensions/`
2. Find "AI Image Generation Automator"
3. Click "Details"
4. Make sure "Allow on all sites" is enabled

### 4. Reload the Extension
**Problem**: Extension state issues
**Solution**:
1. Go to `chrome://extensions/`
2. Find your extension
3. Click the **refresh/reload icon** 🔄
4. Try again

## 🔧 Advanced Debugging

### Test with Debug Script
1. **Open browser console** (F12)
2. **Copy and paste** the contents of `debug-injection.js`
3. **Press Enter** to run
4. **Check the console output** for detailed error info

### Manual Content Script Test
1. **Open test-page.html**
2. **Open console** (F12)
3. **Run**: `console.log('Testing:', document.querySelectorAll('textarea').length, 'textareas found')`
4. **Should show**: Number of textareas found

### Check Extension Console
1. Go to `chrome://extensions/`
2. Find your extension
3. Click **"Inspect views: service worker"**
4. Check for error messages in the console

## 🎯 Specific Solutions

### For "Cannot access contents of the page"
```
✅ Solutions:
1. Make sure you're on a regular website (not chrome:// pages)
2. Check that the page has finished loading
3. Try clicking on the page first to activate the tab
4. Reload the extension
```

### For "Extension context invalidated"
```
✅ Solutions:
1. Reload the extension in chrome://extensions/
2. Close and reopen the popup
3. Try on a fresh tab
```

### For "activeTab permission" errors
```
✅ Solutions:
1. Make sure the current tab is active and focused
2. Click somewhere on the page first
3. Check extension permissions in chrome://extensions/
```

## 🧪 Test Sequence

Follow this sequence to diagnose the issue:

### Step 1: Basic Check
- [ ] Are you on a regular website? (not chrome:// pages)
- [ ] Has the page finished loading?
- [ ] Is the extension enabled in chrome://extensions/?

### Step 2: Permission Check
- [ ] Go to chrome://extensions/
- [ ] Click "Details" on your extension
- [ ] Is "Allow on all sites" enabled?
- [ ] Try toggling it off and on

### Step 3: Extension Reload
- [ ] Go to chrome://extensions/
- [ ] Click the refresh icon on your extension
- [ ] Try the test connection again

### Step 4: Test Page
- [ ] Open test-page.html
- [ ] Try "Test Connection" on the test page
- [ ] Does it work on the test page?

### Step 5: Console Debug
- [ ] Open browser console (F12)
- [ ] Look for error messages
- [ ] Try the debug script

## 📋 Common Working Scenarios

### ✅ These Should Work:
- test-page.html (local file)
- https://runware.ai
- https://leonardo.ai
- https://playground.ai
- Any regular HTTPS website

### ❌ These Won't Work:
- chrome://extensions/
- chrome://settings/
- chrome-extension://...
- about:blank
- Browser internal pages

## 🔄 If Nothing Works

### Nuclear Option - Complete Reset:
1. **Remove the extension** completely
2. **Restart Chrome**
3. **Re-add the extension**
4. **Test on test-page.html first**

### Alternative - Use Firefox:
If Chrome continues to have issues, the extension also works in Firefox:
1. Copy manifest.json to manifest-firefox.json
2. Use Manifest V2 configuration
3. Load in Firefox instead

## 📞 Getting Help

If you're still having issues, please provide:
1. **Chrome version**: `chrome://version/`
2. **Extension error messages**: From chrome://extensions/
3. **Console errors**: From F12 developer tools
4. **Website URL**: Where you're trying to use it
5. **Steps you've tried**: From this troubleshooting guide

The most common cause is trying to use the extension on browser internal pages. Make sure you're on a regular website!
