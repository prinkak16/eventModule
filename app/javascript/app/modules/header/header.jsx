import React from 'react';
import { Toolbar, Select, MenuItem, Icon } from '@material-ui/core';
import './header.scss'; // Import your CSS file

const HeaderBar = ({ isSaralUser = '', language = '', languages = '', userName = 'Ram Avtar' }) => {
    const bjpLogo = 'https://storage.googleapis.com/public-saral/public_document/BJP-logo.png';
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
                            <span className="user-name">{userName}</span>
                        </div>
                        <div className="user-profile-container-mobile">{/* Mobile content */}</div>
                    </div>
                </>
            )}
        </Toolbar>
    );
};

export default HeaderBar;
