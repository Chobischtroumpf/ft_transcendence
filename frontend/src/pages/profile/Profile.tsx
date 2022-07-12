import * as React from "react";
import { Component } from "react";
import axios from "axios";
import {Socket} from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { User, UserLevel, UserStatus } from "../../models/user";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { Link, Navigate } from "react-router-dom";
import './Profile.css'


interface State {
  user: User;
  friends: User[];
  matchHistory: any[];
  ownProfile: boolean;
  showFriends: boolean;
  showAddFriend: boolean;
  userId: string | null | undefined;
  socket: Socket | null;
  profilePicture: string | null;
}

interface Props {
  socket: Socket | null;
}

export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: new User(0, '', '', '', UserStatus.offline, UserLevel.beginner, 0, 0, 0),
      friends: [],
      matchHistory: [],
      ownProfile: false,
      showFriends: false,
      showAddFriend: true,
      userId: undefined,
      socket: this.props.socket,
      profilePicture: null
    };
    this.componentDidMount = this.componentDidMount.bind(this); 
    this.getUser = this.getUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getFriends = this.getFriends.bind(this);
  }
  
  componentDidMount() {
    if (this.state.socket?.connected === false) {
      this.state.socket?.connect();
    }

    const query = new URLSearchParams(window.location.search);
    this.setState({userId: query.get('userId')});
    if (query.get('userId')) {
      this.setState({ownProfile: false, showFriends: false});
      this.getUserById(query.get('userId')).then(user => {
        this.setState({user: user});
        this.getProfilePicture(user).then(picture => {
          this.setState({profilePicture: picture});
        }
        , error => {
          console.log(error);
        }
        );
      }, error => {
        console.log(error);
      });
    }
    else {
      this.setState({ownProfile: true});
      this.getUser().then(user => {
        this.setState({user: user});
        this.getProfilePicture(user).then(picture => {
          this.setState({profilePicture: picture});
        }
        , error => {
          console.log(error);
        }
        );
      }, error => {
        console.log(error);
      });
    } 

    this.getFriends().then(friends => {
      console.log(friends);
      this.setState({ friends: friends });
      for (let i = 0; i < friends.length; i++) {
        console.log(friends[i].id);
        console.log(this.state.user.id)
        if (friends[i].id === this.state.user.id) {
          this.setState({showAddFriend: false});
          break;
        }
        else {
          console.log("here");
          this.setState({showAddFriend: true});
        }
      }
    }, error => {
      console.log(error);
    });


  }

  friendClick = (friendId: number) => (e:any) => {
    e.preventDefault();
    this.setState({ownProfile: false});

  }

  async getProfilePicture(user: User) {
    console.log("getProfilePicture");
    const response = await axios.get(`/user/picture/${user.picture}`);
    try{
      console.log(response)
      return response.data;
    }
    catch(error) {
      console.log(error);
    }
  }

  async getFriends() {
    const data = await axios.get(`/user/friend`)
    try {
      console.log(data);
      return(data.data);
    } catch (e) {
      return <Navigate to={'/error500'} />;
    }
  }
  
  async getUserById(userId: string | null) {
    if (userId) {
      const data = await axios.get(`/user/${userId}`)
      try {
        return(data.data);
      } catch (e) {
        return <Navigate to={'/error500'} />;
      }
    }
  }

  async getMatchHistory() {
    const data = await axios.get(`/user/matchHistory`)
    try {
      return(data.data);
    } catch (e) {
      return <Navigate to={'/error500'} />;
    }
  }

  async getUser() {
    const data = await axios.get(`/user`)
    try {
      return(data.data);
    } catch (e) {
      return <Navigate to={'/error500'} />;
    }
  }

  render() {
    if (this.state.ownProfile) {
      return (
      <div key={1}>
        <Wrapper>
          <div className="user-profile">
            <div className="user-name">
              <img className="profile-picture" src={this.state.user.picture} alt="avatar" />
              <h1>{this.state.user.username}'s profile</h1>
                {
                  (this.state.user.status === "online") && (
                    <span className="status-online">Online</span>)
                }
                {
                (this.state.user.status === "offline") && (
                      <span className="status-offline">Offline</span>) 
                }
                {
                (this.state.user.status === "playing") && (
                      <span className="status-playing">Playing</span>) 
                }
                {
                  (this.state.showAddFriend && !this.state.ownProfile) && (
                    <button className="btn btn-primary" onClick={() => {
                      (
                        async () => {
                          const {data} = await axios.post(`user/friend/${this.state.user.id}`);
                        }
                      )();
                      setTimeout(() => {
                      (
                        async () => {
                          const {data} = await axios.get(`/user/friend`);
                          this.setState({friends: data});
                        }
                      )();
                      }, 100);
                    }
                    }
                    >Send friend request</button>
                  )
                }
            </div>
          </div>
          <div className="settings">
          {
            (this.state.ownProfile) && (
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
                  <h5>{this.state.user.level} </h5>
                </div>
              </div>
              <div className="gamesWon">
                <div className="gamesWom-item">
                  <h2 className="title">Games Won</h2>
                  <h5>{this.state.user.wins} </h5>
                </div>
              </div>
              <div className="gamesLost">
                <div className="gamesLost-item">
                  <h2 className="title">Games Lost</h2>
                  <h5>{this.state.user.losses} </h5>
                </div>
              </div>
              <div className="gamesPlayed">
                <div className="gamesPlayed-item">
                  <h2 className="title">Games Played</h2>
                  <p>{this.state.user.wins + this.state.user.losses} </p>
                </div>
              </div>
              {
                (this.state.user.wins + this.state.user.losses) === 0 ? (
                  <div className="win-loss-ratio">
                    <div className="win-loss-ratio-item">
                      <h2 className="title">Win/Loss Ratio</h2>
                      <p>0</p>
                    </div>
                  </div>
                ) : (
                ((this.state.user.wins / (this.state.user.wins + this.state.user.losses)) > 0.5) ? (
                  <div className="win-loss-ratio positive">
                    <div className="win-loss-ratio-item">
                      <h2 className="title">Win/Loss Ratio</h2>
                      <p className="">
                        {(this.state.user.wins / (this.state.user.wins + this.state.user.losses)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="win-loss-ratio negative">
                    <div className="win-loss-ratio-item">
                    <h2 className="title">Win/Loss Ratio</h2>
                    <p className="">
                      {(this.state.user.wins / (this.state.user.wins + this.state.user.losses)).toFixed(2)}  
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
                <p className="">{this.state.user.username} has not played any games yet.</p>
                {/* ) */}
              </div>
            </div>
          </div>
          <div className="user-friends">
            {
              (this.state.ownProfile) && 
              (
                <div className="friends-list">
                  <div className="friends-list-item">
                    <h2 className="title">Friends</h2>
                    {(this.state.friends.length > 0) ? (
                      <ul>
                        {this.state.friends.map((friend:User) => (
                          <li key={friend.id}>
                            <a href={`/profile?userId=${friend.id}`}  /*onClick={}*/><button className="btn btn-primary" > {friend.username} {friend.id}</button></a>
                            {/* <a href={`/profile/removefriend?userId=${friend.id}`}>Remove</a> */}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{this.state.user.username} has no friends yet.</p>
                    )}
                  </div>
                </div>
              )}
          </div>
        </Wrapper>
      </div>
      );
    } else {
      return (
        <div key={2}>
          <Wrapper>
            <div className="user-profile">
              <div className="user-name">
                <img className="profile-picture" src={this.state.user.picture} alt="avatar" />
                <h1>{this.state.user.username}'s profile</h1>
                  {
                    (this.state.user.status === "online") && (
                      <span className="status-online">Online</span>)
                  }
                  {
                  (this.state.user.status === "offline") && (
                        <span className="status-offline">Offline</span>) 
                  }
                  {
                  (this.state.user.status === "playing") && (
                        <span className="status-playing">Playing</span>) 
                  }
                  {
                    (this.state.showAddFriend && !this.state.ownProfile) && (
                      <button className="btn btn-primary" onClick={() => {
                        (
                          async () => {
                            const {data} = await axios.post(`user/friend/${this.state.user.id}`);
                          }
                        )();
                        setTimeout(() => {
                        (
                          async () => {
                            const {data} = await axios.get(`/user/friend`);
                            this.setState({friends: data});
                          }
                        )();
                        }, 100);
                      }
                      }
                      >Send friend request</button>
                    )
                  }
              </div>
            </div>
            <div className="settings">
            {
              (this.state.ownProfile) && (
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
                    <h5>{this.state.user.level} </h5>
                  </div>
                </div>
                <div className="gamesWon">
                  <div className="gamesWom-item">
                    <h2 className="title">Games Won</h2>
                    <h5>{this.state.user.wins} </h5>
                  </div>
                </div>
                <div className="gamesLost">
                  <div className="gamesLost-item">
                    <h2 className="title">Games Lost</h2>
                    <h5>{this.state.user.losses} </h5>
                  </div>
                </div>
                <div className="gamesPlayed">
                  <div className="gamesPlayed-item">
                    <h2 className="title">Games Played</h2>
                    <p>{this.state.user.wins + this.state.user.losses} </p>
                  </div>
                </div>
                {
                  (this.state.user.wins + this.state.user.losses) === 0 ? (
                    <div className="win-loss-ratio">
                      <div className="win-loss-ratio-item">
                        <h2 className="title">Win/Loss Ratio</h2>
                        <p>0</p>
                      </div>
                    </div>
                  ) : (
                  ((this.state.user.wins / (this.state.user.wins + this.state.user.losses)) > 0.5) ? (
                    <div className="win-loss-ratio positive">
                      <div className="win-loss-ratio-item">
                        <h2 className="title">Win/Loss Ratio</h2>
                        <p className="">
                          {(this.state.user.wins / (this.state.user.wins + this.state.user.losses)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="win-loss-ratio negative">
                      <div className="win-loss-ratio-item">
                      <h2 className="title">Win/Loss Ratio</h2>
                      <p className="">
                        {(this.state.user.wins / (this.state.user.wins + this.state.user.losses)).toFixed(2)}  
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
                  <p className="">{this.state.user.username} has not played any games yet.</p>
                  {/* ) */}
                </div>
              </div>
            </div>
            <div className="user-friends">
              {
                (this.state.ownProfile) && 
                (
                  <div className="friends-list">
                    <div className="friends-list-item">
                      <h2 className="title">Friends</h2>
                      {(this.state.friends.length > 0) ? (
                        <ul>
                          {this.state.friends.map((friend:User) => (
                            <li key={friend.id}>
                              <a onClick={()=>{this.friendClick}}><button className="btn btn-primary" > {friend.username} {friend.id}</button></a>
                              {/* <a href={`/profile/removefriend?userId=${friend.id}`}>Remove</a> */}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{this.state.user.username} has no friends yet.</p>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </Wrapper>
        </div>
        );
    }
  }
}