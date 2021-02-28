const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const groupName = document.getElementById('group-name');
const userList = document.getElementById('users');

// Get username and group from URL
const {
    username,
    group
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join Chatroom
socket.emit('joinGroup', {
    username,
    group
});

// Get group and users
socket.on('groupUsers', ({
    group,
    users
}) => {
    outputGroupName(group);
    outputUsers(users);
});

// Message from server 
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server 
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Output Message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add group name to DOM
function outputGroupName(group) {
    groupName.innerText = group;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
${users.map(user => `<li>${user.username}</li>`).join('')}
`;
}