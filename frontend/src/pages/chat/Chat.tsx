import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { MessageI } from "../../models/Chat";
import styled from "styled-components"
import { Link } from 'react-router-dom';
import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
import chatImage from '../../assets/chat2.png';
import './chat.css' 


type Props = {
    socket: Socket | null,
    joinMsg: string,
    channelName: string,
    messages: MessageI[],
    onlineUsers: string[],
};

const Chat = ({socket, joinMsg, channelName, messages, onlineUsers}: Props) =>
{
  const [newMessage, setNewMessage] = useState('');
  const [infoMsg, setInfoMsg] = useState(joinMsg);
  const [game, setGame] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [base64, setBase64] = useState();
  const [name, setName] = useState('');
  const [myName, setMyName] = useState('');
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  var oldURL = window.location.href;

  const pongGame = async (e: SyntheticEvent) =>
  {
      e.preventDefault();
      const {data} = await axios.get(`http://localhost:3000/user/get/user?username=${name}`);
      const resp = await axios.get('/user');
      if (data === '' || data.username === resp.data.username)
      {
          window.alert(`User: (${name}) doesn't exists or you invited yourself, try again!`);
          setGame(false);
          return ;
      }
      const id = data.id;
      socket?.emit('addInviteToServer', {id, paddleSize: 40, paddleSpeed: 6, ballSpeed: 3});
      setGame(true);
  }

  const newMsg = async (e: SyntheticEvent) =>
  {
      e.preventDefault();
      
      socket?.emit('msgToServer', { name: channelName, message: newMessage });
      
      setNewMessage("");
      window.scrollTo(0,document.body.scrollHeight);
  }
   
  useEffect(() => {
      const intervalId = setInterval(() => {
          if(window.location.href != oldURL){
              var url_string = oldURL;
              var url = new URL(url_string);
              const temp = url.searchParams.get('chatId');
              socket?.emit('leaveChannelToServer', temp);
              clearInterval(intervalId);
          }
      }, 1000);
  }, []);

  useEffect(() => {
      (async () => {
          const {data} = await axios.get('user');
          setMyName(data.username);
      }) ()
      // window.scrollTo(0,document.body.scrollHeight);
      if (socket === null)
          setRedirect(true);
      setInfoMsg(joinMsg);
      return () => {

        }
  }, [joinMsg, socket]);

  if (redirect === true)
  {
      return <Navigate to={'/channels'} />;
  }

  if (game === true)
  {
      return <Navigate to={'/gamewaitingroom'} />;
  }
  
  return (
    <Wrapper>
      <div className="chat_name">
        <h2>{channelName}</h2>
        <div className="col-md-12 text-center"><b>{infoMsg}</b></div>
      </div>
      <div className="chat_container">
        <div className="chat_members_list">
          <h5 style={{ padding: '1px' }}><u>Online chat members:</u></h5>
          {onlineUsers.map((onlineUser, index) => {
            if (myName === onlineUser)
            {
              return (
                  
              <li style={{ listStyleType : 'none' }} key={index}>
                  <h6 style={{ padding: '1px', color: 'green' }}>
                      {onlineUser}
                  </h6>
              </li>
              );
            }
            else
            {
              return (
              <li style={{ listStyleType : 'none' }} key={index}>
                <h6 style={{ padding: '1px', color: 'green' }}>
                  {onlineUser} 
                  <form onSubmit={pongGame}>
                    <input type="submit" value="Invite to game" />
                  </form>
                </h6>
              </li>
              );
            }
          }
          )}
        </div>
        <Link className="chat_setting_link" to={`/chat/chatsettings?ChatSettingsId=${channelName}`} type="submit">
          <button className=" btn chat_setting_button">
            settings
          </button>
        </Link>
        <div className="chat_message_container" style={{ backgroundImage: `url(${chatImage})`, borderRadius: '20px', padding: '20px' }}>

          <div className="messages" >
            {messages.map((message: MessageI) => {
              if (myName === message.author.username)
              {
                return (
                  <li style={{listStyleType: 'none' }} key={message.id}>
                      <h5 style={{textAlign: 'right', padding: '10px' }}>
                        <span style={{backgroundColor: '#f1f1f1', borderRadius: '20px', padding: '10px' }}>
                          {message.content}
                        </span>
                      </h5>
                  </li>
                );
              }
              else
              {
                return (
                  <li style={{listStyleType: 'none' }} key={message.id}>
                      <h5 style={{ padding: '10px' }}><span style={{backgroundColor: '#ddd', borderRadius: '2px', padding: '10px'}}><b>{message.author.username}:</b> {message.content}</span></h5>
                  </li>
                );
              }
            })}
          </div>
        </div>
        <div className="chat_input_container">
          <form className="input_container_form" onSubmit={newMsg}>
              <input className="input_container_input" placeholder="message" value={newMessage} size={19} required onChange={e => setNewMessage(e.target.value)}/>
              <button className="input_container_button">send</button>
          </form>
        </div>
    </div >
    </Wrapper>
  );
}

export default Chat;