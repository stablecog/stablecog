```python
import os
import requests

API_KEY = os.getenv('STABLECOG_API_KEY')
API_HOST = 'https://api.stablecog.com'
API_ENDPOINT = '/v1/audio/voiceover/outputs'
API_URL = f'{API_HOST}{API_ENDPOINT}'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

response = requests.get(API_URL, headers=headers)

res_json = response.json()
print(json.dumps(res_json, indent=2))
```
