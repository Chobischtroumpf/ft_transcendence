import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { Channel, ChannelStatus } from "../../models/channel";
import io, { Socket } from 'socket.io-client';
import {Link} from "react-router-dom"
import { Navigate } from "react-router";
import ModalMessage from "./ModalMessage"
import ModalPwd from "./ModalPwd"

type Props = {
  socket: Socket | null,
  channels: Channel[],
  lastPage: number,
};

const Channels = ({socket, channels, lastPage}: Props) =>
{
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(ChannelStatus.public);
  const [place, setPlace] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const [actionSuccess, setActionSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [gotUsername, setGotUsername] = useState(false);

  console.log("place: ",place);
  useEffect(() => {
    console.log("here");
    socket?.emit('getChannelsToServer', page);
    getUser().then((username) => {
      setUsername(username);
      setGotUsername(true);
    }, (error) => {
      console.log(error);
    } 
    );
  }, [page, socket, username]);

  const getUser = async () => {
      try {
        console.log("here");
        let temp = await axios.get('/user');
        return temp.data.username;
      }catch (e) {
        console.log(e);
      }
    }


  const submit = async (e: SyntheticEvent) =>
  {
    e.preventDefault();
    setPopupMessage("");

    try {
    if (status === ChannelStatus.public)
      await axios.post('chat/public', { name });
    else if (status === ChannelStatus.protected)
      await axios.post('chat/protected', { name, password });
    else if (status === ChannelStatus.private)
      await axios.post('chat/private', { name });
    socket?.emit('getChannelsToServer', page);
    setPopupMessage("Channel " + name + " successfully created");
    setActionSuccess(true);}
    catch (e:any) {
      setPopupMessage(e.response.data.error);
      setActionSuccess(false);
    }
  }

  const join = async (e: SyntheticEvent, channelName: string) =>
  {
    e.preventDefault();

    const data = await axios.get(`chat/${channelName}`);
    // console.log(data.data.status);
    if (data.data.status !== "public")
    {
      try {
        // console.log("here");
        return <ModalPwd chatName={channelName}/>
      }
      catch (e) {
        return ;
      }
    }
    setPlace(true);
  }

  const leave = async (e: SyntheticEvent, channelId: number) =>
  {
    e.preventDefault();
    setPopupMessage("");

    try {
      await axios.delete(`chat/leave/${channelId}`);
      socket?.emit('getChannelsToServer', page);
      setPopupMessage("Channel successfully left");
      setActionSuccess(true);
    }
    catch (e:any) {
      setPopupMessage(e.response.data.message);
      setActionSuccess(false);
    }
  }

  const chanDelete = async (e: SyntheticEvent, channelId: number) =>
  {
    e.preventDefault();
    setPopupMessage("");

    try {
      await axios.delete(`chat/delete/${channelId}`);
      socket?.emit('getChannelsToServer', page);
      setPopupMessage("Channel successfully deleted");
      setActionSuccess(true);
    }
      catch(e:any)
    {
      setPopupMessage(e.response.data.message);
      setActionSuccess(false);
    }
  }

  const next = () =>
  {
    if (page < lastPage)
      setPage(page + 1);
  }

  const prev = () =>
  {
    if (page >= 2)
      setPage(page - 1);
  }

  const channelHasMember = (channel: Channel) =>
  {
    if (channel.members.length > 0)
    {
      console.log(channel.members);
      console.log (username);
      for (let i = 0; i < channel.members.length; i++)
      {
        if (channel.members[i].username === username)
          return true;
      }
    }
    return false;
  }

  if (place === true)
  {
      socket?.emit('joinToServer', { name });
      return <Navigate to={`/chat?chatId=${name}`} />;
  }

  if (gotUsername)
  {
    return (
      <Wrapper>
          <div className="table-responsive">
            <form onSubmit={submit}>
              <h4>Create a channel</h4>
              <input placeholder="name" size={19} required onChange={e => setName(e.target.value)}/>
              <br />
              <input placeholder="password" size={19} onChange={e => setPassword(e.target.value)}/>
              <br />
              <input type={"radio"} name="radio" onChange={e => setStatus(ChannelStatus.public)}/> public <br/>
              <input type={"radio"} name="radio" onChange={e => setStatus(ChannelStatus.protected)}/> protected <br/>
              <input type={"radio"} name="radio" onChange={e => setStatus(ChannelStatus.private)}/> private <br/>
              <button type="submit">Create</button>
            </form>
            <br/>
            <br/>
            <table className="table table-striped table-sm">
              
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">name</th>
                  <th scope="col">status</th>
                  <th scope="col">join</th>
                  <th scope="col">leave</th>
                  <th scope="col">delete</th>
                </tr>
              </thead>
              <tbody>
              {
                channels.map((channel: Channel) => 
                {
                  {
                    return (
                      ((channel.status !== ChannelStatus.direct && channel.status !== ChannelStatus.private) || channelHasMember(channel) === true) &&
                        (<tr key={channel.id}>
                          <td>{channel.id}</td>
                          <td>{channel.name}</td>
                          <td>{channel.status}</td>
                          {/* {(console.log(channel.owner))} */}
                          <td>
                            <form onSubmit={e => join(e, channel.name)}>
                              <button onClick={e => setName(channel.name)} type="submit">Join</button>
                            </form>
                          </td>
                          <td>
                              <button onClick={e => leave(e, channel.id)} type="submit">Leave</button>
                          </td>
                          <td>
                            <button onClick={e => chanDelete(e, channel.id)} type="submit">Delete</button>
                          </td>
                        </tr>
                        )
                      )
                  }
                }
                )
              }
              </tbody>
            </table>
          </div>
        <nav>
          <ul className="pagination">
              <li className="page-item">
                <a href="#" className="page-link" onClick={prev}>Previous</a>
              </li>
              <li className="page-item">
                <a href="#" className="page-link" onClick={next}>Next</a>
              </li>
          </ul>
        </nav>		
        { popupMessage != "" && <ModalMessage message={popupMessage} success={actionSuccess} /> }
      </Wrapper>
    );
  }
  else
  {
    return <div>Loading...</div>
  }
}

export default Channels;