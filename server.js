const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formartMessage = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botnic = 'ChatBot'

// setting static folder
app.use(express.static(path.join(__dirname, 'public')));

// Alert when user connection is made
io.on('connection', socket => {
    socket.on('joinroom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room);

        socket.emit('message', formartMessage(botnic, `${user.username} Welcome to ChatApp`));

        //alert when a user connects
        socket.broadcast.to(user.room).emit(
            'message',
            formartMessage(botnic, `${user.username} has joined the chat`));
    });

    //cathching the chatMessage
    socket.on('chatMessage', (msg) =>{
        io.emit('message', formartMessage(`${user.username} `, msg));
    })

    //alert when a user disconnects
        socket.on('disconnect', () => {
            io.emit('message', formartMessage(botnic, `A user has left the chat`));
        })
    
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server Runing on port ${PORT}`));