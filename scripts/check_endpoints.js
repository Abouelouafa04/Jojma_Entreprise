import http from 'http';

const urls = ['/api/conversion/jobs', '/api/ar/stats', '/api/ar/library'];

function check(path) {
  return new Promise((resolve) => {
    const options = { hostname: 'localhost', port: 5000, path, method: 'GET', headers: {} };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('URL:', `http://localhost:5000${path}`, 'STATUS:', res.statusCode);
        console.log('CONTENT-TYPE:', res.headers['content-type'] || '');
        console.log(data.substring(0,1000));
        console.log('---');
        resolve();
      });
    });
    req.on('error', (e) => { console.log('ERROR', e.message); resolve(); });
    req.end();
  });
}

(async () => {
  for (const u of urls) await check(u);
})();
