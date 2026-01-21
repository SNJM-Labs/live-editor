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

let content = "";

// Response if on the '/' route
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {

    // Sets the content for the client when they first join
    socket.emit('update content', content);

    socket.on('content change', (msg) => {
        // Sets the message as the content
        content = msg;

        // Sends the content to all clients
        console.log('Content: ' + content);
        io.emit('update content', content);
    });
});

// Listens for incoming HTTP requests
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});