```typescript
// Node.js requires formdata-node package
import { fileFromPath } from 'formdata-node/file-from-path';
import { FormData } from 'formdata-node';

const API_KEY = process.env.STABLECOG_API_KEY;
const API_HOST = 'https://api.stablecog.com';
const API_ENDPOINT = '/v1/image/upload';
const API_URL = `${API_HOST}${ENDPOINT}`;

const uploadFile = async () => {
  const filePath = `./emotions.jpg`;
  const formData = new FormData();
  formData.set('file', await fileFromPath(filePath));

  const resultOfUpload = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: formData,
  });
  console.log(await resultOfUpload.json());
};

uploadFile();
```
