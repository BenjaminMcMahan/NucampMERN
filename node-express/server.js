const express = require('express');
const morgan = require('morgan');
const campsiteRouter = require('./routes/campsiteRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev')); // Log using the dev version
app.use(express.json()); // Handle JSON parsing

// Use the router for campsites
app.use('/campsites', campsiteRouter);

// Server static files from the public directory
app.use(express.static(__dirname + '/public'));

app.use((
    // Middleware
    req, res
) => {
    // This will be a fallback if the file cannot be found
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html lang="en"><body><h1>This is an Express Server</h1></body></html>');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});