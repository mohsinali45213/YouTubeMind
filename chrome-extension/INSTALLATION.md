# Installation Guide for Users

## Prerequisites

This extension requires a running backend server. You have two options:

### Option A: Run Your Own Backend (Recommended for Privacy)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/YTSuppoter.git
   cd YTSuppoter
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file with:
   ```
   GEMINI_MODEL=gemini-pro
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from: https://makersuite.google.com/app/apikey

4. **Start the backend server:**
   ```bash
   uvicorn src.main:app --reload
   ```
   Keep this running in the background.

### Option B: Use Hosted Backend (If Available)

If a public backend is available, you can skip running your own server.
The extension will automatically connect to the hosted version.

## Installing the Extension

### Method 1: From ZIP File

1. Download the latest release ZIP file
2. Extract it to a permanent location (don't delete this folder later!)
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top-right)
5. Click **Load unpacked**
6. Select the extracted `chrome-extension` folder
7. Done! The extension icon should appear in your toolbar

### Method 2: From Source (Developers)

1. Clone the repository (see Option A above)
2. Open Chrome: `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Navigate to `YTSuppoter/chrome-extension` folder
6. Click "Select Folder"

## Setup

### First-Time Setup

1. **Generate Icons** (if not already included):
   - Open `chrome-extension/icons/generate_icons.html` in your browser
   - Download all 3 icon files
   - Save them in the `icons` folder
   - Refresh the extension

2. **Configure Backend** (only if using custom backend):
   - If your backend runs on a different port, edit `popup.js`
   - Change `BACKEND_URL` to your server address

## Usage

1. **Start your backend** (if running locally):
   ```bash
   uvicorn src.main:app --reload
   ```

2. **Go to any YouTube video**
   - Navigate to youtube.com and open any video

3. **Open the extension**
   - Click the extension icon in Chrome toolbar
   - You'll see the video title and URL detected automatically

4. **Select language** (if needed)
   - Choose the transcript language
   - Default is English

5. **Ask your question**
   - Type your question in the text box
   - Click "Ask Question"
   - Wait for AI response

6. **Copy answer** (optional)
   - Click "📋 Copy Answer" to copy to clipboard

## Troubleshooting

### "No YouTube video detected"
- Make sure you're on a video page (`youtube.com/watch?v=...`)
- Refresh the page and try again

### "Failed to connect to backend"
- Verify backend is running: visit `http://localhost:8000/docs`
- Check if the port is correct (default: 8000)
- Ensure no firewall is blocking the connection

### "Transcript not available"
- Try selecting a different language
- Some videos don't have transcripts/captions
- Live streams may not have transcripts yet

### Extension not loading
- Make sure all files are in the `chrome-extension` folder
- Check Chrome console for errors: `chrome://extensions/` → Details → Errors
- Try removing and re-adding the extension

## Updating the Extension

1. Pull latest changes: `git pull`
2. Go to `chrome://extensions/`
3. Click the refresh icon ↻ on the extension card
4. Restart may be required for major updates

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "YouTube Supporter - AI Q&A"
3. Click "Remove"
4. Confirm deletion

---

**Need Help?** Open an issue on GitHub or check the main README.
