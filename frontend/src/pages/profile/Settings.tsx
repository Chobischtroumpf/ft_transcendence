import axios from "axios";
import { useState, useEffect } from "react";
import Wrapper from "../../components/Wrapper";


const Settings = () => {  
  const [formValue, setformValue] = useState({
    username: '',
    tfa: false,
    picture: File
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();

    // we will fill this in the coming paragraph
  }

  const handleChange = (event: any) => {
    setformValue({
      ...formValue,
      username: event.target.value
    });
  }

  const handleFileChange = (event: any) => {
    setformValue({
      ...formValue,
      picture: event.target.files[0]
    });
  }

  const handleTfaChange = (event: any) => {
    setformValue({
      ...formValue,
      tfa: event.target.checked
    });
  }

  return (
    <Wrapper>
      <div>
        <h1>Settings</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="string"
            name="username"
            placeholder="change username"
            value={formValue.username}
            onChange={handleChange}
          />
          <input
            type="checkbox"
            name="Two Factor Auth"
            value="Two Factor Auth"
            onChange={handleTfaChange}/>
            Two Factor Auth    
          {/* </input> */}
          <input
            type="file"
            name="profilePicture"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
          <button type="submit" onSubmit={handleSubmit}>
            Save
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

export default Settings;