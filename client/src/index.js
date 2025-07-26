const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 8080;
const CLIENT_DIR = __dirname;
const ROOT_DIR = path.resolve(CLIENT_DIR, '..');
const STATIC_DIR = path.join(ROOT_DIR, 'public');

const MIME = {
  '.html':'text/html', '.css':'text/css', '.js':'application/javascript',
  '.png':'image/png',  '.jpg':'image/jpeg',   '.svg':'image/svg+xml',
  '.json':'application/json'
};

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let file;

  if (urlPath === '/' || urlPath === '/index.html') {
    file = path.join(ROOT_DIR, 'index.html');
  }
  else if (urlPath.startsWith('/assets/')) {
    file = path.join(STATIC_DIR, urlPath);
  }
  else {
    // fallback for SPA routing
    file = path.join(ROOT_DIR, 'index.html');
  }

  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';

  fs.readFile(file, (err, data) => {
    if (err) {
      const code = err.code === 'ENOENT' ? 404 : 500;
      res.writeHead(code, {'Content-Type':'text/plain'});
      return res.end(code === 404 ? 'Not Found' : 'Server Error');
    }
    res.writeHead(200, {'Content-Type': type});
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`🌐 Static server running at http://localhost:${PORT}`);
});
