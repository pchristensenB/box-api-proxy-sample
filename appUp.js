const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// proxy middleware options
const options = {
  target: 'https://dl.boxcloud.com/', // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets,
   router: {
    'upload.box.com' : 'https://upload.box.com',
    'upload.app.box.com' : 'https://upload.app.box.com',
  },
};

// create the proxy (without context)
const boxProxy = createProxyMiddleware(options);

// mount `exampleProxy` in web server
const app = express();
app.use('/', boxProxy);
app.listen(3001);