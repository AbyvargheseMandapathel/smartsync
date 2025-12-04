import requests
import json

api_key = "AIzaSyDNwaBW-LXzu2-3AHItysu87sECZUCaaFI"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{ "text": "Hello, when should I start cooking?" }]
    }]
}

headers = {
    "Content-Type": "application/json"
}

print(f"Testing URL: {url}")
try:
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
