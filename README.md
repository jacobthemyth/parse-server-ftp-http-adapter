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
      host:     process.env.FTP_HOST || "example.com",
      port:     process.env.FTP_PORT || "21",
      username: process.env.FTP_USER || "user",
      password: process.env.FTP_PASS || "secret",
      path:     process.env.FTP_PATH || "/site/uploads"
    },
    http: {
      host: process.env.HTTP_HOST || "example.com",
      port: process.env.HTTP_PORT || "80",
      path: process.env.HTTP_PATH || "/uploads"
    }
  }),
  ...
});
```
