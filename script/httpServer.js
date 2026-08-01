/**
 * HTTP server, with middleware to set CORS header.
 */

import liveServer from 'live-server';
import { resolve } from 'node:path';

const port = 8080; // Was: 9001.
const root = import.meta.resolve('..');

const PARAMS = {
  port, // Set the server port. Defaults to 8080.
  host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  root, // Set root directory that's being served. Defaults to cwd.
  open: false, // When false, it won't load your browser by default.
  ignore: 'scss,my/templates', // comma-separated string for paths to ignore
  file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
  wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
  // mount: [['/components', './node_modules']], // Mount a directory to a route.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  middleware: [
    function setCorsHttpHeader (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    }
  ] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

liveServer.start(PARAMS);
