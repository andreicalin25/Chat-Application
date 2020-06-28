//const { text } = require("express");

const btn = document.getElementById('btn');
const chatMessages = document.querySelector('.chat-messages');
userList = document.getElementById('users');
        
var ceva = window.location.pathname;
const prenume = ceva.substring(6);


// // Arata users
// var show = false;
// function show() {
    
//     if(!show) {

//     }
// }

// Intra in chat
socket.emit('joinRoom', prenume);

// Get users
socket.on('roomUsers', users => {
    outputUsers(users);
});

// Message de la server
socket.on('message',  message => {
    
    outputMessage(message);

  // afiseaza mereu ultimul mesaj
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Color de la server
socket.on('color', (userChoice) => {
    
    console.log(userChoice.prenume);
    console.log(userChoice.color);

    console.log(chatMessages);

    const userDivs = document.getElementsByClassName(userChoice.prenume);
    console.log(userDivs);

    //document.querySelector('.Andrei .text').style.color = 'red';

    
    for(let i=0; i < userDivs.length; i++){

        console.log(userDivs[i]);
        text = userDivs[i].getElementsByClassName("text")[0];
        console.log(text);
        text.setAttribute('style', `color:${userChoice.color}`);
    }

})

// Message send
function send() {

    // Get message text
    const msg = document.getElementById('msg').value;

    // Emit message to server
    socket.emit('chatMessage', ({prenume, msg}));

    // Clear input
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
};

//Color select
function color() {
    var color = document.getElementById('color').value;
    console.log(color);

    socket.emit('color', ({prenume, color}));
}

// trimite mesaj
function outputMessage(message) {

    const div = document.createElement('div');
    div.setAttribute('class', `message ${message.prenume}`)

    div.innerHTML = `<p >${message.prenume} <span style="color:grey">${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// afiseaza utilizatori                                    
function outputUsers(users) {
    console.log(users);

    document.getElementById("users").innerHTML = "";

    for(let i=0; i < users.length; i++) {

        let node = document.createElement("li");
        let textnode = document.createTextNode(users[i].prenume);
        node.appendChild(textnode);
        
        document.getElementById("users").appendChild(node);
    }
}