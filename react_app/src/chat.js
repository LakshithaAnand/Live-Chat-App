import "./chat.css";
import { Form, Button } from "react-bootstrap";
import React, { useState, useRef, useEffect } from "react";
const sqlite3 = require('sqlite3').verbose() // importing the sqlite3 module

// open database in memory
let db = new sqlite3.Database(':memory:', sqlite3.OPEN_CREATE, (err) => {// create a database object
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to the in-memeory SQlit database.');
}); 

// close the database connection
db.close((err) => {
    if (err){
        return console.error(err.message);
    }
    console.log('Close the database connection');
});

export default function Chat({ socket, username, room }) {
  // console.log(username);
  const MessageInputRef = useRef();
  const [latestMessage, setLatestMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  function HandleMessages(e) {
    e.preventDefault();
    const Message = MessageInputRef.current.value;
    // Message.preventDefault();
    if (Message === "") return;
    console.log("Message:", Message);
    setLatestMessage(Message);
    console.log("username:", username, "room:", room);
    var today = new Date(),
    time = today.getHours() + ':' + today.getMinutes();

    const MessageParams = {
      room: room,
      Sender: username,
      message: Message,
      current_time: time,
    };

    socket.emit("messageSent", MessageParams);
    // socket.on("messageRecieved", (data) => {
    //   console.log("DATA:", data);
    // })
  }

  useEffect(() => {
    // console.log("HI");
      socket.on("messageRecieved", (data) => {
        console.log("Messaged received from the server is:", data);
        setMessageList((list) => [...list, data]);
        // console.log("AA:", data);
      });
  }, [socket]);

  return (
    <div className="Chat">
        <div id = "chat-header">
            <p>Chat Room</p>
        </div>
        <div id="body">
            {messageList.map((content) => {
                // return <h1>{content.message}</h1>;
                return (
                    <div className="chat-messages"  id={username === content.Sender ? "sender" : "receiver"}>
                        <div className="message-content">
                            <p>{content.message}</p>
                        </div>
                        <div className="message-senderinfo">
                            <p>{content.Sender}&nbsp;</p>
                            <p>{content.current_time}</p>
                        </div>
                    </div>
                );
            })}
        </div>
      <div id="Footer">
        <input type="text" placeholder="Message.." ref={MessageInputRef} />
        <div id="send-button">
        <Button variant="primary" id="MessageSubmit" onClick={HandleMessages}>
          Submit
        </Button>
        </div>
      </div>
    </div>
  );
}