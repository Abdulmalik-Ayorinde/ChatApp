const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true

});

const socket = io();

//Join chatroom 
socket.emit('joinroom', {username, room});

// Get room and Users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users)
});

//Server Message
socket.on('message', message => {
    outputMessage(message);
    console.log(message)

    //Scroll down functionality
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Adding form functionality
chatForm.addEventListener('submit', (e) => {
   e.preventDefault();
   
   // getting message text
   const msg = e.target.elements.msg.value;

   // send message to server 
   socket.emit('chatMessage',msg);

   //clear input

e.target.elements.msg.value = '';
e.target.elements.msg.focus();
});

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

// Adding room name
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
  }
  
