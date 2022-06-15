import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { Chat } from "../../models/Chat";
import io, { Socket } from 'socket.io-client';


const Chat = () =>
{

    const [message, setMessage ] = useState([]);
    const [User, setName] = useState('');
    const [AllMessage, setAllMessage] = useState('');
    const Send = async (e: SyntheticEvent) =>
    {
      e.preventDefault();
    
    //   window.location.reload();
    }

    useEffect(() => {
        (
          async () => {
            const {data} = await axios.get(`chat/all?page=${page}`);
    
            setChannels(data.data);
            setLastPage(data.meta.last_page);
          }
        )();
      }, [page]);

      return ();
}

export default Chat;