const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url} by method ${req.method}`);

  if (req.method === 'GET') {
    let fileUrl = req.url;
    if (fileUrl === '/') {
      fileUrl = '/index.html';
    }

    const filePath = path.resolve('./templates' + fileUrl);
    const fileExt = path.extname(filePath);

    if (fileExt === '.html') {
      fs.access(filePath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
      });
    } else if (fileExt === '.css') {
      const cssPath = path.resolve('./assets/css/style.css');
      fs.access(cssPath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/css');
          res.end(`/* Error 404: ${cssPath} not found */`);
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        fs.createReadStream(cssPath).pipe(res);
      });
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
      const imagePath = path.resolve('/assets/img/' + fileUrl);
      fs.access(imagePath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Error 404: ${fileUrl} not found`);
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', `image/${fileExt.slice(1)}`);
        fs.createReadStream(imagePath).pipe(res);
      });
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Error 404: ${fileUrl} not found`);
    }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Error 404: ${req.method} not supported`);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
