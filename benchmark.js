'use strict'

const Benchmark = require('benchmark')
const random = require('pseudo-math-random')('a seed')
const zipfian = require('.')
const suite = new Benchmark.Suite()

console.log('node %s\n', process.version)

suite
  .add('n=1e2  skew=+0.0 pseudo-math-random', zipfian(1, 1e2, 0, random))
  .add('n=1e2  skew=+0.0 Math.random', zipfian(1, 1e2, 0))
  .add('n=1e6  skew=+0.0 pseudo-math-random', zipfian(1, 1e6, 0, random))
  .add('n=1e6  skew=+0.0 Math.random', zipfian(1, 1e6, 0))
  .add('n=1e12 skew=+0.0 pseudo-math-random', zipfian(1, 1e12, 0, random))
  .add('n=1e12 skew=+0.0 Math.random', zipfian(1, 1e12, 0))

  .add('n=1e2  skew=+1.0 pseudo-math-random', zipfian(1, 1e2, 1, random))
  .add('n=1e2  skew=+1.0 Math.random', zipfian(1, 1e2, 1))
  .add('n=1e6  skew=+1.0 pseudo-math-random', zipfian(1, 1e6, 1, random))
  .add('n=1e6  skew=+1.0 Math.random', zipfian(1, 1e6, 1))
  .add('n=1e12 skew=+1.0 pseudo-math-random', zipfian(1, 1e12, 1, random))
  .add('n=1e12 skew=+1.0 Math.random', zipfian(1, 1e12, 1))

  .add('n=1e2  skew=-0.5 pseudo-math-random', zipfian(1, 1e2, -0.5, random))
  .add('n=1e2  skew=-0.5 Math.random', zipfian(1, 1e2, -0.5))
  .add('n=1e6  skew=-0.5 pseudo-math-random', zipfian(1, 1e6, -0.5, random))
  .add('n=1e6  skew=-0.5 Math.random', zipfian(1, 1e6, -0.5))
  .add('n=1e12 skew=-0.5 pseudo-math-random', zipfian(1, 1e12, -0.5, random))
  .add('n=1e12 skew=-0.5 Math.random', zipfian(1, 1e12, -0.5))

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('\nFastest is:\n' + this.filter('fastest').map('name').join('\n'))
  })
  .run({ async: true })
