import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './confirmation-modal.scss'
import Button from "@mui/material/Button";

const style = {};


export default function ConfirmationModal({  title,
                                              message,
                                              showConfirmationModal,
                                              setShowConfirmationModal,
                                              setConfirmationStatus
                                          }) {

    const handleClose = () => setShowConfirmationModal(false);
    const handleConfirmation = () => {
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
                    <div className={"title-message-container"}>
                        <Typography className={"title"}>{title}</Typography>
                        <Typography className={"message"}>
                            {message}
                        </Typography>
                    </div>
                    <div className="confirmation-modal-buttons">
                        <Button className="no-button" onClick={handleClose}>No thanks</Button>
                        <Button variant={"text"} className="yes-button" onClick={handleConfirmation}>Delete</Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}