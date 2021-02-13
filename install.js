var get = require('simple-get')
// var crypto = require('crypto')
var os = require('os')
var fs = require('fs')
var stream = require('stream')
var path = require('path')
var unzipper = require('unzipper')
var version = require("./package.json").version

// var darwinSha256 = ''
// var linuxSha256 = ''

var url
// var sha256
var binary = `moonbeam-v${version}-macos-11.0`

switch (os.platform()) {
//   case 'win32':
//     url = ''
//     sha256 = win32Sha256
//     break
  case 'darwin':
    url = `https://github.com/nugget-digital/moonbeam-binary/releases/download/v${version}/${binary}`
    // sha256 = darwinSha256
    break
  case 'linux':
    url = `https://github.com/nugget-digital/moonbeam-binary/releases/download/v${version}/${binary}`
    // sha256 = linuxSha256
    break
  default:
    console.error('No moonbeam binary found for:', os.platform())
    process.exit(1)
}

get(url, function (err, res) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  var tmpDir = path.resolve(__dirname, './moonbeam.tmp')
  var unzipr = unzipper.Extract({ path: tmpDir })
//   var hash = crypto.createHash('sha256')

  stream.pipeline(res, unzipr, function (err) {
    if (err) {
      console.error(`Download failed - ${err.message}`)
      process.exit(1)
    }

    if (hash.digest('hex') !== sha256) {
      console.error('SHA-256 checksum mismatch')
      process.exit(1)
    }

    fs.renameSync(path.join(tmpDir, binary), path.resolve(__dirname, binary))
    fs.chmodSync(path.resolve(__dirname, binary), 0o777)
  })

//   res.on('data', chunk => hash.update(chunk))
})