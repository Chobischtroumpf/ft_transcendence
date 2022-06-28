import axios from "axios";
import { useLocation } from "react-router";
import React, { SyntheticEvent, useEffect, useState } from "react";

import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineAudioMuted, } from 'react-icons/ai';
import { GoMute, GoUnmute } from 'react-icons/go';
import { RiRotateLockFill, RiAdminLine } from 'react-icons/ri';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';
import './SettingsPage.css'
import Wrapper from "../../components/Wrapper";



// 1 = owner 2 = admin 3 = password=true


const ChatSettings = () =>{
	const queryParams = new URLSearchParams(useLocation().search);
	const ChatId= queryParams.get("ChatSettingsId");

	const [UserStatus, setUserStatus] = useState('');


	// useEffect(() => {
	// 	(
	// 	  async () => {
	// 		const {data} = await axios.get(`chat/all`);
	// 		console.log(data);
	// 	  }
	// 	)();
	//   }, []);

    return(
	<Wrapper>
		<div className='new-user'>
			<h1>
				<u>
					SETTINGS : <p/>
				</u> 
			</h1>
			<AddUser chatId={ChatId}/>
			{ 1 && <AdminUser/>}
			{ (1 || 2) && (<BanUser/>)}
			{ 1 && 3 && (<AddPassword/>)}
			{ 1 && 3 && (<ModifyPassword/>)}
			{ 1 && 3 && (<RemovePassword/>)}
			{ (1 || 2) && (<MuteUser/>)}
			{ (1 || 2) && (<UnmuteUser/>)}
		</div>
		<Link to={`/chat?chatId=${ChatId}`} className="button-return" type="submit">Return</Link>
    </Wrapper>
    );
}
interface prop {
	chatId: string | null
}
const AddUser = (ChatId:prop) => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true); onModalOpen();}
	const handleClose = () => {setState(false);}
	const [userList, setUserList] = useState([]);


	console.log(ChatId.chatId);
	const onModalOpen = async() => {
		try {
			const {data} = await axios.get(`chat/getusers/${ChatId.chatId}`);
			setUserList(data);
			} catch (e) {
				console.log("here")
			}
		};
	
	return (
	<h2>
		Add user : &nbsp;&nbsp;
		<Popup
			trigger={<button><AiOutlineUserAdd/></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className="modal2">
				<button className="close" onClick={handleClose}>&times;</button>
				<div className="header"> Add user</div>
					<div className="content">
					{' '}
					<pre>      Select user to add      </pre>
					</div>
					<div className="actions">
					<Popup
						trigger={<button className="button-return"> Select user </button>}
						modal nested>
						<div className="menu-settings">
							<div className="menu-item-settings"> item 1</div>
							<div className="menu-item-settings"> item 2</div>
							<div className="menu-item-settings"> item 3</div>
						</div>
					</Popup>
				</div>
			</div>
		</Popup>
	</h2>)
}

const AdminUser = () => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true);}
	const handleClose = () => {setState(false);}
	
	return (
	<h2>
		Make a chat user admin : &nbsp;&nbsp;
		<Popup trigger={<button>
			<RiAdminLine /></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className='modal2'>
				<button className="close" onClick={handleClose}>
				&times;
				</button>
				<div className="header"> Make user admin</div>
				<div className="content">
				{' '}
				<pre>  Select a user to give him administrator role  </pre>
				</div>
				<div className="actions">
				<Popup
					trigger={<button className="button-return"> Select user </button>}
					modal nested>
					<div className="menu-settings">
						<div className="menu-item-settings"> item 1</div>
						<div className="menu-item-settings"> item 2</div>
						<div className="menu-item-settings"> item 3</div>
					</div>
				</Popup>
				</div>
			</div>
		</Popup>
	</h2>)
}

const BanUser = () => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true);}
	const handleClose = () => {setState(false);}
	
	return (
	<h2>
		Ban user : &nbsp;&nbsp;
		<Popup trigger={<button>
			<AiOutlineUserDelete /></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className='modal2'>
				<button className="close" onClick={handleClose}>
				&times;
				</button>
				<div className="header"> Ban user</div>
				<div className="content">
				{' '}
				<pre>      Select user to ban from the chanel     </pre>
				</div>
				<div className="actions">
				<Popup
					trigger={<button className="button-return"> Select user </button>}
					modal nested>
					<div className="menu-settings">
						<div className="menu-item-settings"> item 1</div>
						<div className="menu-item-settings"> item 2</div>
						<div className="menu-item-settings"> item 3</div>
					</div>
				</Popup>
				</div>
			</div>
		</Popup>
	</h2>)
}

const AddPassword = () => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true);}
	const handleClose = () => {setState(false);}
	
	return (
	<h2>
		Add password : &nbsp;&nbsp;
		<Popup trigger={<button>
			<GiPadlock /></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className='modal2'>
				<button className="close" onClick={handleClose}>
					&times;
				</button>
				<div className="header"> Add password to channel</div>
				<div className="content">
					{' '}
					<pre>   Please enter a new password   </pre>
				</div>
				<div className="actions">
					<input className="input-width" id='new password' type="text" ></input><button className="button-return">Set password</button>
				</div>
			</div>
		</Popup>
	</h2>)
}

const ModifyPassword = () => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true);}
	const handleClose = () => {setState(false);}
	
	return (
	<h2>
		Modify password : &nbsp;&nbsp;
		<Popup trigger={<button>
			<RiRotateLockFill /></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className='modal2'>
				<button className="close" onClick={handleClose}>
				&times;
				</button>
				<div className="header"> Modify password</div>
				<div className="content">
				{' '}
				<pre>      Enter a new password      </pre>
				</div>
				<div className="actions"><div className="actions">
					<input className="input-width" id='new password' type="text" ></input><button className="button-return">Set new password</button>
				</div>
				</div>
			</div>
		</Popup>
	</h2>)
}

const RemovePassword = () => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true);}
	const handleClose = () => {setState(false);}
	
	return (
	<h2>
		Remove password : &nbsp;&nbsp;
		<Popup trigger={<button>
			<GiPadlockOpen /></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className='modal2'>
				<button className="close" onClick={handleClose}>
				&times;
				</button>
				<div className="header"> Remove password</div>
				<div className="content">
				{' '}
				<pre>    Remove the password   </pre>
				</div>
				<div className="actions">
					<button className="button-return"> Remove password </button>
				</div>
			</div>
		</Popup>
	</h2>)
}

const MuteUser = () => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true);}
	const handleClose = () => {setState(false);}
	
	return (
	<h2>
		Mute user : &nbsp;&nbsp;
		<Popup trigger={<button>
			<GoMute /></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className='modal2'>
				<button className="close" onClick={handleClose}>
				&times;
				</button>
				<div className="header"> Mute user</div>
				<div className="content">
				{' '}
				<pre>      Select user to mute      </pre>
				</div>
				<div className="actions">
				<Popup
					trigger={<button className="button-return"> Select user </button>}
					modal nested>
					<div className="menu-settings">
						<div className="menu-item-settings"> item 1</div>
						<div className="menu-item-settings"> item 2</div>
						<div className="menu-item-settings"> item 3</div>
					</div>
				</Popup>
				</div>
			</div>
		</Popup>
	</h2>)
}

const UnmuteUser = () => {
	const [state, setState] = useState(false); 
	const handleOpen = () => {setState(true);}
	const handleClose = () => {setState(false);}
	
	return (
	<h2>
		Unmute user : &nbsp;&nbsp;
		<Popup trigger={<button>
			<GoUnmute /></button>}
			on='click'
			open={state}
			onClose={handleClose}
			onOpen={handleOpen}
			position='top right' modal nested>
			<div className='modal2'>
				<button className="close" onClick={handleClose}>
				&times;
				</button>
				<div className="header"> Unmute user</div>
				<div className="content">
				{' '}
				<pre>      Select user to unmute      </pre>
				</div>
				<div className="actions">
				<Popup
					trigger={<button className="button-return"> Select user </button>}
					modal nested>
					<div className="menu-settings">
						<div className="menu-item-settings"> item 1</div>
						<div className="menu-item-settings"> item 2</div>
						<div className="menu-item-settings"> item 3</div>
					</div>
				</Popup>
				</div>
			</div>
		</Popup>
	</h2>)
}


export default ChatSettings;