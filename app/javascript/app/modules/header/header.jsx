import React, {useEffect, useState} from 'react';
import { Toolbar, Select, MenuItem, Icon } from '@material-ui/core';
import './header.scss';
import {redirect, useNavigate} from "react-router-dom"; // Import your CSS file

const HeaderBar = ({ isSaralUser = '', language = '', languages = '', userName = 'Ram Avtar' }) => {
    const bjpLogo = 'https://storage.googleapis.com/public-saral/public_document/BJP-logo.png';
    const [userDetail, setUserDetail] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        getUserDetail()
    }, [])

    const navigateToLogOut = (url) => {
        window.location.href = url
    }
    async function getUserDetail() {
        let data = await fetch("api/event/login_user_detail", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
        const res = await data.json();
        setUserDetail([res.data]);
    }
    return (
        <Toolbar className="header-bg" id="header">

            <div className="left-header-container">
                <img src={bjpLogo} alt="" className="header-img" />
                <span className="navbar-header-title"> भारतीय जनता पार्टी </span>
            </div>
            {!isSaralUser && (
                <>
                    <div className="language-setting-container mt-3">
                    </div>
                    <div className="right-header-content">
                        <div className="user-profile-container">
                            <span className="user-name">{userDetail ? userDetail[0].name : ''}</span>
                            {userDetail ?
                                <span className="log-out" onClick={() => navigateToLogOut(userDetail[0].logout_url)}>LogOut</span>
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
