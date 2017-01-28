const cp     = require('child_process');
const path   = require('path');
const rimraf = require('rimraf');

const rootPath = cp.execSync('mktemp -d').toString().trim();

let ftpd, httpd;

module.exports = {
  start({ftpPath, httpPath}) {
    cp.execSync(`mkdir -p ${path.join(rootPath, ftpPath)}`);
    cp.execSync(`mkdir -p ${path.join(rootPath, httpPath)}`);

    ftpd = cp.fork(`${__dirname}/ftp-server`, [rootPath, ftpPath]);
    httpd = cp.fork(`${__dirname}/http-server`, [rootPath, httpPath]);

    return Promise.all([
      new Promise((resolve) => {
        ftpd.on("message", resolve);
      }),
      new Promise((resolve) => {
        httpd.on("message", resolve);
      })
    ]);
  },

  stop(cb) {
    ftpd && ftpd.kill();
    httpd && httpd.kill();
    rimraf(rootPath, cb);
  }
}

if (require.main === module) {
  module.exports.start({ftpPath: '/example.com/uploads', httpPath: '/example.com'}).then(([ftp, http]) => {
    console.log(`Server root path is ${rootPath}`);
    console.log(`FTP server (${ftp.pid}) listening on port ${ftp.port}`);
    console.log(`HTTP server (${http.pid}) listening on port ${http.port}`)
  });

  process.on('exit', function () {
    module.exports.stop();
  });
}
