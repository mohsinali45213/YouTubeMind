// Content script for YouTube pages
// This script runs on YouTube pages and can interact with the page content

console.log('YouTube Supporter extension loaded on:', window.location.href);

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoUrl') {
    sendResponse({ url: window.location.href });
  }
  
  if (request.action === 'getVideoInfo') {
    const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent || 
                      document.querySelector('h1.title')?.textContent || 
                      'YouTube Video';
    
    sendResponse({
      url: window.location.href,
      title: videoTitle.trim()
    });
  }
  
  return true; // Keep channel open for async response
});

// Optional: Add a floating button on YouTube pages
function addFloatingButton() {
  // Check if button already exists
  if (document.getElementById('yt-supporter-btn')) return;
  
  const button = document.createElement('div');
  button.id = 'yt-supporter-btn';
  button.innerHTML = '🤖 Ask AI';
  button.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    z-index: 10000;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  button.onmouseover = () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
  };
  
  button.onmouseout = () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
  };
  
  button.onclick = () => {
    // Open the extension popup programmatically
    chrome.runtime.sendMessage({ action: 'openPopup' });
  };
  
  document.body.appendChild(button);
}

// Add button when video page is detected
if (window.location.href.includes('youtube.com/watch')) {
  // Wait for page to load
  setTimeout(addFloatingButton, 2000);
}

// Handle YouTube's SPA navigation
let lastUrl = window.location.href;
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    if (currentUrl.includes('youtube.com/watch')) {
      setTimeout(addFloatingButton, 2000);
    } else {
      const existingButton = document.getElementById('yt-supporter-btn');
      if (existingButton) {
        existingButton.remove();
      }
    }
  }
}).observe(document.body, { childList: true, subtree: true });
