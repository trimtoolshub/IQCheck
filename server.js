const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const basePath = '/iqcheck';

const app = next({ dev, hostname, port, basePath });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      
      // Strip base path from URL if it exists
      // Request comes as /iqcheck/... but Next.js with basePath expects /...
      let pathname = parsedUrl.pathname || '/';
      if (pathname.startsWith(basePath)) {
        pathname = pathname.slice(basePath.length) || '/';
      }
      
      // Create new parsed URL with corrected pathname
      const correctedUrl = {
        ...parsedUrl,
        pathname: pathname,
        path: pathname + (parsedUrl.search || '')
      };
      
      await handle(req, res, correctedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}${basePath}`);
  });
});

