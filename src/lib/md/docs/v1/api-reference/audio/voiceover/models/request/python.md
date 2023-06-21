```python
import requests

API_HOST = 'https://api.stablecog.com'
API_ENDPOINT = '/v1/audio/voiceover/models'
API_URL = f'{API_HOST}{API_ENDPOINT}'

response = requests.get(API_URL)

res_json = response.json()
print(json.dumps(res_json, indent=2))
```
