# AI Image Automator - Testing Guide

## Quick Test Setup

### 1. Install the Extension
Follow the instructions in `INSTALL.md` to install the extension in your browser.

### 2. Test with the Test Page
1. Open `test-page.html` in your browser
2. The page simulates an AI image generation interface
3. You should see a "🤖 AI Automator Ready" indicator appear briefly

### 3. Load Sample Prompts
1. Click the extension icon in your browser toolbar
2. Click "Select Text File with Prompts"
3. Choose `sample_prompts.txt` (contains 15 test prompts)

### 4. Test Connection
1. Click "Test Connection" button
2. You should see "✅ Connection successful!" message
3. If you see an error, refresh the page and try again

### 5. Debug Elements (Optional)
1. Click "Debug Elements" button
2. Open browser console (F12) to see detailed element information
3. This helps troubleshoot if automation isn't working

### 6. Start Automation Test
1. Set wait time to 5 seconds (for quick testing)
2. Click "Start Automation"
3. Watch the extension automatically:
   - Fill the textarea with prompts
   - Click the generate button
   - Wait for the specified time
   - Move to the next prompt

## Testing with Real AI Websites

### Supported Websites
The extension has been tested with:
- Runware.ai ✅
- Leonardo.ai ✅
- Playground.ai ✅
- Various other AI image generators

### Testing Steps
1. Navigate to an AI image generation website
2. Make sure you're logged in and on the generation page
3. Load the extension and test connection
4. Use longer wait times (30-60 seconds) for real generation
5. Monitor the first few prompts to ensure everything works correctly

## Troubleshooting Tests

### Test 1: Extension Loading
**Problem**: Extension icon doesn't appear
**Solution**: 
- Check `chrome://extensions/` or `about:addons`
- Reload the extension
- Refresh browser

### Test 2: Content Script Communication
**Problem**: "Content script not responding" error
**Solution**:
- Refresh the page
- Check if the page blocks content scripts
- Try the test page first

### Test 3: Element Detection
**Problem**: "Could not find textarea/button" error
**Solution**:
- Use "Debug Elements" to see what's found
- Check if the page has loaded completely
- Try waiting a few seconds after page load

### Test 4: Button Enabling
**Problem**: "Generate button remained disabled" error
**Solution**:
- Check if the prompt is valid
- Some sites require minimum prompt length
- Verify the textarea actually received the text

## Manual Testing Checklist

### Basic Functionality
- [ ] Extension installs without errors
- [ ] Extension icon appears in toolbar
- [ ] Popup opens when clicking icon
- [ ] File selection works
- [ ] Prompt count displays correctly
- [ ] Wait time setting saves

### Connection Testing
- [ ] "Test Connection" works on test page
- [ ] "Test Connection" works on real AI sites
- [ ] "Debug Elements" shows correct information
- [ ] Content script indicator appears

### Automation Testing
- [ ] Automation starts without errors
- [ ] Prompts are filled correctly
- [ ] Generate button is clicked
- [ ] Progress updates correctly
- [ ] Automation completes successfully
- [ ] Stop button works

### Error Handling
- [ ] Graceful handling of missing elements
- [ ] Clear error messages
- [ ] Recovery from page changes
- [ ] Proper cleanup on stop

## Performance Testing

### Memory Usage
- Monitor browser memory usage during long automation runs
- Extension should not cause memory leaks

### Timing Accuracy
- Verify wait times are respected
- Check that automation doesn't run too fast or slow

### Reliability
- Test with 50+ prompts
- Verify automation doesn't get stuck
- Check handling of page navigation

## Browser Compatibility

### Chrome
- [ ] Manifest V3 compatibility
- [ ] Extension APIs work correctly
- [ ] No console errors

### Firefox
- [ ] WebExtensions compatibility
- [ ] Browser-specific APIs work
- [ ] No console errors

## Advanced Testing

### Edge Cases
- [ ] Empty prompts file
- [ ] Very long prompts
- [ ] Special characters in prompts
- [ ] Network interruptions
- [ ] Page reloads during automation

### Website Variations
- [ ] Different textarea selectors
- [ ] Different button selectors
- [ ] Dynamic content loading
- [ ] Single-page applications

## Automated Testing

You can run the included test script:
1. Open test-page.html
2. Open browser console (F12)
3. Run: `extensionTests.runAllTests()`
4. Check results for any failures

## Reporting Issues

When reporting issues, please include:
1. Browser version and type
2. Website URL (if applicable)
3. Console error messages
4. Steps to reproduce
5. Expected vs actual behavior

## Test Results Template

```
Date: ___________
Browser: ___________
Website: ___________

✅ Extension loads correctly
✅ Connection test passes
✅ Element detection works
✅ Automation starts
✅ Prompts are processed
✅ Automation completes
❌ Issue: ___________

Notes: ___________
```
