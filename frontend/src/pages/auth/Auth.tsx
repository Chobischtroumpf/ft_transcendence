import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import background from "../../assets/the_pong.png";
import './Auth.css'

const SignIn = () =>
{
    const [tfaCode, setTfaCode] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        await axios.post("/auth/tfa", {tfaCode: tfaCode}).then(() => {
            setRedirect(true);
        }).catch(() => {
            setError(true);
        }
        );
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

  const handleChange = (event: any) => {
    setTfaCode(event.target.value);
  }

  return(
    <div style={{ backgroundImage: `url(${background})`, width: '100vw', height: '100vh'}}>
      <div>
      <form onSubmit={submit} style={{
          margin: '30% 40%',width: '300px', height: '200px',
          backgroundColor: 'white', color: 'black', border: '2px solid black'
          }}>
        <input
          className="username input"
          type="string"
          name="username"
          placeholder={'two factor authentication code'}
          value={tfaCode}
          onChange={handleChange}
        />
        <button type="submit"><h1>sendCode</h1></button>
      </form>
      </div>
    </div>
  );
}

export default SignIn;

