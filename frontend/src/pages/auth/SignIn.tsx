import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import background from "../../assets/the_pong.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';

const SignIn = () =>
{
    const [redirectTFA, setRedirectTFA] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);

    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();
      const myWindow = window.open('http://localhost:3000/auth/42');
      const interval = setInterval(async () => {
        if (getCookie("access_token") !== null) {   
          var tfaEnabled = false;
          async () => {
            try {
              await axios.get('user');
              tfaEnabled = false
            } catch (e) {
              tfaEnabled = true
            }
          }
          if (tfaEnabled) {
            setRedirectTFA(true);
          }
          else {
            setRedirect(true);
          }
          myWindow?.close();
          clearInterval(interval);
        }
      }, 1000);

      // return () => clearInterval(interval);
    }

  function getCookie(name: string): string | null {
    const nameLenPlus = (name.length + 1);
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map(cookie => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null;
  }
  
    if (redirect) {
      return <Navigate to={'/'} />
    }

  if (redirectTFA) {
    return <Navigate to={'/auth/tfa'} />
  }

  return(
    <Card bg="dark">
    <Card.Img src={background} height={400} />
    <Card.Body>
    <div className="col-md-12 text-center">
    <form onSubmit={submit}>
        <Button style={{ width: '250px', height: '100px', backgroundColor: 'white', color: 'black', border: '2px solid black' }}
        type="submit"><h1><b><mark>42 SignIn</mark></b></h1></Button>
    </form>
    </div>
    </Card.Body>
</Card>
  );
}

export default SignIn;

