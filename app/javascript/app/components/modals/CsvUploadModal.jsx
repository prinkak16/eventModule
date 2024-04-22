import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './csv-upload-modal.scss'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {DownloadIcon, FileUploadIcon} from "../../assests/svg";
import {useState} from "react";
import {TextField} from "@mui/material";
import {EventState} from "../../context/EventContext";
import {toast} from "react-toastify";
import {useParams} from "react-router";
import {isNotNullUndefinedOrEmpty} from "../../utils/NullUndefinedChecker";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth:"624px",
    minWidth:"700px",
    height:"530px",
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingBottom:"16px",
    borderRadius:"15px"
};

export default function CsvModal    ({formFieldValue={},setFormFieldValue=()=>{},uploadCsv=()=>{}}) {
    const {showCsvModal,setShowCsvModal}=EventState();
    const [formData,setFormData]=useState({
        email:"",
        csvFile:null,
        csv_upload_time:""
    });
    const {id}=useParams();
    const handleClose = () => {
        setFormFieldValue((prevState)=>({...prevState,event_type:""}))
        resetFormData();
        setShowCsvModal(false);
    }
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const uploadButtonHandler=(e)=>{
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData?.email)){
            toast.error('Invalid email');
            return;
        }
        setFormFieldValue((prevData)=>{return{...prevData,email:formData?.email,csv_file:formData?.csvFile,csv_upload_time:formData?.csv_upload_time}})
        uploadCsv({...formData,id}); //if function is present api of upload csv would be called
        resetFormData();
        setShowCsvModal(false);
    }

    const handleFileUpload=(e)=>{
        const file=e.target.files[0];
        const csv_upload_time=new Date();
        setFormData(prevState => ({...prevState,csvFile: file,csv_upload_time: csv_upload_time}));
        e.target.files=null;
    }

    const handleChange=(e)=>{
        const {name,value}=e?.target;
        setFormData(prevState => ({...prevState,[name]:value}))
    }
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const csv_upload_time=new Date();
        setFormData(prevState => ({...prevState,csvFile: file,csv_upload_time: csv_upload_time}));
    };

    const resetFormData=()=>{
        const obj={};
        for(let key in formData){
            obj[key]="";
        }
        setFormData(obj);
    }

    const disableUploadButton=()=>{
            for(let key in formData){
                if(!isNotNullUndefinedOrEmpty(formData[key]))
                     return true;
        }
    }

    const downloadFile = ({ data, fileName, fileType }) => {
        const blob = new Blob([data], { type: fileType });

        const a = document.createElement("a");
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };

    const exportToCsv = (e) => {
        e.preventDefault();

        // Headers for each column
        let headers = [
            "operation",
            "country_state",
            "phone_number",
            "location_type",
            "location_name",
            "location_filter",
        ];

        downloadFile({
            data: [...headers],
            fileName: "CsvUploadUsersSample.csv",
            fileType: "text/csv",
        });
    };
    return (
        <div>
            <Modal
                open={showCsvModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={"csv-modal-container"}>
                        <div className={"header"}>Upload csv</div>


                        <div className={"csv-modal-inner-container"}>

                            <TextField
                                id="email"
                                variant="outlined"
                                placeholder="Enter email address"
                                onChange={handleChange}
                                name={"email"}
                                value={formData?.email}
                                label={<span>Enter email address{' '}
                                    <span style={{color: 'red'}}>*</span>
                                 </span>}
                            />
                            <div className={"download-and-upload-container"}>
                                <div className={"download-container"}>
                                <span className={"text-style"}>
                                    <div>
                                        You can Download
                                    </div>
                                    <div>
                                        Template file here
                                    </div>
                                </span>
                                    <Button component="label" variant="contained" startIcon={<DownloadIcon/>}
                                            className={"button-style"} onClick={exportToCsv}>
                                        Download
                                    </Button>
                                </div>
                                <div className={"upload-container"}  onDragOver={handleDragOver}
                                     onDrop={handleDrop}>
                                <span className={"text-style"}>
                                    <div>
                                       You can Drag and
                                    </div>
                                    <div>
                                         Drop your file here
                                    </div>
                                  </span>
                                    <Button component="label" variant="contained" startIcon={<FileUploadIcon/>}
                                            className={"button-style"}>
                                        Select File
                                        <VisuallyHiddenInput type="file" onChange={handleFileUpload} accept=".csv"/>
                                    </Button>
                                </div>

                            </div>
                            <div className={"button-container"}>
                                <Button className={"cancel-button"} variant={"outlined"}
                                        onClick={handleClose}>Cancel</Button>
                                <Button

                                        className={"upload-button"} variant={"contained"}
                                        style={{background:disableUploadButton()&&"#d1d1d5"}}
                                        disabled={disableUploadButton()}
                                        onClick={uploadButtonHandler}>Upload</Button>
                            </div>
                        </div>

                    </div>
                </Box>
            </Modal>
        </div>
    );
}