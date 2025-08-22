import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const SECRET = process.env.SECRET || 'Waddimi';

const body = JSON.parse(fs.readFileSync('script/body.json', 'utf8'));
const bodyString = JSON.stringify(body);
const signature = crypto.createHmac('sha256', SECRET).update(bodyString).digest('hex');


// Para probar el caso incorrecto: genera la firma con un body diferente al que envías
// const wrongBodyString = JSON.stringify({ foo: 'Incorrecto' });
// const wrongSignature = crypto.createHmac('sha256', SECRET).update(wrongBodyString).digest('hex');

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