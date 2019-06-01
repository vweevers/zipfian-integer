# zipfian-integer

> **Get an integer between a min and max with skew towards either.**  
> A JS port of [Apache Commons Math](http://commons.apache.org/math/)'s `ZipfRejectionInversionSampler`.

[![npm status](http://img.shields.io/npm/v/zipfian-integer.svg)](https://www.npmjs.org/package/zipfian-integer)
[![node](https://img.shields.io/node/v/zipfian-integer.svg)](https://www.npmjs.org/package/zipfian-integer)
[![Travis build status](https://img.shields.io/travis/vweevers/zipfian-integer.svg?label=travis)](http://travis-ci.org/vweevers/zipfian-integer)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Table of Contents

<details><summary>Click to expand</summary>

- [Usage](#usage)
- [Visual Example](#visual-example)
- [About](#about)
- [API](#api)
- [Install](#install)
- [Development](#development)
- [License](#license)

</details>

## Usage

```js
const zipfian = require('zipfian-integer')
const sample = zipfian(1, 100, 0.2)

console.log(sample())
console.log(sample())
```

This logs two random integers between 1 and 100, skewed 20% towards the minimum, thus more frequently returning integers &lt; 50. You can optionally inject a (seeded) random number generator. The following example always returns the same integers in sequence unless you change the seed:

```js
const random = require('pseudo-math-random')('a seed')
const sample = zipfian(1, 100, 0.2, random)
```

## Visual Example

<table>
<tr>
  <td><img src="https://raw.githubusercontent.com/vweevers/zipfian-integer/7f2a2b874e3bc068b48952c4e698ad3d9463e8c7/img/1.png" /></td>
  <td><sub><code>skew=1</code> vs <code>skew=-1</code></sub></td>
</tr>
<tr>
  <td><img src="https://raw.githubusercontent.com/vweevers/zipfian-integer/7f2a2b874e3bc068b48952c4e698ad3d9463e8c7/img/2.png" /></td>
  <td><sub><code>skew=1</code> vs <code>skew=-1</code>, same seed</sub></td>
</tr>
<tr>
  <td><img src="https://raw.githubusercontent.com/vweevers/zipfian-integer/7f2a2b874e3bc068b48952c4e698ad3d9463e8c7/img/3.png" /></td>
  <td><sub><code>skew=0</code></sub></td>
</tr>
</table>

## About

This module is useful as a (optionally deterministic) number generator in tests and benchmarks. With a `skew` parameter of 0 it produces integers with a uniform distribution over the range `min` to `max`. With a positive `skew` it more frequently returns integers leaning towards the `min`. With a negative `skew` it returns more integers leaning towards the `max`.

To explain it in another way, let's say the integers represent the keyspace of a key-value store with numeric keys in insertion order, then a positive `skew` favors the oldest keys while a negative `skew` favors the latest keys.

The algorithm is fast, accurate and has a constant memory footprint. Other solutions like [`prob.js`](https://github.com/bramp/prob.js) build a lookup table which costs time and memory. Performance of `zipfian-integer` depends mostly on `skew` and your choice of random number generator (see benchmarks below).

## API

### `sample = zipfian(min, max, skew[, rng])`

Create a new random number generator with a zipfian distribution. The `skew` must be a floating-point number >= -1 &lt;= 1. The `rng` if provided must be a function that returns a random floating-point number between 0 (inclusive) and 1 (exclusive). It defaults to [`Math.random`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random).

### `num = sample()`

Get a random integer between min (inclusive) and max (inclusive).

## Install

With [npm](https://npmjs.org) do:

```
npm install zipfian-integer
```

## Development

### Verify

A small test is included to verify `zipfian-integer` results against results of the Apache Commons Math original. First generate test data (a few million combinations of parameters):

- Install JDK and [Maven](https://maven.apache.org/)
- `cd test/java`
- `mvn compile`
- `mvn -q exec:java > ../../data.ndjson`

Then verify it:

- `cd ../..`
- `npm i`
- `node test/verify.js test/data.ndjson`

### Benchmark

```
$ node benchmark.js
node v10.14.1

n=1e2  skew=+0.0 pseudo-math-random x 8,446,287 ops/sec ±0.67%
n=1e2  skew=+0.0 Math.random x 9,556,211 ops/sec ±0.34%
n=1e6  skew=+0.0 pseudo-math-random x 8,141,930 ops/sec ±0.43%
n=1e6  skew=+0.0 Math.random x 9,509,349 ops/sec ±0.42%
n=1e12 skew=+0.0 pseudo-math-random x 7,418,569 ops/sec ±0.44%
n=1e12 skew=+0.0 Math.random x 8,905,792 ops/sec ±0.28%
n=1e2  skew=+1.0 pseudo-math-random x 12,010,890 ops/sec ±0.41%
n=1e2  skew=+1.0 Math.random x 19,650,279 ops/sec ±0.55%
n=1e6  skew=+1.0 pseudo-math-random x 11,954,408 ops/sec ±0.53%
n=1e6  skew=+1.0 Math.random x 19,752,283 ops/sec ±0.64%
n=1e12 skew=+1.0 pseudo-math-random x 11,579,715 ops/sec ±0.51%
n=1e12 skew=+1.0 Math.random x 17,908,808 ops/sec ±0.51%
n=1e2  skew=-0.5 pseudo-math-random x 7,907,162 ops/sec ±0.40%
n=1e2  skew=-0.5 Math.random x 9,388,148 ops/sec ±0.52%
n=1e6  skew=-0.5 pseudo-math-random x 7,879,909 ops/sec ±0.35%
n=1e6  skew=-0.5 Math.random x 9,196,799 ops/sec ±0.36%
n=1e12 skew=-0.5 pseudo-math-random x 7,250,634 ops/sec ±0.30%
n=1e12 skew=-0.5 Math.random x 8,636,395 ops/sec ±0.46%

Fastest is:
n=1e6  skew=+1.0 Math.random
```

## License

The code of this port is licensed MIT © 2019-present Vincent Weevers. The original code (Apache Commons Math v3.6.1) is licensed under the Apache License 2.0. For details please see the full [LICENSE](LICENSE). The `NOTICE` of Apache Commons Math follows:

```
Apache Commons Math
Copyright 2001-2016 The Apache Software Foundation

This product includes software developed at
The Apache Software Foundation (http://www.apache.org/).

This product includes software developed for Orekit by
CS Systèmes d'Information (http://www.c-s.fr/)
Copyright 2010-2012 CS Systèmes d'Information
```
