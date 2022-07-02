// // import axios from "axios";
// // import React, { SyntheticEvent, useEffect, useState } from "react";
// // import Wrapper from "../../components/Wrapper";
// // import { MessageI } from "../../models/Chat";
// // import io, { Socket } from 'socket.io-client';
// // import { useLocation } from "react-router";

// import axios from "axios";
// import React, { SyntheticEvent, useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router";
// import { Socket } from "socket.io-client";
// import Wrapper from "../../components/Wrapper";
// import { MessageI } from "../../models/Chat";

// import {Link} from "react-router-dom"

// type Props = {
//   socket: Socket | null,
//   joinMsg: string,
//   channelName: string,
//   messages: MessageI[],
// };

// type CreateMessageToChatDto = 
// {
//     name: string;
//     message: string;
// }

// const Chat = ({socket, joinMsg, channelName, messages}: Props) =>
// {
//     // var sender: MessageSend = {message: '', name : 1};
//     const [newMessage, setNewMessage] = useState('');
//     const [infoMsg, setInfoMsg] = useState(joinMsg);
//     const [redirect, setRedirect] = useState(false);
//     const queryParams = new URLSearchParams(useLocation().search);
//     const ChatId= queryParams.get("chatId");

    
//     const newMsg = async (e: SyntheticEvent) =>
//     {
//         e.preventDefault();
//         var sender : CreateMessageToChatDto = { name : "nnn", message: newMessage};

//         console.log(ChatId);
//         console.log(newMessage);
//         console.log(infoMsg);

//         // sender.append('name', 'nnn');
//         // sender.append('message', newMessage);
//         // console.log(tmp.data);
//         // sender.name = tmp.data.username;
//         // sender.message = newMessage;
//         (document.getElementById('inputMessage') as HTMLInputElement).value = "";

//         await axios({
//           method: 'post',
//           url: "/chat/createmessage/",
//           data: sender,
//           headers: {'content-type': 'application/json'}
//         })
//        const tmp =  await axios.get(`/chat/messages/nnn`);
//        console.log(tmp);
//         return ("");
//         // socket?.emit('msgToServer', { name: channelName, message: newMessage });
//     }

//     useEffect(() => {
//         if (socket === null)
//             setRedirect(true);
//         setInfoMsg(joinMsg);
//         return () => {
//             // leave channel emit here
//           }
//     }, [joinMsg, socket]);

//     // if (redirect === true)
//     // {
//     //     // leave channel emit here
//     //     return <Navigate to={'/channels'} />;
//     // }
//     function handle_send(newmess:string)
//       {
//         // console.log(newmess);
//         // console.log("je suis icic");
//       }

//     return (
//       <Wrapper>
//         <ChatContainer>
          
//           <Header>
//               <h4><strong>#Rome-Name
//                 </strong></h4>
//           </Header>
//           <Link to={`/chat/chatsettings?ChatSettingsId=${ChatId}`} type="submit">settings</Link>
//           <h1>{newMessage}</h1>
//           <ChatInputContainer>
//               <form onSubmit={newMsg}>
//                     <input id="inputMessage" value={newMessage}  size={19} required onChange={e => setNewMessage(e.target.value)}/>
//                     <button onClick={() => handle_send(newMessage)}>Click me</button>
//                 </form>
//             </ChatInputContainer>
//         </ChatContainer>
//       </Wrapper>
     
//     );
// }

import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { MessageI } from "../../models/Chat";
import styled from "styled-components"
import { GiSleepy } from "react-icons/gi";
import axios from "axios";
import { tmpdir } from "os";

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
    const [base64, setBase64] = useState();
 
    const newMsg = async (e: SyntheticEvent) =>
    {
        e.preventDefault();
        
        socket?.emit('msgToServer', { name: channelName, message: newMessage });
        console.log(messages);
        window.scrollTo(0,document.body.scrollHeight);
        setNewMessage("");
    }

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
    // window.scrollTo(0,document.body.scrollHeight);
    return (
        <Wrapper>

            <div>{infoMsg}</div>
            <ChatContainer>
            <ChatInputContainer>
            <form onSubmit={newMsg}>
                <input placeholder="message" id="inputMessage" value={newMessage} size={19} required onChange={e => setNewMessage(e.target.value)}/>
                <button> send </button>
            </form>
            </ChatInputContainer>
            <div>
            {messages.map((message: MessageI) => {
                console.log(message.author.picture);
                return (
                    <li key={message.id}>
                        <h4>{message.content}</h4>
                        <hr></hr>
                        <h5>{message.author.username}</h5>
                        
                    </li>
                );
                
            })}
            </div>
            </ChatContainer>
        </Wrapper>
    );
}

export default Chat;


const ChatContainer = styled.div`

  flex: 0.7;
  flex-frow: 1;
  overflow-y: scroll;
  margin-top: 40px;
`
const ChatInputContainer = styled.div`
    
  border-radius: 20px;
    
    > form {
      position: relative;
      display: flex;
      justify-content: center;
    }

    > form > input {
      position: fixed;
      bottom: 4px;
      width: 80%;
      border: 1px solid gray;
      border-radius: 20px;
      padding: 10px;
      outline: none; 
    }
    
    > form > button {
      display: none !important ;
    }
`;