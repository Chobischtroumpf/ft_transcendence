import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import Wrapper from "../../components/Wrapper";
import { encode } from "base64-arraybuffer";
import { User } from "../../models/user";
import './Settings.css'


export interface tfaDto {
  tfa: boolean;
}

const Settings = () => {  

  const [user, setUser] = useState<User>();
  var [username, setUsername] = useState<string>('');
  var [tfa, setTfa] = useState<boolean>(false);
  var [tfaImage, setTfaImage] = useState<string | null>(null);
  const [picturefile, setPictureFile] = useState<File>();
  var [picture, setPicture] = useState<string | undefined>(undefined);
  var [error, setError] = useState<boolean>(false);
  var [tfaCode, setTfaCode] = useState<string>('');

  const [gotUser, setGotUser] = useState<boolean>(false)
  
  useEffect(() => {
  (async () => {
    const { data } = await axios.get("user");
    try {
      setUser(data);
      setGotUser(true);
      // setTfa(data.tfa);
    } catch (e) {
      <Navigate to={'/error500'} />
    }
  }
  )();
  }, []);

  const handleTfaSubmit = async(event: any) => {
    event.preventDefault();
    const data = await axios({
      method: 'post',
      url: "/user/tfa/secret/",
      responseType: 'arraybuffer'
    });
    setTfaImage('data:image/jpeg;base64,' + encode(data.data));
  }

  const handleUsernameSubmit = async(event: any) => {
    event.preventDefault();

    const formData = new FormData();
    if (!username && user)
      setUsername(user.username);
    try {
      const { data } = await axios.post("/user/username", { username: username });
    }
    catch (e) {
      <Navigate to={'/error500'} />
    }
  }

  const handlePictureSubmit = async(event: any) => {
    event.preventDefault();
    let formData = new FormData();
    if (picturefile !== undefined) {
      formData.append("picture", picturefile, picturefile.name);    
    }
    try {
      const { data } = await axios.post("/user/picture", formData, { headers: {'content-type': 'multipart/form-data'}} );
    }
    catch (e) {
      <Navigate to={'/error500'} />
    }
  }

  const handleTfaCodeSubmit = async(event: any) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/user/tfa/turn-on", { tfaCode: tfaCode });
    }
    catch (e) {
      console.log(e);
    }
  }

  const handleChange = (event: any) => {
    setUsername(event.target.value);
  }

  const handleTfaChange = (event: any) => {
    setTfa(event.target.checked);
  }

  const handleTfaCodeChange = (event: any) => {
    setTfaCode(event.target.value);
  }	

  const handlePictureChange = (event: any) => {
    setPicture(URL.createObjectURL(event.target.files[0]));
    setPictureFile(event.target.files[0]);
  }



  return (
    <Wrapper>
      <div className="settings">
        <h1 className="title">Settings</h1>
        {(gotUser) ? (
          <div className="user-name">
            {
              (picture) ?
              (<img className="profile-picture" src={picture} alt="avatar" />) : 
              (<img className="profile-picture" src={`http://localhost:3000/user/picture/${user?.picture}`} alt="avatar" />)
            }
            {(username) && (<h1>{username}'s profile</h1>)}
            {(!username && user?.username) && (<h1>{user?.username}'s profile</h1>)}
          </div>

          ) : 
          (<div><h1>Loading</h1></div>)
      }
        <form onSubmit={handleUsernameSubmit}>
          <input
            className="username input"
            type="string"
            name="username"
            placeholder={user?.username}
            value={username}
            onChange={handleChange}
          />
          <input type="submit" value="Save"/>
        </form>

        <form onSubmit={handlePictureSubmit}>
            <input
              className="picture input"
              type="file"
              name="picture"
              accept="image/png, image/jpeg"
              onChange={handlePictureChange}
            />
            <input type="submit" value="Save"/>
        </form>
        {(user?.) ? (
        <form onSubmit={handleTfaSubmit}>
          <div className="tfa input">
            <input
              className="tfa"
              type="checkbox"
              name="Two Factor Auth"
              value="Two Factor Auth"
              onChange={handleTfaChange}/>
              Two Factor Auth
          </div>
          <input type="submit" value="Save"/>
        </form>
        { (tfaImage) && (
          <div>
            <div className="tfa-qr">
              <img src={tfaImage} alt="tfa-qr" />
            </div>
            <div>
              <h1>Scan the QR code to setup your two factor authentication</h1>
            </div>
            <form onSubmit={handleTfaCodeSubmit}>
            <input className="tfa-code input" type="string" name="tfa-code" placeholder="Enter code" onChange={handleTfaCodeChange} />
            <input type="submit" value="Save"/>
        </form>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Settings;