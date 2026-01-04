// DOM Elements
const questionInput = document.getElementById('question');
const askBtn = document.getElementById('askBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const answerSection = document.getElementById('answerSection');
const answerDiv = document.getElementById('answer');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const videoInfo = document.getElementById('videoInfo');
const videoTitle = document.getElementById('videoTitle');
const videoUrl = document.getElementById('videoUrl');
const languageSelect = document.getElementById('language');
const copyBtn = document.getElementById('copyBtn');
const statusDiv = document.getElementById('status');

// Backend URL is hardcoded
const BACKEND_URL = 'https://youtubemind.onrender.com';

let currentVideoUrl = null;

// Load saved settings
chrome.storage.sync.get(['language'], (result) => {
  if (result.language) {
    languageSelect.value = result.language;
  }
});

// Save settings on change
languageSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ language: languageSelect.value });
});

// Get current YouTube video
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const tab = tabs[0];
  
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    currentVideoUrl = tab.url;
    videoTitle.textContent = `📺 ${tab.title || 'YouTube Video'}`;
    videoUrl.textContent = `Video: ${currentVideoUrl}`;
    videoUrl.style.display = 'block';
    askBtn.disabled = false;
    showStatus('✅ Video detected! Ask any question below.', 'success');
  } else {
    videoTitle.textContent = '⚠️ Please open a YouTube video';
    videoUrl.style.display = 'none';
    askBtn.disabled = true;
    showStatus('Please navigate to a YouTube video', 'warning');
  }
});

// Ask question handler
askBtn.addEventListener('click', async () => {
  const question = questionInput.value.trim();
  
  if (!question) {
    showError('Please enter a question');
    return;
  }

  if (!currentVideoUrl) {
    showError('No YouTube video detected');
    return;
  }

  // Hide previous results
  answerSection.style.display = 'none';
  errorSection.style.display = 'none';
  loadingIndicator.style.display = 'block';
  askBtn.disabled = true;

  try {
    const language = languageSelect.value || 'en';

    const response = await fetch(`${BACKEND_URL}/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: currentVideoUrl,
        languages: language,
        query: question
      })
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Try to parse JSON, handle non-JSON responses
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Server returned invalid response. Make sure backend is running correctly.');
    }

    loadingIndicator.style.display = 'none';
    askBtn.disabled = false;

    if (data.error) {
      showError(data.error);
    } else if (data.answer) {
      showAnswer(data.answer);
    } else {
      showError('Unexpected response from server');
    }
  } catch (error) {
    loadingIndicator.style.display = 'none';
    askBtn.disabled = false;
    showError(`Failed to connect to backend: ${error.message}`);
  }
});

// Copy answer to clipboard
copyBtn.addEventListener('click', () => {
  const answerText = answerDiv.textContent;
  navigator.clipboard.writeText(answerText).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });
});

// Enter key to submit
questionInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    askBtn.click();
  }
});

// Helper functions
function showAnswer(answer) {
  answerSection.style.display = 'block';
  errorSection.style.display = 'none';
  
  // Format answer with proper markdown-like rendering
  answerDiv.innerHTML = formatAnswer(answer);
}

function showError(message) {
  errorSection.style.display = 'block';
  answerSection.style.display = 'none';
  errorMessage.textContent = message;
}

function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status status-${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

function formatAnswer(text) {
  // Basic formatting for better readability
  let formatted = text
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    // Format code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Format inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Format bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Format lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  return formatted;
}
