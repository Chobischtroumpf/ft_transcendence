import * as React from "react";
import { Component } from "react";
import axios from "axios";
import {Socket} from "socket.io-client";
import Wrapper from "../../components/Wrapper";
import { User, UserLevel, UserStatus } from "../../models/user";
import UserProfile from "./UserProfile";
import './Profile.css'
import { url } from "inspector";

interface Props {
  socket: Socket | null;
}

interface State {
  user: User;
  urlParam: string | null;
}


export default class Profile extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      user: new User(0, '', '', '', UserStatus.offline, UserLevel.beginner, 0, 0, 0),
      urlParam: ''
    };
  }

  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    this.setState({urlParam: query.get('userId')});

    this.getUserById(query.get('userId')).then(user => {
      this.setState({user: user})
      console.log("user :", user);
    }, error => {
      console.log(error);
    });

  }


  async getUserById(userId: string | null) {
    if (userId) {
        return axios.get(`/user/${userId}`).then(response => {
          return response.data;
        }, error => {
          console.log(error);
          return null;
        }
      );
    }
    else {
        return axios.get('/user').then(response => {
        console.log("response :", response.data); 
          return response.data;
        }, error => {
          console.log(error);
        }
      );
    }
  }

  render() {
    console.log(this.state.user);
    if (!this.state.user || this.state.user.id === 0) {
      // console.log('user not found');
      return (<Wrapper><div>Loading...</div></Wrapper>);
    }
    else if (this.state.urlParam)
    {
      console.log('user found');
      return (
        <Wrapper>
          <UserProfile key={1} socket={this.props.socket} userId={this.state.urlParam} />
        </Wrapper>
      );
    }
    else {
      console.log('own profile');
      return (
        <Wrapper>
          <UserProfile key={2} socket={this.props.socket}/>
        </Wrapper>
      );
    }
  }
}
