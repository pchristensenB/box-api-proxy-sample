const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

function onError(err, req, res, target) {
  console.log(err);
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
}
// proxy middleware options
const options = {
  target: 'https://api.box.com/', // target host
  changeOrigin: true, // needed for virtual hosted sites
  onError:onError,
  logLevel:'debug',
  ws: true, // proxy websockets,
   router: {
    'upload.box.com' : 'https://upload.box.com',
    'upload.app.box.com' : 'https://upload.app.box.com'
    
  },
};

// create the proxy (without context)
const boxProxy = createProxyMiddleware(options);

// mount `exampleProxy` in web server
const app = express();
app.use('/', boxProxy);
app.listen(3000);