import React from 'react';
import { Link } from 'react-router-dom';
import Wrapper from "../../components/Wrapper";
import errorPng from "../../assets/Error500.png"

const Error500 = () => (
	<Wrapper>
  <div>
    <img src={errorPng}/>
    <Link to="/">Go Home</Link>
  </div></Wrapper>
);

export default Error500;