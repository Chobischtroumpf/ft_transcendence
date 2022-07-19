import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import background from "../../assets/the_pong.png";

const SignIn = () =>
{
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);

    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();
      const myWindow = window.open('http://localhost:3000/auth/42');
      const interval = setInterval(async () => {
        if (getCookie("access_token") !== null) {      
          myWindow?.close();
         setRedirect(true);
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
    return <Navigate to={'/auth/tfa'} />
  }

  return(
    <div style={{ backgroundImage: `url(${background})` }}>
      <div>
        <form onSubmit={submit}>
          <button style={{
            margin: '40vh 30vw', width: '300px', height: '200px',
            backgroundColor: 'white', color: 'black', border: '2px solid black'
            }} type="submit"><h1><b><mark>42 SignIn</mark></b></h1></button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;

