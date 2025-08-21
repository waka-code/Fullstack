import axios from 'axios';

async function testPagination(page:number | undefined, limit:number | undefined) {
  try {
    const res = await axios.get('http://localhost:3000/pagination/items', {
      params: { page, limit }
    });
    console.log(`Status: ${res.status}`);
    console.log('Response:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log('Response:', err.response.data);
    } else {
      console.error(err);
    }
  }
}


testPagination(undefined, undefined);
testPagination(2, 5);
testPagination(999, 10);