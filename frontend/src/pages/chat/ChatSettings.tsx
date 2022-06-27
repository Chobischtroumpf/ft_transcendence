
import Wrapper from "../../components/Wrapper";
import { useLocation } from "react-router";
import React, { SyntheticEvent, useEffect, useState } from "react";




const ChatSettings = () =>{

    const [message, setMessage] = useState('');
    const [User, setName] = useState('');
    const [AllMessage, setAllMessage] = useState('');
    const queryParams = new URLSearchParams(useLocation().search);
    const ChatId= queryParams.get("ChatSettingsId")
    

    return(
        <Wrapper>
            <div>

                <h1>Chat Setting</h1>
            </div>  
        </Wrapper>
    );
}

export default ChatSettings;