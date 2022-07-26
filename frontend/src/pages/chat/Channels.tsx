import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { Channel, ChannelStatus } from "../../models/channel";
import io, { Socket } from 'socket.io-client';
import {Link} from "react-router-dom"
import { Navigate } from "react-router";
import ModalMessage from "./ModalMessage"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { SetPasswordDto } from "./chatSettings.dto";
import { User } from "../../models/user"
import { wait } from "@testing-library/user-event/dist/types/utils";
import { waitFor } from "@testing-library/react";

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
  // const [place, setPlace] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const [actionSuccess, setActionSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [gotUsername, setGotUsername] = useState(false);
  const [chatStatus, setChatStatus] = useState("");
  const [currentChannel, setCurrentChannel] = useState<any>("");
  const [checkPwd, setCheckPwd ] = useState(0);

  useEffect(() => {
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

  const join = async (e: SyntheticEvent, channel:Channel) =>
  {
    e.preventDefault();
    setCheckPwd(0);

    const data = await axios.get(`chat/${name}`);
    setCurrentChannel(data.data);
    setChatStatus(data.data.status);

    setCheckPwd(1);
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
      for (let i = 0; i < channel.members.length; i++)
      {
        if (channel.members[i].username === username)
          return true;
      }
    }
    return false;
  }

  if (checkPwd == 1)
  {
    if (currentChannel.status === "protected" && channelHasMember(currentChannel) === false)
      setCheckPwd(2);
    else
    {
      socket?.emit('joinToServer', { name });
      return (<Navigate to={`/chat?chatId=${name}`} />);
    }
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
                          <td>
                            <form onSubmit={e => join(e, channel)}>
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
        { checkPwd == 2 && <ModalPwd socket={socket} chatName={name} />}
        { popupMessage != "" && <ModalMessage message={popupMessage} success={actionSuccess} /> }
      </Wrapper>
    );
  }
  else
  {
    return <div>Loading...</div>
  }
}

interface prop {
	chatName: string,
  socket: Socket | null
}

function ModalPwd({chatName, socket}:prop) {
  const [show, setShow] = useState(true);
  const [goodPwd, setGoodPwd] = useState(0);

  const handleClose = () => setShow(false);

  const handleConfirm = async() => {
      setGoodPwd(0);
			const newpwd = (document.getElementById("new password") as HTMLInputElement).value;

			const adminForm : SetPasswordDto = { name : chatName!, password : newpwd }
      try {
        const data = await axios({
            method: 'post',
            url: "chat/join",
            data: adminForm,
            headers: {'content-type': 'application/json'}
          });
        socket?.emit('joinToServer', adminForm);
        setGoodPwd(1);
      }
      catch (e) {
        console.log("wrong pwd")
        setGoodPwd(2);
      }
	};

  if (goodPwd === 1)
  {
      return (<Navigate to={`/chat?chatId=${chatName}`} />);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Please enter password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<input id='new password' type="text" placeholder="Enter the new password"></input>
				</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {goodPwd == 2 && <ModalMessage message="Wrong password" success={false}/>}
    </>
  );
}

export default Channels;