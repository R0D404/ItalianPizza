const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const pizzasHandler = require('./api/pizzas');
const pedidosHandler = require('./api/pedidos');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Helper para simular helpers de Express / Vercel en res
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
    return res;
  };

  // Helper para leer body JSON
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const bodyStr = Buffer.concat(buffers).toString();
    try {
      req.body = bodyStr ? JSON.parse(bodyStr) : {};
    } catch (e) {
      req.body = bodyStr;
    }
  }

  // Rutas API
  if (pathname === '/api/pizzas') {
    return pizzasHandler(req, res);
  }
  if (pathname === '/api/pedidos') {
    return pedidosHandler(req, res);
  }

  // Rutas amigables
  let filePath = pathname === '/' ? '/index.html' : pathname;
  if (filePath === '/menu') filePath = '/index.html';
  if (filePath === '/admin') filePath = '/admin.html';
  if (filePath === '/cocina') filePath = '/cocina.html';

  const fullPath = path.join(PUBLIC_DIR, filePath);

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Página no encontrada');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(fullPath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🍕 Servidor Italiany Pizzas Fullstack en ejecución`);
  console.log(`👉 Menú Clientes:     http://localhost:${PORT}/`);
  console.log(`👉 Panel Admin:       http://localhost:${PORT}/admin.html`);
  console.log(`👉 Monitor Cocina:    http://localhost:${PORT}/cocina.html`);
  console.log(`👉 Endpoint API:      http://localhost:${PORT}/api/pizzas`);
  console.log(`====================================================`);
});
