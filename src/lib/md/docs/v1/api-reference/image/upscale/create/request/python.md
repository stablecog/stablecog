```python
import os
import requests
import json

API_KEY = os.environ.get("STABLECOG_API_KEY")
API_HOST = "https://api.stablecog.com"
API_ENDPOINT = "/v1/image/upscale/create"
API_URL = f"{API_HOST}{API_ENDPOINT}"

req = {
	"input": "daa383dc-42f7-4137-92b6-4087af7b4aab"
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

res = requests.post(API_URL, data=json.dumps(req), headers=headers)

res_json = res.json()
print(json.dumps(res_json, indent=2))
```
