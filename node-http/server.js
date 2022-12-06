const http = require('http');

const hostname = 'localhost';
const port = 3000;

const path = require('path');
const fs = require('fs');

// Create a new server using the Node HTTP module
const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} by method ${req.method}`);

    if (req.method === 'GET') {
        let fileUrl = req.url;

        if (fileUrl === '/') {
            fileUrl = '/index.html';
        }

        // Full, absolute path to the requested file
        const filePath = path.resolve('./public' + fileUrl);
        // Check if HTML file
        const fileExt = path.extname(filePath);
        if (fileExt === '.html') {
            // Check to make sure the file exists on the server
            fs.access(filePath, err => {
                // Path is not accessible
                if (err) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`<html lang="en"><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');

                // Read the contents of the file (similar to lazy loading, in chunks. Creates a stream read object)
                // This will also cause the response object to end
                fs.createReadStream(filePath).pipe(res);
            });
        } else {
            // Not HTML...
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html lang="en"><body><h1>Error 404: ${fileUrl} is not an HTML file</h1></body></html>`);
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<html lang="en"><body><h1>Error 404: ${req.method} not supported</h1></body></html>`);
    }

});

server.listen(port, hostname, () => {
    console.info(`Server running at http://${hostname}:${port}`);
});