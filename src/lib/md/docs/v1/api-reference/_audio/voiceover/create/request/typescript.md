```typescript
const API_KEY = process.env.STABLECOG_API_KEY;
const API_HOST = 'https://api.stablecog.com';
const API_ENDPOINT = '/v1/audio/voiceover/create';
const API_URL = `${API_HOST}${ENDPOINT}`;

const req = {
	prompt: 'Technology is a bridge between imagination and reality.'
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
