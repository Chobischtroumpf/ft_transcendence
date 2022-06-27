import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { chat } from "../../models/Chat";
import io, { Socket } from 'socket.io-client';
import {Link} from "react-router-dom"
import { useLocation } from "react-router";


const Chat = () =>
{
 
    const [message, setMessage] = useState('');
    const [User, setName] = useState('');
    const [AllMessage, setAllMessage] = useState('');
    const queryParams = new URLSearchParams(useLocation().search);
    const ChatId= queryParams.get("chatId");
    
    const Send = async (e: SyntheticEvent) =>
    {
      e.preventDefault();
    
      window.location.reload();
    }

    useEffect(() => {
        (
          async () => {
            // const {data} = await axios.get(`chat/message=${chatId}`);
    
          }
        )();
      });
      console.log(ChatId);
      return(
        <Wrapper>  
        <div>
       
        <Link to={`/chat/chatsettings?ChatSettingsId=${ChatId}`} type="submit">settings</Link>
          <input id="inputMessage" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={"message_room"}/>
          {/* <input id='send-message-input' type="texte"  onChange={() => on_change()}></input> */}
          <button onClick={() => handle_send()}>Click me</button>
            <h1>ldllldld</h1>
        </div>
      
          </Wrapper>
      );
      function handle_send()
      {

        (document.getElementById('inputMessage') as HTMLInputElement).value = "";
        
        return ("lll");
      }
      function on_change() 
      {
        return (console.log());
      }
  
}

export default Chat;