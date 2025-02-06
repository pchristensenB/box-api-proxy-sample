const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path  = require("path");
const fs  = require("fs");
const app = express();
const PORT = 3000;

// Replace with token generator? 
const BOX_ACCESS_TOKEN = '';

app.use(express.static(path.join(__dirname, "public")));
// Common function to set the Authorization header
const setAuthHeader = (proxyReq) => {
  proxyReq.setHeader('Authorization', `Bearer ${BOX_ACCESS_TOKEN}`);
};
app.get('/upload', function (req, res) {
  let file = 'html/file_uploader_proxy.html';
	fs.readFile(file, 'utf8', (err, page) => {
		if (err) {
			console.log("error reading the index.html file")
		}
		res.send(page)
	})
	
})
app.get('/explorer', function (req, res) {
  let file = 'html/file_uploader_explorer.html';
	fs.readFile(file, 'utf8', (err, page) => {
		if (err) {
			console.log("error reading the index.html file")
		}
		res.send(page)
	})
	
})

// Proxy for api.box.com
app.use('/api', createProxyMiddleware({
  target: 'https://api.box.com',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },  
  onProxyReq: setAuthHeader,
  logLevel:'debug'
}));

// Proxy for upload.box.com
app.use('/upload', createProxyMiddleware({
  target: 'https://upload.box.com',
  changeOrigin: true,
  pathRewrite: { '^/upload': '' },  
  onProxyReq: setAuthHeader,
  logLevel:'debug'
}));

// Proxy for upload.app.box.com
app.use('/app-upload', createProxyMiddleware({
  target: 'https://upload.app.box.com',
  changeOrigin: true,
  pathRewrite: { '^/app-upload': '' }, 
  onProxyReq: setAuthHeader,
  logLevel:'debug'
}));
// Proxy for dl.boxcloud.com
app.use('/dl', createProxyMiddleware({
    target: 'https://dl.boxcloud.com',
    changeOrigin: true,
    pathRewrite: { '^/dl': '' },  
    onProxyReq: setAuthHeader,
    logLevel:'debug'
  }));

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
  console.log(`API requests: http://localhost:${PORT}/api`);
  console.log(`Upload requests: http://localhost:${PORT}/upload`);
  console.log(`App Upload requests: http://localhost:${PORT}/app-upload`);
  console.log(`Download requests: http://localhost:${PORT}/dl`);
});
