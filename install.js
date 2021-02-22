const get = require('simple-get')
const crypto = require('crypto')
const os = require('os')
const fs = require('fs')
const stream = require('stream')
const path = require('path')
const gunzip = require('gunzip-maybe')
const version = `v${process.env.MOONBEAM_TAG || require('./package.json').version}`

function panic (err) {
  err && console.error(err.message || err)
  process.exit(1)
}

let url
let sha

switch (os.platform()) {
  case 'linux':
    url = `https://github.com/nugget-digital/moonbeam-binary/releases/download/${version}/moonbeam-${version}-ubuntu-20.04.gz`
    sha = `https://github.com/nugget-digital/moonbeam-binary/releases/download/${version}/moonbeam-${version}-ubuntu-20.04.gz.sha256sum`
    break
  default:
    panic('no moonbeam binary found for ' + os.platform())
}

get(sha, function (err, r) {
  if (err) panic(err)

  const chunks = []

  r.on('error', panic)

  r.on('data', function (chunk) {
    chunks.push(chunk)
  })

  r.on('end', function () {
    const expected = Buffer.concat(chunks).toString('hex')

    get(url, function (err, res) {
      if (err) panic(err)

      const hash = crypto.createHash('sha256')
      const moonbeam = path.resolve(__dirname, 'moonbeam')

      res.on('data', function (chunk) {
        hash.update(chunk)
      })

      stream.pipeline(res, gunzip(), fs.createWriteStream(moonbeam), function (err) {
        if (err) panic(err)

        if (hash.digest('hex') !== expected) panic('SHA-256 checksum mismatch')

        fs.chmodSync(moonbeam, 0o777)
      })
    })
  })
})
