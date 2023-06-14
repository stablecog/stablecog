```python
import requests
import json

API_KEY = os.environ.get("STABLECOG_API_KEY")
API_HOST = "https://api.stablecog.com"
API_ENDPOINT = "/v1/image/upload"
API_URL = f"{API_HOST}{API_ENDPOINT}"

files = {'file': open('my_init_image.jpg', 'rb')}

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

res = requests.post(API_URL, files=files, headers=headers)

res_json = res.json()
print(json.dumps(res_json, indent=2))
```
