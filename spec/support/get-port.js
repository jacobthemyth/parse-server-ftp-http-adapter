const net = require('net');

module.exports = function getPort(cb) {
  const server = net.createServer();

  server.listen(0, () => {
    const port = server.address().port;
    server.once('close', () => {
      cb(port);
    });
    server.close();
  });

  server.on('error', () => {
    getPort(cb);
  });
}
