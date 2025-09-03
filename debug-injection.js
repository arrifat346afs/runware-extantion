// Debug script to test content script injection
// Run this in the browser console to test injection manually

console.log('🔧 Debug: Testing content script injection...');

async function testInjection() {
    try {
        // Get current tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        
        console.log('🔧 Debug: Current tab:', currentTab.url);
        
        // Check if it's a restricted page
        if (currentTab.url.startsWith('chrome://') || 
            currentTab.url.startsWith('chrome-extension://') || 
            currentTab.url.startsWith('moz-extension://')) {
            console.log('❌ Debug: Cannot inject into browser pages');
            return;
        }
        
        // Try to inject content script
        console.log('🔧 Debug: Attempting injection...');
        const results = await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content.js']
        });
        
        console.log('✅ Debug: Injection successful!', results);
        
        // Wait a moment then try to ping
        setTimeout(async () => {
            try {
                const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'ping' });
                console.log('✅ Debug: Ping successful!', response);
            } catch (pingError) {
                console.log('❌ Debug: Ping failed:', pingError);
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Debug: Injection failed:', error);
        
        // Provide specific error analysis
        if (error.message.includes('Cannot access')) {
            console.log('💡 Debug: This is likely a permissions issue. Make sure:');
            console.log('   1. You\'re on a regular website (not chrome:// pages)');
            console.log('   2. The extension has host permissions');
            console.log('   3. The page has finished loading');
        } else if (error.message.includes('activeTab')) {
            console.log('💡 Debug: ActiveTab permission issue. Try:');
            console.log('   1. Click on the page first');
            console.log('   2. Make sure the tab is active');
            console.log('   3. Reload the extension');
        }
    }
}

// Run the test
testInjection();

// Also provide a manual test function
window.testContentScriptInjection = testInjection;
