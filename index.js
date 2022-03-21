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

io.on('connection', socket=>{
  socket.on('new-user-joined', name=>{
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message=>{
      socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
  });

  socket.on('disconnect', message=>{
     socket.broadcast.emit('left', users[socket.id]);
     delete users[socket.id];
 });
})

server.listen(port, () => {
  console.log('listening on port:3000');
});

