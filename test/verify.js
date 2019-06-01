'use strict'

const { pipeline, Writable } = require('readable-stream')
const split2 = require('split2')
const fs = require('fs')
const zipfian = require('..')

let tests = 0

pipeline(
  fs.createReadStream(process.argv[2]),
  split2(JSON.parse),
  new Writable({
    objectMode: true,
    write (test, enc, next) {
      const { n, s, p, k } = test

      if (tests % 1e5 === 0) {
        console.error('Progress: %d tests, current N: %d', tests, n)
      }

      const sample = zipfian(1, n, s, function rng () {
        if (!p.length) throw new Error('Too many random numbers requested')
        return p.shift()
      })

      const actual = sample()

      if (actual !== k) {
        console.error({ n, s, p, k, actual })
        throw new Error('Bad result')
      }

      tests++
      next()
    }
  }),
  (err) => {
    if (err) throw err
    console.log('OK')
  }
)
