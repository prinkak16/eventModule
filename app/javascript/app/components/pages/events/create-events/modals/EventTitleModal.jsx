import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './event-title-modal.scss'
import {EventState} from "../../../../../EventContext";
import {TextField} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    minHeight: 300,

    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
};


export default function EventTitleModal({setOpenLanguageModal, openLanguageModal,languagesMap,setFormFieldValue}) {
    const handleClose = () => setOpenLanguageModal(false);
    const [languages, setLanguages] = useState([]);
    const [inputData, setInputData] = useState({});


    const handleChange = (e) => {
        const {name, value} = e?.target;
        setInputData((prevData) => ({...prevData, [name]: value}));
    }

    const handleSave=()=>{
        setFormFieldValue((prevData)=>({...prevData,translated_title:inputData}));
        setOpenLanguageModal(false);
    }
    useEffect(() => {
        console.log('input data  is', inputData);
    }, [inputData]);

    return (
        <Modal
            open={openLanguageModal}
        >
            <Box sx={style} className={'event-title-main-container'}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Enter event title in different languages
                </Typography>

                <div className={"input-main-container"}>

                    {
                        languagesMap?.map((language) => <div className={'input-inner-container'}>
                            <span>{language?.name} title</span>
                            <TextField multiline fullWidth sx={{maxWidth: "80%"}} name={language?.lang}
                                       onChange={handleChange}/>
                        </div>)
                    }

                </div>

                <div className="modal-buttons-container">
                    <Button variant={"outlined"} className="no-button" onClick={handleClose}>No</Button>
                    <Button className="yes-button" onClick={handleSave}>Yes</Button>
                </div>
            </Box>
        </Modal>
    );
}