const ftpd    = require('ftpd');
const getPort = require('./get-port');

const rootPath  = process.argv[2];
const mountPath = process.argv[3];

getPort((port) => {
  let server;

  server = new ftpd.FtpServer('127.0.0.1', {
    getInitialCwd() {
      return mountPath;
    },
    getRoot() {
      return rootPath;
    }
  });

  server.on('client:connected', (connection) => {
    let username;
    connection.on('command:user', (user, success, failure) => {
      if (user) {
        username = user;
        success();
      } else {
        failure();
      }
    });

    connection.on('command:pass', (pass, success, failure) => {
      if (pass) {
        success(username);
      } else {
        failure();
      }
    });
  });

  server.listen(port);
  process.send({
    pid: process.pid,
    port: port
  });
});
