const Ftp        = require('ftp');
const _          = require('lodash/fp');
const path       = require('path');
const url        = require('url');

class FtpHttpAdapter {
  constructor(options) {
    this.options = processOptions(options);
    this._debug = this.options.debug && console.log; // eslint-disable-line no-console
  }

  _connect() {
    if(this._connected) return this._connected;

    this._ftpClient = new Ftp();

    this._debug && this._ftpClient.on('greeting', this._debug);
    this._debug && this._ftpClient.on('close', this._debug);
    this._debug && this._ftpClient.on('end', this._debug);
    this._debug && this._ftpClient.on('error', this._debug);

    this._connected = new Promise((resolve) => {
      this._ftpClient.on('ready', () => {
        resolve(this._ftpClient);
      });
      this._ftpClient.on('error', (err) => {
        this._disconnect();
        this._debug && this._debug(err.stack);
        setTimeout(this._connect.bind(this), 30000);
      });
    });

    this._ftpClient.connect(this.options.ftp);

    return this._connected;
  }

  _disconnect() {
    this._ftpClient.end();
    delete this._ftpClient;
    delete this._connected;
  }

  createFile(filename, data) {
    const buffer = Buffer.from(data);
    const filePath = path.join(this.options.ftp.path, filename);

    this._debug && this._debug(`createFile: called with ${filename}`);

    return this._connect().then((client) => {
      this._debug && this._debug(`createFile: connected with ${filename}`);
      return new Promise((resolve, reject) => {
        client.put(buffer, filePath, (err) => {
          if(err) return reject(err);
          this._debug && this._debug(`createFile: PUT successful with ${filename}`);
          resolve();
        });
      });
    }, this._handleError.bind(this));
  }

  getFileData(filename) {
    const filePath = path.join(this.options.ftp.path, filename);

    this._debug && this._debug(`getFileData: called with ${filename}`);

    return this._connect().then((client) => {
      this._debug && this._debug(`getFileData: connected with ${filename}`);
      return new Promise((resolve, reject) => {
        client.get(filePath, (err, stream) => {
          if(err) return reject(err);
          this._debug && this._debug(`getFileData: GET successful with ${filename}`);
          streamToBuffer(stream).then(resolve, reject);
        });
      });
    }, this._handleError.bind(this));
  }

  deleteFile(filename) {
    this._debug && this._debug(`deleteFile: called with ${filename}`);
    return this._connect().then((client) => {
      this._debug && this._debug(`deleteFile: connected with ${filename}`);
      return new Promise((resolve, reject) => {
        client.delete(path.join(this.options.ftp.path, filename), (err) => {
          if(err) return reject(err);
          this._debug && this._debug(`deleteFile: DEL successful with ${filename}`);
          return resolve();
        });
      });
    }, this._handleError.bind(this));
  }


  getFileLocation(config, filename) {
    filename = encodeURIComponent(filename);
    const {host, path, port} = this.options.http
    const baseUrl = url.resolve((port == 80 ? host : `${host}:${port}`), path);
    this._debug && this._debug(`getFileLocation: called with ${filename}`);
    this._debug && this._debug(`getFileLocation: returning ${baseUrl}/${filename}`);
    return `${baseUrl}/${filename}`;
  }

  _handleError(err) {
    this._debug && this._debug(err);
    return err;
  }
}

module.exports = FtpHttpAdapter;
module.exports.default = FtpHttpAdapter;

function processOptions(options) {
  return _.flow(
    _.map((def) => {
      let option = process.env[def.env] || deepFetch(def.path, options) || def.default;
      if(def.required && !option) throw `FtpHttpAdapter requires option '${def.path}'`;
      return [def.path, option];
    }),
    _.zipAll,
    _.spread(_.zipObjectDeep),
    _.merge(options)
  )([
    {
      path: 'debug',
      env: 'PARSE_SERVER_FILES_DEBUG',
      default: false
    },
    {
      path: 'ftp.host',
      env: 'PARSE_SERVER_FILES_FTP_HOST',
      required: true
    },
    {
      path: 'ftp.path',
      env: 'PARSE_SERVER_FILES_FTP_PATH',
      default: '/'
    },
    {
      path: 'ftp.port',
      env: 'PARSE_SERVER_FILES_FTP_PORT',
      default: 21
    },
    {
      path: 'ftp.user',
      env: 'PARSE_SERVER_FILES_FTP_USER',
      default: 'anonymous'
    },
    {
      path: 'ftp.password',
      env: 'PARSE_SERVER_FILES_FTP_PASSWORD',
      default: 'anonymous@'
    },
    {
      path: 'http.port',
      env: 'PARSE_SERVER_FILES_HTTP_PORT',
      default: 80
    },
    {
      path: 'http.host',
      env: 'PARSE_SERVER_FILES_HTTP_HOST',
      required: true
    },
    {
      path: 'http.path',
      env: 'PARSE_SERVER_FILES_HTTP_PATH',
      default: '/'
    }
  ])
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffer = new Buffer("");
    stream.on('data', function(data) {
      buffer = Buffer.concat([buffer, data]);
    });
    stream.on('end', function() {
      resolve(buffer);
    });
    stream.on('error', reject);
  });
}

function deepFetch(key, obj) {
  return key.split('.').reduce((o, k) => o && o[k], obj);
}
