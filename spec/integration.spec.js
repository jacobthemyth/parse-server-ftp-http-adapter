const testServers       = require('./support/test-servers');
const FtpHttpAdapter    = require('../index.js');

let ftpd, httpd;

describe("Integration suite", () => {
  beforeAll((done) => {
    testServers.start({
      ftpPath:  '/example.com/uploads',
      httpPath: '/example.com',
    }).then((servers) => {
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
          password: 'password',
          path: '/example.com/uploads'
        },
        http: {
          host: 'http://127.0.0.1',
          port: httpd.port,
          path: '/uploads'
        }
      });
    });

    it("should properly create, read, delete files", (done) => {
      const filename = 'file.txt';
      adapter.createFile(filename, "hello world", 'text/utf8').then(() => {
        return adapter.getFileData(filename);
      }, (err) => {
        console.error(err);
        fail("The adapter should create the file");
        done();
      }).then((result) => {
        expect(result instanceof Buffer).toBe(true);
        expect(result.toString('utf-8')).toEqual("hello world");
        return adapter.deleteFile(filename);
      }, (err) => {
        console.error(err);
        fail("The adapter should get the file");
        done();
      }).then(() => {

        adapter.getFileData(filename).then(() => {
          fail("the file should be deleted");
          done();
        }, () => {
          done();
        });

      }, (err) => {
        console.error(err);
        fail("The adapter should delete the file");
        done();
      });
    }, 5000);

    it('should properly get file location', () => {
      expect(adapter.getFileLocation({}, 'test.png')).toEqual(`http://127.0.0.1:${httpd.port}/uploads/test.png`);
      adapter.options.http.port = 80
      expect(adapter.getFileLocation({}, 'test.png')).toEqual(`http://127.0.0.1/uploads/test.png`);
    });
  });
});
