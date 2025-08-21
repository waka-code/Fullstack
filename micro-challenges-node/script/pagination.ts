import axios from 'axios';

async function testPagination(page:number | undefined, limit:number | undefined) {
  try {
    const res = await axios.get('http://localhost:3000/pagination/items', {
      params: { page, limit }
    });
    console.log(`Status: ${res.status}`);
    console.log('Response:', res.data);
} catch (err) {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = err.response;
    console.log('Status:', response);
    console.log('Response:', response);
  } else {
    console.error(err);
  }
}
}


testPagination(undefined, undefined);
testPagination(2, 5);
testPagination(999, 10);