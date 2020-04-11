const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formartMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botnic = 'ChatBot'

// setting static folder
app.use(express.static(path.join(__dirname, 'public')));

// Alert when user connection is made
io.on('connection', socket => {
    socket.emit('message', formartMessage(botnic, 'Welcome to ChatApp'));

    //alert when a user connects
    socket.broadcast.emit('message', formartMessage(botnic, 'A user has joined the chat'));

    //alert when a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formartMessage(botnic, 'A user has left the chat'));
    })

    //cathching the chatMessage
    socket.on('chatMessage', (msg) =>{
        io.emit('message', formartMessage('USER', msg));
    })
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server Runing on port ${PORT}`));