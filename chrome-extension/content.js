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
