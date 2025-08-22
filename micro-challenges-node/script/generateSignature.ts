import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const SECRET = process.env.SECRET || 'Waddimi';

const body = JSON.parse(fs.readFileSync('script/body.json', 'utf8'));
 const bodyString = JSON.stringify(body);

const signature = crypto.createHmac('sha256', SECRET).update(bodyString).digest('hex');

fs.writeFileSync('signature.txt', signature);
console.log('Firma generada y guardada en signature.txt:', signature);
