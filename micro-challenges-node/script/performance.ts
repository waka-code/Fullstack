import axios from 'axios';

const testPerformance = async (endpoint: string, n: number, times: number): Promise<void> => {
  const start = performance.now();
  try {
    await Promise.all(
      Array.from({ length: times }, () => axios.get(`http://localhost:3000/performance/${endpoint}`, { params: { n } }))
    );
    const end = performance.now();
    console.log(`${endpoint}: ${times} requests with n=${n} took ${(end - start).toFixed(2)}ms`);
  } catch (error) {
    console.error(`Error testing ${endpoint}:`, error);
  }
};

const run = async (): Promise<void> => {
  await testPerformance('heavy-main', 45, 100);
  await testPerformance('heavy', 45, 100);
};

run();

