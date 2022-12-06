const http = require('http');

const hostname = 'localhost';
const port = 3000;

// Create a new server using the Node HTTP module
const server = http.createServer((req, res) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // End the request, return HTML
    res.end('<html lang="en"><body><h1>Hello World!</h1></body></html>');
});

server.listen(port, hostname, () => {
    console.info(`Server running at http://${hostname}:${port}`);
});