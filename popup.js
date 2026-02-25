console.log('🔧 POPUP: Popup script loading...');
console.log('🔧 POPUP: Document ready state:', document.readyState);

class AIImageAutomator {
    constructor() {
        console.log('🔧 POPUP: Initializing popup...');
        this.prompts = [];
        this.currentPromptIndex = 0;
        this.isRunning = false;
        this.waitTime = 30;
        
        console.log('🔧 POPUP: Initializing elements...');
        this.initializeElements();
        console.log('🔧 POPUP: Binding events...');
        this.bindEvents();
        console.log('🔧 POPUP: Loading stored data...');
        this.loadStoredData();
        console.log('🔧 POPUP: Popup initialization complete');
    }
    
    initializeElements() {
        this.fileInput = document.getElementById('fileInput');
        this.fileName = document.getElementById('fileName');
        this.waitTimeInput = document.getElementById('waitTime');
        this.promptCount = document.getElementById('promptCount');
        this.currentPrompt = document.getElementById('currentPrompt');
        this.startBtn = document.getElementById('startAutomation');
        this.stopBtn = document.getElementById('stopAutomation');
        this.testBtn = document.getElementById('testConnection');
        this.debugBtn = document.getElementById('debugElements');
        this.status = document.getElementById('status');
        this.progressFill = document.getElementById('progressFill');
        this.openWindowBtn = document.getElementById('openWindow');
    }
    
    bindEvents() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.waitTimeInput.addEventListener('change', (e) => this.updateWaitTime(e));
        this.startBtn.addEventListener('click', () => this.startAutomation());
        this.stopBtn.addEventListener('click', () => this.stopAutomation());
        this.testBtn.addEventListener('click', () => this.testConnection());
        this.debugBtn.addEventListener('click', () => this.debugElements());
        this.openWindowBtn.addEventListener('click', () => this.openInWindow());

        // Add double-click to reload content script if needed
        this.testBtn.addEventListener('dblclick', () => this.reloadContentScript());
        
        // Listen for messages from content script - Firefox compatibility
        const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
        runtimeAPI.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
        });
    }
    
    async loadStoredData() {
        try {
            // Firefox compatibility: use browser.storage if chrome.storage fails
            const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
            const result = await storageAPI.local.get(['prompts', 'waitTime', 'currentIndex']);

            if (result && result.prompts) {
                this.prompts = result.prompts;
                this.updatePromptDisplay();
            }
            if (result && result.waitTime) {
                this.waitTime = result.waitTime;
                this.waitTimeInput.value = this.waitTime;
            }
            if (result && result.currentIndex !== undefined) {
                this.currentPromptIndex = result.currentIndex;
                this.updateProgress();
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }
    
    async saveData() {
        try {
            // Firefox compatibility: use browser.storage if chrome.storage fails
            const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
            await storageAPI.local.set({
                prompts: this.prompts,
                waitTime: this.waitTime,
                currentIndex: this.currentPromptIndex
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        this.fileName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.parsePrompts(content);
        };
        reader.readAsText(file);
    }
    
    parsePrompts(content) {
        // Split by lines and filter out empty lines
        this.prompts = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        this.currentPromptIndex = 0;
        this.updatePromptDisplay();
        this.saveData();
        
        this.status.textContent = `Loaded ${this.prompts.length} prompts`;
        this.startBtn.disabled = this.prompts.length === 0;
    }
    
    updatePromptDisplay() {
        if (this.prompts.length === 0) {
            this.promptCount.textContent = 'No prompts loaded';
            this.currentPrompt.textContent = '';
        } else {
            this.promptCount.textContent = `${this.prompts.length} prompts loaded`;
            this.currentPrompt.textContent = `Current: ${this.currentPromptIndex + 1}/${this.prompts.length}`;
        }
        this.updateProgress();
    }
    
    updateProgress() {
        if (this.prompts.length === 0) {
            this.progressFill.style.width = '0%';
        } else {
            const progress = (this.currentPromptIndex / this.prompts.length) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
    }
    
    updateWaitTime(event) {
        this.waitTime = parseInt(event.target.value);
        this.saveData();
    }

    async testConnection() {
        console.log('🔧 POPUP: testConnection called');
        this.status.textContent = 'Testing connection to page...';
        this.status.classList.add('updating');

        try {
            const tabsAPI = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;
            console.log('🔧 POPUP: Using tabs API:', tabsAPI ? 'Available' : 'Not Available');

            // Get all tabs across ALL windows (not just current window)
            const allTabs = await tabsAPI.query({});
            console.log('🔧 POPUP: All tabs across all windows:', allTabs.map(t => ({ id: t.id, url: t.url, active: t.active, windowId: t.windowId })));

            // Filter out extension pages and find a suitable tab
            const webTabs = allTabs.filter(tab => {
                const url = tab.url || '';
                const isValidWebPage =
                    !url.startsWith('chrome-extension://') &&
                    !url.startsWith('moz-extension://') &&
                    !url.startsWith('chrome://') &&
                    !url.startsWith('about:') &&
                    url !== 'about:blank' &&
                    (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://'));

                console.log('🔧 POPUP: Checking tab:', url, 'Valid:', isValidWebPage);
                return isValidWebPage;
            });

            console.log('🔧 POPUP: Web tabs:', webTabs.map(t => ({ id: t.id, url: t.url, active: t.active })));

            // Prefer the active tab if it's a web page, otherwise use the first web tab
            let targetTab = webTabs.find(tab => tab.active) || webTabs[0];

            if (!targetTab) {
                console.log('🔧 POPUP: No suitable web page found');
                console.log('🔧 POPUP: Available tabs:', allTabs.map(t => t.url));
                console.log('🔧 POPUP: Filtered web tabs:', webTabs.map(t => t.url));
                this.status.textContent = `No suitable web page found. Found ${allTabs.length} tabs, ${webTabs.length} valid web pages.`;
                this.status.classList.remove('updating');
                return;
            }

            console.log('🔧 POPUP: Target tab:', targetTab.url);

            try {
                // Send a ping message to content script
                console.log('🔧 POPUP: Sending ping message to tab:', targetTab.id);
                const response = await tabsAPI.sendMessage(targetTab.id, { action: 'ping' });
                console.log('🔧 POPUP: Ping response:', response);

                if (response && response.success) {
                    console.log('🔧 POPUP: Content script is active!');
                    this.status.textContent = `✅ Connection successful! Found ${response.elements?.textareas || 0} textareas, ${response.elements?.buttons || 0} buttons.`;
                } else {
                    console.log('🔧 POPUP: Content script not responding properly');
                    this.status.textContent = '❌ Content script not responding';
                }
            } catch (pingError) {
                console.log('🔧 POPUP: Ping failed, error:', pingError);
                console.log('🔧 POPUP: Trying to inject content script...');

                // Try to inject the content script manually
                try {
                    // Use background script to inject content script
                    console.log('🔧 POPUP: Requesting content script injection...');
                    const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
                    const injectResponse = await runtimeAPI.sendMessage({
                        action: 'injectContentScript',
                        tabId: targetTab.id
                    });
                    console.log('🔧 POPUP: Injection response:', injectResponse);

                    if (injectResponse && injectResponse.success) {
                        console.log('🔧 POPUP: Content script injected, waiting...');
                        // Wait a moment for injection
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Try ping again
                        console.log('🔧 POPUP: Trying ping after injection...');
                        try {
                            const response = await tabsAPI.sendMessage(targetTab.id, { action: 'ping' });
                            console.log('🔧 POPUP: Post-injection ping response:', response);

                            if (response && response.success) {
                                console.log('🔧 POPUP: Content script working after injection!');
                                this.status.textContent = `✅ Connection successful! (Injected) Found ${response.elements?.textareas || 0} textareas, ${response.elements?.buttons || 0} buttons.`;
                            } else {
                                console.log('🔧 POPUP: Content script still not responding after injection');
                                this.status.textContent = '⚠️ Content script injected but not responding. Try refreshing the page.';
                            }
                        } catch (secondPingError) {
                            console.log('🔧 POPUP: Second ping also failed:', secondPingError);
                            this.status.textContent = '⚠️ Content script injected but not responding. Try refreshing the page.';
                        }
                    } else {
                        console.log('🔧 POPUP: Background script injection failed:', injectResponse?.error);
                        this.status.textContent = `❌ Injection failed: ${injectResponse?.error || 'Unknown error'}`;
                    }
                } catch (injectError) {
                    console.error('🔧 POPUP: Content script injection error:', injectError);
                    this.status.textContent = '❌ Cannot inject content script. Try refreshing the page.';
                }
            }
        } catch (error) {
            console.error('Test connection error:', error);
            this.status.textContent = `❌ Connection failed: ${error.message}`;
        }

        this.status.classList.remove('updating');

        // Reset status after 5 seconds
        setTimeout(() => {
            this.status.textContent = 'Ready to load prompts';
        }, 5000);
    }

    async debugElements() {
        this.status.textContent = 'Debugging page elements...';
        this.status.classList.add('updating');

        try {
            const tabsAPI = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;

            // Get all tabs across ALL windows (not just current window)
            const allTabs = await tabsAPI.query({});
            const webTabs = allTabs.filter(tab => {
                const url = tab.url || '';
                const isValidWebPage =
                    !url.startsWith('chrome-extension://') &&
                    !url.startsWith('moz-extension://') &&
                    !url.startsWith('chrome://') &&
                    !url.startsWith('about:') &&
                    url !== 'about:blank' &&
                    (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://'));

                console.log('🔧 POPUP: Debug - Checking tab:', url, 'Valid:', isValidWebPage);
                return isValidWebPage;
            });

            let targetTab = webTabs.find(tab => tab.active) || webTabs[0];

            if (!targetTab) {
                this.status.textContent = 'No suitable web page found. Please open a website in another tab.';
                this.status.classList.remove('updating');
                return;
            }

            // Inject content script if needed
            try {
                await tabsAPI.sendMessage(targetTab.id, { action: 'ping' });
            } catch (pingError) {
                const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
                await runtimeAPI.sendMessage({
                    action: 'injectContentScript',
                    tabId: targetTab.id
                });
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Send debug message
            const response = await tabsAPI.sendMessage(targetTab.id, { action: 'debugElements' });

            if (response && response.success) {
                this.status.textContent = `Found: ${response.textareas} textareas, ${response.buttons} buttons. Check console for details.`;
            } else {
                this.status.textContent = 'Debug failed - check console';
            }
        } catch (error) {
            console.error('Debug error:', error);
            this.status.textContent = `Debug error: ${error.message}`;
        }

        this.status.classList.remove('updating');

        // Reset status after 5 seconds
        setTimeout(() => {
            this.status.textContent = 'Ready to load prompts';
        }, 5000);
    }
    
    async startAutomation() {
        if (this.prompts.length === 0) {
            this.status.textContent = 'Please load prompts first';
            return;
        }

        try {
            // Firefox compatibility: use browser.tabs if chrome.tabs fails
            const tabsAPI = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;

            // Get all tabs across ALL windows (not just current window)
            const allTabs = await tabsAPI.query({});
            console.log('🔧 POPUP: All tabs across all windows:', allTabs.map(t => ({ id: t.id, url: t.url, active: t.active, windowId: t.windowId })));

            // Filter out extension pages and find a suitable tab
            const webTabs = allTabs.filter(tab => {
                const url = tab.url || '';
                const isValidWebPage =
                    !url.startsWith('chrome-extension://') &&
                    !url.startsWith('moz-extension://') &&
                    !url.startsWith('chrome://') &&
                    !url.startsWith('about:') &&
                    url !== 'about:blank' &&
                    (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://'));

                console.log('🔧 POPUP: Checking tab:', url, 'Valid:', isValidWebPage);
                return isValidWebPage;
            });

            console.log('🔧 POPUP: Web tabs:', webTabs.map(t => ({ id: t.id, url: t.url, active: t.active })));

            // Prefer the active tab if it's a web page, otherwise use the first web tab
            let targetTab = webTabs.find(tab => tab.active) || webTabs[0];

            if (!targetTab) {
                this.status.textContent = 'No suitable web page found. Please open a website in another tab.';
                return;
            }

            console.log('🔧 POPUP: Target tab:', targetTab.url);

            this.isRunning = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.status.textContent = 'Injecting into all frames...';
            this.status.classList.add('updating');

            // Always inject into ALL frames (including iframes like my.runware.ai).
            // The content script guards against double-initialization itself.
            try {
                const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
                const injectResponse = await runtimeAPI.sendMessage({
                    action: 'injectContentScript',
                    tabId: targetTab.id
                });

                if (!injectResponse || !injectResponse.success) {
                    console.warn('Injection warning:', injectResponse?.error);
                    // Non-fatal: content script may already be present via manifest
                }

                // Give frames a moment to initialize
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (injectError) {
                console.warn('Injection warning (non-fatal):', injectError.message);
                // Non-fatal: the manifest may have already injected the script
            }

            this.status.textContent = 'Starting automation...';

            // Send message to content script to start automation
            await tabsAPI.sendMessage(targetTab.id, {
                action: 'startAutomation',
                prompts: this.prompts,
                currentIndex: this.currentPromptIndex,
                waitTime: this.waitTime * 1000 // Convert to milliseconds
            });
        } catch (error) {
            console.error('Error starting automation:', error);
            this.status.textContent = `Error: ${error.message}`;
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.status.classList.remove('updating');
        }
    }
    
    async stopAutomation() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.status.textContent = 'Automation stopped';
        this.status.classList.remove('updating');

        try {
            console.log('🛑 POPUP: Stopping automation...');

            // Firefox compatibility: use browser.tabs if chrome.tabs fails
            const tabsAPI = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;

            // Get all tabs across ALL windows (not just current window)
            const allTabs = await tabsAPI.query({});
            console.log('🛑 POPUP: All tabs for stop:', allTabs.map(t => ({ id: t.id, url: t.url, active: t.active, windowId: t.windowId })));

            // Filter out extension pages and find a suitable tab
            const webTabs = allTabs.filter(tab => {
                const url = tab.url || '';
                const isValidWebPage =
                    url.startsWith('http://') ||
                    url.startsWith('https://');
                const isNotExtensionPage =
                    !url.startsWith('chrome-extension://') &&
                    !url.startsWith('moz-extension://');

                return isValidWebPage && isNotExtensionPage;
            });

            if (webTabs.length === 0) {
                console.log('🛑 POPUP: No suitable web pages found to stop automation');
                return;
            }

            // Try to send stop message to all suitable tabs
            let stopSent = false;
            for (const tab of webTabs) {
                try {
                    await tabsAPI.sendMessage(tab.id, { action: 'stopAutomation' });
                    console.log('🛑 POPUP: Stop automation message sent to tab:', tab.id);
                    stopSent = true;
                } catch (error) {
                    console.log('🛑 POPUP: Failed to send stop to tab', tab.id, ':', error.message);
                }
            }

            if (stopSent) {
                console.log('🛑 POPUP: Stop message sent successfully');
            } else {
                console.log('🛑 POPUP: Could not send stop message to any tab');
            }

        } catch (error) {
            console.error('Error stopping automation:', error);
        }
    }
    
    handleMessage(message, _sender, sendResponse) {
        switch (message.action) {
            case 'updateStatus':
                this.status.textContent = message.status;
                break;
                
            case 'updateProgress':
                this.currentPromptIndex = message.currentIndex;
                this.updatePromptDisplay();
                this.saveData();
                break;
                
            case 'automationComplete':
                this.isRunning = false;
                this.startBtn.disabled = false;
                this.stopBtn.disabled = true;
                this.status.textContent = 'All prompts processed!';
                this.status.classList.remove('updating');
                this.currentPromptIndex = 0;
                this.updatePromptDisplay();
                this.saveData();
                break;
                
            case 'automationError':
                this.isRunning = false;
                this.startBtn.disabled = false;
                this.stopBtn.disabled = true;
                this.status.textContent = `Error: ${message.error}`;
                this.status.classList.remove('updating');
                break;
        }
        
        sendResponse({ received: true });
    }
    
    openInWindow() {
        const width = 400;
        const height = 600;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        // Firefox compatibility
        const windowsAPI = typeof browser !== 'undefined' ? browser.windows : chrome.windows;
        const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

        windowsAPI.create({
            url: runtimeAPI.getURL('popup.html'),
            type: 'popup',
            width: width,
            height: height,
            left: Math.round(left),
            top: Math.round(top)
        });

        // Close the current popup
        window.close();
    }

    async reloadContentScript() {
        console.log('🔄 POPUP: Reloading content script...');
        this.status.textContent = 'Reloading content script...';

        try {
            const tabsAPI = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;
            const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

            // Get all tabs across ALL windows
            const allTabs = await tabsAPI.query({});
            const webTabs = allTabs.filter(tab => {
                const url = tab.url || '';
                return url.startsWith('http://') || url.startsWith('https://');
            });

            if (webTabs.length === 0) {
                this.status.textContent = 'No web pages found to reload script';
                return;
            }

            // Try to inject content script into all web tabs
            let reloadedCount = 0;
            for (const tab of webTabs) {
                try {
                    const injectResponse = await runtimeAPI.sendMessage({
                        action: 'injectContentScript',
                        tabId: tab.id
                    });

                    if (injectResponse && injectResponse.success) {
                        reloadedCount++;
                        console.log('🔄 POPUP: Content script reloaded in tab:', tab.id);
                    }
                } catch (error) {
                    console.log('🔄 POPUP: Failed to reload script in tab', tab.id, ':', error.message);
                }
            }

            this.status.textContent = `Content script reloaded in ${reloadedCount} tabs`;
            setTimeout(() => {
                this.status.textContent = 'Ready';
            }, 3000);

        } catch (error) {
            console.error('Error reloading content script:', error);
            this.status.textContent = 'Failed to reload content script';
        }
    }
}

// Initialize the automator when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new AIImageAutomator();
});
