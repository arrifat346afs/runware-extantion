// AI Image Automator Content Script
console.log('🤖 AI Image Automator: Content script loaded on', window.location.href);
console.log('🤖 AI Image Automator: Script injection time:', new Date().toISOString());
console.log('🤖 AI Image Automator: Document ready state:', document.readyState);
console.log('🤖 AI Image Automator: User agent:', navigator.userAgent);

// Test if we can access the DOM
console.log('🤖 AI Image Automator: Document body exists:', !!document.body);
console.log('🤖 AI Image Automator: Total elements in page:', document.querySelectorAll('*').length);

// Signal that the content script is loaded
window.aiAutomatorLoaded = true;

class AIImageAutomationEngine {
    constructor() {
        console.log('🤖 AI Image Automator: Initializing automation engine...');
        this.isRunning = false;
        this.prompts = [];
        this.currentIndex = 0;
        this.waitTime = 30000; // Default 30 seconds
        this.timeoutId = null;
        
        // Selectors for the AI image generation interface - Updated for Runware
        this.textareaSelector = 'textarea[placeholder*="Type your prompt here to start"]';
        this.generateButtonSelector = 'button[id*="submit-btn"]';

        // Alternative selectors based on the provided HTML structure
        this.specificTextareaSelector = 'textarea.w-full.bg-transparent.outline-none';
        this.specificButtonSelector = 'button.MuiButtonBase-root.MuiButton-containedPrimary';

        // Runware-specific selectors (primary - most specific)
        this.runwareTextareaSelector = 'textarea.scrollable-content[placeholder="Type your prompt here to start..."]';
        this.runwareButtonSelector = 'button.MuiButtonBase-root[id^="submit-btn"], button#submit-btn-5dt, button[id^="submit-btn"]';
        
        this.bindMessageListener();
        console.log('🤖 AI Image Automator: Engine initialized successfully');
    }
    
    bindMessageListener() {
        console.log('🤖 AI Image Automator: Binding message listener...');
        // Firefox compatibility
        const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
        console.log('🤖 AI Image Automator: Using runtime API:', runtimeAPI ? 'Available' : 'Not Available');

        runtimeAPI.onMessage.addListener((message, sender, sendResponse) => {
            console.log('🤖 AI Image Automator: Received message:', message);
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep the message channel open for async responses
        });
        console.log('🤖 AI Image Automator: Message listener bound successfully');
    }
    
    handleMessage(message, sender, sendResponse) {
        console.log('🤖 AI Image Automator: Handling message:', message.action);

        switch (message.action) {
            case 'ping':
                console.log('🤖 AI Image Automator: Ping received, responding...');
                sendResponse({
                    success: true,
                    message: 'Content script is active',
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    elements: {
                        textareas: document.querySelectorAll('textarea').length,
                        buttons: document.querySelectorAll('button').length
                    }
                });
                break;

            case 'debugElements':
                console.log('🤖 AI Image Automator: Debug elements requested');
                this.debugElements(sendResponse);
                break;

            case 'startAutomation':
                console.log('🤖 AI Image Automator: Start automation requested');
                this.startAutomation(message.prompts, message.currentIndex, message.waitTime);
                sendResponse({ success: true });
                break;

            case 'stopAutomation':
                console.log('🤖 AI Image Automator: Stop automation requested');
                this.stopAutomation();
                sendResponse({ success: true });
                break;

            default:
                console.log('🤖 AI Image Automator: Unknown action:', message.action);
                sendResponse({ success: false, error: 'Unknown action' });
        }
    }

    debugElements(sendResponse) {
        console.log('=== AI Automator Debug Elements ===');

        const allTextareas = document.querySelectorAll('textarea');
        const allButtons = document.querySelectorAll('button');

        console.log(`Found ${allTextareas.length} textareas:`);
        allTextareas.forEach((ta, i) => {
            console.log(`  Textarea ${i}:`, {
                placeholder: ta.placeholder,
                className: ta.className,
                name: ta.name,
                id: ta.id,
                value: ta.value,
                visible: ta.offsetHeight > 0 && window.getComputedStyle(ta).display !== 'none',
                focused: document.activeElement === ta
            });
        });

        console.log(`Found ${allButtons.length} buttons:`);
        allButtons.forEach((btn, i) => {
            console.log(`  Button ${i}:`, {
                text: btn.textContent?.trim(),
                className: btn.className,
                id: btn.id,
                type: btn.type,
                disabled: btn.disabled,
                visible: btn.offsetHeight > 0 && window.getComputedStyle(btn).display !== 'none'
            });
        });

        // Test element finding
        const foundTextarea = this.findTextarea();
        const foundButton = this.findGenerateButton();

        console.log('Selected elements:');
        console.log('  Textarea:', foundTextarea);
        console.log('  Button:', foundButton);

        sendResponse({
            success: true,
            textareas: allTextareas.length,
            buttons: allButtons.length,
            foundTextarea: !!foundTextarea,
            foundButton: !!foundButton
        });
    }
    
    findTextarea() {
        console.log('🔍 Finding textarea...');

        // Try Runware-specific selector first
        let textarea = document.querySelector(this.runwareTextareaSelector);
        console.log('Runware textarea selector result:', !!textarea);

        // Try specific selector
        if (!textarea) {
            textarea = document.querySelector(this.specificTextareaSelector);
            console.log('Specific textarea selector result:', !!textarea);
        }

        // Try generic selectors
        if (!textarea) {
            textarea = document.querySelector(this.textareaSelector);
            console.log('Generic textarea selector result:', !!textarea);
        }

        // If still not found, try to find any textarea that might be for prompts
        if (!textarea) {
            console.log('Searching through all textareas...');
            const textareas = document.querySelectorAll('textarea');
            console.log('Found', textareas.length, 'textareas total');

            for (const ta of textareas) {
                const placeholder = ta.placeholder?.toLowerCase() || '';
                const className = ta.className?.toLowerCase() || '';
                const name = ta.name?.toLowerCase() || '';

                console.log('Checking textarea:', { placeholder, className, name });

                if (placeholder.includes('prompt') ||
                    placeholder.includes('describe') ||
                    placeholder.includes('type your prompt') ||
                    placeholder.includes('enter prompt') ||
                    className.includes('prompt') ||
                    name.includes('prompt')) {
                    textarea = ta;
                    console.log('Found matching textarea by content!');
                    break;
                }
            }
        }

        // Last resort: find the first visible textarea
        if (!textarea) {
            const textareas = document.querySelectorAll('textarea');
            for (const ta of textareas) {
                const style = window.getComputedStyle(ta);
                if (style.display !== 'none' && style.visibility !== 'hidden' && ta.offsetHeight > 0) {
                    textarea = ta;
                    break;
                }
            }
        }

        return textarea;
    }
    
    findGenerateButton() {
        console.log('🔍 Finding generate button...');

        // Try Runware-specific selector first
        let button = document.querySelector(this.runwareButtonSelector);
        console.log('Runware button selector result:', !!button);

        // Try specific selector
        if (!button) {
            button = document.querySelector(this.specificButtonSelector);
            console.log('Specific button selector result:', !!button);
        }

        // Try generic selectors
        if (!button) {
            button = document.querySelector(this.generateButtonSelector);
            console.log('Generic button selector result:', !!button);
        }

        // If still not found, look for buttons with generate-related text
        if (!button) {
            console.log('Searching through all buttons...');
            const buttons = document.querySelectorAll('button');
            console.log('Found', buttons.length, 'buttons total');

            for (const btn of buttons) {
                const text = btn.textContent?.toLowerCase().trim() || '';
                const id = btn.id?.toLowerCase() || '';
                const className = btn.className?.toLowerCase() || '';

                console.log('Checking button:', {
                    text,
                    id,
                    className,
                    disabled: btn.disabled,
                    hasDisabledAttr: btn.hasAttribute('disabled'),
                    hasMuiDisabled: btn.classList.contains('Mui-disabled')
                });

                if (text === 'generate' ||
                    text.includes('generate') ||
                    text.includes('create') ||
                    text.includes('submit') ||
                    text.includes('run') ||
                    className.includes('generate') ||
                    className.includes('submit') ||
                    id.includes('generate') ||
                    id.includes('submit')) {
                    // Make sure the button is visible (disabled is OK, we'll handle that later)
                    const style = window.getComputedStyle(btn);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        button = btn;
                        console.log('Found matching button by content/class/id!');
                        break;
                    }
                }
            }
        }

        // Last resort: find any visible button
        if (!button) {
            console.log('Last resort: finding any visible button...');
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                const style = window.getComputedStyle(btn);
                if (style.display !== 'none' && style.visibility !== 'hidden' && btn.offsetHeight > 0) {
                    button = btn;
                    console.log('Using fallback button:', btn);
                    break;
                }
            }
        }

        console.log('Final button selection:', button);
        return button;
    }

    isButtonDisabled(button) {
        if (!button) return true;

        return button.disabled ||
               button.hasAttribute('disabled') ||
               button.classList.contains('disabled') ||
               button.classList.contains('Mui-disabled') ||
               button.getAttribute('aria-disabled') === 'true';
    }

    async setTextareaValue(textarea, text) {
        console.log('🔧 Setting textarea value using multiple strategies...');

        // Focus the textarea first
        textarea.focus();
        textarea.click();
        await this.sleep(200);

        // Strategy 1: Select all existing text and delete it
        textarea.select();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
        await this.sleep(100);

        // Strategy 2: Use execCommand('insertText') — this is the most reliable
        // way to trigger React/Vue/Angular state updates because it simulates
        // actual user typing and fires native input events that frameworks listen to
        console.log('🔧 Trying execCommand insertText...');
        const insertSuccess = document.execCommand('insertText', false, text);
        console.log('🔧 execCommand insertText result:', insertSuccess);

        if (insertSuccess && textarea.value === text) {
            console.log('🔧 ✅ execCommand insertText worked!');
            return true;
        }

        // Strategy 3: Native setter + React synthetic event
        console.log('🔧 Trying native setter + InputEvent...');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, "value"
        ).set;

        // Clear with native setter
        nativeInputValueSetter.call(textarea, '');
        textarea.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'deleteContentBackward' }));
        await this.sleep(100);

        // Set new value with native setter
        nativeInputValueSetter.call(textarea, text);

        // Dispatch InputEvent (not Event) — React 16+ listens for this
        textarea.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: text
        }));

        // Also dispatch change event
        textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        await this.sleep(100);

        if (textarea.value === text) {
            console.log('🔧 ✅ Native setter + InputEvent worked!');
            return true;
        }

        // Strategy 4: Simulate clipboard paste
        console.log('🔧 Trying simulated paste...');
        textarea.focus();
        textarea.select();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
        await this.sleep(100);

        // Create a DataTransfer object for the paste event
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', text);

        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: dataTransfer
        });
        textarea.dispatchEvent(pasteEvent);

        // If paste didn't set the value, set it manually and fire events
        if (textarea.value !== text) {
            nativeInputValueSetter.call(textarea, text);
            textarea.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertFromPaste',
                data: text
            }));
        }

        await this.sleep(100);

        // Strategy 5: Keyboard simulation as last resort
        if (textarea.value !== text) {
            console.log('🔧 Trying keyboard simulation...');
            nativeInputValueSetter.call(textarea, '');
            textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'deleteContentBackward' }));
            await this.sleep(50);

            for (const char of text) {
                textarea.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                textarea.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));

                // Append character using native setter
                const currentVal = textarea.value;
                nativeInputValueSetter.call(textarea, currentVal + char);
                textarea.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    inputType: 'insertText',
                    data: char
                }));

                textarea.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
            }
        }

        console.log('🔧 Final textarea value:', textarea.value);
        console.log('🔧 Textarea value length:', textarea.value.length);
        console.log('🔧 Expected text length:', text.length);
        console.log('🔧 Values match:', textarea.value === text);

        return textarea.value === text;
    }
    
    async startAutomation(prompts, startIndex, waitTime) {
        console.log('AI Automator: startAutomation called with:', { prompts: prompts?.length, startIndex, waitTime });

        if (this.isRunning) {
            console.log('AI Automator: Already running, aborting');
            this.sendMessage('automationError', { error: 'Automation is already running' });
            return;
        }

        if (!prompts || prompts.length === 0) {
            console.log('AI Automator: No prompts provided');
            this.sendMessage('automationError', { error: 'No prompts provided' });
            return;
        }

        this.prompts = prompts;
        this.currentIndex = startIndex || 0;
        this.waitTime = waitTime || 30000;
        this.isRunning = true;

        console.log('AI Automator: Starting automation with', this.prompts.length, 'prompts');
        this.sendMessage('updateStatus', { status: 'Checking page elements...' });

        // Wait for page to be fully loaded
        if (document.readyState !== 'complete') {
            console.log('AI Automator: Waiting for page to load...');
            await new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve, { once: true });
                }
            });
        }

        // Debug: Log all textareas and buttons found
        console.log('AI Automator Debug: Looking for elements...');
        const allTextareas = document.querySelectorAll('textarea');
        const allButtons = document.querySelectorAll('button');
        console.log('Found textareas:', allTextareas.length);
        console.log('Found buttons:', allButtons.length);

        allTextareas.forEach((ta, i) => {
            console.log(`Textarea ${i}:`, {
                placeholder: ta.placeholder,
                className: ta.className,
                name: ta.name,
                id: ta.id,
                visible: ta.offsetHeight > 0 && window.getComputedStyle(ta).display !== 'none'
            });
        });

        allButtons.forEach((btn, i) => {
            console.log(`Button ${i}:`, {
                text: btn.textContent?.trim(),
                className: btn.className,
                id: btn.id,
                type: btn.type,
                disabled: btn.disabled,
                visible: btn.offsetHeight > 0 && window.getComputedStyle(btn).display !== 'none'
            });
        });

        // Verify that we can find the necessary elements
        let textarea = this.findTextarea();
        let button = this.findGenerateButton();

        console.log('Selected textarea:', textarea);
        console.log('Selected button:', button);

        if (!textarea) {
            // Last resort: try to find ANY textarea
            const allTextareas = document.querySelectorAll('textarea');
            if (allTextareas.length > 0) {
                textarea = allTextareas[0]; // Use the first textarea found
                console.log('Using fallback textarea:', textarea);
            } else {
                this.sendMessage('automationError', { error: 'Could not find any textarea on this page. Make sure you are on an AI image generation website.' });
                this.isRunning = false;
                return;
            }
        }

        if (!button) {
            // Last resort: try to find ANY button that might be a submit button
            const allButtons = document.querySelectorAll('button');
            for (const btn of allButtons) {
                const style = window.getComputedStyle(btn);
                if (style.display !== 'none' && style.visibility !== 'hidden' && btn.offsetHeight > 0) {
                    button = btn;
                    console.log('Using fallback button:', button);
                    break;
                }
            }

            if (!button) {
                this.sendMessage('automationError', { error: 'Could not find any clickable button on this page. Make sure you are on an AI image generation website.' });
                this.isRunning = false;
                return;
            }
        }

        // Store the found elements for later use
        this.foundTextarea = textarea;
        this.foundButton = button;

        this.sendMessage('updateStatus', { status: 'Starting automation...' });

        // Start processing prompts
        console.log('AI Automator: About to start processing prompts...');
        this.processNextPrompt();
    }
    
    stopAutomation() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.sendMessage('updateStatus', { status: 'Automation stopped' });
    }
    
    async processNextPrompt() {
        console.log('AI Automator: processNextPrompt called, currentIndex:', this.currentIndex, 'total prompts:', this.prompts?.length);

        if (!this.isRunning || this.currentIndex >= this.prompts.length) {
            console.log('AI Automator: Stopping - isRunning:', this.isRunning, 'currentIndex:', this.currentIndex);
            if (this.currentIndex >= this.prompts.length) {
                this.sendMessage('automationComplete', {});
            }
            this.isRunning = false;
            return;
        }

        const currentPrompt = this.prompts[this.currentIndex];

        this.sendMessage('updateStatus', {
            status: `Processing prompt ${this.currentIndex + 1}/${this.prompts.length}`
        });

        this.sendMessage('updateProgress', {
            currentIndex: this.currentIndex
        });

        try {
            console.log('AI Automator: Processing prompt', this.currentIndex + 1, ':', currentPrompt);

            // Use stored elements or find them again
            let textarea = this.foundTextarea || this.findTextarea();
            let button = this.foundButton || this.findGenerateButton();

            console.log('AI Automator: Found elements - textarea:', !!textarea, 'button:', !!button);

            if (!textarea || !button) {
                console.error('AI Automator: Elements not found - textarea:', textarea, 'button:', button);
                this.sendMessage('automationError', {
                    error: 'Page elements not found. The page may have changed. Please refresh and try again.'
                });
                this.isRunning = false;
                return;
            }

            // Clear existing text and paste new prompt
            console.log('AI Automator: Setting prompt text...');
            console.log('AI Automator: Target textarea:', {
                tagName: textarea.tagName,
                id: textarea.id,
                className: textarea.className,
                placeholder: textarea.placeholder,
                currentValue: textarea.value
            });

            // Use the new comprehensive text setting method
            const success = await this.setTextareaValue(textarea, currentPrompt);
            console.log('AI Automator: Text setting success:', success);

            console.log('AI Automator: Textarea value after setting:', textarea.value);
            console.log('AI Automator: Textarea length:', textarea.value.length);

            // Wait for the UI to update
            console.log('AI Automator: Waiting for UI to update...');
            await this.sleep(1500);

            // Check button state immediately after UI update
            console.log('AI Automator: Button state after UI update:', {
                disabled: button.disabled,
                hasDisabledAttr: button.hasAttribute('disabled'),
                hasMuiDisabled: button.classList.contains('Mui-disabled'),
                classList: button.className,
                textContent: button.textContent
            });

            // Check if button is enabled (check multiple disabled states)
            const isDisabled = button.disabled ||
                              button.hasAttribute('disabled') ||
                              button.classList.contains('disabled') ||
                              button.classList.contains('Mui-disabled') ||
                              button.getAttribute('aria-disabled') === 'true';

            console.log('AI Automator: Button disabled status:', {
                disabled: button.disabled,
                hasDisabledAttr: button.hasAttribute('disabled'),
                hasDisabledClass: button.classList.contains('disabled'),
                hasMuiDisabledClass: button.classList.contains('Mui-disabled'),
                ariaDisabled: button.getAttribute('aria-disabled'),
                isDisabled: isDisabled
            });

            if (isDisabled) {
                this.sendMessage('updateStatus', {
                    status: 'Waiting for generate button to be enabled...'
                });

                // Wait up to 15 seconds for button to be enabled
                let attempts = 0;
                const maxAttempts = 30; // 15 seconds with 500ms intervals

                while (this.isButtonDisabled(button) && attempts < maxAttempts && this.isRunning) {
                    console.log('AI Automator: Waiting for button to be enabled, attempt:', attempts + 1);
                    await this.sleep(500);
                    attempts++;

                    // Re-check the button in case the DOM changed
                    button = this.foundButton || this.findGenerateButton();
                    if (!button) {
                        console.error('AI Automator: Button disappeared while waiting');
                        this.sendMessage('automationError', {
                            error: 'Generate button disappeared. The page may have changed.'
                        });
                        this.isRunning = false;
                        return;
                    }
                }

                if (this.isButtonDisabled(button)) {
                    console.log('AI Automator: Button still disabled — force-enabling it...');
                    // Force-enable the button as a last resort
                    button.disabled = false;
                    button.removeAttribute('disabled');
                    button.classList.remove('Mui-disabled');
                    button.classList.remove('disabled');
                    button.removeAttribute('aria-disabled');
                    button.tabIndex = 0;
                    button.style.opacity = '1';
                    button.style.pointerEvents = 'auto';
                    console.log('AI Automator: Button force-enabled');
                    await this.sleep(200);
                }
            }

            // Click the generate button
            console.log('AI Automator: About to click generate button...');
            console.log('AI Automator: Button element:', button);
            console.log('AI Automator: Button ID:', button.id);
            console.log('AI Automator: Button classes:', button.className);
            console.log('AI Automator: Button text:', button.textContent);

            try {
                console.log('AI Automator: Button visible?', button.offsetHeight > 0 && button.offsetWidth > 0);
                console.log('AI Automator: Button getBoundingClientRect:', button.getBoundingClientRect());

                // Scroll button into view first
                console.log('AI Automator: Scrolling button into view...');
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await this.sleep(500);

                // Try multiple click methods
                console.log('AI Automator: Attempting click...');

                // Method 1: Simulate real user interaction
                console.log('AI Automator: Simulating real user interaction...');

                // Focus the button first
                button.focus();
                await this.sleep(100);

                // Simulate mouse events in sequence
                button.dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                }));

                await this.sleep(50);

                button.dispatchEvent(new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                }));

                await this.sleep(50);

                // Now the actual click
                console.log('AI Automator: Trying direct click...');
                button.click();
                console.log('AI Automator: ✅ Direct click executed');

                // Also try event dispatch as backup
                console.log('AI Automator: Also dispatching click event...');
                button.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,
                    buttons: 1
                }));
                console.log('AI Automator: ✅ Event dispatch click executed');

                // Wait a moment and check if generation started
                await this.sleep(2000);
                console.log('AI Automator: Checking if generation started...');

                // Look for signs that generation started
                const generationIndicators = [
                    'button:contains("Stop")',
                    'button:contains("Cancel")',
                    '[class*="generating"]',
                    '[class*="loading"]',
                    '.progress',
                    '[aria-label*="generating"]',
                    '[aria-label*="loading"]'
                ];

                let generationStarted = false;
                for (const selector of generationIndicators) {
                    try {
                        let element;
                        if (selector.includes(':contains')) {
                            const baseSelector = selector.split(':contains')[0];
                            const text = selector.match(/\("([^"]+)"\)/)[1];
                            const elements = document.querySelectorAll(baseSelector);
                            element = Array.from(elements).find(el =>
                                el.textContent.toLowerCase().includes(text.toLowerCase())
                            );
                        } else {
                            element = document.querySelector(selector);
                        }

                        if (element) {
                            console.log('AI Automator: ✅ Generation started - found:', selector);
                            generationStarted = true;
                            break;
                        }
                    } catch (e) {
                        // Ignore selector errors
                    }
                }

                if (!generationStarted) {
                    console.log('AI Automator: ⚠️ No generation indicators found - the click might not have triggered generation');

                    // Check if button is still the same (maybe it should have changed)
                    const buttonAfterClick = this.findGenerateButton();
                    if (buttonAfterClick) {
                        console.log('AI Automator: Button after click:', {
                            text: buttonAfterClick.textContent,
                            disabled: buttonAfterClick.disabled,
                            classes: buttonAfterClick.className
                        });
                    }
                } else {
                    console.log('AI Automator: ✅ Generation appears to have started successfully');
                }

            } catch (error) {
                console.error('AI Automator: ❌ Click failed with error:', error);
                console.error('AI Automator: Error stack:', error.stack);

                // Try alternative click method
                try {
                    console.log('AI Automator: Trying alternative click method...');
                    const clickEvent = new Event('click', { bubbles: true, cancelable: true });
                    button.dispatchEvent(clickEvent);
                    console.log('AI Automator: ✅ Alternative click executed');
                } catch (error2) {
                    console.error('AI Automator: ❌ Alternative click also failed:', error2);
                }
            }

            this.sendMessage('updateStatus', {
                status: `Prompt ${this.currentIndex + 1} submitted. Waiting ${this.waitTime / 1000} seconds before next prompt...`
            });

            // Move to next prompt
            this.currentIndex++;
            console.log('AI Automator: Moving to next prompt, currentIndex now:', this.currentIndex);

            // Wait before processing next prompt
            console.log('AI Automator: Setting timeout for', this.waitTime, 'ms');
            this.timeoutId = setTimeout(() => {
                console.log('AI Automator: Timeout completed, processing next prompt...');
                this.processNextPrompt();
            }, this.waitTime);

        } catch (error) {
            console.error('AI Automator: Error processing prompt:', error);
            this.sendMessage('automationError', {
                error: `Error processing prompt ${this.currentIndex + 1}: ${error.message}`
            });
            this.isRunning = false;
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    sendMessage(action, data = {}) {
        // Firefox compatibility
        const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
        runtimeAPI.sendMessage({
            action: action,
            ...data
        });
    }
}

// Initialize the automation engine
console.log('AI Image Automator: Content script loaded');
const automationEngine = new AIImageAutomationEngine();

// Add visual indicator when extension is active
const indicator = document.createElement('div');
indicator.id = 'ai-automator-indicator';
indicator.innerHTML = '🤖 AI Automator Ready';
indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    cursor: pointer;
`;

document.body.appendChild(indicator);

// Hide indicator after 3 seconds
setTimeout(() => {
    if (indicator.parentNode) {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 300);
    }
}, 3000);
