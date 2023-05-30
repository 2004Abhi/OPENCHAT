import React, { useEffect, useRef, useState } from "react";
import ChatBar from "./chatBar";
import ChatBody from "./chatBody";
import ChatFooter from "./chatFooter";
import axios from "axios";

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const data = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/chat`
      );
      setMessages(data.data.message);
    }
    fetchData();
  }, []);
  useEffect(() => {
    socket.on("messageResponse", (data) =>{ 
      setMessages([...messages, data])});
    // console.log(messages);
  }, [socket, messages]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("stoppedTypingResponse", (data) => setIsTyping(data));
  });
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = async (e) => {
    e.preventDefault();
    localStorage.removeItem("userName");
    const message =
      "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    return message;
  };
  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        {typingStatus.socketID !== socket.id && isTyping ? (
          <ChatBody
            messages={messages}
            lastMessageRef={lastMessageRef}
            typingStatus={typingStatus}
          />
        ) : (
          <ChatBody messages={messages} lastMessageRef={lastMessageRef} />
        )}
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
