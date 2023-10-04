const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/isRealString')
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname,'../public');
let users = new Users();
app.use(express.static(publicPath));
// Set up a route for the client to connect to
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Define what happens when a client connects
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('join', (params, callback)=>{
    if(!isRealString(params.name)|| !isRealString(params.room)){
      return callback('Name and Room are required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat group: ${params.room}`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New User Joined'));
  
    callback();
  });
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text:message.msg,
    //   createdAt: new Date().getTime()
    // })
    socket.on('createMessage', (message, callback)=>{
      let user = users.getUser(socket.id);
      if(user && isRealString(message.msg)){
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.msg));
      }
      console.log('createMessage', message);
      callback('this is server');
  });
  // socket.emit('newMessage',{
  //   from:"anju",
  //   msg:"hi print on the server console"
  // })
  // Define what happens when a client disconnects
  socket.on('createGeoLoc', (coords) => {
    let user = users.getUser(socket.id);
      if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng));
      }
  })
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    let user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the ${user.room} chat room`));
    }
  });
 
  
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
