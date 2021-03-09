# moonbeam-binary

[![prebuilt](https://github.com/nuggetdigital/moonbeam-binary/workflows/prebuild&publish/badge.svg)](https://github.com/nuggetdigital/moonbeam-binary/actions/workflows/prebuild&publish.yml)

installs a prebuilt `moonbeam` binary on your os during `npm install` and returns the binary's file path when being `require`d

## usage

```js
var moonbeam = require("child_process").spawn(require("moonbeam-binary"), ["--dev"])
```

to pin a specific `moonbeam` version see the corresponding [`moonbeam-binary` tags here](https://github.com/nuggetdigital/moonbeam-binary/releases)

## license

[MIT](./LICENSE)
