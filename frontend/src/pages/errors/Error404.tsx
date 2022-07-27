import React from 'react';
import { Link } from 'react-router-dom';
import Wrapper from "../../components/Wrapper";

const Error404 = () => (
	<Wrapper>
  <div>
    <h1>404 - Not Found!</h1>
    <Link to="/">Go Home</Link>
  </div></Wrapper>
);

export default Error404;