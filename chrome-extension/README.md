# YouTube Supporter - Chrome Extension

A Chrome extension that integrates with your YouTube Supporter AI backend to answer questions about YouTube videos using AI-powered transcript analysis.

## Features

✨ **AI-Powered Q&A**: Ask questions about any YouTube video and get intelligent answers
🎯 **Multi-language Support**: Supports transcripts in 12+ languages
🎨 **Beautiful UI**: Modern, gradient-styled popup interface
🤖 **Smart Integration**: Floating AI button on YouTube pages
⚡ **Real-time Processing**: Fast responses powered by your FastAPI backend
📋 **Copy to Clipboard**: Easily copy AI responses

## Prerequisites

Before installing the extension, make sure you have:

1. **Backend Running**: Your FastAPI backend must be running
   ```bash
   cd YTSuppoter
   uvicorn src.main:app --reload
   ```

2. **Python Dependencies**: Ensure all backend dependencies are installed
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Variables**: Set up your `.env` file with:
   ```
   GEMINI_MODEL=gemini-pro
   GEMINI_API_KEY=your_api_key_here
   ```

## Installation

### Step 1: Generate Icons

1. Open `chrome-extension/icons/generate_icons.html` in your browser
2. Download all three icon files (icon16.png, icon48.png, icon128.png)
3. Save them in the `chrome-extension/icons/` folder

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder from your YTSuppoter directory
5. The extension should now appear in your extensions list

### Step 3: Configure Backend URL

1. Click the extension icon in Chrome toolbar
2. By default, it connects to `http://localhost:8000`
3. If your backend runs on a different port/host, update the Backend URL field
4. The setting is saved automatically

## Usage

### Method 1: Using the Extension Popup

1. Navigate to any YouTube video
2. Click the YouTube Supporter extension icon
3. Select the transcript language (if not English)
4. Type your question in the text area
5. Click **Ask Question**
6. Wait for the AI response
7. Copy the answer using the **Copy Answer** button

### Method 2: Using the Floating Button

1. Navigate to any YouTube video
2. Look for the **🤖 Ask AI** floating button in the bottom-right
3. Click it to open the extension popup
4. Follow the same steps as Method 1

## Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- Arabic (ar)
- Hindi (hi)

## Example Questions

Here are some example questions you can ask:

- "What is the main topic of this video?"
- "Can you summarize the key points?"
- "What code examples are shown?"
- "Explain the concept discussed at the beginning"
- "What are the steps to implement this?"
- "List all the tools mentioned"

## Troubleshooting

### Extension shows "No YouTube video detected"
- Make sure you're on a YouTube video page (`youtube.com/watch?v=...`)
- Refresh the page and try again

### "Failed to connect to backend" error
- Verify your backend is running: `http://localhost:8000/docs`
- Check the Backend URL in extension settings
- Ensure CORS is enabled in your FastAPI app (already configured)

### Transcript not available error
- Try selecting a different language
- Some videos don't have transcripts available
- Auto-generated captions may not be available immediately after upload

### Icons not showing
- Follow Step 1 in Installation to generate icon files
- Make sure all three PNG files exist in the `icons` folder
- Reload the extension after adding icons

## File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.js             # Popup logic and API calls
├── popup.css            # Styling for popup
├── content.js           # YouTube page integration
├── background.js        # Background service worker
└── icons/
    ├── generate_icons.html  # Icon generator tool
    ├── icon16.png          # 16x16 icon
    ├── icon48.png          # 48x48 icon
    └── icon128.png         # 128x128 icon
```

## Development

### Testing Changes

1. Make your changes to the extension files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the YouTube Supporter extension
4. Test your changes

### Debugging

- **Popup**: Right-click popup → Inspect
- **Background Script**: Go to `chrome://extensions/` → Click "service worker"
- **Content Script**: Open YouTube page → F12 → Console tab

## Backend API Reference

The extension communicates with your FastAPI backend:

**Endpoint**: `POST /transcript`

**Request Body**:
```json
{
  "url": "https://youtube.com/watch?v=...",
  "languages": "en",
  "query": "What is this video about?"
}
```

**Response**:
```json
{
  "answer": "The AI-generated answer..."
}
```

## Privacy & Security

- The extension only accesses YouTube pages
- Video URLs and questions are sent to your local backend
- No data is stored or shared with third parties
- All processing happens on your local machine

## Future Enhancements

- [ ] Conversation history
- [ ] Bookmarking favorite responses
- [ ] Timestamp citations in answers
- [ ] Dark mode support
- [ ] Export answers to file
- [ ] Keyboard shortcuts

## License

This extension is part of the YouTube Supporter project.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Ensure your backend is properly configured
3. Check browser console for errors

---

**Note**: This extension requires the YouTube Supporter backend to be running. Make sure to start your FastAPI server before using the extension.
