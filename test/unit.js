'use strict'

const test = require('tape')
const random = () => require('pseudo-math-random')('a seed')
const zipfian = require('..')

test('skew=1 vs skew=-1 is exact opposite', function (t) {
  const oldest = zipfian(0, 999, 1, random())
  const latest = zipfian(0, 999, -1, random())

  t.is(oldest(), 84) // = 999 - 915
  t.is(oldest(), 14) // = 999 - 985

  t.is(latest(), 915)
  t.is(latest(), 985)

  t.end()
})

test('min equal to max', function (t) {
  t.is(zipfian(1, 1, 0)(), 1)
  t.end()
})

test('negative min', function (t) {
  t.ok(zipfian(-10, -5, 0)() <= -5)
  t.end()
})

// TODO: verify this in the java test
test('skew > 1', function (t) {
  t.is(zipfian(0, 9, 2, random())(), 1, '2')
  t.is(zipfian(0, 9, 3, random())(), 0, '3')
  t.is(zipfian(0, 9999999, 2, random())(), 1, '2')
  t.is(zipfian(0, 9999999, 3, random())(), 0, '3')

  t.is(zipfian(0, 9, -2, random())(), 8, '-2')
  t.is(zipfian(0, 9, -3, random())(), 9, '-3')
  t.is(zipfian(0, 9999999, -2, random())(), 9999998, '-2')
  t.is(zipfian(0, 9999999, -3, random())(), 9999999, '-3')

  t.end()
})
