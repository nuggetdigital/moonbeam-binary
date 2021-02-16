const get = require('simple-get')
// var crypto = require('crypto')
const os = require('os')
const fs = require('fs')
const stream = require('stream')
const path = require('path')
const gunzip = require('gunzip-maybe')
const version = `v${process.env.MOONBEAM_TAG || require('./package.json').version}`

// var darwinSha256 = ''
// var linuxSha256 = ''

let url
// var sha256
let binary = `moonbeam-${version}-`

switch (os.platform()) {
//   case 'win32':
//     url = ''
//     sha256 = win32Sha256
//     break
  case 'darwin':
    binary += 'macos-11.0'
    url = `https://github.com/nugget-digital/moonbeam-binary/releases/download/${version}/${binary}.gz`
    // sha256 = darwinSha256
    break
  case 'linux':
    binary += 'ubuntu-20.04'
    url = `https://github.com/nugget-digital/moonbeam-binary/releases/download/${version}/${binary}.gz`
    // sha256 = linuxSha256
    break
  default:
    console.error('No moonbeam binary found for:', os.platform())
    process.exit(1)
}

console.log('[DEBUG] url', url)

get(url, function (err, res) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const moonbeam = path.resolve(__dirname, 'moonbeam')

  stream.pipeline(res, gunzip(), fs.createWriteStream(moonbeam), function (err) {
    if (err) {
      console.error(`Download failed - ${err.message}`)
      process.exit(1)
    }

    fs.chmodSync(moonbeam, 0o777)
  })
})
