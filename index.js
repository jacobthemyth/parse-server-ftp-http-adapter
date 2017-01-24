const Ftp  = require('ftp');
const path = require('path');
const url  = require('url');

class FtpHttpAdapter {
  constructor(options) {
    this.options = processOptions(options);
    this.ftpClient = new Ftp();

    this.ftpConnect = new Promise((resolve) => {
      this.ftpClient.on('ready', resolve);
    });

    this.ftpClient.connect({
      host: this.options.ftp.host,
      port: this.options.ftp.port,
      user: this.options.ftp.user,
      password: this.options.ftp.pass,
    });
  }

  createFile(filename, data) {
    const buffer = Buffer.from(data);
    const filePath = path.join(this.options.ftp.path, filename);

    return this.ftpConnect.then(() => {
      return new Promise((resolve, reject) => {
        this.ftpClient.put(buffer, filePath, function(err) {
          if(err) return reject(err);
          resolve();
        });
      });
    });
  }

  getFileData(filename) {
    const filePath = path.join(this.options.ftp.path, filename);

    return this.ftpConnect.then(() => {
      return new Promise((resolve, reject) => {
        this.ftpClient.get(filePath, function(err, stream) {
          if(err) return reject(err);
          resolve(streamToBuffer(stream));
        });
      });
    });
  }

  deleteFile(filename) {
    return this.ftpConnect.then(() => {
      return new Promise((resolve, reject) => {
        this.ftpClient.delete(path.join(this.options.ftp.path, filename), function(err) {
          if(err) return reject(err);
          resolve();
        });
      });
    });
  }


  getFileLocation(config, filename) {
    filename = encodeURIComponent(filename);
    let {host, path} = this.options.http
    return `${url.resolve(host, path)}/${filename}`;
  }
}

module.exports = FtpHttpAdapter;
module.exports.default = FtpHttpAdapter;

function processOptions(options) {
  const defaults = {
    ftp: {
      port: 21,
      user: "anonymous",
      pass: "@anonymous",
      path: '/'
    },

    http: {
      path: '/'
    }
  };

  [
    'ftp.host',
    'http.host',
  ].forEach(function(key) {
    if (!key.split('.').reduce((o, k) => o[k], options)) {
      throw `FtpHttpAdapter requires option '${key}'`;
    }
  });

  return Object.assign({}, defaults, options);
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
