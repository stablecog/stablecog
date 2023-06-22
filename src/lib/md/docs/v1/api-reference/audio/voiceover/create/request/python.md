```python
import os
import requests
import json

API_KEY = os.environ.get("STABLECOG_API_KEY")
API_HOST = "https://api.stablecog.com"
API_ENDPOINT = "/v1/audio/voiceover/create"
API_URL = f"{API_HOST}{API_ENDPOINT}"

req = {
	"prompt": "Technology is a bridge between imagination and reality."
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

res = requests.post(API_URL, data=json.dumps(req), headers=headers)

res_json = res.json()
print(json.dumps(res_json, indent=2))
```
