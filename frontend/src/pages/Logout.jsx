import { useNavigate } from 'react-router-dom'
import { authUser } from '../component/auth'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

export default function Logout() {
    const navigator = useNavigate()
    const { logOut } = authUser()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleLogout = async () => {
        try {
            await logOut();
            navigator('/');
        } catch (error) {
            console.log("Logout failed",error);
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Logout
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>        
        </>
  )
}
