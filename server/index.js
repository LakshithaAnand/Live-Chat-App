const express = require("express");
const app = express()
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (User, room) => {  // receives from the browser if key is join_room
    socket.join(room);
    console.log(`User with ID: ${User} joined room: ${room}`)
  });

  socket.on("disconnect", () => {  // on is an event
    console.log("User Disconnected", socket.id);
  });

  socket.on("messageSent", (params) => {
    console.log("params", params.room);
    // io.to(params.room).emit('messageReceived', params);
    // socket.broadcast.emit("messageRecieved", params);
    socket.broadcast.to(params.room).emit("messageRecieved", params);
    socket.emit("messageRecieved", params);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
})