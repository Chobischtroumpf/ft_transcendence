import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/user"
import { useLocation } from "react-router";
import './Profile.css'

const Profile = () =>
{
  const [currentUser, setCurrentUser] = useState<User>({data: Object} as unknown as User); //this is ugly af, but it works,but we gotta change it
  const [user, setUser] = useState<User>({data: Object} as unknown as User); //this is ugly af, but it works,but we gotta change it
  // const [matchHistory, setMatchHistory] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);

  const queryParams = new URLSearchParams(useLocation().search);
  const userId = queryParams.get("userId");
  var ownProfile: boolean = false;
  var showFriendRequest: boolean = false;

  useEffect(() => {
    (
      async () => {
        const {data} = await axios.get(`user`);
        setCurrentUser(data);
      }
    )();
    (
      async () => {
        const {data} = await axios.get(`user/alluser?userId=${userId}`);
        console.log("data :", data);
        setUser(data);
      }
    )();
    (
      async () => {
        const {data} = await axios.get(`user/friend`);
        console.log("friends :", data);
        setFriends(data);
      }
    )();
    // (
    //   async () => {
    //     const {data} = await axios.get(`user/get/user?username=${'nlaurids'}`);
    //     console.log(data);
    //   }
    // )();
    if (userId !== null)
    {
      (
        async () => {
          const {data} = await axios.get(`user/get/user/${userId}`,);
          setUser(data);
        }
      )();
      // (
      //   async () => {
      //     const {data} = await axios.get(`user/friend`);
      //     console.log(data);
      //     setFriends(data);
      //   }
      // )();
    }
    else {
      (
        async () => {
          const {data} = await axios.get(`user`);
          setUser(data);
        }
      )();
      (
        async () => {
          const {data} = await axios.get(`user/friend`);
          console.log(data);
        }
      )();
    }
  }, [userId]);
  
  if (user.id === currentUser.id)
    ownProfile = true;
  else {
    ownProfile = false;
  }
  if (!friends.includes(currentUser.id)) {
    // console.log("into else condition")
    showFriendRequest = true;
  }
  console.log("friends : ", friends);

  return(
    <Wrapper>
      <div className="user-profile">
        <div className="user-name">
          <img className="profile-picture" src={user.picture} alt="avatar" />
          <h1>{user.username}'s profile</h1>
            {
              (user.status === "online") && (
                <span className="status-online">Online</span>)
            }
            {
            (user.status === "offline") && (
                  <span className="status-offline">Offline</span>) 
            }
            {
            (user.status === "playing") && (
                  <span className="status-playing">Playing</span>) 
            }
            {
              (showFriendRequest) && (
                <button className="btn btn-primary" onClick={() => {
                  setTimeout(() => {
                  (
                    async () => {
                      const {data} = await axios.post(`user/friend/${user.id}`);
                      console.log(`user/friend/${user.id}`);
                    }
                  )();
                  }, 1000);
                  (
                    async () => {
                      const {data} = await axios.get(`user/friend`);
                      console.log(`friends :`, data);
                    }
                  )();
                }
                }>Send friend request</button>
              )
            }
        </div>
        <div className="user-stats">
            
        </div>
      </div>
      <div className="user-stats">
        <div className="stats">
          <div className="level">
            <div className="level-item">
              <h2 className="title">Level</h2>
              <h5>{user.level} </h5>
            </div>
          </div>
          <div className="gamesWon">
            <div className="gamesWom-item">
              <h2 className="title">Games Won</h2>
              <h5>{user.wins} </h5>
            </div>
          </div>
          <div className="gamesLost">
            <div className="gamesLost-item">
              <h2 className="title">Games Lost</h2>
              <h5>{user.losses} </h5>
            </div>
          </div>
          <div className="gamesPlayed">
            <div className="gamesPlayed-item">
              <h2 className="title">Games Played</h2>
              <p>{user.wins + user.losses} </p>
            </div>
          </div>
          <div className="win-loss-ratio">
            <div className="win-loss-ratio-item">
              <h2 className="title">Win/Loss Ratio</h2>
              {
                (user.wins + user.losses) === 0 ? (
                  <p>0</p>
                ) : (
                  ((user.wins / (user.wins + user.losses)) > 0.5) ? (
                    <p className="positive">
                      {(user.wins / (user.wins + user.losses)).toFixed(2)}
                    </p>
                  ) : (
                    <p className="negative">
                      {(user.wins / (user.wins + user.losses)).toFixed(2)}  
                    </p>
                  )
                )
              }
            </div>
          </div>
        </div>
        <div className="gameHistory">
          <div className="gameHistory-item">
            <h2 className="title">Game History</h2>
            {/* {(user.gameHistory.size() > 0) ? ( */}
            {/* ) : ( */}
            <p className="">{user.username} has not played any games yet.</p>
            {/* ) */}
          </div>

        </div>
        <div className="friends-list">
          <div className="friends-list-item">
            <h2 className="title">Friends</h2>
            {(friends.length > 0) ? (
              <ul>
                {friends.map((friend:any) => (
                  <li key={friend.id}>
                    <a href={`/profile?userId=${friend.id}`}>{friend.username}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{user.username} has no friends yet.</p>
            )}
        </div>
      </div>
        {/* <ButtonFriends /> */}
      </div>
    </Wrapper>
  );
}

export default Profile;