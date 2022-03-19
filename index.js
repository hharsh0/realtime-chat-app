const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static(__dirname + '/css'));


const port = process.env.PORT || 3000

const users = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

io.on('connection', (socket) => {

  socket.on('login', name=> io.emit('chat message', `${name} joined the chat`))
                          // Chat message
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg); // to add given message on console
    io.emit('chat message', msg);
  });
                           // Connection/disconnect message
  socket.on('disconnect', function() {
    io.emit('chat message', `some user disconnected`);
 });

 console.log(`socket id : ${socket.id}`)
});


server.listen(port, () => {
  console.log('listening on port:3000');
});