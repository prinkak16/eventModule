import React from 'react';
import {IconButton} from "@mui/material";
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const PhoneDialerLink = ({ phoneNumber }) => {
    const handleDialClick = () => {
        window.location.href=`tel:${phoneNumber}`;
    };

    return (
            <IconButton onClick={handleDialClick}>
                <HeadsetMicIcon/>
            </IconButton>

    );
};

export default PhoneDialerLink;
