// Background script for AI Image Automator Extension

class BackgroundManager {
    constructor() {
        this.initializeExtension();
    }

    initializeExtension() {
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                console.log('AI Image Automator installed');
                this.showWelcomeNotification();
            } else if (details.reason === 'update') {
                console.log('AI Image Automator updated');
            }
        });

        // Handle messages from popup and content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });

        // Handle action click (when popup is disabled) - Manifest V3
        chrome.action.onClicked.addListener((tab) => {
            this.handleActionClick(tab);
        });

        // Handle tab updates to inject content script if needed
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.handleTabUpdate(tabId, tab);
            }
        });
    }
    
    showWelcomeNotification() {
        // Create a welcome notification
        if (chrome.notifications) {
            chrome.notifications.create('welcome', {
                type: 'basic',
                iconUrl: 'icons/icon-48.svg',
                title: 'AI Image Automator Installed!',
                message: 'Click the extension icon to start automating your AI image generation.'
            });
        }
    }

    handleMessage(message, sender, sendResponse) {
        console.log('🔧 BACKGROUND: Received message:', message.action, message);

        switch (message.action) {
            case 'openPopupWindow':
                console.log('🔧 BACKGROUND: Opening popup window...');
                this.openPopupWindow();
                sendResponse({ success: true });
                break;

            case 'getTabInfo':
                console.log('🔧 BACKGROUND: Getting tab info...');
                this.getActiveTabInfo(sendResponse);
                break;

            case 'injectContentScript':
                console.log('🔧 BACKGROUND: Injecting content script for tab:', message.tabId);
                this.injectContentScript(message.tabId, sendResponse);
                break;

            default:
                console.log('🔧 BACKGROUND: Unknown action:', message.action);
                sendResponse({ success: false, error: 'Unknown action' });
        }
    }

    handleActionClick(tab) {
        // This is called when the extension icon is clicked and no popup is shown
        // We can use this as a fallback to open the popup window
        this.openPopupWindow();
    }
    
    handleTabUpdate(tabId, tab) {
        // Check if this is a page where we might want to inject our content script
        // This is useful for single-page applications that change URLs dynamically
        if (this.isRelevantPage(tab.url)) {
            // Content script should already be injected via manifest, but we can
            // send a message to check if it's active
            chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
                if (chrome.runtime.lastError) {
                    // Content script not responding, might need to inject manually
                    console.log('Content script not active on tab', tabId);
                }
            });
        }
    }
    
    isRelevantPage(url) {
        if (!url) return false;
        
        // List of domains/patterns where AI image generation might happen
        const relevantPatterns = [
            'midjourney.com',
            'openai.com',
            'stability.ai',
            'runware.ai',
            'leonardo.ai',
            'playground.ai',
            'huggingface.co',
            'replicate.com'
        ];
        
        return relevantPatterns.some(pattern => url.includes(pattern));
    }
    
    openPopupWindow() {
        const width = 400;
        const height = 600;

        // For Manifest V3, we'll use a simpler approach without system.display
        // Center the window on screen (approximate)
        const left = Math.round((screen.width - width) / 2);
        const top = Math.round((screen.height - height) / 2);

        chrome.windows.create({
            url: chrome.runtime.getURL('popup.html'),
            type: 'popup',
            width: width,
            height: height,
            left: left,
            top: top,
            focused: true
        });
    }
    
    async getActiveTabInfo(sendResponse) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                sendResponse({
                    success: true,
                    tab: {
                        id: tabs[0].id,
                        url: tabs[0].url,
                        title: tabs[0].title
                    }
                });
            } else {
                sendResponse({ success: false, error: 'No active tab found' });
            }
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    
    async injectContentScript(tabId, sendResponse) {
        try {
            console.log('Background: Injecting content script into tab', tabId);

            // First check if we have permission for this tab
            const tab = await chrome.tabs.get(tabId);
            console.log('Background: Tab URL:', tab.url);

            // Check if it's a valid URL (not chrome:// or extension pages)
            if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://')) {
                console.log('Background: Cannot inject into browser pages');
                sendResponse({ success: false, error: 'Cannot inject into browser pages' });
                return;
            }

            // Manifest V3 uses chrome.scripting API
            // allFrames: true ensures the script is injected into iframes too
            const results = await chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames: true },
                files: ['content.js']
            });

            console.log('Background: Content script injected successfully', results);
            sendResponse({ success: true });
        } catch (error) {
            console.error('Background: Failed to inject content script:', error);

            // Provide more specific error messages
            let errorMessage = error.message;
            if (error.message.includes('Cannot access')) {
                errorMessage = 'Cannot access this page. Make sure you\'re on a regular website, not a browser page.';
            } else if (error.message.includes('activeTab')) {
                errorMessage = 'Permission denied. Make sure the extension has access to this tab.';
            }

            sendResponse({ success: false, error: errorMessage });
        }
    }
    
    // Utility method to store data
    async storeData(key, data) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [key]: data }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }
    
    // Utility method to retrieve data
    async getData(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result[key]);
                }
            });
        });
    }
}

// Initialize the background manager
const backgroundManager = new BackgroundManager();

// Handle cleanup when extension is disabled/uninstalled
chrome.runtime.onSuspend.addListener(() => {
    console.log('AI Image Automator suspended');
});

// Error handling for uncaught errors
self.addEventListener('error', (event) => {
    console.error('Background script error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection in background script:', event.reason);
});
