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
import {reportStatus, reportTimeline} from "../constants";
import CircularProgress from "@mui/material/CircularProgress";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height:370,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius:"20px"
};


export default function ReportEmailModal({reportModal, setReportModal, reportEventId,}) {
    const [formData,setFormData]=useState({email:"",reportTimeline:"",status:""});
    const [disableSendButton,setDisableSendButton]=useState(false);
    const [loader,setLoader]=useState(false);
    const handleClose = () => {
        setFormData({email: "",reportTimeline: "",status: ""})
        setReportModal(false);
    }

        const fetchReport =async () => {
                setDisableSendButton(true);
                setLoader(true);
                try {
                    const {data} = await ApiClient.get(`/event/reports?email_id=${formData?.email}&event_id=${reportEventId}&report_timeline=${formData?.reportTimeline}&status=${formData?.status}`);
                    if (data?.success) {
                        toast.success(data?.message);
                        setReportModal(false);
                       setFormData({email: "",reportTimeline: ""})
                    }else{
                        toast.error(data?.message);
                    }
                } catch(error) {
                    toast.error(error?.message)
                } finally {
                    setLoader(false)
                    setDisableSendButton(false);
                }

        }
    const sendReportToEmail = ()=>{
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData?.email)){
            toast.error('Email is not valid');
        }else if(!formData?.reportTimeline){
            toast.error('Select report timeline')
        }else if(!formData?.status){
            toast.error('Select status')
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
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <div>
                    <label>Report Download</label>
                    <br/>
                    <TextField sx={{marginY: "20px", width: "100%"}} id="outlined-basic" label="Email Address"
                            name={"email"}   variant="outlined" value={formData?.email} onChange={handleChange}/>
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

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select submission status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name={"status"}
                            label="Select submission status"
                            value={formData?.status}
                            onChange={handleChange}
                        >
                            {reportStatus?.map((status) => <MenuItem value={status}>{status}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <br/>
                    <br/>
                    <div style={{display:"flex",gap:"10px"}}>
                    <Button  variant="contained" onClick={handleClose} component="label"
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
                            }}>Cancel</Button>

                    <Button disabled={loader} variant="contained" onClick={sendReportToEmail} component="label"
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
                            }}>{loader?<CircularProgress />:"Send"}</Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}