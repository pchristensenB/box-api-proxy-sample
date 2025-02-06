const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path  = require("path");
const fs  = require("fs");
const app = express();
const PORT = 3000;

// Replace with token generator? 
const BOX_ACCESS_TOKEN = '1!sr-d2BDFGOyBDgq8HXzgKt5nlkkDCcSAMXb15X5_eYrj_BnFAwBgf0LzS6VIkocaV6yAYrqs6v4aGFg8ZC3cWGammHbmovNAfQFA_odZhppEIO4QfeK0D1ozq66idO5q6ivssVuiIz34OBhkljQMsGa_VBOR4vPyGsOdu5HQkwSr4Ag8QWE8xYj9D7qIUP-_HwTbCBqiSz5yJuIX1281z_1MPosXJ59JeDNIQpp67lGVOvxy1JLl38TQBY917U4umenBS7PunRtCkc-rw2Hn6HL-6ONGjLPv9QqiQi2S8k0tAh1tjNQUdMOYXuSp5Tp4J3HR5aJIRCCktzUpsEvPgMI3-vym0WwozXpQs0UNVpJkhAQDDx9J7yzplxaZ9xO4NRSD8JyIMExKMKj_1oGaDpx4LwXPtcDp2Ck2Eh6gmj-3nW-qE16E7pwvdhpJca9ZfxolYY6pufVTV87MKz-47DIiS6dUNi0vORTroMQUOr3lFoG1dOc0LTo13hfcSqAVXOvsT_89nuZrfRT6YchL6NuYJSFmncvTUfvxEeYyY-YKWQGIUl4FC0rQpFHESX-xq1Dr2Qy9s16IafWYq3jXbo31BlMXTP8G6pHkBlRBduFf2RhYQkyO35rQR87DDSUvs0vgVeCi6xQs79e0fXI7pfjW8kJzxTcYJ7jGFDk9ZJVnZRNOR8jCQbXzB1e9WYgf4nppg948EqKd2GoU_oxTcQ04fnfzT30xhjLaCC6J65py3cMWvP8LIGO55l6819Jn9aE-cNgt4x2YbNVODMY0GuvKl08t5GduYDRCHi4-5b2JajyknbTwygahPfPFWlAvWoEkuiqtolp0l3GFb6_vr_qm_Tw2LSvFtB0ICBixY_AnEyz88WeiQuhF7R_chtXlG5_toCJUQMrITvUS';

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
