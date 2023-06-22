```python
import os
import requests
import json

API_KEY = os.environ.get("STABLECOG_API_KEY")
API_HOST = "https://api.stablecog.com"
API_ENDPOINT = "/v1/image/generation/outputs"
API_URL = f"{API_HOST}{API_ENDPOINT}"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

res = requests.get(API_URL, headers=headers)

res_json = res.json()
print(json.dumps(res_json, indent=2))
```
