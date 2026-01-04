import re
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

def get_youtube_video_id(url: str) -> str | None:
    """
    Extract YouTube video ID from a URL.
    Returns video ID if found, else None.
    """
    # Handle None or empty strings
    if not url:
        return None

    # Short URLs: youtu.be/VIDEO_ID
    short_match = re.match(r"https?://youtu\.be/([^?&/]+)", url)
    if short_match:
        return short_match.group(1)

    parsed = urlparse(url)

    # Standard URLs: youtube.com/watch?v=VIDEO_ID
    if parsed.hostname in ("www.youtube.com", "youtube.com", "m.youtube.com"):
        query = parse_qs(parsed.query)
        if "v" in query:
            return query["v"][0]

        # Embedded / Shorts / Live
        path_match = re.match(
            r"/(embed|v|shorts|live)/([^?/]+)", parsed.path
        )
        if path_match:
            return path_match.group(2)

    return None

def get_youtube_transcript(url: str, languages=["en"]) -> str | None:
    """
    Fetch transcript text for a YouTube video URL.
    Returns transcript as plain text or None if unavailable.
    """
    try:
        video_id = get_youtube_video_id(url)
        if not video_id:
            print("Invalid URL or video ID not found.")
            return None

        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id,languages=languages)

        formatter = TextFormatter()
        text_transcript = formatter.format_transcript(transcript)
        return text_transcript

    except Exception as e:
        print(f"Transcript not available: {e}")
        return None