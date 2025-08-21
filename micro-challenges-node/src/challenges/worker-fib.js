const { parentPort, workerData } = require('worker_threads');

function fib(n) {
  if (n <= 2) return 1;
  let a = 1, b = 1;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

const result = fib(workerData.n);
parentPort.postMessage(result);