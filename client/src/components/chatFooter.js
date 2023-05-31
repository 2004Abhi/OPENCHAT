import React, { useState, useEffect } from "react";
import checkPageStatus from "../utils/functions";
import axios from "axios";

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleTyping = () => {
    socket.emit("typing", {
      name: localStorage.getItem("userName"),
      socketID: socket.id,
    });
  };

  const handleKeyUp = () => {
    clearTimeout(typingTimeout); // Clear the previous timeout

    setTypingTimeout(setTimeout(() => {
      socket.emit("stoppedTyping", true);
    }, 1000));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      const data = {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      };

      console.log(`This message is sent by me: ${data.name}`);

      axios.post(`${process.env.REACT_APP_BASE_URL}/api/chat`, data);
      socket.emit("message", data);
      checkPageStatus(message, localStorage.getItem("userName"));
    }
    setMessage("");
  };

  useEffect(() => {
    return () => {
      // Clean up the timeout when the component unmounts
      clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

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
