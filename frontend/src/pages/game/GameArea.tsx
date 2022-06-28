import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { BallClass, GameOptions, gameUpdate, PlayerClass, Sound } from "../../models/game";
import '../game/Game.css';

type Props = {
    socket: Socket | null,
    gameStart: string | null,
    gameUpdate: gameUpdate | null,
    spectator: string | null,
};

const GameArea = ({socket, gameStart, gameUpdate, spectator}: Props) =>
{
    // const [ballx, setBallx] = useState(0);
    const [player1, setPlayer1] = useState<PlayerClass | null>(null);
    const [player2, setPlayer2] = useState<PlayerClass | null>(null);
    const [ball, setBall] = useState<BallClass | null>(null);
    const [option, setOption] = useState<GameOptions | null>(null);
    const [name, setName] = useState('');
    const [sounds, setSounds] = useState<Sound | null>(null);
    const [finished, setFinished] = useState(false);

    window.addEventListener("keydown", function(event) {
        if (event.defaultPrevented)
            return ;  
        switch (event.key) {
            case "ArrowDown":
                socket?.emit('moveDownToServer');
                break ;
            case "ArrowUp":
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

    if (gameStart === null)
    {
        if (spectator === null)
        {
            return(
                <Wrapper>
                    waiting for the other player...
                </Wrapper>
            )
        }
    }

    if (sounds?.loose === true || sounds?.win === true)
    {
        sounds.loose === false;
        sounds.win = false;
        return(
            <Wrapper>
                Game finished!
            </Wrapper>
        )
    }

    return(
        <Wrapper>
            <div>
                
            {/* </div>
            <div className="board">
                <div className='ball'>
                    <div className="ball_effect"></div>
                </div>
                <div className="paddle_1 paddle"></div>
                <div className="paddle_2  paddle"></div> */}
                <h1 className="player_1_score">{player1?.score}</h1>
                <h1 className="player_2_score">{player2?.score}</h1>
                <h1 className="message">
                    Score board
                </h1>
            </div>
            <div>
                ball:
                <br />
                y: {ball?.y}
                <br />
                x: {ball?.x}
                <br />
                paddle1: {player1?.y}
                <br />
                paddle2: {player2?.y}
                gamename: {name}
            </div>
        </Wrapper>
    );
}

export default GameArea;