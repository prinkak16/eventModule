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


export default function EventTitleModal({allLanguages,translated_title,setOpenLanguageModal, openLanguageModal,languagesMap,setFormFieldValue}) {
    const [inputData, setInputData] = useState(translated_title??{});
    const [languageCodeMap,setLanguageCodeMap]=useState(new Map());

    const handleClose = () => {
        setFormFieldValue((prevData)=>({...prevData,translated_title:inputData}));
        setOpenLanguageModal(false);
    }


   useEffect(()=>{
       setInputData(translated_title??{});

   },[translated_title])

    useEffect(() => {
        const newobj=new Map(languageCodeMap);
        allLanguages?.forEach((item)=>{
            if(languagesMap.includes(item?.lang)){
                if(!newobj.has(item?.lang)) {
                    newobj.set(item?.lang, item?.name);
                }
            }
        })
        setLanguageCodeMap(newobj)
    }, [languagesMap]);
    const handleChange = (e) => {
        const {name, value} = e?.target;
        setInputData((prevData) => ({...prevData, [name]: value}));
    }

    const handleSave=()=>{
        setFormFieldValue((prevData)=>({...prevData,translated_title:inputData}));
        setOpenLanguageModal(false);
    }
    const disableSaveButton=()=>{
        // check if input data length is equal to selected languages length
        //if there are equal it means all respective event name is filled

        // if length are equal , we will return false, so that save button can be enabled
        return  Object.values(inputData).filter(item=>Boolean(item)).length!==languagesMap?.length;
    }


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
                            <span>{languageCodeMap.get(language)} title</span>
                            <TextField multiline fullWidth sx={{maxWidth: "80%"}} value={inputData[language]} name={language}
                                       onChange={handleChange}/>
                        </div>)
                    }

                </div>

                <div className="modal-buttons-container">
                    <Button variant={"outlined"} className="no-button" onClick={handleClose}>No</Button>
                    <button className="yes-button" onClick={handleSave} disabled={disableSaveButton()}>Yes</button>
                </div>
            </Box>
        </Modal>
    );
}