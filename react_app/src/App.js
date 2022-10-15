import './App.css';
import io from "socket.io-client";
import Chat from "./chat";
import React, {useState, useRef, useEffect} from "react";

const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const UserNameRef = useRef();
  const RoomIDRef = useRef();

  function joinRoom(){
    const UserName = UserNameRef.current.value;
    if (UserName === "") return;
    console.log("UserName:", UserName);
    setUserName(UserName);

    const RoomID = RoomIDRef.current.value;
    if (RoomID === "") return;
    console.log("RoomID:", RoomID);
    setRoom(RoomID);

    socket.emit("join_room", UserName, RoomID); // Sends to the server
  }

  return (
    <div className="App">
      <h3>Join A Chat</h3>
      <input type = "text" placeholder = "Name" ref = {UserNameRef} />
      <input type = "text" placeholder = "Room ID" ref = {RoomIDRef} />
      <button onClick = {joinRoom}>Join A Room</button>
      <Chat socket = {socket} username = {username} room = {room}/>
    </div>
  );
}

export default App;
