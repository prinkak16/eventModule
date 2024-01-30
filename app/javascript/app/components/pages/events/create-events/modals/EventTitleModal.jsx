import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './event-title-modal.scss'
import {EventState} from "../../../../../EventContext";
import {TextField} from "@mui/material";
import {useEffect, useState} from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    minHeight:300,

    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:"10px",
    p: 4,
};


export default function EventTitleModal({setOpenLanguageModal,openLanguageModal}) {
    const {selectedLanguages,setSelectedLanguages}=EventState();
    const handleClose = () => setOpenLanguageModal(false);
    const [languages,setLanguages]=useState([]);
    const [inputData,setInputData]=useState({});

    useEffect(() => {
       
        setLanguages(selectedLanguages)
    }, [selectedLanguages]);

    const handleChange=(e)=>{
        const {name,value}=e?.target;
        setInputData((prevData)=>({...prevData,[name]:value}));
    }

    useEffect(() => {
        console.log('input data  is',inputData);
    }, [inputData]);

    return (
            <Modal
                open={openLanguageModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={'event-title-main-container'}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                       Enter event title in different languages
                    </Typography>

                    <div className={"input-main-container"}>

                        {
                            languages?.map((language)=><div className={'input-inner-container'}>
                                <span>{language} title</span>
                                <TextField multiline fullWidth sx={{maxWidth:"80%"}} name={language} onChange={handleChange}/>
                            </div>)
                        }

                    </div>

                    <div className="modal-buttons-container">
                        <Button variant={"outlined"} className="no-button" onClick={handleClose}>No</Button>
                        <Button className="yes-button">Yes</Button>
                    </div>
                </Box>
            </Modal>
    );
}