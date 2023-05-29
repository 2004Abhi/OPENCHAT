import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatPage from './chatPage';

const ChatPageHOC = ({socket}) => {
  const navigate=useNavigate()
  const user=localStorage.getItem('userName')
  useEffect(() => {
    if(!user){
        navigate('/');
    }
  }, [user]);
  return (
    <div>
      <ChatPage socket={socket}/>
    </div>
  );
}

export default ChatPageHOC;
