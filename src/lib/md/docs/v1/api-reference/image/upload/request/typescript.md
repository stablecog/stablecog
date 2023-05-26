```typescript
const API_KEY = process.env.STABLECOG_API_KEY;
const API_HOST = 'https://api.stablecog.com';
const API_ENDPOINT = '/v1/image/upload';
const API_URL = `${API_HOST}${ENDPOINT}`;

const file = readFileSync('./my_init_image.jpeg');
const formData = new FormData()
formData.append('file', file)

const res = await fetch(API_URL, {
	method: 'POST',
	body: formData,
	headers: {
		Authorization: `Bearer ${API_KEY}`,
		'Content-Type': 'application/json'
	}
});

const resJSON = await res.json();
console.log(resJSON);
```
