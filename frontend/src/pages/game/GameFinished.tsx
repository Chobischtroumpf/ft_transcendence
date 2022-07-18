import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Socket } from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Form, Stack } from 'react-bootstrap';
import winnerImage from '../../assets/winner.png';

type Props = {
    winner: string,
};

const GameFinished = ({winner}: Props) =>
{
    return(
        <Wrapper>
            <Card>
                <Card.Img src={winnerImage} />
                <Card.Body>
                    <div className="col-md-12 text-center">
                        <h1>{winner}</h1>
                    </div>
                </Card.Body>
            </Card>
        </Wrapper>
    );
}

export default GameFinished;