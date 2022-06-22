import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import Wrapper from "../../components/Wrapper";
import './Settings.css'

const Settings = () => {  

  
  const [username, setUsername] = useState<string>();
  const [prevusername, setPrevUsername] = useState<string>();
  const [tfa, setTfa] = useState(false);
  const [picture, setPicture] = useState<string>();
  const [picturefile, setPictureFile] = useState<File>();
  
  useEffect(() => {
    (async () => {
      const { data } = await axios.get("user");
      try {
        setPrevUsername(data.username);
        setTfa(data.tfa);
      } catch (e) {
        <Navigate to={'/error500'} />
      }
    }
    )();
  }, []);

  // const handleSubmit = async(event: any) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   if (username)
  //     formData.append("username", username);
  //   else if (prevusername)
  //     formData.append("username", prevusername);
  //   formData.append("tfa", tfa.toString());
  //   if (picturefile !== undefined) {
  //     formData.append("picture", picturefile);
  //   }

  //   try {
  //     const { data } = await axios.post("user/update", formData);
  //     console.log(data);
  //   }
  //   catch (e) {
  //     <Navigate to={'/error500'} />
  //   }
  // }

  const handleTfaSubmit = async(event: any) => {
    event.preventDefault();
    axios.post("user/tfa/turn-on").then(() => {
      setTfa(true);
    
    }


  const handlePictureSubmit = async(event: any) => {
    event.preventDefault();
    const formData = new FormData();
    if (picturefile !== undefined) {
      formData.append("picture", picturefile);
    }
    try {
      const { data } = await axios.post("user/picture", formData);
      console.log(data);
    }
    catch (e) {
      <Navigate to={'/error500'} />
    }
  }

  const handleChange = (event: any) => {
    setUsername(event.target.value);
  }

  const handlePictureChange = (event: any) => {
    setPicture(URL.createObjectURL(event.target.files[0]));
  }

  const handleTfaChange = (event: any) => {
    setTfa(event.target.checked);
  }

  return (
    <Wrapper>
      <div className="settings">
        <h1 className="title">Settings</h1>
        { (username) && (
            <div className="user-name">
            <img className="profile-picture" src={picture} alt="avatar" />
            <h1>{username}'s profile</h1>
            </div>
          )}
          { (prevusername) && (!username) && (
            <div className="user-name">
            <img className="profile-picture" src={picture} alt="avatar" />
            <h1>{prevusername}'s profile</h1>
            </div>
          )}
          
        <form onSubmit={handleSubmit}>
          <input
            className="username input"
            type="string"
            name="username"
            placeholder={prevusername}
            value={username}
            onChange={handleChange}
          />
          <input type="button" value="Save"/>
        </form>

        <form onSubmit={handlePictureSubmit}>
            <input
              className="picture input"
              type="file"
              name="picture"
              accept="image/png, image/jpeg"
              onChange={handlePictureChange}
            />
            <input type="button" value="Save"/>
        </form>

        <form onSubmit={handleTfaChange}>
          <div className="tfa input">
            <input
              className="tfa"
              type="checkbox"
              name="Two Factor Auth"
              value="Two Factor Auth"
              onChange={handleTfaChange}/>
              Two Factor Auth
          </div>
          <input type="button" value="Save"/>
        </form>
      </div>
    </Wrapper>
  );
};

export default Settings;