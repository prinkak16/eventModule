import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {toast} from "react-toastify";
import '../ConfirmationModal/confirmation-modal.scss';
import {useState} from "react";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {reportTimeline} from "../constants";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


export default function ReportEmailModal({reportModal, setReportModal, reportEventId,}) {
    const [email,setEmail] = useState("");
    const [formData,setFormData]=useState({email:"",reportTimeline:""});
    const handleClose = () => setReportModal(false);

        const fetchReport = () => {
            (async () => {
                try {
                    const {data} = await ApiClient.get(`/event/reports?email_id=${formData?.email}&event_id=${reportEventId}&report_timeline=${formData?.reportTimeline}`);
                    if (data?.success) {
                        toast.success(data?.message);
                        setReportModal(false);
                       setFormData({email: "",reportTimeline: ""})
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
        if(!emailRegex.test(formData?.email)){
            toast.error('Email is not valid');
        }else if(!formData?.reportTimeline){
            toast.error('Select report timeline')
        }
        else{
            fetchReport();
        }
    }

    const handleChange=(e)=>{
            const {name,value}=e.target;
            setFormData((prevData)=>({...prevData,[name]:value}));
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
                    <TextField sx={{marginY: "20px", width: "100%"}} id="outlined-basic" label="Email Address"
                            name={"email"}   variant="outlined" value={formData?.   email} onChange={handleChange}/>
                    <br/>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select Report Timeline</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name={"reportTimeline"}
                            label="Select Report Timeline"
                            value={formData?.reportTimeline}
                            onChange={handleChange}
                        >
                            {reportTimeline?.map((time) => <MenuItem value={time}>{time}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <br/>
                    <br/>

                    <Button variant="contained" onClick={sendReportToEmail} component="label"
                            size="medium"
                            style={{textTransform: "none", border: "1px solid #fffff"}}
                            sx={{
                                ":hover": {background: "#f77f00"},
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