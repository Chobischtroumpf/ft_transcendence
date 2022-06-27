import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from './pages/users/Users';
import SingIn from './pages/SignIn';
import Profile from './pages/profile/Profile';
import Channels from './pages/chat/Channels';
import Game from './pages/game/Game';
import Settings from './pages/settings/Settings';
import Chat from './pages/chat/Chat'
import ChatSettings from './pages/chat/ChatSettings';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/profile/settings" element={<Settings/>}></Route>
          <Route path="/users" element={<Users/>}></Route>
          <Route path="/signin" element={<SingIn/>}></Route>
          <Route path="/channels" element={<Channels/>}></Route>
          <Route path="/chat" element={<Chat/>}></Route>
          <Route path="chat/chatSettings" element={<ChatSettings/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
