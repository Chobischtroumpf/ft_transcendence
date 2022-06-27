// import React from 'react';
// import './App.css';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Users from './pages/users/Users';
// import SingIn from './pages/SignIn';
// import Profile from './pages/profile/Profile';
// import Channels from './pages/chat/Channels';
// import Game from './pages/game/Game';
// import Chat from './pages/chat/Chat';
// import ChatSettings from './pages/chat/ChatSettings';
// import { MessageI } from "./models/Chat";

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/game" element={<Game/>}></Route>
//           <Route path="/" element={<Profile/>}></Route>
//           <Route path="/users" element={<Users/>}></Route>
//           <Route path="/signin" element={<SingIn/>}></Route>
//           <Route path="/channels" element={<Channels/>}></Route>
//           <Route path="/chat" element={<Chat socket={socket} joinMsg={joinMsg} channelName={channelName} messages={messages}/>}></Route>
//           <Route path="chat/chatSettings" element={<ChatSettings/>}></Route>
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from './pages/users/Users';
import SingIn from './pages/SignIn';
import Profile from './pages/profile/Profile';
import Channels from './pages/chat/Channels';
import Game from './pages/game/Game';
import Settings from './pages/settings/Settings';
import { io, Socket } from 'socket.io-client';
import Chat from './pages/chat/Chat';
// import GameArea from './pages/game/GameArea';
// import { gameUpdate } from './models/game';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [joinMsg, setJoinMsg] = useState('');
  const [channelName, setChannelName] = useState('');
  const [messages, setMessages] = useState([]);
  const [games, setGames] = useState([]);
  const [gameStart, setGameStart] = useState<string | null>(null);
  // const [gameUpdate, setGameUpdate] = useState<gameUpdate | null>(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3000`, {withCredentials: true, transports: ['websocket']});
    newSocket.on('joinToClient', (data) => {
      setJoinMsg(data.msg);
      setChannelName(data.channel);
      setMessages(data.messages);
    });
    newSocket.on('leaveToClient', (data) => {
      console.log(data);
    });
    newSocket.on('msgToClient', (data) => {
      setMessages(data);
    });
    newSocket.on('getGamesToClient', (data) => {
      setGames(data);
    });
    newSocket.on('addInviteToClient', (data) => {
      console.log(data);
    });
    newSocket.on('leaveQueueToClient', (data) => {
      console.log(data);
    });
    newSocket.on('newSpectatorToClient', (data) => {
      console.log(data);
    });
    newSocket.on('gameStartsToClient', (data) => {
      setGameStart(data);
    });
    // newSocket.on('gameUpdateToClient', (data) => {
    //   console.log(data);
    //   setGameUpdate(data);
    // });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/game" element={<Game socket={socket} games={games} />}></Route> */}
          <Route path="/" element={<Profile socket={socket}/>}></Route>
          <Route path="/profile" element={<Profile socket={socket}/>}></Route>
          <Route path="/profile/settings" element={<Settings/>}></Route>
          <Route path="/users" element={<Users />}></Route>
          <Route path="/signin" element={<SingIn />}></Route>
          <Route path="/channels" element={<Channels />}></Route>
          <Route path="/chat" element={<Chat socket={socket} joinMsg={joinMsg} channelName={channelName} messages={messages}/>}></Route>
          {/* <Route path="/gamearea" element={<GameArea socket={socket} gameStart={gameStart} gameUpdate={gameUpdate}/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;