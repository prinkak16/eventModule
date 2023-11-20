import React, {useEffect, useState} from 'react';
import { Toolbar, Select, MenuItem, Icon } from '@material-ui/core';
import './header.scss';
import {Link, redirect, useNavigate} from "react-router-dom";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import {useLocation} from "react-router"; // Import your CSS file
    import {EventState} from "../../../EventContext";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Paper from '@mui/material/Paper';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";


const HeaderBar = ({ isSaralUser = '', language = '', languages = '', userName = 'Ram Avtar' }) => {
    const bjpLogo = 'https://storage.googleapis.com/public-saral/public_document/BJP-logo.png';
    const [userDetails, setUserDetails] = useState(null)
    const navigate = useNavigate()
    const {pathname}=useLocation();
    const {eventName,setEventName,isSubmissionPage,setIsSubmissionPage}=EventState();
    useEffect(() => {
        getUserDetail()
    }, [])                                              

    const navigateToLogOut = (url) => {
        window.location.href = url
    }
     const getUserDetail=async ()=> {
        let {data} = await ApiClient.get("/event/user", {
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
    
        if(data?.success) {
            setUserDetails(data?.data);
        }
    }



    return (
        <>
            {(pathname.includes('events')||pathname.includes('event'))?
            <Toolbar className="header-bg" id="header" >

                <div className="left-header-container">
                    <Link to="/">
                        <img src={bjpLogo} alt="" className="header-img" />
                        <span className="navbar-header-title"> भारतीय जनता पार्टी </span>
                    </Link>
                </div>
                {!isSaralUser && (
                    <>
                        <div className="language-setting-container mt-3">
                        </div>
                        <div className="right-header-content">
                            <div className="user-profile-container">
                                <span className="user-name">{userDetails ? userDetails?.name : ''}</span>
                                {userDetails ?
                                    <span className="log-out" onClick={() => navigateToLogOut(userDetails?.logout_url)}>LogOut</span>
                                    :
                                    <></>
                                }
                            </div>
                            <div className="user-profile-container-mobile">{/* Mobile content */}</div>
                        </div>
                    </>
                )}
            </Toolbar>  :
               
                <Toolbar className="header-form-bg">
                    <Tooltip className="header-form-back-button" onClick={()=> navigate(-1)}>
                        {isSubmissionPage &&
                        <IconButton>
                            <ArrowBackIosIcon />
                        </IconButton>
                        }
                    </Tooltip>
                    <h2 className="event-name-heading">{eventName??"Events"} </h2>
                </Toolbar>
            }
        </>

    );
};

export default HeaderBar;
