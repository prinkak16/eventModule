import  React from 'react';
import './user-navbar.scss'
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const UserNavbar=({eventname,backButtonHandler})=>{

    return(
        <div className="user-navbar-container">
            <div className="event-name-heading-container">


                <div className="form-event-back-button" onClick={backButtonHandler}>


                    <Tooltip>
                        <IconButton>
                            <ArrowBackIosIcon/>

                        </IconButton>
                    </Tooltip>

                </div>
                <h2 className="event-name-heading">{eventname} </h2>

            </div>
        </div>
    )

}

export default  UserNavbar;