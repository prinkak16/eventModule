import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './confirmation-modal.scss'

const style = {
   
};


export default function ConfirmationModal({message,showConfirmationModal,setShowConfirmationModal,setConfirmationStatus}) {

    const handleClose = () => setShowConfirmationModal(false);
    const handleConfirmation=()=>{
        setConfirmationStatus(true);
        setShowConfirmationModal(false);
    }

    return (

            <Modal
                open={showConfirmationModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="confirmation-modal-main-container">
                    <div className="confirmation-modal-container">


                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {message}
                    </Typography>
                   <div className="confirmation-modal-buttons">
                       <button className="no-button" onClick={handleClose}>No</button>
                       <button className="yes-button" onClick={handleConfirmation}>Yes</button>
                   </div>
                    </div>
                </Box>
            </Modal>
    );
}