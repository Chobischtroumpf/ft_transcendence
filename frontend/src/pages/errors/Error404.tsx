import React from 'react';
import { Link } from 'react-router-dom';
import Wrapper from "../../components/Wrapper";
import errorPng from "../../assets/Error404.png"

const Error404 = () => (
	<Wrapper>
  <div>
    <img src={errorPng}/>
    <Link to="/">Go Home</Link>
  </div></Wrapper>
);

export default Error404;