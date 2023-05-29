import express, { json } from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import {Server} from 'socket.io'
import chatRouter from './routes/chatRouter.js'
import {createServer} from 'http'
import connectMongo from './config/db.js';
import axios from 'axios';
const app = express();
const PORT = process.env.PORT||3001;

//config env
dotenv.config()

//db connect
connectMongo()

//create a http server
const http=createServer(app)

//cors
app.use(cors());
app.use(json())
//routes

app.get("/", (request, response) => {
  response.send('hello');
});
app.use("/api",chatRouter)

const socketIO = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];
let typing=false;

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message",(data) => {
    axios.post("http://localhost:3001/api/chat",data);
    socketIO.emit("messageResponse", data);
  });

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    users.push(data);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
  });
  
  //Listens when a user types
  socket.on('typing', (data) => {
    typing=true,
    socketIO.emit("stoppedTypingResponse",typing);
    socketIO.emit('typingResponse', data)
  });
  socket.on('stoppedTyping',(data)=>{
    typing=false
    socketIO.emit("stoppedTypingResponse",typing);
  })
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

http.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})

