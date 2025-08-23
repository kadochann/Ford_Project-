export function computeTimerColor(elapsed, optimalTime) {
  if (elapsed >= optimalTime) return 'text-red-600';
  if (elapsed >= optimalTime * 0.8) return 'text-yellow-600';
  return 'text-green-600';
}
