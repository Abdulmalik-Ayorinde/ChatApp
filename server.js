const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formartMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

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
        socket
        .broadcast
        .to(user.room)
        .emit(
            'message',
            formartMessage(botnic,`${user.username} has joined the chat`)
        );

    //Send user info to room
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });

    //cathching the chatMessage
    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formartMessage(user.username, msg));
    })

    //alert when a user disconnects
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if(user){
                io.to(user.room)
                .emit('message', 
                formartMessage(botnic, `${user.username} has left the chat`)
                );

                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                  }); 
            }
        })
    
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server Runing on port ${PORT}`));