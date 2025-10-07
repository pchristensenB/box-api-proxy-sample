# Box API Proxy Middleware

A Node.js middleware application that provides proxy services for Box API endpoints, enabling local development and testing of Box integrations with custom authentication and routing.

## Overview

This middleware acts as a proxy layer between your application and Box's various API endpoints, allowing you to:
- Route API calls through local endpoints
- Inject custom authentication tokens
- Test Box integrations in a controlled environment
- Handle CORS issues during development

## Features

- **Multi-endpoint Proxy**: Routes requests to different Box services (API, Upload, Download)
- **Authentication Injection**: Automatically adds Bearer tokens to requests
- **WebSocket Support**: Handles WebSocket connections for real-time features
- **Static File Serving**: Serves HTML demo pages for testing
- **Multiple Configurations**: Different app configurations for various use cases

## Project Structure

```
middleware/
├── app.js          # Main proxy server (port 3000)
├── appProxy.js     # Multi-endpoint proxy with static serving (port 3000)
├── appUp.js        # Upload-focused proxy (port 3002)
├── appDown.js      # Download-focused proxy (port 3001)
├── html/           # Demo HTML pages
│   ├── file_uploader_proxy.html
│   └── file_explorer_proxy.html
├── public/         # Static assets
└── package.json
```

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### Authentication Token

**Important**: Replace the hardcoded `BOX_ACCESS_TOKEN` in the application files with your own Box access token.

In `app.js`, `appUp.js`, and `appProxy.js`, update:
```javascript
const BOX_ACCESS_TOKEN = 'your-box-access-token-here';
```

### Port Configuration

The different applications run on different ports:
- **app.js**: Port 3000 (main proxy)
- **appProxy.js**: Port 3000 (multi-endpoint with UI)
- **appUp.js**: Port 3002 (upload proxy)
- **appDown.js**: Port 3001 (download proxy)

## Usage

### Running the Applications

#### Main Proxy Server
```bash
npm start
# or
node app.js
```

#### Multi-endpoint Proxy with UI
```bash
node appProxy.js
```

#### Upload Proxy
```bash
node appUp.js
```

#### Download Proxy
```bash
node appDown.js
```

### Available Endpoints

When running `appProxy.js`, the following endpoints are available:

- **API Proxy**: `http://localhost:3000/api/*` → `https://api.box.com/*`
- **Upload Proxy**: `http://localhost:3000/upload/*` → `https://upload.box.com/*`
- **App Upload Proxy**: `http://localhost:3000/app-upload/*` → `https://upload.app.box.com/*`
- **Download Proxy**: `http://localhost:3000/dl/*` → `https://dl.boxcloud.com/*`
- **File Uploader UI**: `http://localhost:3000/upload`
- **File Explorer UI**: `http://localhost:3000/explorer`

### Demo Pages

The application includes two demo HTML pages:

1. **File Uploader** (`/upload`): Demonstrates Box Content Uploader integration
2. **File Explorer** (`/explorer`): Demonstrates Box Content Explorer with annotations

## API Integration

### Request Interceptors

The demo pages include request/response interceptors that modify URLs to route through the proxy:

```javascript
var testResponseInterceptor = (config) => {
  var newConfig = JSON.stringify(config)
    .replace(/https:\/\/dl.boxcloud.com/g, "http://localhost:3000/dl")
    .replace(/https:\/\/upload.app.box.com/g, "http://localhost:3000/app-upload");
  return JSON.parse(newConfig);
};
```

### Box SDK Integration

The proxy works with Box's JavaScript SDK by configuring custom hosts:

```javascript
var contentUploader = new Box.ContentUploader();
contentUploader.show('folder-id', 'access-token', {
  container: '.container',
  apiHost: "http://localhost:3000/api",
  uploadHost: "http://localhost:3000/upload",
  requestInterceptor: testRequestInterceptor,
  responseInterceptor: testResponseInterceptor
});
```

## Dependencies

- **express**: Web framework
- **http-proxy-middleware**: HTTP proxy middleware
- **http-proxy**: HTTP proxy library
- Various utility libraries for pattern matching and routing

## Development Notes

### Security Considerations

- **Never commit access tokens** to version control
- Consider using environment variables for sensitive configuration
- The current implementation uses hardcoded tokens for demonstration purposes

### CORS Handling

The proxy automatically handles CORS issues by:
- Setting `changeOrigin: true`
- Adding proper headers to requests
- Routing through local endpoints

### Error Handling

The proxy includes error handling for failed requests:
```javascript
function onError(err, req, res, target) {
  console.log(err);
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure your Box access token is valid and has appropriate permissions
2. **Port Conflicts**: Make sure the required ports (3000, 3001, 3002) are available
3. **CORS Issues**: The proxy should handle CORS automatically, but check browser console for errors

### Debug Mode

All proxy configurations include debug logging:
```javascript
logLevel: 'debug'
```

Check the console output for detailed request/response information.

## License

ISC

## Contributing

This is a sample project for demonstration purposes. Feel free to modify and extend it for your specific use cases.