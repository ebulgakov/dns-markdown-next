export default async function getPerformance(executedFunction: () => Promise<void>) {
  const start = performance.now();
  await executedFunction();
  const end = performance.now();
  console.log(`Execution time: ${(end - start).toFixed(2)} ms`);
}
