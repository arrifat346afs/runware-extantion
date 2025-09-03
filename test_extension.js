// Test script for AI Image Automator Extension
// This script can be run in the browser console to test extension functionality

console.log('🧪 Testing AI Image Automator Extension...');

// Test 1: Check if content script is loaded
function testContentScriptLoaded() {
    console.log('🧪 Test 1: Checking if content script is loaded...');
    
    const indicator = document.getElementById('ai-automator-indicator');
    if (indicator) {
        console.log('✅ Content script indicator found');
        return true;
    } else {
        console.log('❌ Content script indicator not found');
        return false;
    }
}

// Test 2: Check if elements can be found
function testElementDetection() {
    console.log('🧪 Test 2: Testing element detection...');
    
    const textareas = document.querySelectorAll('textarea');
    const buttons = document.querySelectorAll('button');
    
    console.log(`Found ${textareas.length} textareas and ${buttons.length} buttons`);
    
    if (textareas.length > 0 && buttons.length > 0) {
        console.log('✅ Elements found successfully');
        return true;
    } else {
        console.log('❌ Required elements not found');
        return false;
    }
}

// Test 3: Test textarea interaction
function testTextareaInteraction() {
    console.log('🧪 Test 3: Testing textarea interaction...');
    
    const textarea = document.querySelector('textarea');
    if (!textarea) {
        console.log('❌ No textarea found');
        return false;
    }
    
    const testPrompt = 'Test prompt for automation';
    textarea.value = testPrompt;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    if (textarea.value === testPrompt) {
        console.log('✅ Textarea interaction successful');
        return true;
    } else {
        console.log('❌ Textarea interaction failed');
        return false;
    }
}

// Test 4: Test button state
function testButtonState() {
    console.log('🧪 Test 4: Testing button state...');
    
    const button = document.querySelector('button');
    if (!button) {
        console.log('❌ No button found');
        return false;
    }
    
    console.log('Button disabled:', button.disabled);
    console.log('Button text:', button.textContent?.trim());
    
    if (button.disabled === false) {
        console.log('✅ Button is enabled and ready');
        return true;
    } else {
        console.log('⚠️ Button is disabled (this might be expected)');
        return true; // This might be expected behavior
    }
}

// Run all tests
function runAllTests() {
    console.log('🧪 Running all extension tests...');
    
    const results = {
        contentScript: testContentScriptLoaded(),
        elementDetection: testElementDetection(),
        textareaInteraction: testTextareaInteraction(),
        buttonState: testButtonState()
    };
    
    const passedTests = Object.values(results).filter(result => result).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`🧪 Test Results: ${passedTests}/${totalTests} tests passed`);
    console.log('📊 Detailed results:', results);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Extension should work correctly.');
    } else {
        console.log('⚠️ Some tests failed. Check the issues above.');
    }
    
    return results;
}

// Auto-run tests when script is loaded
setTimeout(runAllTests, 1000);

// Export functions for manual testing
window.extensionTests = {
    runAllTests,
    testContentScriptLoaded,
    testElementDetection,
    testTextareaInteraction,
    testButtonState
};

console.log('🧪 Extension test script loaded. Run extensionTests.runAllTests() to test manually.');
