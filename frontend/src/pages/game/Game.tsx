import React, { SyntheticEvent, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { Socket } from 'socket.io-client';
import background from "../../assets/pong.png";
import { User } from "../../models/user";
import axios from "axios";
import { GameClass, gameNames, Invite } from "../../models/game";
import './Game.css';
import { Navigate } from "react-router";

type Props = {
    socket: Socket | null,
    games: gameNames[],
    invites: any[],
};

const Game = ({socket, games, invites}: Props) =>
{
    const [place, setPlace] = useState<string | null>(null);
    const [paddleSize, setPaddleSize] = useState(40);
    const [paddleSpeed, setPaddleSpeed] = useState(6);
    const [ballSpeed, setBallSpeed] = useState(3);
    const [invitedUser, setInvitedUser] = useState<string | null>(null);
    const [matchMaking, setMatchMaking] = useState(false);
    const [player2, setPlayer2] = useState<User | null>(null);
    const [acceptInvite, setAcceptInvite] = useState(false);
    const [allGames, setAllGames] = useState<GameClass | null>(null);
    const [name, setName] = useState('');
    const [inviter, setInviter] = useState<string | null>(null);

    useEffect(() => {
        setPlace(null);
    }, []);

    const spectatorJoin = async (e: SyntheticEvent) =>
    {
      e.preventDefault();
      socket?.emit('newSpectatorToServer', { room: name });
      setPlace("queue"); // change it later, go to spectating game
    }

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setPlace("option");
    }

    const submit_spectator = async (e: SyntheticEvent) => {
        e.preventDefault();
        socket?.emit('getGamesToServer');
        setPlace("matches_list");
    }

    const options = async (e: SyntheticEvent) => {
        e.preventDefault();
        const {data} = await axios.get(`http://localhost:3000/user/get/user?username=${invitedUser}`);
        if (data === '')
        {
            window.alert(`User: (${invitedUser}) doesn't exists, try again`);
            setPlace(null);
            return ;
        }
        const id = data.id;
        socket?.emit('addInviteToServer', {id, paddleSize, paddleSpeed, ballSpeed});
        setPlace("queue");
    }

    const queue = async (e: SyntheticEvent) => {
        e.preventDefault();
        socket?.emit('JoinQueueToServer');
        setPlace("queue");
    }

    const Join = async (e: SyntheticEvent) =>
    {
        e.preventDefault();
        setPlace("join");
    }

    if (place === "join")
    {
        socket?.emit('acceptInviteToServer', inviter);
        return <Navigate to={'/gamewaitingroom'} />;
    }
    
    if (place === "queue")
    {
        // socket?.emit('nullToServer');
        return <Navigate to={'/gamewaitingroom'} />;
    }

    if (place === "matches_list")
    {
        return(
            <Wrapper>
                <div>
                <table className="table table-striped table-sm"> 
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">name</th>
                        <th scope="col">join</th>
                    </tr>
                    </thead>
                    <tbody>
                    {games.map((game: gameNames) => {
                        return (
                        <tr key={game.id}>
                            <td>{game.id}</td>
                            <td>{game.name}</td>
                            <td>
                            <form onSubmit={spectatorJoin}>
                                <button onClick={e => setName(game.name)} type="submit">Join</button>
                            </form>
                            </td>
                        </tr>  
                        )
                    })}
                    </tbody>
                </table>
                </div>
            </Wrapper>
        )
    }

    if (place === "option")
    {
        return(
            <Wrapper>
                 <div style={{ width: "878px", height: "776px", backgroundImage: `url(${background})` }}>
                    <input style={{
                        background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                        // margin: '250px 30px',
                        padding: "13px 0",
                        width: "100px",
                        height: "50px",
                        border: "ridge",
                        borderColor: "gray",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontFamily: "Optima, sans-serif"
                    }} placeholder="invitedUser" onChange={e => setInvitedUser(e.target.value)}/>
                    <input style={{
                        background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                        // margin: '250px 30px',
                        padding: "13px 0",
                        width: "100px",
                        height: "50px",
                        border: "ridge",
                        borderColor: "gray",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontFamily: "Optima, sans-serif"
                    }} placeholder="paddleSize" required defaultValue={40} onChange={e => setPaddleSize(parseInt(e.target.value))}/>
                    <input style={{
                        background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                        padding: "13px 0",
                        width: "100px",
                        height: "50px",
                        border: "ridge",
                        borderColor: "gray",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontFamily: "Optima, sans-serif"
                    }} placeholder="paddleSpeed" size={19} required defaultValue={6} onChange={e => setPaddleSpeed(parseInt(e.target.value))}/>
                    <input style={{
                        background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                        // margin: '150px 30px',
                        padding: "13px 0",
                        width: "100px",
                        height: "50px",
                        border: "ridge",
                        borderColor: "gray",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontFamily: "Optima, sans-serif"
                    }} placeholder="ballSpeed" size={19} required defaultValue={3} onChange={e => setBallSpeed(parseInt(e.target.value))}/>
                    <div>
                    <form onSubmit={options}>
                        <button style={{
                            background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                            padding: "13px 0",
                            width: "200px",
                            height: "100px",
                            border: "ridge",
                            borderColor: "gray",
                            borderRadius: "20px",
                            color: "white",
                            fontWeight: "bold",
                            fontFamily: "Optima, sans-serif"
                        }} type="submit">Start Game With Invited User</button>
                    </form>
                    <form onSubmit={queue}>
                        <button style={{
                                background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                                padding: "13px 0",
                                width: "200px",
                                height: "100px",
                                border: "ridge",
                                borderColor: "gray",
                                borderRadius: "20px",
                                color: "white",
                                fontWeight: "bold",
                                fontFamily: "Optima, sans-serif"
                        }} type="submit">Join Queue And Start Game</button>
                    </form>
                    </div>
                    <div>
                        <table className="table table-striped table-sm"> 
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Player who invited</th>
                            <th scope="col">Join to game</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invites.map((invite: Invite) => {
                            return (
                            <tr key={invite.id}>
                                <td>{invite.id}</td>
                                <td>{invite.username}</td>
                                <td>
                                <form onSubmit={Join}>
                                    <button onClick={e => setInviter(invite.username)} type="submit">Join</button>
                                </form>
                                </td>
                            </tr>  
                            )
                        })}
                        </tbody>
                        </table>
                    </div>
            </div>
            </Wrapper>
        )
    }

    return(
        <Wrapper>
            <div style={{ width: "878px", height: "776px", backgroundImage: `url(${background})` }}>
                <div>
                    <form onSubmit={submit}>
                        <button style={{
                            background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                            padding: "13px 0",
                            width: "200px",
                            height: "100px",
                            border: "ridge",
                            borderColor: "gray",
                            borderRadius: "20px",
                            color: "white",
                            fontWeight: "bold",
                            fontFamily: "Optima, sans-serif"
                        }} type="submit">Game Options</button>
                    </form>
                    <form onSubmit={submit_spectator}>
                        <button style={{
                            background: "linear-gradient(81.4deg, #BC8F8F 0%, #CD5C5C 100%)",
                            padding: "13px 0",
                            width: "200px",
                            height: "100px",
                            border: "ridge",
                            borderColor: "gray",
                            borderRadius: "20px",
                            color: "white",
                            fontWeight: "bold",
                            fontFamily: "Optima, sans-serif"
                        }} type="submit">On Going Games</button>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
}
export default Game;