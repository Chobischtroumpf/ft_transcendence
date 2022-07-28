import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { SetPasswordDto } from "./chatSettings.dto";
import axios from "axios";
import { Navigate } from "react-router";

interface prop {
	chatName: string,
}

function ModalPwd(prop:prop) {
  const [show, setShow] = useState(true);
  const [goodPwd, setGoodPwd] = useState(0);

  const handleClose = () => setShow(false);

  const handleConfirm = async() => {
			const newpwd = (document.getElementById("new password") as HTMLInputElement).value;

			const adminForm : SetPasswordDto = { name : prop.chatName!, password : newpwd }
      try {
        const data = await axios({
            method: 'post',
            url: "chat/join",
            data: adminForm,
            headers: {'content-type': 'application/json'}
          });
        setGoodPwd(1);
      }
      catch (e) {
        setGoodPwd(2);
      }
	};

  if (goodPwd === 1)
  {
    return (
      <Navigate to={`/chat?chatId=${prop.chatName}`} />
    )
  }

  if (goodPwd === 2)
  {
    return (
      <Navigate to={`/channels`} />
      )
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Please enter password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<input id='new password' type="text" placeholder="Enter the new password"></input>
				</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalPwd