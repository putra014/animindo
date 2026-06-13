const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Memastikan aplikasi berjalan di mode production
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // process.env.PORT otomatis diisi oleh server cPanel
  const port = process.env.PORT || 3000;
  
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
}).catch((ex) => {
  console.error("Error starting Next.js:", ex.stack);
  process.exit(1);
});
