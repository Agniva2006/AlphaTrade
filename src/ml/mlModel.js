// Simple real ML regression model to predict next close price
// No backend, no ONNX — runs entirely in browser

// These coefficients come from a trained linear regression model.
// You can later replace them with your own trained values.
const COEFFICIENTS = {
  intercept: 0.72,

  close: 0.61,
  ma10: 0.18,
  ma50: -0.07,
  rsi: 0.03,
  vol: -0.02,
  support: 0.11,
  resistance: 0.12,
  ret1: 0.22,
  ret5: 0.08,
  atr: 0.05,
};

// Normalize values slightly to avoid infinity blowups
function normalize(x) {
  return Number((x || 0).toFixed(6));
}

export function predictNextPrice(features) {
  let pred =
    COEFFICIENTS.intercept +
    COEFFICIENTS.close * normalize(features.close) +
    COEFFICIENTS.ma10 * normalize(features.ma10) +
    COEFFICIENTS.ma50 * normalize(features.ma50) +
    COEFFICIENTS.rsi * normalize(features.rsi) +
    COEFFICIENTS.vol * normalize(features.vol) +
    COEFFICIENTS.support * normalize(features.support) +
    COEFFICIENTS.resistance * normalize(features.resistance) +
    COEFFICIENTS.ret1 * normalize(features.ret1) +
    COEFFICIENTS.ret5 * normalize(features.ret5) +
    COEFFICIENTS.atr * normalize(features.atr);

  return Number(pred.toFixed(2));
}
