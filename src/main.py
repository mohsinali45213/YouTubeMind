from fastapi import FastAPI
from src.models.model import model
from fastapi.middleware.cors import CORSMiddleware
from src.utils.get_youtube_transcript import get_youtube_video_id, get_youtube_transcript
from src.utils.get_chunks_text import get_chunks_text
from src.utils.get_vectorstore import get_vectorstore
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from pydantic import BaseModel

class Url(BaseModel):
  url: str
  languages: str | None = "en"
  query: str | None = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcript")
async def fetch_transcript(url: Url):
  
  video_id = get_youtube_video_id(url.url)
  transcript = get_youtube_transcript(url.url, [url.languages])
  
  if not transcript:
    return {"error": f"{get_languages(url.languages)} Transcript not available for this video please select another language."}
  
  chunks = get_chunks_text(transcript, video_id)
  vectorstore = get_vectorstore(video_id, chunks)
  retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k":3})
  
  if url.query is None or url.query.strip() != "":
    prompt = ChatPromptTemplate.from_template("""You are a helpful assistant that helps people to get answer their quetions base on youtube video transcripts. Use the following context to answer the question at the end...You can generate your own examples to better illustrate your points and make sure code should be in code formate not text.
    warning : 
    - if the question is not related to the context, politely respond that you are only able to answer questions related to the provided context.
    - output should be clear and concise.
    - if user asked any codding related question provide code snippets.
    - you have ability to understand and answer in different languages based on user query .
  
    Context: {context}
    Question: {question}
    Answer:""")
    
    chain = (
      {
          "context": retriever | format_docs,  # Question goes to retriever, then format docs
          "question": RunnablePassthrough()     # Pass question through unchanged
      }
      | prompt      # Format the prompt with context and question
      | model       # Send to the model
      | StrOutputParser()  # Parse the output
    )
    response = chain.invoke(url.query)
    return {"answer": response}
  else:
    return{"error": "Please provide a valid query."}

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)  
  
def get_languages(code):
    language_map = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "ru": "Russian",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
        # Add more language codes and names as needed
    }
    return language_map.get(code, "Unknown")