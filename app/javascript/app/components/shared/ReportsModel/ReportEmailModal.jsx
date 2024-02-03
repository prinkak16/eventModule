import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {toast} from "react-toastify";
import '../ConfirmationModal/confirmation-modal.scss';
import {useState} from "react";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";

const style = {};


export default function ReportEmailModal({reportModal, setReportModal, reportEventId,}) {
    const [email,setEmail] = useState("");
    const handleClose = () => setReportModal(false);

        const fetchReport = () => {
            (async () => {
                try {
                    const {data} = await ApiClient.get(`/event/reports?email_id=${email}&event_id=${reportEventId}`);
                    if (data?.success) {
                        toast.success(`Please Check your mail for reports`);
                        setReportModal(false);
                        setEmail("");
                    }
                } catch(error) {
                    toast.error('Failed to fetch Reports')
                } finally {
                    console.log("triggered Successfully");
                }
            })();
        }
    const sendReportToEmail = ()=>{
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            toast.error('Email is not valid');
        }else{
            fetchReport();
        }
    }

    return (
        <Modal
            open={reportModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="confirmation-modal-main-container">
                    <label>Report Download</label>
                    <br/>
                    <TextField sx={{marginY: "20px", width:"100%"}} id="outlined-basic" label="Email Address" variant="outlined" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    <br/>
                    <Button variant="contained" onClick={sendReportToEmail} component="label"
                            size="medium"
                            style={{ textTransform: "none", border: "1px solid #fffff" }}
                            sx={{
                                ":hover": { background: "#f77f00" },
                                background: "#F3F7FF",
                                borderRadius: 2,
                                fontSize: 20,
                                fontFamily: "Quicksand",
                                color: "#3f3f3f",
                                fontStyle: "normal",
                            }}>Send</Button>
                </div>
            </Box>
        </Modal>
    );
}