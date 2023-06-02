// Import dependencies
const express = require('express');
const socket = require('socket.io');

// Set up the Express app
const app = express();
const port = 3000; // Change this to the desired port number

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Set up Socket.IO
const io = socket(server);

const users = [];

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new messages
  socket.on('chatMessage', (data) => {
    const { username, message } = data;
  
    const timestamp = new Date().toLocaleTimeString(); // Get the current timestamp

    
    if (!users.includes(username)) {
      users.push(username);
    }

    console.log(`Message received from ${username} at ${timestamp}: ${message}`);

    // Broadcast the message to all connected clients
    io.emit('chatMessage', { username, message, timestamp });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Remove the username from the users array
    const index = users.indexOf(socket.username);
    if (index !== -1) {
      users.splice(index, 1);
    }
    // Broadcast the updated user list to all connected clients
    io.emit('userList', users);
  });

  // Send the initial user list to the connecting client
  socket.emit('userList', users);


  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Remove the username from the users array
    const index = users.indexOf(socket.username);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});

// Create an API endpoint to get the list of users
app.get('/users', (req, res) => {
  res.json(users);
});


