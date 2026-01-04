from langchain_google_genai import ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os
load_dotenv()

model = ChatGoogleGenerativeAI(
  model=os.getenv("GEMINI_MODEL"),
  api_key=os.getenv("GEMINI_API_KEY")
)

embeddings = GoogleGenerativeAIEmbeddings(
  api_key=os.getenv("GEMINI_API_KEY"),
  model="models/gemini-embedding-001"
)

