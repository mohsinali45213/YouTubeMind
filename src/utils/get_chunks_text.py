from langchain_text_splitters import RecursiveCharacterTextSplitter

def get_chunks_text(text: str, video_id: str) -> list[dict]:
    """
    Split the given text into chunks suitable for vector storage.
    Returns a list of documents with metadata.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunks = text_splitter.create_documents([text], metadatas=[{"video_id": video_id}])
    return chunks