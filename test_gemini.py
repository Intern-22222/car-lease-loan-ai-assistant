
from google import genai
import os
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
print(client.models.generate_content(
    model="gemini-1.5-pro-latest",
    contents="Say hello"
).text)

