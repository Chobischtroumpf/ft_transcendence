import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { SetPasswordDto } from "./chatSettings.dto";
import axios from "axios";


interface prop {
	chatName: string,
}

function ModalPwd(prop:prop) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  const handleConfirm = async() => {
			const newpwd = (document.getElementById("new password") as HTMLInputElement).value;

			const adminForm : SetPasswordDto = { name : prop.chatName!, password : newpwd }
			const data = await axios({
					method: 'post',
					url: "chat/join",
					data: adminForm,
					headers: {'content-type': 'application/json'}
				});
				handleClose();
	};

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