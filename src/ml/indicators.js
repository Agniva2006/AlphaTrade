export function simpleMovingAverage(values, window) {
  if (values.length < window) return [];
  const out = [];
  for (let i = 0; i <= values.length - window; i++) {
    const slice = values.slice(i, i + window);
    const avg = slice.reduce((a, b) => a + b, 0) / window;
    out.push(avg);
  }
  return out;
}

export function rsi(values, period = 14) {
  if (values.length <= period) return [];
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  const result = [];
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1) + 0) / period;
    } else {
      avgGain = (avgGain * (period - 1) + 0) / period;
      avgLoss = (avgLoss * (period - 1) + -diff) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsiVal = 100 - 100 / (1 + rs);
    result.push(rsiVal);
  }
  return result;
}

export function volatility(values, window = 10) {
  if (values.length < window) return 0;
  const slice = values.slice(-window);
  const mean = slice.reduce((a, b) => a + b, 0) / window;
  const variance =
    slice.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / window;
  return Math.sqrt(variance);
}

export function supportResistance(values, lookback = 10) {
  if (values.length < lookback) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { support: min, resistance: max };
  }
  const slice = values.slice(-lookback);
  return {
    support: Math.min(...slice),
    resistance: Math.max(...slice),
  };
}
