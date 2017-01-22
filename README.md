# parse-server-ftp-http-adapter
[![codecov.io](https://codecov.io/github/jacobthemyth/parse-server-ftp-http-adapter/coverage.svg?branch=master)](https://codecov.io/github/jacobthemyth/parse-server-ftp-http-adapter?branch=master)
[![Build Status](https://travis-ci.org/jacobthemyth/parse-server-ftp-http-adapter.svg?branch=master)](https://travis-ci.org/jacobthemyth/parse-server-ftp-http-adapter)

parse-server file adapter for FTP upload and HTTP download

# installation

`npm install --save parse-server-ftp-http-adapter`

# usage with parse-server

## environment variables
```
PARSE_FILE_FTP_HOST="example.com"
PARSE_FILE_FTP_PORT="21"
PARSE_FILE_FTP_USERNAME="user"
PARSE_FILE_FTP_PASSWORD="secret"
PARSE_FILE_FTP_UPLOAD_PATH="/site/uploads"
PARSE_FILE_HTTP_HOST="example.com"
PARSE_FILE_HTTP_PORT="80"
PARSE_FILE_HTTP_DOWNLOAD_PATH="/uploads"
```

## config object
```
{
  "appId": 'my_app_id',
  "masterKey": 'my_master_key',
  // other options
  "filesAdapter": {
    "module": "parse-server-ftp-http-adapter",
    "options": {
      "ftp": {
        "host": "example.com",
        "port": "21",
        "username": "user",
        "password": "secret",
        "uploadPath": "/site/uploads"
      },
      "http": {
        "host": "example.com",
        "port": "80",
        "downloadPath": "/uploads"
      }
    }
  }
}
```
