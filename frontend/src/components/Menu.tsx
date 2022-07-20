import { getSuggestedQuery } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { NavLink, Navigate } from "react-router-dom";
import { User, UserLevel, UserStatus } from "../models/user";

export const Menu = (props: any) => {

  const [user, setUser] = React.useState<User>(new User(0, '', '', false, '', UserStatus.offline, UserLevel.beginner, 0, 0, 0));
  

  async function getUser() {
    const response = await axios.get("/user");
    try{
      return response.data;
    } catch (e) {
      return <Navigate to={'/error500'} />;
    }
  }

  React.useEffect(() => {
    getUser().then(user => {
      setUser(user);
    } , error => {

    });
  },[]);
  

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
        <li className="nav-item">
            <NavLink to={'/game'} className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
              Game
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={`/profile`} key={1} className={({isActive}) => (isActive ? "nav-link active" : "nav-link")} onClick={props.setParentState}>
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/users'} className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
              Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/channels'} className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
              Channels
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}