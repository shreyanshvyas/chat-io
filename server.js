const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getGroupUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat.io Bot'

// Run when client connects
io.on('connection', socket => {
	socket.on('joinGroup', ({
		username,
		group
	}) => {
		const user = userJoin(socket.id, username, group);
		socket.join(user.group);

		// welcome current user
		socket.emit('message', formatMessage(botName, 'Welcome to Chat.io'));

		// Broadcast when a user connects
		socket.broadcast.to(user.group).emit('message', formatMessage(botName, `${user.username} has join the chat`));

		// Send users and grop info
		io.to(user.group).emit('groupUsers', {
			group: user.group,
			users: getGroupUsers(user.group)
		});
	});

	// Listen For chatMessage
	socket.on('chatMessage', msg => {
		const user = getCurrentUser(socket.id);

		io.to(user.group).emit('message', formatMessage(user.username, msg));
	});

	// Runs when the clients disconnect
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.group).emit('message', formatMessage(botName, `${user.username} has left the chat`));

			// Send users and grop info
			io.to(user.group).emit('groupUsers', {
				group: user.group,
				users: getGroupUsers(user.group)
			});
		}
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));