/**
 * Static file server for the portfolio.
 *
 * No dependencies on purpose: Railway installs nothing, builds are instant,
 * and there is no package to keep patched. Handles gzip for text, byte-range
 * requests so self-hosted MP4s can be scrubbed, and sane caching.
 *
 * You should not need to edit this file.
 */

const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const zlib   = require('zlib');
const stream = require('stream');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.mov':  'video/quicktime',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8'
};

const COMPRESSIBLE = new Set([
  '.html', '.css', '.js', '.json', '.svg', '.txt', '.md', '.xml'
]);

function cacheFor(ext) {
  if (ext === '.html') return 'public, max-age=0, must-revalidate';
  if (ext === '.css' || ext === '.js') return 'public, max-age=3600';
  return 'public, max-age=86400';
}

function send(res, code, body, headers) {
  res.writeHead(code, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, headers || {}));
  res.end(body);
}

function handle(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (err) {
    return send(res, 400, 'Bad request');
  }

  // A decoded %00 makes fs throw synchronously rather than call back, which
  // would take the whole process down. Refuse it before it reaches fs.
  if (pathname.indexOf('\0') !== -1) return send(res, 400, 'Bad request');

  if (pathname === '/healthz') return send(res, 200, 'ok');

  if (pathname.endsWith('/')) pathname += 'index.html';

  // Resolve inside ROOT only. Anything that escapes it is refused.
  const filePath = path.join(ROOT, path.normalize(pathname));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    return send(res, 403, 'Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return notFound(req, res);

    const ext  = path.extname(filePath).toLowerCase();
    const type = TYPES[ext] || 'application/octet-stream';

    const accepts  = String(req.headers['accept-encoding'] || '');
    const isRange  = typeof req.headers.range === 'string';
    // Ranges are always served raw, so never negotiate gzip alongside one.
    const gzip     = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(accepts) && !isRange;

    // The gzipped body is a different representation, so it needs its own tag
    // or a cache can hand a compressed body to a client that didn't ask.
    const etag = '"' + stat.size.toString(16) + '-' + stat.mtimeMs.toString(16) +
                 (gzip ? '-gz' : '') + '"';

    const base = {
      'Content-Type': type,
      'Cache-Control': cacheFor(ext),
      'ETag': etag,
      'Last-Modified': stat.mtime.toUTCString(),
      'Vary': 'Accept-Encoding',
      'X-Content-Type-Options': 'nosniff'
    };

    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, base);
      return res.end();
    }

    // Byte ranges, so video scrubbing works on self-hosted files.
    if (isRange) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range.trim());
      if (m && !(m[1] === '' && m[2] === '')) {
        let start, end;

        if (m[1] === '') {
          // Suffix range, e.g. "bytes=-500". Players use this to grab the
          // trailing moov atom of an MP4 before they can play anything.
          const want = parseInt(m[2], 10);
          if (isNaN(want) || want === 0 || stat.size === 0) return unsatisfiable(res, stat.size);
          start = Math.max(0, stat.size - want);
          end   = stat.size - 1;
        } else {
          start = parseInt(m[1], 10);
          end   = m[2] ? parseInt(m[2], 10) : stat.size - 1;
        }

        if (isNaN(start) || isNaN(end) || start > end || start >= stat.size) {
          return unsatisfiable(res, stat.size);
        }
        end = Math.min(end, stat.size - 1);

        res.writeHead(206, Object.assign({}, base, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1
        }));

        if (req.method === 'HEAD') return res.end();

        const part = fs.createReadStream(filePath, { start, end });
        return stream.pipeline(part, res, () => {});
      }
      // A range header we can't parse falls through to a normal 200.
    }

    const headers = Object.assign({}, base, { 'Accept-Ranges': 'bytes' });
    if (gzip) headers['Content-Encoding'] = 'gzip';
    else headers['Content-Length'] = stat.size;

    res.writeHead(200, headers);
    if (req.method === 'HEAD') return res.end();

    const file = fs.createReadStream(filePath);

    // pipeline tears the whole chain down if any link fails, including the
    // gzip transform. A bare .pipe() would leak the socket instead.
    if (gzip) stream.pipeline(file, zlib.createGzip(), res, () => {});
    else stream.pipeline(file, res, () => {});
  });
}

function unsatisfiable(res, size) {
  res.writeHead(416, { 'Content-Range': 'bytes */' + size });
  res.end();
}

/* Missing assets should 404 as plain text. Only a navigation gets the styled
   page back, otherwise a broken image path would silently return HTML. */
function notFound(req, res) {
  const wantsHtml = /text\/html/i.test(String(req.headers.accept || ''));
  const head = { 'Cache-Control': 'no-store' };

  if (!wantsHtml) return send(res, 404, 'Not found', head);

  fs.readFile(path.join(ROOT, 'index.html'), (err, html) => {
    if (err) return send(res, 404, 'Not found', head);
    send(res, 404, html, Object.assign({ 'Content-Type': TYPES['.html'] }, head));
  });
}

const server = http.createServer((req, res) => {
  try {
    handle(req, res);
  } catch (err) {
    console.error('Request failed:', err);
    if (!res.headersSent) send(res, 500, 'Server error');
    else res.destroy();
  }
});

server.on('clientError', (err, socket) => {
  if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// Nothing here holds state between requests, so staying up beats dropping the
// whole site because one socket misbehaved.
process.on('uncaughtException', (err) => console.error('Uncaught:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));

server.listen(PORT, '0.0.0.0', () => {
  console.log('Portfolio running on http://localhost:' + PORT);
});
