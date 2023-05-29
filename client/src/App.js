import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';
import Home from './components/home';
import ChatPageHOC from './components/chatPageHOC.js';

const socket = socketIO.connect('http://localhost:3001');
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPageHOC socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
