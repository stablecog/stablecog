```typescript
const API_KEY = process.env.STABLECOG_API_KEY;
const API_HOST = 'https://api.stablecog.com';
const API_ENDPOINT = '/v1/image/upscale/create';
const API_URL = `${API_HOST}${ENDPOINT}`;

const req = {
	input: 'daa383dc-42f7-4137-92b6-4087af7b4aab'
};

const res = await fetch(API_URL, {
	method: 'POST',
	body: JSON.stringify(req),
	headers: {
		Authorization: `Bearer ${API_KEY}`,
		'Content-Type': 'application/json'
	}
});

const resJSON = await res.json();
console.log(resJSON);
```
