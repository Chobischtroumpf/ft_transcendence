import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { BallClass, GameOptions, gameUpdate, PlayerClass, Sound } from "../../models/game";
import '../game/Game.css';

type Props = {
    socket: Socket | null,
    gameUpdate: gameUpdate | null,
    gameWinner: string | null,
};

const GameArea = ({socket, gameUpdate, gameWinner }: Props) =>
{
    const [player1, setPlayer1] = useState<PlayerClass | null>(null);
    const [player2, setPlayer2] = useState<PlayerClass | null>(null);
    const [ball, setBall] = useState<BallClass | null>(null);
    const [option, setOption] = useState<GameOptions | null>(null);
    const [name, setName] = useState('');
    const [sounds, setSounds] = useState<Sound | null>(null);
    const [place, setPlace] = useState<string | null>(null);

    const style = {
        border: '1px solid black',
    };

    const leave = async (e: SyntheticEvent) => {
        e.preventDefault();
        socket?.emit('leaveGameToServer', name);
    }

    window.addEventListener("keydown", function(event) {
        if (event.defaultPrevented)
            return ;  
        switch (event.key) {
            case "ArrowUp":
                socket?.emit('moveDownToServer');
                break ;
            case "ArrowDown":
                socket?.emit('moveUpToServer');
                break ;
            default:
                return ;
        }
        event.preventDefault();
    }, true);

    useEffect(() => {
        if (gameUpdate !== null)
        {
            setPlayer1(gameUpdate.player1);
            setPlayer2(gameUpdate.player2);
            setBall(gameUpdate.ball);
            setOption(gameUpdate.options);
            setName(gameUpdate.name);
            setSounds(gameUpdate.sounds);
        }
    }, [gameUpdate]);

    // after game is done, you need to refresh page to get gamefinished page away, need to fix that

    if (gameWinner !== '')
    {
        // socket?.emit('nullGameStartToServer');
        return <Navigate to={'/gamefinished'} />
    }

    return(
        <Wrapper>
            <div>
                {name}
                <svg
                    id="aliens-go-home-canvas"
                    preserveAspectRatio="xMaxYMax none"
                    style={style}
                    width="300px"
                    height="200px"
                >
                    
                    <rect x={10} y={player1?.y} width={10} height={option?.paddleSize} />
                    <rect x={280} y={player2?.y} width={10} height={option?.paddleSize} />
                    <circle cx={ball?.x} cy={ball?.y} r={ball?.size} />
                </svg>
                <h1 className="player_1_score">{player1?.score}</h1>
                <h1 className="player_2_score">{player2?.score}</h1>
                <h1 className="message">
                    Score board
                </h1>
            </div>
            <div>
                <form onSubmit={leave}>
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
                    }} type="submit">Leave Game</button>
                </form>
            </div>
        </Wrapper>
    );
}

export default GameArea;