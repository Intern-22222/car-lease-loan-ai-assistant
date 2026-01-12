import os
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def send_message_to_gemini(message):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GEMINI_API_KEY}"
    }
    payload = {
        "contents": [{"parts": [{"text": message}]}]
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.ok:
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    else:
        return f"Error: {response.status_code} - {response.text}"
