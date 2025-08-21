import axios from 'axios';

async function testPerformance(n:number | undefined) {
  try {
    const res = await axios.get('http://localhost:3000/performance/heavy', {
      params: { n }
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

testPerformance(undefined);
testPerformance(10);
testPerformance(1);