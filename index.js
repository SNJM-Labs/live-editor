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

let rooms = {}

// Response if on the '/' route
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '\\pages\\login.html'));
});
app.get('/create-room', (req, res) => {
    res.sendFile(join(__dirname, '\\pages\\create-room.html'));
});
app.get('/editor', (req, res) => {
    res.sendFile(join(__dirname, '\\pages\\index.html'));
});
app.get('/create-room-action', (req, res) => {

    // Gets room Id and user
    const roomId = Math.random().toString(10).substring(2, 8);
    const user = req.query.user;

    // Creates new room
    rooms[roomId] = {
        textarea1: "",
        textarea2: "",
        textarea3: ""
    };

    // Redirects to main page
    res.redirect(`/editor?room=${roomId}&user=${user}`);
});

io.on('connection', (socket) => {

    // Joins rooms
    const roomId = socket.handshake.query.roomId;
    socket.join(roomId);

    // Sets the content for the client when they first join
    Object.keys(rooms[roomId]).forEach(id => {
        socket.emit('update content', { id: id, val: rooms[roomId][id] });
    });

    socket.on('content change', (msg) => {
        // Sets the message as the content
        rooms[roomId][msg.id] = msg.val;

        // Sends the content to all clients
        io.to(roomId).emit('update content', msg);

        console.log(rooms)
    });
});

// Listens for incoming HTTP requests
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});