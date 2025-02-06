const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const BOX_ACCESS_TOKEN = '1!VpUxDe0FMM3JeGE6k6tANd5WAc4m1cIhYFnPIbipKT3iB7nHZfQRlrJ4uXEibn7ETsqGaIAx8Acu5S_MUHqOjr93t-_Xc0seQTEBAALKreGBb_ipBTE5I38kf7SVdxpmvpz3dclV9BKXi5Yp4t-evMWfaQSnQVA89_3sLYMcThtkXXCGaR42uw9wu5L516UnJ35UvTgnt9EuyAyGt8LUkGmRgdbbAcOudFdEfJpU9FhYXnVUnMdlMM1uZgEDVmngkTvZLPuLw1Hej48xrYJz8dGlXM9aWK436HkeBMUrJhJomxHaS2loG7J5eBq6SGYe6zB2rGMa1xVd_3JoWtpgBO12n7DqxoV1quM2d_PQDbAwMjaVAG6IbWILim9DTvyg8NnYlDoa3VkzX2FFVHYEhpZKPGsVQ73vUtW-6xWSbz3KjUBhMWG3kmPHp0SedveCXKcLzZVOnZyE8sbYVzzteEM_FODCval9DyE0pU5Sl8l2IGtiGG_Mq8Nq5896bUeAyx3_f0j54gvt49jEpBjq_xSRJBmhemD-g48ihjgpSiB7yoFTRxFxAtslwlTGO7SUtkPW9UJjukxxOXgcUxaz5vWgFvGPdKa8ZXT1RYSMSFkkAD53V0E4JmJCct-SC1c3nG5sRhIzm03342monFU3GxHhPwESEnQ6SI7SHDZk7qbdsEnyIsVjkqujKhirUvDaaW7b3l7L48QV8D-EG2kGUaccrPf7pD-yQyXnay2OD4N5XfaU1hiTp24-qO0KfBDeTycAG5scSv9kHDbVBsGmAVWhH4cUHN_SgWTLl_rjQuDvDD5h3e9FwtWKj15nqgEvtga5Mb_40esMogknpiXII0DdQIQItqRwveOfkbG-e6-cTrmfrdqnvvjccKB0j6vEqko_EhBFWT_7WmQf';

// proxy middleware options
const options = {
  target: 'https://upload.app.box.com/', // target host
  changeOrigin: true, // needed for virtual hosted sites
  logLevel:'debug',
  onProxyReq: (proxyReq, req, res) => {
    // Add the Authorization header with the Bearer token
    proxyReq.setHeader('Authorization', `Bearer ${BOX_ACCESS_TOKEN}`);
  },
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
app.listen(3002);