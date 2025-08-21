import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.SECRET! || 'Waddimi';

const body = { foo: 'bar' };
const bodyString = JSON.stringify(body);
const signature = crypto.createHmac('sha256', SECRET).update(bodyString).digest('hex');

axios.post('http://localhost:3000/hmac/protected', body, {
  headers: {
    'Content-Type': 'application/json',
    'x-signature': signature
  }
})
.then(res => {
  console.log('Status:', res.status);
  console.log('Response:', res.data);
})
.catch(err => {
  if (err.response) {
    console.log('Status:', err.response.status);
    console.log('Response:', err.response.data);
  } else {
    console.error(err);
  }
});