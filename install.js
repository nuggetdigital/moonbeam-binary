var crypto = require("crypto")
var fs = require("fs")
var os = require("os")
var path = require("path")
var stream = require("stream")

var get = require("simple-get")
var gunzip = require("gunzip-maybe")

var pkg = require("./package.json")

var version = process.env.MOONBEAM_BINARY_TAG
  ? process.env.MOONBEAM_BINARY_TAG
  : `v${pkg.version}`

function panic(err) {
  err && console.error(err.message || err)
  process.exit(1)
}

var url
var sha

switch (os.platform()) {
  case "linux":
    url = `https://github.com/nugget-digital/moonbeam-binary/releases/download/${version}/moonbeam-${version}-ubuntu-20.04.gz`
    sha = `https://github.com/nugget-digital/moonbeam-binary/releases/download/${version}/moonbeam-${version}-ubuntu-20.04.gz.sha256sum`
    break
  default:
    panic(`no moonbeam binary found for ${os.platform()}`)
}

get.concat(sha, function (err, r, buf) {
  if (err) panic(err)
  if (r.statusCode !== 200)
    panic(`unexpected status code ${r.statusCode} getting ${sha}`)
  var expected = buf.toString("utf8").trim()
  get(url, function (err, res) {
    if (err) panic(err)
    var hash = crypto.createHash("sha256")
    var moonbeam = path.resolve(__dirname, "moonbeam")
    res.on("data", function (chunk) {
      hash.update(chunk)
    })
    stream.pipeline(
      res,
      gunzip(),
      fs.createWriteStream(moonbeam),
      function (err) {
        if (err) panic(err)
        if (hash.digest("hex") !== expected) panic("sha256sum mismatch")
        fs.chmodSync(moonbeam, 0o777)
      }
    )
  })
})
