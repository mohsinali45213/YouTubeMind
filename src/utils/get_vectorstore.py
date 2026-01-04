from langchain_community.vectorstores import Chroma
from src.models.model import embeddings

def get_vectorstore(video_id: str, chunks):
  try:
    vectorstore = Chroma(
        collection_name=video_id,
        embedding_function=embeddings,
        persist_directory="chroma_db"
    )
    # Check if collection has any documents
    if vectorstore._collection.count() > 0:
        print(f"Loaded existing vectorstore for video {video_id} with {vectorstore._collection.count()} documents")
    else:
        # Collection exists but is empty, add documents
        vectorstore.add_documents(chunks)
        print(f"Added documents to existing empty collection {video_id}")
  except Exception as e:
      # Collection doesn't exist, create new one
      print("Loaded existing vectorstore")
      vectorstore = Chroma.from_documents(
          documents=chunks,
          embedding=embeddings,
          persist_directory="chroma_db",
          collection_name=video_id
      )
  return vectorstore

