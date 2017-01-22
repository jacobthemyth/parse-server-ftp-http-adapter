const cp     = require('child_process');
const rimraf = require('rimraf');

const rootPath = cp.execSync('mktemp', ['-p']).toString();

module.exports = {
  start() {
    const ftpd = cp.fork(`${__dirname}/ftp-server`, [rootPath]);
    const httpd = cp.fork(`${__dirname}/http-server`, [rootPath]);

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
    rimraf(rootPath, cb);
  }
}

if (require.main === module) {
  module.exports.start(([ftp, http]) => {
    console.log(`FTP server (${ftp.pid}) listening on port ${ftp.port}`);
    console.log(`HTTP server (${http.pid}) listening on port ${http.port}`)
  });
}
