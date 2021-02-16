const get = require('simple-get')
const os = require('os')
const fs = require('fs')
const stream = require('stream')
const path = require('path')
const gunzip = require('gunzip-maybe')
const version = `v${process.env.MOONBEAM_TAG || require('./package.json').version}`

function panic (msg) {
  console.error(msg)
  process.exit(1)
}

let url

switch (os.platform()) {
  case 'linux':
    url = `https://github.com/nugget-digital/moonbeam-binary/releases/download/${version}/moonbeam-${version}-ubuntu-20.04.gz`
    break
  default:
    panic('no moonbeam binary found for ' + os.platform())
}

console.debug('url', url)

get(url, function (err, res) {
  if (err) panic(err.message)

  const moonbeam = path.resolve(__dirname, 'moonbeam')

  stream.pipeline(res, gunzip(), fs.createWriteStream(moonbeam), function (err) {
    if (err) panic(err.message)

    fs.chmodSync(moonbeam, 0o777)
  })
})
