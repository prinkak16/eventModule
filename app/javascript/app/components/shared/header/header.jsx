import React, {useEffect, useState} from 'react';
import { Toolbar, Select, MenuItem, Icon } from '@material-ui/core';
import './header.scss';
import {Link, redirect, useNavigate} from "react-router-dom";
import {ApiClient} from "../../../services/RestServices/BaseRestServices"; // Import your CSS file

const HeaderBar = ({ isSaralUser = '', language = '', languages = '', userName = 'Ram Avtar' }) => {
    const bjpLogo = 'https://storage.googleapis.com/public-saral/public_document/BJP-logo.png';
    const [userDetails, setUserDetails] = useState(null)
    const navigate = useNavigate()
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
        <Toolbar className="header-bg" id="header">

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
        </Toolbar>
    );
};

export default HeaderBar;
