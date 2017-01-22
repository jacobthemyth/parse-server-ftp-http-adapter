const testServers       = require('./support/test-servers');
const FtpHttpAdapter    = require('../index.js');

let ftpd, httpd;

describe("Integration suite", () => {
  beforeAll((done) => {
    testServers.start().then((servers) => {
      [ftpd, httpd] = servers;
    }).then(done);
  });
  afterAll(testServers.stop);

  describe("Parse Server conformance tests", () => {
    let adapter;

    beforeAll(() => {
      adapter = new FtpHttpAdapter({
        ftp: {
          host: '127.0.0.1',
          port: ftpd.port,
          user: 'user',
          password: 'password'
        },
        http: {
          host: '127.0.0.1',
          port: httpd.port
        }
      });
    });

    it("should properly create, read, delete files", (done) => {
      const filename = 'file.txt';
      adapter.createFile(filename, "hello world", 'text/utf8').then(() => {
        return adapter.getFileData(filename);
      }, () => {
        fail("The adapter should create the file");
        done();
      }).then((result) => {
        expect(result instanceof Buffer).toBe(true);
        expect(result.toString('utf-8')).toEqual("hello world");
        return adapter.deleteFile(filename);
      }, () => {
        fail("The adapter should get the file");
        done();
      }).then(() => {

        adapter.getFileData(filename).then(() => {
          fail("the file should be deleted");
          done();
        }, () => {
          done();
        });

      }, () => {
        fail("The adapter should delete the file");
        done();
      });
    }, 5000);
  });
});
