import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";

type Props = {
    winner: string,
};

const GameFinished = ({winner}: Props) =>
{
    return(
        <Wrapper>
            <div>
                <h1>Winner is: {winner}</h1>
            </div>
        </Wrapper>
    );
}

export default GameFinished;