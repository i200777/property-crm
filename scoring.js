export function calculateScore(budget) {
  if (budget > 20000000) return 'High';
  if (budget >= 10000000) return 'Medium';
  return 'Low';
}