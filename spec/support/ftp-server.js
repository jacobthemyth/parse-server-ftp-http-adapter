const ftpd     = require('ftpd');
const getPort  = require('./get-port');
const rootPath = process.argv[2];

getPort((port) => {
  let server;
  const options = {
    host: '127.0.0.1',
    port: port
  };

  server = new ftpd.FtpServer(options.host, {
    getInitialCwd() {
      return '/';
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

  server.debugging = 4;
  server.listen(options.port);
  process.send({
    pid: process.pid,
    port: options.port
  });
});
