'use strict'

const Jimp = require('jimp')
const fs = require('fs')
const zipfian = require('..')

function generate (rng, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  } else if (options == null) {
    options = {}
  }

  const width = options.width || 256
  const height = options.height || 256
  const a = Jimp.cssColorToHex('#6e47d8')
  const b = options.mono ? a : Jimp.cssColorToHex('#d84797')

  const image = new Jimp(width, height, 0x000000FF, function (err) {
    if (err) return callback(err)

    const rng1 = rng()
    const rng2 = options.mirror ? rng() : rng1

    const skewedToMin = zipfian(0, width, options.uniform ? 0 : options.skewA || 1, rng1)
    const skewedToMax = zipfian(0, width, options.uniform ? 0 : options.skewB || -1, rng2)

    for (let y = 0; y < height; y++) {
      for (let i = 0; i < width; i++) {
        image.setPixelColor(a, skewedToMin(), y)
        image.setPixelColor(b, skewedToMax(), y)
      }

      if (!options.uniform && options.doublePass !== false) {
        for (let i = 0; i < width; i++) {
          image.setPixelColor(b, skewedToMax(), y)
          image.setPixelColor(a, skewedToMin(), y)
        }
      }
    }

    if (options.scale && options.scale !== 1) {
      image.resize(
        Math.round(width * options.scale),
        Math.round(height * options.scale),
        Jimp.RESIZE_NEAREST_NEIGHBOR
      )
    }

    image.getBuffer(options.mime || Jimp.MIME_PNG, callback)
  })
}

module.exports = generate

if (!module.parent) {
  const pmr = require('pseudo-math-random')
  const [ width, height ] = [600, 200]
  const options1 = { width, height }
  const options1b = { width, height, skewA: 2, skewB: -2, doublePass: false }
  const options2 = { width, height, mirror: true, mono: true }
  const options3 = { width, height, uniform: true, mirror: true }

  generate(() => pmr('a seed'), options1, (err, buf) => {
    if (err) throw err
    fs.writeFileSync('img/1.png', buf)
  })

  generate(() => pmr('a seed'), options1b, (err, buf) => {
    if (err) throw err
    fs.writeFileSync('img/1b.png', buf)
  })

  generate(() => pmr('a seed'), options2, (err, buf) => {
    if (err) throw err
    fs.writeFileSync('img/2.png', buf)
  })

  generate(() => pmr('a seed'), options3, (err, buf) => {
    if (err) throw err
    fs.writeFileSync('img/3.png', buf)
  })
}
