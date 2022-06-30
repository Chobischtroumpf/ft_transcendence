import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { BallClass, GameOptions, gameUpdate, PlayerClass, Sound } from "../../models/game";
import '../game/Game.css';

type Props = {
    gameStart: string | null,
    spectator: string | null,
};

const GameWaitingRoom = ({ gameStart, spectator }: Props) =>
{
    if (gameStart === null && spectator === null)
    {
        return(
            <Wrapper>
                waiting for the other player...
            </Wrapper>
        )
    }
    else
    {
        if (spectator !== null)
            return <Navigate to={`/gamearea?gamename=${spectator}`} />;
        else
            return <Navigate to={`/gamearea?gamename=${gameStart}`} />;
    }
    
}

export default GameWaitingRoom;