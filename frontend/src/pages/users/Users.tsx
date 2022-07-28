import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/user";
import minigames from "../../assets/minigames.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Table } from 'react-bootstrap';
import { Navigate } from "react-router";
import ModalMessage from "../chat/ModalMessage";

const Users = () =>
{
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [place, setPlace] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  const handleClick = (e: SyntheticEvent) => 

  useEffect(() => {
    setTimeout(async() => {
      try {
      const {data} = await axios.get(`user/allusers?page=${page}`);
      setUsers(data.data);
      setLastPage(data.meta.last_page);
      } catch (error) {
        console.log(error);
      }
    }, 40);
  }, [page]);

  const join = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPlace(true);
  }

  if (place === true) {
    return <Navigate to={`/profile?userId=${userId}`} />;
  }

  const next = () => {
    if (page < lastPage)
      setPage(page + 1);
  }

  const prev = () => {
    if (page >= 2)
      setPage(page - 1);
  }

  return (
    // <>
      <Wrapper>
        <Card bg="light">
          <Card.Img src={minigames} />
          <Card.Body>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">username</th>
                  <th scope="col">status</th>
                  <th scope="col">level</th>
                  <th scope="col">wins</th>
                  <th scope="col">losses</th>
                  <th scope="col">rank</th>
                  <th scope="col">block/unblock</th>
                  <th scope="col">add friend</th>
                </tr>
              </thead>
              <tbody>
              {users.map((user: User) => {
                console.log('user', user);
                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <form onSubmit={join}>
                          <Button variant="link" onClick={() => setUserId(user.id)} type="submit">{user.username}</Button>
                        </form>
                      </td>
                      <td>{user.status}</td>
                      <td>{user.level}</td>
                      <td>{user.wins}</td>
                      <td>{user.losses}</td>
                      <td>{user.rank}</td>
                      {/* <td><button  className="btn btn-light" onClick={
                        async () => {
                          setPopupMessage("");
                          try {
                            await axios.post(`/user/block/${user.id}`);
                            setPopupMessage('User blocked');
                            setActionSuccess(true);
                          }
                          catch (e:any) {
                            setPopupMessage(e.response.data.message);
                            setActionSuccess(false);
                          }
                        }
                      }>block user</button> </td> */}
                    </tr>  
                  )
                })}
              </tbody>
            </Table>
        <nav>
          <ul className="pagination">
              <li className="page-item">
                <a href="#" className="page-link" onClick={prev}>Previous</a>
              </li>
              <li className="page-item">
                <a href="#" className="page-link" onClick={next}>Next</a>
              </li>
          </ul>
        </nav>
        </Card.Body>
        </Card>
        {/* {(popupMessage != "") && <ModalMessage message={popupMessage} success={actionSuccess} />} */}
      </Wrapper>
    // </>
  );
}

export default Users;