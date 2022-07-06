import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { User, UserLevel, UserStatus } from "../../models/user";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import './Profile.css'

interface Props {
  socket: Socket | null
}

async function getUser(){
    const data = await axios.get(`/user`)
    try {
      return(data.data);
    } catch (e) {
      <Navigate to={'/error500'} />
    }
  }

async function getFriends(){
  const data = await axios.get(`/user/friend`)
  try {
    return(data.data);
  } catch (e) {
    <Navigate to={'/error500'} />
  }
}

// async function getMatchHistory(){
//   const data = await axios.get(`/user/matchHistory`)
//   try {
//     return(data.data);
//   } catch (e) {
//     <Navigate to={'/error500'} />
//   }
// }

async function getUserById(userId: string){
  const data = await axios.get(`/user/${userId}`)
  try {
    return(data.data);
  } catch (e) {
    <Navigate to={'/error500'} />
  }
}

const Profile = ({socket}: Props) =>
{
  // var tempUser: User = new User(0, '', '', '', UserStatus.offline, UserLevel.beginner, 0, 0, 0);
  var [currentUser, setCurrentUser] = useState<User>(new User(0, '', '', '', UserStatus.offline, UserLevel.beginner, 0, 0, 0));
  var [user, setUser] = useState<User>(new User(0, '', '', '', UserStatus.offline, UserLevel.beginner, 0, 0, 0));
  
  const [friends, setFriends] = useState<User[]>([]);
  
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  
  var [ownProfile, setOwnProfile] = useState(false);
  var [showFriendRequest, setShowFriendRequest] = useState(false);
  var [isLoading, setIsLoading] = useState(true); 
  
  const queryParams = new URLSearchParams(useLocation().search);
  const userId = queryParams.get("userId");

  if (socket?.connected === false)
  socket?.connect();


  function checkUser(){
    console.log("checkUser");
    console.log(userId);

    if (userId)
    {
      getUserById(userId).then(data => {
        setUser(data);
      }).catch(e => {
        <Navigate to={'/error500'} />
      }
      );
    }
    else
    {
      setUser(currentUser);
      console.log(currentUser);
      console.log(user);
    }
  }

  useEffect(() => {
    getUser().then(data => {
      setCurrentUser(data);
    }, err => {
      <Navigate to={'/error500'} />
    });

    getFriends().then(data => {
      setFriends(data);
    }, err => {
      <Navigate to={'/error500'} />
    });

    // getMatchHistory().then(data => {
    //   // setMatchHistory(data);
    // }, err => {
    //   <Navigate to={'/error500'} />
    // });

    setTimeout(() => {
      checkUser();

      // user = currentUser;
      if (user.id === currentUser.id)
        setOwnProfile(true);
      else
        setOwnProfile(false);
      if (!friends.includes(currentUser))
        setShowFriendRequest(true);
      else
        setShowFriendRequest(false);

      setIsLoading(false);
    }, 2000);
    }, [user]);
  
  // console.log("friends : ", friends);
  // console.log("currentUser : ", currentUser.id);
  // console.log("user : ", user.id);
  // console.log("ownProfile : ", ownProfile);
  // console.log("showFriendRequest : ", showFriendRequest);

if (isLoading)
{
  return(
    <Wrapper>
    <div className="loading">
      <div className="loading-spinner">
        <div className="loading-spinner-item">
          <h1>Loading...</h1>
        </div>
      </div>
    </div>
    </Wrapper>
  )
}

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
              (showFriendRequest && !ownProfile) && (
                <button className="btn btn-primary" onClick={() => {
                  (
                    async () => {
                      const {data} = await axios.post(`user/friend/${user.id}`);
                    }
                  )();
                  setTimeout(() => {
                  (
                    async () => {
                      const {data} = await axios.get(`user/friend`);
                      setFriends(data);
                    }
                  )();
                  }, 100);
                }
                }>Send friend request</button>
              )
            }
        </div>
      </div>
      <div className="settings">
      {
        (ownProfile) && (
          <div className="settings-gear">
            <Link to="/profile/settings">
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faGear}/>
              </button>
            </Link>
            </div>
        )
      }
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
          {
            (user.wins + user.losses) === 0 ? (
              <div className="win-loss-ratio">
                <div className="win-loss-ratio-item">
                  <h2 className="title">Win/Loss Ratio</h2>
                  <p>0</p>
                </div>
              </div>
            ) : (
            ((user.wins / (user.wins + user.losses)) > 0.5) ? (
              <div className="win-loss-ratio positive">
                <div className="win-loss-ratio-item">
                  <h2 className="title">Win/Loss Ratio</h2>
                  <p className="">
                    {(user.wins / (user.wins + user.losses)).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="win-loss-ratio negative">
                <div className="win-loss-ratio-item">
                <h2 className="title">Win/Loss Ratio</h2>
                <p className="">
                  {(user.wins / (user.wins + user.losses)).toFixed(2)}  
                </p>
                </div>
              </div>
              )
            )
          }
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
        {/* {
          (ownProfile) && 
          ( */}
            <div className="friends-list">
              <div className="friends-list-item">
                <h2 className="title">Friends</h2>
                {(friends.length > 0) ? (
                  <ul>
                    {friends.map((friend:User) => (
                      <li key={friend.id}>
                        <a href={`/profile?userId=${friend.id}`}>{friend.username}</a>
                        {/* <a href={`/profile/removefriend?userId=${friend.id}`}>Remove</a> */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{user.username} has no friends yet.</p>
                )}
              </div>
            </div>
          {/* )} */}
        </div>
    </Wrapper>
  );
}

export default Profile