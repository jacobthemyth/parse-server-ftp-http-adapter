const st       = require('st')
const http     = require('http')
const getPort  = require('./get-port');
const rootPath = process.argv[2];

getPort((port) => {
  http.createServer(
    st(rootPath)
  ).listen(port)

  process.send({
    pid: process.pid,
    port: port
  });
});
