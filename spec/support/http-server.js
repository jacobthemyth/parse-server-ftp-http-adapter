const st      = require('st');
const http    = require('http');
const path    = require('path');
const getPort = require('./get-port');

const rootPath  = process.argv[2];
const mountPath = process.argv[3];

getPort((port) => {
  http.createServer(
    st(path.join(rootPath, mountPath))
  ).listen(port)

  process.send({
    pid: process.pid,
    port: port
  });
});
