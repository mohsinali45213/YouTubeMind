// Background service worker for the extension
// Handles extension lifecycle and messaging

console.log('YouTube Supporter background service worker started');

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      backendUrl: 'http://localhost:8000',
      language: 'en'
    });
    
    // Open welcome page or instructions
    chrome.tabs.create({
      url: 'https://github.com/mohsinali45213/YouTubeMind'
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    // Note: We can't programmatically open the popup from content script
    // This is a Chrome limitation for security reasons
    // User must click the extension icon
    console.log('Popup open requested');
  }
  
  if (request.action === 'testBackend') {
    // Test backend connection
    fetch(`${request.url}/docs`)
      .then(response => response.ok)
      .then(isOk => sendResponse({ success: isOk }))
      .catch(() => sendResponse({ success: false }));
    return true; // Keep channel open for async response
  }
  
  return true;
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.url);
});

// Monitor active tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    console.log('YouTube video detected:', tab.url);
    // You can add badge or other indicators here
    chrome.action.setBadgeText({ text: '✓', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#667eea', tabId: tab.id });
  } else {
    chrome.action.setBadgeText({ text: '', tabId: tab.id });
  }
});

// Monitor tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('youtube.com/watch')) {
      console.log('YouTube video page loaded:', tab.url);
      chrome.action.setBadgeText({ text: '✓', tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#667eea', tabId: tabId });
    } else {
      chrome.action.setBadgeText({ text: '', tabId: tabId });
    }
  }
});
