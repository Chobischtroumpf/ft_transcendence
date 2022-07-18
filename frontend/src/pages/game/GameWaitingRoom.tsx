import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { BallClass, GameOptions, gameUpdate, PlayerClass, Sound } from "../../models/game";
import '../game/Game.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Form, Stack } from 'react-bootstrap';
import waitingImage from "../../assets/waitingroom.png";

type Props = {
    gameStart: string | null,
    spectator: string | null,
    socket: Socket | null,
};

const GameWaitingRoom = ({ gameStart, spectator, socket }: Props) =>
{
    const [place, setPlace] = useState<string | null>(null);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        socket?.emit('leaveQueueToServer');
        setPlace("leave");
    }

    if (place === "leave")
    {
        return <Navigate to={'/game'} />;
    }

    if (gameStart === null && spectator === null)
    {
        return(
            <Wrapper>
                <Card>
                    <Card.Img src={waitingImage} />
                    <Card.ImgOverlay>
                    <div className="col-md-12 text-center">
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
                            }} type="submit">Leave queue</button>
                        </form>
                    </div>
                    </Card.ImgOverlay>
                </Card>
                
            </Wrapper>
        )
    }
    else
    {
        if (spectator !== null)
            return <Navigate to={`/gamearea?gamename=${spectator}`} />;
        else
        {
            console.log(gameStart);
            return <Navigate to={`/gamearea?gamename=${gameStart}`} />;
        }
    }
    
}

export default GameWaitingRoom;