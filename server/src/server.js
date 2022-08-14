import http from 'http';

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    // Avoid CORS errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    switch (req.url) {
        // Respond to queries to the domain root
        case '/':
            res.writeHead(200);
            res.end(JSON.stringify({ data: success }));
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Resource Not found' }));
    }
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});