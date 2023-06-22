```typescript
const API_HOST = 'https://api.stablecog.com';
const API_ENDPOINT = '/v1/image/upscale/defaults';
const API_URL = `${API_HOST}${ENDPOINT}`;

const res = await fetch(API_URL);

const resJSON = await res.json();
console.log(resJSON);
```
