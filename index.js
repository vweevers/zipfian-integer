'use strict'

module.exports = function zipfian (min, max, skew, rng) {
  // Type checking is important here to prevent infinite loops in the algorithm.
  if (!Number.isInteger(min)) {
    throw new TypeError('The first argument "min" must be an integer')
  } else if (!Number.isInteger(max)) {
    throw new TypeError('The second argument "max" must be an integer')
  } else if (max < min) {
    throw new RangeError('The second argument "max" must be >= the "min" argument')
  } else if (!Number.isFinite(skew)) {
    throw new TypeError('The third argument "skew" must be a number')
  }

  const n = max - min + 1
  const flip = skew < 0
  const sampler = new ZipfRejectionInversionSampler(n, Math.abs(skew))

  rng = rng || Math.random

  return function sample () {
    const k = sampler.sample(rng) - 1
    return flip ? max - k : min + k
  }
}

// A port of Apache Commons Math's ZipfRejectionInversionSampler.
// See Apache Commons Math v3.6.1 for the (annotated) source of this.
class ZipfRejectionInversionSampler {
  constructor (numberOfElements, exponent) {
    this.numberOfElements = numberOfElements
    this.exponent = exponent
    this.hIntegralX1 = this._hIntegral(1.5) - 1
    this.hIntegralNumberOfElements = this._hIntegral(numberOfElements + 0.5)
    this.s = 2 - this._hIntegralInverse(this._hIntegral(2.5) - this._h(2))
  }

  // Returns an integer in the range [1,N]
  sample (rng) {
    while (true) {
      const u = this.hIntegralNumberOfElements + rng() * (this.hIntegralX1 - this.hIntegralNumberOfElements)
      const x = this._hIntegralInverse(u)

      let k = (x + 0.5) | 0

      if (k < 1) {
        k = 1
      } else if (k > this.numberOfElements) {
        k = this.numberOfElements
      }

      if ((k - x <= this.s) || (u >= this._hIntegral(k + 0.5) - this._h(k))) {
        return k
      }
    }
  }

  _hIntegral (x) {
    const logX = Math.log(x)
    return helper2((1 - this.exponent) * logX) * logX
  }

  _h (x) {
    return Math.exp(-this.exponent * Math.log(x))
  }

  _hIntegralInverse (x) {
    let t = x * (1 - this.exponent)
    if (t < -1) t = -1
    return Math.exp(helper1(t) * x)
  }
}

function helper1 (x) {
  // TODO (perf): avoid Math.abs()
  if (Math.abs(x) > 1e-8) {
    return Math.log1p(x) / x
  } else {
    return 1 - x * ((1 / 2) - x * ((1 / 3) - x * (1 / 4)))
  }
}

function helper2 (x) {
  // TODO (perf): avoid Math.abs()
  if (Math.abs(x) > 1e-8) {
    return Math.expm1(x) / x
  } else {
    return 1 + x * (1 / 2) * (1 + x * (1 / 3) * (1 + x * (1 / 4)))
  }
}
