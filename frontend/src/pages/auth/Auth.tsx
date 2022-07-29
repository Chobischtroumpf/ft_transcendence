import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import background from "../../assets/the_pong.png";
import './Auth.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';

const SignIn = () =>
{
    const [tfaCode, setTfaCode] = useState("");
    const [redirect, setRedirect] = useState(false);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        await axios.post("/auth/tfa", {tfaCode: tfaCode}).then(() => {
            setRedirect(true);
        }).catch(() => {
          window.alert(`There was an error`);
        }
        );
    }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  const handleChange = (event: any) => {
    setTfaCode(event.target.value);
  }

  return(
    <Card bg="dark">
    <Card.Img src={background} height={400} />
    <Card.Body>
    <div className="col-md-12 text-center">
    <form onSubmit={submit}>
    <input
          style={{width: '250px'}}
          className="username input"
          type="string"
          name="username"
          placeholder={'two factor authentication code'}
          value={tfaCode}
          onChange={handleChange}
        />
        <br />
        <Button style={{ width: '250px', height: '100px', backgroundColor: 'white', color: 'black', border: '2px solid black' }}
        type="submit"><h1><b><mark>sendCode</mark></b></h1></Button>
    </form>
    </div>
    </Card.Body>
    </Card>
  );
}

export default SignIn;

