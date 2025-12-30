import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io'; 

// Creates the Express app and HTTP Server
const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Response if on the '/' route
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Emits new content to all clients
io.on('connection', (socket) => {
    socket.on('content change', (msg) => {
        console.log('Content: ' + msg);
        io.emit('update content', msg);
    });
});

// Listens for incoming HTTP requests
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});