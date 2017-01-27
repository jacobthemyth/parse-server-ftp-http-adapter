# parse-server-ftp-http-adapter

[![codecov.io](https://codecov.io/github/jacobthemyth/parse-server-ftp-http-adapter/coverage.svg?branch=master)](https://codecov.io/github/jacobthemyth/parse-server-ftp-http-adapter?branch=master)

[![Build Status](https://travis-ci.org/jacobthemyth/parse-server-ftp-http-adapter.svg?branch=master)](https://travis-ci.org/jacobthemyth/parse-server-ftp-http-adapter)

[parse-server](https://github.com/ParsePlatform/parse-server) file adapter for FTP upload and HTTP download

# Installation

```sh
npm install --save parse-server-ftp-http-adapter
```

# Usage

```js
...
var FtpHttpAdapter = require('parse-server-ftp-http-adapter');

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  appId:       process.env.APP_ID || 'APPLICATION_ID',
  masterKey:   process.env.MASTER_KEY || 'MASTER_KEY',
  ...
  filesAdapter: new FtpHttpAdapter({
    ftp: {
      host:     "example.com",         # required
      port:     21,                    # defaults to 21
      username: "user",                # defaults to "anonymous"
      password: "secret",              # defaults to "@anonymous"
      path:     "/example.com/uploads" # defaults to "/"
      ...                              # any other options to send to node-ftp
    },
    http: {
      host: "http://example.com",      # required
      port: 80,                        # defaults to 80
      path: "/uploads"                 # defaults to "/"
    }
  }),
  ...
});
```
