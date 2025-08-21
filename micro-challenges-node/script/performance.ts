import axios from 'axios';

async function testPerformance(n:number | undefined) {
  try {
    const res = await axios.get('http://localhost:3000/performance/heavy', {
      params: { n }
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

testPerformance(undefined);
testPerformance(10);
testPerformance(1);