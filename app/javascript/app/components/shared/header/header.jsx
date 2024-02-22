import React, {useEffect, useState} from 'react';
import {Toolbar} from '@material-ui/core';
import './header.scss';
import {Link, useNavigate} from "react-router-dom";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import {useLocation} from "react-router"; // Import your CSS file
import {EventState} from "../../../EventContext";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LangaugeSwitchSelect from "../../language-switch-select";
import {useTranslation} from "react-i18next";
import HeadphonesIcon from '@mui/icons-material/Headphones';
import Dialer from "../../phone-dialer/Dialer";

const HeaderBar = ({isSaralUser = '', language = '', userName = 'Ram Avtar'}) => {
    const redirectFor = document.getElementById('app').getAttribute('data-redirect-for');
    const bjpLogo = 'https://storage.googleapis.com/public-saral/public_document/BJP-logo.png';
    const [userDetails, setUserDetails] = useState(null)
    const navigate = useNavigate()
    const {pathname} = useLocation();
    const {eventName, setEventName, isSubmissionPage, setIsSubmissionPage} = EventState();
    const {t}=useTranslation();


    useEffect(() => {
        getUserDetail()
    }, [])

    const navigateToLogOut = (url) => {
        window.location.href = url
    }
    const getUserDetail = async () => {
        let {data} = await ApiClient.get("/event/user", {
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });

        if (data?.success) {
            setUserDetails(data?.data);
        }
    }


    return (
        <>
            {(pathname.includes('events') || pathname.includes('event')) ?
                <Toolbar className="header-bg" id="header">

                    <div className="left-header-container">
                        <Link to="/events">
                            <img src={bjpLogo} alt="" className="header-img"/>
                            <span className="navbar-header-title"> भारतीय जनता पार्टी </span>
                        </Link>
                    </div>
                    {!isSaralUser && (
                        <div className={"header-form-button-logout-container"}>

                            <button className={"header-form-button"} onClick={() => navigate('/forms')}>go to forms
                            </button>

                            <div className="right-header-content">
                                <div className="user-profile-container">
                                    <span className="user-name">{userDetails ? userDetails?.name : ''}</span>
                                    {userDetails ?
                                        <span className="log-out"
                                              onClick={() => navigateToLogOut(userDetails?.logout_url)}>LogOut</span>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </Toolbar> :

                <Toolbar className={redirectFor === 'mobile' ? 'header-form-bg header-form-bg-mobile' : 'header-form-bg'}>
                    <Tooltip id={"nav_back_button"} className="header-form-back-button" onClick={() =>
                        navigate(-1)
                    }>
                            <IconButton>
                                <ArrowBackIosIcon/>
                            </IconButton>
                    </Tooltip>

                    <h2 className="event-name-heading">Events</h2>
                    <div className={"header-form-button-and-lang-select-container"}>

                        {(JSON.parse(document.getElementById("app").getAttribute("data-create"))) && !isSubmissionPage &&
                            <button className={"header-form-create-button"} onClick={() => navigate('/events')}>{t("Create Event")}</button>
                        }
                        <LangaugeSwitchSelect/>
                        <Dialer phoneNumber={"8287809809"}/>

                    </div>

                </Toolbar>
            }
        </>

    );
};

export default HeaderBar;
