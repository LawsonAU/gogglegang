const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); // Import the cors middleware

const app = express();

// Use the cors middleware to enable CORS
app.use(cors({
  origin: 'http://localhost:4200', // Allow requests from your Angular app's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you need to include cookies
}));

// Define a proxy route
app.use('/api', createProxyMiddleware({
  target: 'https://nwmarketprices.com', // Target server URL
  changeOrigin: true,
  secure: false, // Disable SSL certificate validation (for development only)
}));

// Start the server on a port (e.g., 3000)
const port = 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
