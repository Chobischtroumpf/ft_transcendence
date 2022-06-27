// import axios from "axios";
// import React, { SyntheticEvent, useEffect, useState } from "react";
// import Wrapper from "../../components/Wrapper";
// import { MessageI } from "../../models/Chat";
// import io, { Socket } from 'socket.io-client';
// import {Link} from "react-router-dom"
// import { useLocation } from "react-router";

import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { MessageI } from "../../models/Chat";
import styled from "styled-components"

type Props = {
  socket: Socket | null,
  joinMsg: string,
  channelName: string,
  messages: MessageI[],
};

const Chat = ({socket, joinMsg, channelName, messages}: Props) =>
{
    const [newMessage, setNewMessage] = useState('');
    const [infoMsg, setInfoMsg] = useState(joinMsg);
    const [redirect, setRedirect] = useState(false);
    
    const newMsg = async (e: SyntheticEvent) =>
    {
        e.preventDefault();
        socket?.emit('msgToServer', { name: channelName, message: newMessage });
    }

    // function ChatInput({})
    useEffect(() => {
        if (socket === null)
            setRedirect(true);
        setInfoMsg(joinMsg);
        return () => {
            // leave channel emit here
          }
    }, [joinMsg, socket]);

    if (redirect === true)
    {
        // leave channel emit here
        return <Navigate to={'/channels'} />;
    }
    function handle_send(newmess:string)
      {
        console.log(newmess);
        // (document.getElementById('inputMessage') as HTMLInputElement).value = "";
        // const {data} = await axios.post(`/chat/createmessage`,{ ,newmess} );
        return ("");
      }

    return (
      <Wrapper>
        <ChatContainer>
          <h1>Chat</h1>
          {/* <form></> */}
          <Header>
            <HeaderLeft>
              <h4><strong>#Rome-Name
                </strong></h4>
            </HeaderLeft>
            <HeaderRigth></HeaderRigth>

          </Header>
        </ChatContainer>
      </Wrapper>
     
    );
}

const HeaderRigth = styled.div``;
const HeaderLeft = styled.div``;

const Header = styled.div`

`;

const ChatContainer = styled.div`

  flex: 0.7;
  flex-frow: 1;
  overflow-y: scroll;
  margin-top: 40px;
`









// const Chat = () =>
// {
 
//     const [message, setMessage] = useState('');
//     const [User, setName] = useState('');
//     const [AllMessage, setAllMessage] = useState('');
//     const queryParams = new URLSearchParams(useLocation().search);
//     const ChatId= queryParams.get("chatId");
    
//     const Send = async (e: SyntheticEvent) =>
//     {
//       e.preventDefault();
    
//       window.location.reload();
//     }

//     useEffect(() => {
//         (
//           async () => {
    
//           }
//         )();
//       });
//       console.log(ChatId);
//       return(
//         <Wrapper>  
//         <div>
       
//         <Link to={`/chat/chatsettings?ChatSettingsId=${ChatId}`} type="submit">settings</Link>
//           <input id="inputMessage" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={"message_room"}/>
//           {/* <input id='send-message-input' type="texte"  onChange={() => on_change()}></input> */}
//           <button onClick={() => handle_send()}>Click me</button>
//             <h1>ldllldld</h1>
//         </div>
      
//           </Wrapper>
//       );
//       function handle_send()
//       {

//         (document.getElementById('inputMessage') as HTMLInputElement).value = "";
        
//         return ("lll");
//       }
//       function on_change() 
//       {
//         return (console.log());
//       }
  
// }

export default Chat;