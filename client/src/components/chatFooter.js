import React, { useState } from "react";
import checkPageStatus from "../utils/functions";
import axios from "axios";

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");
  let timer,
    timeoutVal = 1000;
  const handleTyping = () => {
    window.clearTimeout(timer);
    socket.emit("typing", {
      name: localStorage.getItem("userName"),
      socketID: socket.id,
    });
  };
  const handleKeyUp = () => {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    timer = window.setTimeout(() => {
        socket.emit("stoppedTyping",true);
    }, timeoutVal);
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      const data={
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      }
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/chat`,data);
      socket.emit("message", data);
      checkPageStatus(message,localStorage.getItem("userName"))
    }
    setMessage("");
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onKeyUp={handleKeyUp}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
